import React, { useState } from 'react';
import { Folder } from '../types';
import '../styles/FolderMoveModal.css';

interface FolderMoveModalProps {
  folders: Folder[];
  folderToMove: Folder;
  onMove: (targetFolderId: string | null) => void;
  onCancel: () => void;
}

const FolderMoveModal: React.FC<FolderMoveModalProps> = ({
  folders,
  folderToMove,
  onMove,
  onCancel
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Get descendants to prevent circular moves
  const getDescendants = (id: string): string[] => {
    const descendants: string[] = [id];
    folders.forEach(f => {
      if (f.parent_id === id) {
        descendants.push(...getDescendants(f.id));
      }
    });
    return descendants;
  };

  const excludedIds = getDescendants(folderToMove.id);
  const availableFolders = folders.filter(f => !excludedIds.includes(f.id));

  const getDepth = (folderId: string): number => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder || !folder.parent_id) return 0;
    return 1 + getDepth(folder.parent_id);
  };

  const handleMove = () => {
    onMove(selectedFolderId);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Move Folder: {folderToMove.name}</h3>
          <button className="modal-close-btn" onClick={onCancel}>×</button>
        </div>
        
        <div className="modal-body">
          <p className="modal-description">Select destination folder:</p>
          
          <div className="folder-list">
            <div 
              className={`folder-option ${selectedFolderId === null ? 'selected' : ''}`}
              onClick={() => setSelectedFolderId(null)}
            >
              <span className="folder-icon">🏠</span>
              <span className="folder-name">Root (No Parent)</span>
            </div>
            
            {availableFolders.map(folder => {
              const depth = getDepth(folder.id);
              const indent = depth * 20;
              
              return (
                <div
                  key={folder.id}
                  className={`folder-option ${selectedFolderId === folder.id ? 'selected' : ''}`}
                  style={{ paddingLeft: `${20 + indent}px` }}
                  onClick={() => setSelectedFolderId(folder.id)}
                >
                  <span className="folder-icon">📁</span>
                  <span className="folder-name">{folder.name}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-move" onClick={handleMove}>Move Here</button>
        </div>
      </div>
    </div>
  );
};

export default FolderMoveModal;

