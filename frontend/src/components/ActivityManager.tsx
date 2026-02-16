import React, { useState, useEffect } from 'react';
import { Seminar, RecruitmentDrive, BookOrder } from '../types';
import { seminarsAPI, recruitmentAPI, bookOrdersAPI } from '../services/api';
import SeminarForm from './SeminarForm';
import RecruitmentForm from './RecruitmentForm';
import BookOrderForm from './BookOrderForm';
import '../styles/ActivityManager.css';

interface ActivityManagerProps {
  folderId: string;
  folderName: string;
}

type ActivityTab = 'seminars' | 'recruitment' | 'books';

const ActivityManager: React.FC<ActivityManagerProps> = ({ folderId, folderName }) => {
  const [activeTab, setActiveTab] = useState<ActivityTab>('seminars');
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [recruitment, setRecruitment] = useState<RecruitmentDrive[]>([]);
  const [bookOrders, setBookOrders] = useState<BookOrder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActivities();
  }, [folderId, activeTab]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'seminars':
          const seminarsData = await seminarsAPI.getByFolder(folderId);
          setSeminars(seminarsData);
          break;
        case 'recruitment':
          const recruitmentData = await recruitmentAPI.getByFolder(folderId);
          setRecruitment(recruitmentData);
          break;
        case 'books':
          const booksData = await bookOrdersAPI.getByFolder(folderId);
          setBookOrders(booksData);
          break;
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSeminar = async (data: any) => {
    try {
      if (editingItem) {
        const updated = await seminarsAPI.update(editingItem.id, data);
        setSeminars(seminars.map(s => s.id === editingItem.id ? updated : s));
      } else {
        const newSeminar = await seminarsAPI.create({ ...data, folder_id: folderId });
        setSeminars([newSeminar, ...seminars]);
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      alert('Failed to save seminar');
      console.error(error);
    }
  };

  const handleSaveRecruitment = async (data: any) => {
    try {
      if (editingItem) {
        const updated = await recruitmentAPI.update(editingItem.id, data);
        setRecruitment(recruitment.map(r => r.id === editingItem.id ? updated : r));
      } else {
        const newDrive = await recruitmentAPI.create({ ...data, folder_id: folderId });
        setRecruitment([newDrive, ...recruitment]);
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      alert('Failed to save recruitment drive');
      console.error(error);
    }
  };

  const handleSaveBookOrder = async (data: any) => {
    try {
      if (editingItem) {
        const updated = await bookOrdersAPI.update(editingItem.id, data);
        setBookOrders(bookOrders.map(b => b.id === editingItem.id ? updated : b));
      } else {
        const newOrder = await bookOrdersAPI.create({ ...data, folder_id: folderId });
        setBookOrders([newOrder, ...bookOrders]);
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      alert('Failed to save book order');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      switch (activeTab) {
        case 'seminars':
          await seminarsAPI.delete(id);
          setSeminars(seminars.filter(s => s.id !== id));
          break;
        case 'recruitment':
          await recruitmentAPI.delete(id);
          setRecruitment(recruitment.filter(r => r.id !== id));
          break;
        case 'books':
          await bookOrdersAPI.delete(id);
          setBookOrders(bookOrders.filter(b => b.id !== id));
          break;
      }
    } catch (error) {
      alert('Failed to delete item');
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="activity-manager">
      <div className="activity-header">
        <h2>📊 Activity Tracking - {folderName}</h2>
      </div>

      <div className="activity-tabs">
        <button
          className={`tab ${activeTab === 'seminars' ? 'active' : ''}`}
          onClick={() => { setActiveTab('seminars'); setShowForm(false); }}
        >
          📚 Seminars ({seminars.length})
        </button>
        <button
          className={`tab ${activeTab === 'recruitment' ? 'active' : ''}`}
          onClick={() => { setActiveTab('recruitment'); setShowForm(false); }}
        >
          💼 Recruitment ({recruitment.length})
        </button>
        <button
          className={`tab ${activeTab === 'books' ? 'active' : ''}`}
          onClick={() => { setActiveTab('books'); setShowForm(false); }}
        >
          📖 Book Orders ({bookOrders.length})
        </button>
      </div>

      <div className="activity-content">
        {!showForm && (
          <button className="add-activity-btn" onClick={() => { setShowForm(true); setEditingItem(null); }}>
            + Add {activeTab === 'seminars' ? 'Seminar' : activeTab === 'recruitment' ? 'Recruitment Drive' : 'Book Order'}
          </button>
        )}

        {showForm && (
          <div className="activity-form-container">
            {activeTab === 'seminars' && (
              <SeminarForm
                onSave={handleSaveSeminar}
                onCancel={() => { setShowForm(false); setEditingItem(null); }}
                initialData={editingItem}
              />
            )}
            {activeTab === 'recruitment' && (
              <RecruitmentForm
                onSave={handleSaveRecruitment}
                onCancel={() => { setShowForm(false); setEditingItem(null); }}
                initialData={editingItem}
              />
            )}
            {activeTab === 'books' && (
              <BookOrderForm
                onSave={handleSaveBookOrder}
                onCancel={() => { setShowForm(false); setEditingItem(null); }}
                initialData={editingItem}
              />
            )}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="activity-list">
            {activeTab === 'seminars' && seminars.length === 0 && !showForm && (
              <div className="empty-state">No seminars recorded yet. Click "Add Seminar" to get started.</div>
            )}
            {activeTab === 'seminars' && seminars.map(seminar => (
              <div key={seminar.id} className="activity-card">
                <div className="activity-card-header">
                  <h3>{seminar.title}</h3>
                  <div className="activity-actions">
                    <button onClick={() => { setEditingItem(seminar); setShowForm(true); }} className="edit-btn">✏️</button>
                    <button onClick={() => handleDelete(seminar.id)} className="delete-btn">🗑️</button>
                  </div>
                </div>
                <div className="activity-details">
                  <p><strong>Topic:</strong> {seminar.topic}</p>
                  <p><strong>Participants:</strong> {seminar.participants_count}</p>
                  <p><strong>Date:</strong> {formatDate(seminar.seminar_date)}</p>
                  {seminar.description && <p><strong>Description:</strong> {seminar.description}</p>}
                </div>
              </div>
            ))}

            {activeTab === 'recruitment' && recruitment.length === 0 && !showForm && (
              <div className="empty-state">No recruitment drives recorded yet. Click "Add Recruitment Drive" to get started.</div>
            )}
            {activeTab === 'recruitment' && recruitment.map(drive => (
              <div key={drive.id} className="activity-card">
                <div className="activity-card-header">
                  <h3>{drive.company_name}</h3>
                  <div className="activity-actions">
                    <button onClick={() => { setEditingItem(drive); setShowForm(true); }} className="edit-btn">✏️</button>
                    <button onClick={() => handleDelete(drive.id)} className="delete-btn">🗑️</button>
                  </div>
                </div>
                <div className="activity-details">
                  {drive.job_role && <p><strong>Role:</strong> {drive.job_role}</p>}
                  <p><strong>Participants:</strong> {drive.participants_count}</p>
                  <p><strong>Selected:</strong> {drive.selected_count}</p>
                  <p><strong>Date:</strong> {formatDate(drive.drive_date)}</p>
                  {drive.description && <p><strong>Description:</strong> {drive.description}</p>}
                </div>
              </div>
            ))}

            {activeTab === 'books' && bookOrders.length === 0 && !showForm && (
              <div className="empty-state">No book orders recorded yet. Click "Add Book Order" to get started.</div>
            )}
            {activeTab === 'books' && bookOrders.map(order => (
              <div key={order.id} className="activity-card">
                <div className="activity-card-header">
                  <h3>{order.book_title}</h3>
                  <div className="activity-actions">
                    <button onClick={() => { setEditingItem(order); setShowForm(true); }} className="edit-btn">✏️</button>
                    <button onClick={() => handleDelete(order.id)} className="delete-btn">🗑️</button>
                  </div>
                </div>
                <div className="activity-details">
                  {order.author && <p><strong>Author:</strong> {order.author}</p>}
                  <p><strong>Session:</strong> {order.academic_session}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Order Date:</strong> {formatDate(order.order_date)}</p>
                  {order.student_name && <p><strong>Student:</strong> {order.student_name}</p>}
                  {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityManager;



