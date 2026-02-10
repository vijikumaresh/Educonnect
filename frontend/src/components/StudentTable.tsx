import React, { useState, useMemo } from 'react';
import { Student, ExamPreference } from '../types';
import '../styles/StudentTable.css';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, onEdit, onDelete }) => {
  const [searchName, setSearchName] = useState('');
  const [searchCollege, setSearchCollege] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [sortField, setSortField] = useState<keyof Student>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students;

    // Filter by name
    if (searchName) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter by college name
    if (searchCollege) {
      filtered = filtered.filter(student =>
        student.college_name.toLowerCase().includes(searchCollege.toLowerCase())
      );
    }

    // Filter by date
    if (searchDate) {
      filtered = filtered.filter(student => {
        const studentDate = new Date(student.created_at).toISOString().split('T')[0];
        return studentDate === searchDate;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: string | number | Date | ExamPreference[] | null | undefined = a[sortField];
      let bVal: string | number | Date | ExamPreference[] | null | undefined = b[sortField];

      if (sortField === 'created_at') {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return filtered;
  }, [students, searchName, searchCollege, searchDate, sortField, sortDirection]);

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (students.length === 0) {
    return (
      <div className="empty-table-state">
        <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h3>No Students in this folder</h3>
        <p>Click "Add Contact" to add students</p>
      </div>
    );
  }

  return (
    <div className="student-table-container">
      <div className="table-filters">
        <div className="filter-group">
          <label>Search by Name:</label>
          <input
            type="text"
            placeholder="Enter student name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label>Search by College:</label>
          <input
            type="text"
            placeholder="Enter college name..."
            value={searchCollege}
            onChange={(e) => setSearchCollege(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label>Filter by Date:</label>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="filter-input"
          />
        </div>
        {(searchName || searchCollege || searchDate) && (
          <button
            className="clear-filters-btn"
            onClick={() => {
              setSearchName('');
              setSearchCollege('');
              setSearchDate('');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="table-info">
        Showing {filteredAndSortedStudents.length} of {students.length} students
      </div>

      <div className="table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                Student Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('phone')}>
                Phone {sortField === 'phone' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('email')}>
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('college_name')}>
                College {sortField === 'college_name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Address</th>
              <th>Exam Preference</th>
              <th onClick={() => handleSort('registration_date')}>
                Registration Date {sortField === 'registration_date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('created_at')}>
                Date Added {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedStudents.map(student => (
              <tr key={student.id}>
                <td className="name-cell">
                  <div className="student-avatar-small">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{student.name}</span>
                </td>
                <td>{student.phone}</td>
                <td>{student.email}</td>
                <td>{student.college_name}</td>
                <td className="address-cell">{student.address}</td>
                <td>
                  <div className="exam-badges-small">
                    {student.exam_preferences.map(exam => (
                      <span key={exam} className="exam-badge-small">{exam}</span>
                    ))}
                  </div>
                </td>
                <td>{student.registration_date ? formatDate(student.registration_date) : '-'}</td>
                <td>{formatDate(student.created_at)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit(student)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => onDelete(student.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;


