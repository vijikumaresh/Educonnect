import React, { useState, useEffect } from 'react';
import '../styles/ActivityForms.css';

interface BookOrderFormProps {
  onSave: (data: {
    book_title: string;
    author?: string;
    academic_session: string;
    quantity: number;
    order_date: string;
    student_name?: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
  initialData?: any;
}

const BookOrderForm: React.FC<BookOrderFormProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    book_title: '',
    author: '',
    academic_session: '',
    quantity: 1,
    order_date: new Date().toISOString().split('T')[0],
    student_name: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        book_title: initialData.book_title || '',
        author: initialData.author || '',
        academic_session: initialData.academic_session || '',
        quantity: initialData.quantity || 1,
        order_date: initialData.order_date ? initialData.order_date.split('T')[0] : new Date().toISOString().split('T')[0],
        student_name: initialData.student_name || '',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.book_title || !formData.academic_session || formData.quantity < 1) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }));
  };

  const currentYear = new Date().getFullYear();
  const academicSessions = [
    `${currentYear - 1}-${currentYear}`,
    `${currentYear}-${currentYear + 1}`,
    `${currentYear + 1}-${currentYear + 2}`,
  ];

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <h3>{initialData ? 'Edit Book Order' : 'Add New Book Order'}</h3>
      
      <div className="form-group">
        <label htmlFor="book_title">Book Title *</label>
        <input
          type="text"
          id="book_title"
          name="book_title"
          value={formData.book_title}
          onChange={handleChange}
          placeholder="e.g., Engineering Mathematics"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="author">Author</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="e.g., Dr. John Smith"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="academic_session">Academic Session *</label>
          <select
            id="academic_session"
            name="academic_session"
            value={formData.academic_session}
            onChange={handleChange}
            required
          >
            <option value="">Select Session</option>
            {academicSessions.map(session => (
              <option key={session} value={session}>{session}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity *</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="student_name">Student Name</label>
          <input
            type="text"
            id="student_name"
            name="student_name"
            value={formData.student_name}
            onChange={handleChange}
            placeholder="e.g., John Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="order_date">Order Date *</label>
          <input
            type="date"
            id="order_date"
            name="order_date"
            value={formData.order_date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes about the book order..."
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="save-btn">
          {initialData ? 'Update' : 'Save'} Book Order
        </button>
      </div>
    </form>
  );
};

export default BookOrderForm;








