import React from 'react';
import { Folder } from '../types';
import '../styles/SubfolderDashboard.css';

interface SubfolderDashboardProps {
  parentFolder: Folder | null;
  subfolders: Folder[];
  studentCounts: { [key: string]: number };
  onFolderClick: (folderId: string) => void;
  onAddContactClick: () => void;
  onCreateSubfolder: () => void;
}

const SubfolderDashboard: React.FC<SubfolderDashboardProps> = ({
  parentFolder,
  subfolders,
  studentCounts,
  onFolderClick,
  onAddContactClick,
  onCreateSubfolder
}) => {
  if (!parentFolder) return null;

  return (
    <div className="subfolder-dashboard">
      <div className="dashboard-header">
        <div>
          <h2>{parentFolder.name}</h2>
          <p className="subfolder-count">
            {subfolders.length} {subfolders.length === 1 ? 'subfolder' : 'subfolders'}
          </p>
        </div>
        <div className="header-actions">
          <button className="create-folder-btn" onClick={onCreateSubfolder}>
            <span className="btn-icon">📁+</span>
            Create New Folder
          </button>
          <button className="add-contact-btn" onClick={onAddContactClick}>
            <span className="btn-icon">+</span>
            Add Contact Here
          </button>
        </div>
      </div>

      <div className="subfolders-grid">
        {subfolders.length === 0 ? (
          <div className="empty-subfolders">
            <div className="empty-icon">📁</div>
            <h3>No subfolders yet</h3>
            <p>Click "Create New Folder" above to add your first college/subfolder</p>
          </div>
        ) : (
          subfolders.map(folder => (
            <div
              key={folder.id}
              className="subfolder-card"
              onClick={() => onFolderClick(folder.id)}
            >
              <div className="card-icon">📁</div>
              <div className="card-content">
                <h3 className="card-title">{folder.name}</h3>
                <div className="card-stats">
                  <span className="stat-item">
                    <span className="stat-icon">👥</span>
                    {studentCounts[folder.id] || 0} students
                  </span>
                </div>
              </div>
              <div className="card-arrow">→</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SubfolderDashboard;

