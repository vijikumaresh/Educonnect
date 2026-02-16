import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import FolderTree from '../components/FolderTree';
import StudentForm from '../components/StudentForm';
import StudentTable from '../components/StudentTable';
import SubfolderDashboard from '../components/SubfolderDashboard';
import FolderMoveModal from '../components/FolderMoveModal';
import Breadcrumbs from '../components/Breadcrumbs';
import ActivityManager from '../components/ActivityManager';
import { Student, Folder } from '../types';
import { foldersAPI, studentsAPI } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movingFolder, setMovingFolder] = useState<Folder | null>(null);
  const [showActivities, setShowActivities] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const handleBack = () => {
    if (showActivities) {
      // If viewing activities, go back to folder view
      setShowActivities(false);
    } else if (showForm) {
      // If viewing form, go back to list
      setShowForm(false);
      setEditingStudent(null);
    } else if (selectedFolderId) {
      // If folder selected, go back to parent or all folders
      const currentFolder = folders.find(f => f.id === selectedFolderId);
      if (currentFolder?.parent_id) {
        setSelectedFolderId(currentFolder.parent_id);
      } else {
        setSelectedFolderId(null);
      }
    } else {
      // At root, go to login page
      navigate('/');
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsData, foldersData] = await Promise.all([
        studentsAPI.getAll(),
        foldersAPI.getAll()
      ]);
      setStudents(studentsData);
      setFolders(foldersData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddContact = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleCreateFolder = async (parentId: string | null) => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;

    try {
      const newFolder = await foldersAPI.create(folderName, parentId);
      setFolders([...folders, newFolder]);
    } catch (err) {
      alert('Failed to create folder');
      console.error(err);
    }
  };

  const handleRenameFolder = async (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    const newName = prompt('Enter new folder name:', folder.name);
    if (!newName || newName === folder.name) return;

    try {
      const updated = await foldersAPI.update(folderId, newName);
      setFolders(folders.map(f => f.id === folderId ? updated : f));
    } catch (err) {
      alert('Failed to rename folder');
      console.error(err);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!window.confirm('Delete this folder? All subfolders and students will be removed.')) {
      return;
    }

    try {
      await foldersAPI.delete(folderId);
      setFolders(folders.filter(f => f.id !== folderId));
      if (selectedFolderId === folderId) {
        setSelectedFolderId(null);
      }
    } catch (err) {
      alert('Failed to delete folder');
      console.error(err);
    }
  };

  const handleMoveFolder = async (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;
    
    setMovingFolder(folder);
  };

  const handleConfirmMove = async (targetFolderId: string | null) => {
    if (!movingFolder) return;

    try {
      const updated = await foldersAPI.move(movingFolder.id, targetFolderId);
      setFolders(folders.map(f => f.id === movingFolder.id ? updated : f));
      setMovingFolder(null);
    } catch (err) {
      alert('Failed to move folder');
      console.error(err);
    }
  };

  const handleCopyFolder = async (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    const newName = prompt('Enter name for copied folder:', `${folder.name} (Copy)`);
    if (!newName) return;

    try {
      const newFolder = await foldersAPI.create(newName, folder.parent_id);
      setFolders([...folders, newFolder]);
      
      // Copy all students from the original folder to the new folder
      const studentsInFolder = students.filter(s => s.folder_id === folderId);
      for (const student of studentsInFolder) {
        const studentCopy = {
          name: student.name,
          phone: student.phone,
          email: student.email,
          college_name: student.college_name,
          address: student.address,
          exam_preferences: student.exam_preferences,
          folder_id: newFolder.id,
          registration_date: student.registration_date
        };
        const copiedStudent = await studentsAPI.create(studentCopy);
        setStudents(prev => [...prev, copiedStudent]);
      }
      
      alert(`Folder copied successfully with ${studentsInFolder.length} students!`);
    } catch (err) {
      alert('Failed to copy folder');
      console.error(err);
    }
  };

  const handleSaveStudent = async (studentData: Omit<Student, 'id' | 'created_at'>) => {
    console.log('Attempting to save student:', studentData);
    try {
      const apiData = {
        name: studentData.name,
        phone: studentData.phone,
        email: studentData.email,
        college_name: studentData.college_name,
        address: studentData.address,
        exam_preferences: studentData.exam_preferences,
        folder_id: selectedFolderId,
        registration_date: studentData.registration_date
      };

      console.log('Sending to API:', apiData);

      if (editingStudent) {
        const updated = await studentsAPI.update(editingStudent.id, apiData);
        console.log('Student updated:', updated);
        setStudents(students.map(s => s.id === editingStudent.id ? updated : s));
      } else {
        const newStudent = await studentsAPI.create(apiData);
        console.log('Student created:', newStudent);
        setStudents([newStudent, ...students]);
      }
      setShowForm(false);
      setEditingStudent(null);
      alert('Student saved successfully!');
    } catch (err) {
      console.error('Error saving student:', err);
      alert(`Failed to save student: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await studentsAPI.delete(id);
      setStudents(students.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete student');
      console.error(err);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const filteredStudents = selectedFolderId
    ? students.filter(s => s.folder_id === selectedFolderId)
    : students; // Show ALL students when no folder is selected

  // Get subfolders of the selected folder
  const selectedFolder = selectedFolderId ? folders.find(f => f.id === selectedFolderId) : null;
  const subfolders = selectedFolderId ? folders.filter(f => f.parent_id === selectedFolderId) : [];
  
  // Check if this folder is a "main folder" (has NO parent) or has subfolders
  const isMainFolder = selectedFolder && !selectedFolder.parent_id;
  const hasSubfolders = subfolders.length > 0;
  
  // Show SubfolderDashboard if:
  // 1. It's a main folder (district level) OR
  // 2. It has subfolders already
  const showSubfolderDashboard = selectedFolderId && (isMainFolder || hasSubfolders);

  // Calculate student counts for each folder
  const studentCounts = folders.reduce((acc, folder) => {
    acc[folder.id] = students.filter(s => s.folder_id === folder.id).length;
    return acc;
  }, {} as { [key: string]: number });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <button 
            onClick={handleBack} 
            className="back-button"
            title="Go back"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="back-arrow-icon"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="company-name">ONE27 Educational Services Private Limited</h1>
        </div>
        <div className="header-actions">
          <span className="welcome-text">Welcome, {user?.username}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={loadData}>Retry</button>
        </div>
      )}

      <div className="dashboard-content">
        <aside className="sidebar-new">
          <div className="sidebar-actions">
            <button className="action-btn secondary-btn" onClick={() => handleCreateFolder(null)}>
              <span className="btn-icon">📁</span>
              Create Folder
            </button>
          </div>
          
          <div className="folder-section">
            <h3 className="section-title">Folders</h3>
            <FolderTree
              folders={folders}
              selectedFolderId={selectedFolderId}
              onFolderSelect={setSelectedFolderId}
              onCreateFolder={handleCreateFolder}
              onRenameFolder={handleRenameFolder}
              onDeleteFolder={handleDeleteFolder}
              onMoveFolder={handleMoveFolder}
              onCopyFolder={handleCopyFolder}
            />
          </div>
        </aside>
        
        <main className="main-content-new">
          <Breadcrumbs
            folders={folders}
            selectedFolderId={selectedFolderId}
            onFolderClick={setSelectedFolderId}
          />
          
          {showForm ? (
            <StudentForm
              onSave={handleSaveStudent}
              onCancel={handleCancelForm}
              initialData={editingStudent}
              defaultCollegeName={
                selectedFolderId 
                  ? folders.find(f => f.id === selectedFolderId)?.name || ''
                  : ''
              }
            />
          ) : showActivities && selectedFolderId ? (
            <ActivityManager
              folderId={selectedFolderId}
              folderName={folders.find(f => f.id === selectedFolderId)?.name || 'Folder'}
            />
          ) : showSubfolderDashboard ? (
            <SubfolderDashboard
              parentFolder={selectedFolder || null}
              subfolders={subfolders}
              studentCounts={studentCounts}
              onFolderClick={setSelectedFolderId}
              onAddContactClick={handleAddContact}
              onCreateSubfolder={() => handleCreateFolder(selectedFolderId)}
            />
          ) : (
            <>
              <div className="content-header">
                <div className="header-title-section">
                  <h2>
                    {selectedFolderId
                      ? folders.find(f => f.id === selectedFolderId)?.name || 'Folder'
                      : 'All Students'}
                  </h2>
                  <p className="student-count">{filteredStudents.length} students</p>
                </div>
                <div className="header-actions-group">
                  {selectedFolderId && (
                    <button 
                      className="activity-btn" 
                      onClick={() => setShowActivities(!showActivities)}
                      title="Manage Activities"
                    >
                      <span className="btn-icon">📊</span>
                      Activities
                    </button>
                  )}
                  <button className="add-contact-btn" onClick={handleAddContact}>
                    <span className="btn-icon">+</span>
                    Add Contact
                  </button>
                </div>
              </div>
              <StudentTable
                students={filteredStudents}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
              />
            </>
          )}
        </main>
      </div>

      {movingFolder && (
        <FolderMoveModal
          folders={folders}
          folderToMove={movingFolder}
          onMove={handleConfirmMove}
          onCancel={() => setMovingFolder(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
