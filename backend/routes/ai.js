const express = require('express');
const db = require('../database/db');

const router = express.Router();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// POST /api/ai/chat - Send a message, get a streamed response
router.post('/chat', async (req, res) => {
  const { moduleId, message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your-key-here') {
    return res.status(500).json({ error: 'AI is not configured. Set GROQ_API_KEY in backend .env file.' });
  }

  try {
    const systemPrompt = await buildModuleContext(moduleId);

    // Build messages array (OpenAI format)
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-20),
      { role: 'user', content: message },
    ];

    // Stream the response via SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!groqResponse.ok) {
      const error = await groqResponse.text();
      throw new Error(`Groq API error: ${groqResponse.status} - ${error}`);
    }

    const reader = groqResponse.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            res.write('data: [DONE]\n\n');
            break;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    }

    res.end();
  } catch (error) {
    console.error('AI chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'AI request failed' });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
});

async function buildModuleContext(moduleId) {
  const parts = [
    'You are a helpful AI study assistant for the Myway student app.',
    'You help students understand their course material, summarize content, explain concepts, and answer questions.',
    'Be concise but thorough. Use markdown formatting for readability.',
  ];

  if (!moduleId) {
    parts.push(
      '\nNo module is currently selected. You can still answer general study questions.',
      'Suggest the user select a module for context-aware help.'
    );
    return parts.join('\n');
  }

  const module = await db.getAsync('SELECT * FROM modules WHERE id = ?', [moduleId]);
  if (!module) {
    parts.push('\nThe selected module was not found.');
    return parts.join('\n');
  }

  parts.push(`\n## Current Module: ${module.name}`);
  if (module.description) {
    parts.push(`Description: ${module.description}`);
  }

  const resources = await db.allAsync(
    'SELECT * FROM resources WHERE module_id = ? ORDER BY created_at DESC',
    [moduleId]
  );

  if (resources.length > 0) {
    parts.push('\n## Module Resources:');
    for (const r of resources) {
      if (r.type === 'note') {
        const text = r.content.length > 2000
          ? r.content.substring(0, 2000) + '... [truncated]'
          : r.content;
        parts.push(`- Note "${r.title}": ${text}`);
      } else if (r.type === 'url') {
        parts.push(`- Link "${r.title}": ${r.content}`);
      } else if (r.type === 'file') {
        parts.push(`- File "${r.title}": ${r.content} (uploaded file)`);
      }
    }
  }

  const todos = await db.allAsync(
    'SELECT * FROM todos WHERE module_id = ? ORDER BY priority DESC, created_at DESC',
    [moduleId]
  );

  if (todos.length > 0) {
    parts.push('\n## Module Todos:');
    for (const t of todos) {
      const status = t.completed ? 'DONE' : 'TODO';
      parts.push(`- [${status}] ${t.title} (${t.priority} priority)${t.description ? ': ' + t.description : ''}`);
    }
  }

  parts.push(
    '\n## Instructions:',
    'Use the above module resources and todos to provide context-aware answers.',
    'When summarizing, reference specific resources by their titles.',
    'If asked about something not in the resources, say so and provide general guidance.',
    'Suggest study priorities based on todo status and priority levels.'
  );

  return parts.join('\n');
}

module.exports = router;
