import React, { useState, useEffect } from 'react';
import '../styles/ActivityForms.css';

interface SeminarFormProps {
  onSave: (data: {
    title: string;
    topic: string;
    participants_count: number;
    seminar_date: string;
    description?: string;
  }) => void;
  onCancel: () => void;
  initialData?: any;
}

const SeminarForm: React.FC<SeminarFormProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    participants_count: 0,
    seminar_date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        topic: initialData.topic || '',
        participants_count: initialData.participants_count || 0,
        seminar_date: initialData.seminar_date ? initialData.seminar_date.split('T')[0] : new Date().toISOString().split('T')[0],
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.topic || formData.participants_count < 0) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'participants_count' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <h3>{initialData ? 'Edit Seminar' : 'Add New Seminar'}</h3>
      
      <div className="form-group">
        <label htmlFor="title">Seminar Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Career Guidance Seminar"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="topic">Topic *</label>
        <input
          type="text"
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          placeholder="e.g., Career Options in Engineering"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="participants_count">Number of Participants *</label>
          <input
            type="number"
            id="participants_count"
            name="participants_count"
            value={formData.participants_count}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="seminar_date">Seminar Date *</label>
          <input
            type="date"
            id="seminar_date"
            name="seminar_date"
            value={formData.seminar_date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Additional details about the seminar..."
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="save-btn">
          {initialData ? 'Update' : 'Save'} Seminar
        </button>
      </div>
    </form>
  );
};

export default SeminarForm;



