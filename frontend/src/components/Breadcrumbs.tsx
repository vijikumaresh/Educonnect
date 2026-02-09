import React from 'react';
import { Folder } from '../types';
import '../styles/Breadcrumbs.css';

interface BreadcrumbsProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onFolderClick: (folderId: string | null) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  folders,
  selectedFolderId,
  onFolderClick
}) => {
  const getBreadcrumbPath = (): Folder[] => {
    if (!selectedFolderId) return [];
    
    const path: Folder[] = [];
    let currentId: string | null = selectedFolderId;
    
    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (!folder) break;
      path.unshift(folder);
      currentId = folder.parent_id;
    }
    
    return path;
  };

  const breadcrumbPath = getBreadcrumbPath();
  
  if (breadcrumbPath.length === 0) return null;

  return (
    <div className="breadcrumbs">
      <button 
        className="breadcrumb-item home"
        onClick={() => onFolderClick(null)}
      >
        🏠 All Students
      </button>
      {breadcrumbPath.map((folder, index) => (
        <React.Fragment key={folder.id}>
          <span className="breadcrumb-separator">/</span>
          <button
            className={`breadcrumb-item ${index === breadcrumbPath.length - 1 ? 'active' : ''}`}
            onClick={() => onFolderClick(folder.id)}
          >
            {folder.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;

