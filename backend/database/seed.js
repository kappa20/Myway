const db = require('./db');

async function seed() {
  console.log('Seeding database with sample data...');

  try {
    // Sample modules
    const modules = [
      { name: 'Mathematics', description: 'Calculus and Linear Algebra', color: '#3B82F6' },
      { name: 'Computer Science', description: 'Data Structures and Algorithms', color: '#10B981' },
      { name: 'Physics', description: 'Mechanics and Thermodynamics', color: '#F59E0B' }
    ];

    for (const module of modules) {
      const result = await db.runAsync(
        'INSERT INTO modules (name, description, color) VALUES (?, ?, ?)',
        [module.name, module.description, module.color]
      );

      const moduleId = result.id;
      console.log(`Created module: ${module.name} (ID: ${moduleId})`);

      // Sample resources for each module
      await db.runAsync(
        'INSERT INTO resources (module_id, title, type, content) VALUES (?, ?, ?, ?)',
        [moduleId, 'Course Website', 'url', 'https://example.com/course']
      );

      await db.runAsync(
        'INSERT INTO resources (module_id, title, type, content) VALUES (?, ?, ?, ?)',
        [moduleId, 'Study Notes', 'note', 'Important formulas and concepts to review before the exam.']
      );

      // Sample todos for each module
      const todos = [
        { title: 'Complete homework assignment', description: 'Finish exercises 1-10', priority: 'high' },
        { title: 'Read chapter 5', description: '', priority: 'medium' },
        { title: 'Review lecture notes', description: 'From last week', priority: 'low' }
      ];

      for (const todo of todos) {
        await db.runAsync(
          'INSERT INTO todos (module_id, title, description, priority, completed) VALUES (?, ?, ?, ?, ?)',
          [moduleId, todo.title, todo.description, todo.priority, 0]
        );
      }
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
