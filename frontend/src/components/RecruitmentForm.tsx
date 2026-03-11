import React, { useState, useEffect } from 'react';
import '../styles/ActivityForms.css';

interface RecruitmentFormProps {
  onSave: (data: {
    company_name: string;
    drive_date: string;
    participants_count: number;
    selected_count: number;
    job_role?: string;
    description?: string;
  }) => void;
  onCancel: () => void;
  initialData?: any;
}

const RecruitmentForm: React.FC<RecruitmentFormProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    drive_date: new Date().toISOString().split('T')[0],
    participants_count: 0,
    selected_count: 0,
    job_role: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        company_name: initialData.company_name || '',
        drive_date: initialData.drive_date ? initialData.drive_date.split('T')[0] : new Date().toISOString().split('T')[0],
        participants_count: initialData.participants_count || 0,
        selected_count: initialData.selected_count || 0,
        job_role: initialData.job_role || '',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name || formData.participants_count < 0 || formData.selected_count < 0) {
      alert('Please fill in all required fields with valid values');
      return;
    }

    if (formData.selected_count > formData.participants_count) {
      alert('Selected count cannot be greater than participants count');
      return;
    }

    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'participants_count' || name === 'selected_count') ? parseInt(value) || 0 : value
    }));
  };

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <h3>{initialData ? 'Edit Recruitment Drive' : 'Add New Recruitment Drive'}</h3>
      
      <div className="form-group">
        <label htmlFor="company_name">Company Name *</label>
        <input
          type="text"
          id="company_name"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          placeholder="e.g., TCS, Infosys, Wipro"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="job_role">Job Role</label>
        <input
          type="text"
          id="job_role"
          name="job_role"
          value={formData.job_role}
          onChange={handleChange}
          placeholder="e.g., Software Engineer, Data Analyst"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="participants_count">Participants Count *</label>
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
          <label htmlFor="selected_count">Selected Count *</label>
          <input
            type="number"
            id="selected_count"
            name="selected_count"
            value={formData.selected_count}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="drive_date">Drive Date *</label>
        <input
          type="date"
          id="drive_date"
          name="drive_date"
          value={formData.drive_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Additional details about the recruitment drive..."
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="save-btn">
          {initialData ? 'Update' : 'Save'} Recruitment Drive
        </button>
      </div>
    </form>
  );
};

export default RecruitmentForm;








