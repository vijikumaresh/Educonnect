import React, { useState, useEffect } from 'react';
import { Student, ExamPreference } from '../types';
import '../styles/StudentForm.css';

interface StudentFormProps {
  onSave: (student: Omit<Student, 'id' | 'created_at'>) => void;
  onCancel: () => void;
  initialData?: Student | null;
  defaultCollegeName?: string;
}

const EXAM_OPTIONS: ExamPreference[] = ['UPSC', 'TNPSC', 'SSC', 'NEET', 'BANKING', 'RRB'];

const StudentForm: React.FC<StudentFormProps> = ({ onSave, onCancel, initialData, defaultCollegeName = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    college_name: '',
    address: '',
    registration_date: new Date().toISOString().split('T')[0], // Default to today
    exam_preferences: [] as ExamPreference[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        phone: initialData.phone,
        email: initialData.email,
        college_name: initialData.college_name,
        address: initialData.address,
        registration_date: initialData.registration_date || new Date().toISOString().split('T')[0],
        exam_preferences: initialData.exam_preferences
      });
    } else if (defaultCollegeName) {
      // Auto-fill college name from folder name when creating new student
      setFormData(prev => ({ ...prev, college_name: defaultCollegeName }));
    }
  }, [initialData, defaultCollegeName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleExamToggle = (exam: ExamPreference) => {
    setFormData(prev => ({
      ...prev,
      exam_preferences: prev.exam_preferences.includes(exam)
        ? prev.exam_preferences.filter(e => e !== exam)
        : [...prev.exam_preferences, exam]
    }));
    if (errors.exam_preferences) {
      setErrors(prev => ({ ...prev, exam_preferences: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Student name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.college_name.trim()) {
      newErrors.college_name = 'College name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData.exam_preferences.length === 0) {
      newErrors.exam_preferences = 'Please select at least one exam preference';
    }

    if (!formData.registration_date) {
      newErrors.registration_date = 'Registration date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="student-form-container">
      <div className="form-header">
        <h2>{initialData ? 'Edit Student' : 'Add New Student'}</h2>
        <button className="close-button" onClick={onCancel}>
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="name">Student Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter student name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter phone number"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="email">Email ID *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter email address"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="registration_date">Registration Date *</label>
            <input
              id="registration_date"
              type="date"
              name="registration_date"
              value={formData.registration_date}
              onChange={handleChange}
              className={errors.registration_date ? 'error' : ''}
            />
            {errors.registration_date && <span className="error-text">{errors.registration_date}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="college_name">College Name *</label>
            <input
              id="college_name"
              type="text"
              name="college_name"
              value={formData.college_name}
              onChange={handleChange}
              className={errors.college_name ? 'error' : ''}
              placeholder="Enter college name"
            />
            {errors.college_name && <span className="error-text">{errors.college_name}</span>}
          </div>
        </div>

        <div className="form-field full-width">
          <label htmlFor="address">Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? 'error' : ''}
            placeholder="Enter complete address"
            rows={3}
          />
          {errors.address && <span className="error-text">{errors.address}</span>}
        </div>

        <div className="form-field full-width">
          <label>Exam Preferences *</label>
          <div className="exam-preferences">
            {EXAM_OPTIONS.map(exam => (
              <label key={exam} className="exam-checkbox">
                <input
                  type="checkbox"
                  checked={formData.exam_preferences.includes(exam)}
                  onChange={() => handleExamToggle(exam)}
                />
                <span className="exam-label">{exam}</span>
              </label>
            ))}
          </div>
          {errors.exam_preferences && <span className="error-text">{errors.exam_preferences}</span>}
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {initialData ? 'Update Student' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;


