import { useState } from 'react';
import { useModules } from '../../contexts/ModuleContext';

export default function ResourceForm({ moduleId, onSuccess, onCancel }) {
  const { createResource } = useModules();
  const [formData, setFormData] = useState({
    title: '',
    type: 'url',
    content: '',
    file: null,
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (formData.type !== 'file' && !formData.content.trim()) {
      setError('Content is required');
      return;
    }

    if (formData.type === 'file' && !formData.file) {
      setError('Please select a file');
      return;
    }

    try {
      await createResource(moduleId, formData);
      onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, file });
  };

  return (
    <form onSubmit={handleSubmit} className="resource-form">
      <h4>New Resource</h4>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Resource title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="type">Type *</label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value, content: '', file: null })}
        >
          <option value="url">URL / Link</option>
          <option value="note">Note / Text</option>
          <option value="file">File Upload</option>
        </select>
      </div>

      {formData.type === 'url' && (
        <div className="form-group">
          <label htmlFor="content">URL *</label>
          <input
            id="content"
            type="url"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="https://example.com"
            required
          />
        </div>
      )}

      {formData.type === 'note' && (
        <div className="form-group">
          <label htmlFor="content">Note *</label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Enter your notes here"
            rows="5"
            required
          />
        </div>
      )}

      {formData.type === 'file' && (
        <div className="form-group">
          <label htmlFor="file">File *</label>
          <input
            id="file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
            required
          />
          {formData.file && <p className="file-name">Selected: {formData.file.name}</p>}
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          Add Resource
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
