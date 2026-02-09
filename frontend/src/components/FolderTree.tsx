import React, { useState } from 'react';
import { Folder } from '../types';
import '../styles/FolderTree.css';

interface FolderTreeProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onCreateFolder: (parentId: string | null) => void;
  onRenameFolder: (folderId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onMoveFolder: (folderId: string) => void;
  onCopyFolder: (folderId: string) => void;
}

interface FolderNodeProps {
  folder: Folder;
  subFolders: Folder[];
  allFolders: Folder[];
  isSelected: boolean;
  onSelect: () => void;
  onCreateSubfolder: () => void;
  onRename: () => void;
  onDelete: () => void;
  onMove: () => void;
  onCopy: () => void;
}

const FolderNode: React.FC<FolderNodeProps> = ({
  folder,
  subFolders,
  allFolders,
  isSelected,
  onSelect,
  onCreateSubfolder,
  onRename,
  onDelete,
  onMove,
  onCopy
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const hasChildren = subFolders.length > 0;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
    setShowMenu(false);
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Close context menu when clicking outside
  React.useEffect(() => {
    if (contextMenu) {
      const handleClick = () => handleCloseContextMenu();
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu]);

  return (
    <div className="folder-node">
      <div className={`folder-item ${isSelected ? 'selected' : ''}`}>
        <div className="folder-main" onClick={onSelect} onContextMenu={handleContextMenu}>
          {hasChildren && (
            <button
              className="expand-icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {!hasChildren && <span className="folder-spacer"></span>}
          <span className="folder-icon">📁</span>
          <span className="folder-name">{folder.name}</span>
        </div>
        <button
          className="folder-menu-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          ⋮
        </button>
        {showMenu && (
          <div className="folder-menu">
            <button onClick={() => { onCreateSubfolder(); setShowMenu(false); }}>
              📁 New Subfolder
            </button>
            <button onClick={() => { onRename(); setShowMenu(false); }}>
              ✏️ Rename
            </button>
            <button onClick={() => { onMove(); setShowMenu(false); }}>
              📤 Move to...
            </button>
            <button onClick={() => { onCopy(); setShowMenu(false); }}>
              📋 Copy
            </button>
            <button onClick={() => { onDelete(); setShowMenu(false); }} className="delete">
              🗑️ Delete
            </button>
          </div>
        )}
        {contextMenu && (
          <div 
            className="context-menu"
            style={{ 
              position: 'fixed',
              top: `${contextMenu.y}px`,
              left: `${contextMenu.x}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => { onCreateSubfolder(); handleCloseContextMenu(); }}>
              📁 New Subfolder
            </button>
            <button onClick={() => { onRename(); handleCloseContextMenu(); }}>
              ✏️ Rename
            </button>
            <button onClick={() => { onMove(); handleCloseContextMenu(); }}>
              📤 Move to...
            </button>
            <button onClick={() => { onCopy(); handleCloseContextMenu(); }}>
              📋 Copy
            </button>
            <button onClick={() => { onDelete(); handleCloseContextMenu(); }} className="delete">
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div className="folder-children">
          {subFolders.map(subFolder => (
            <FolderTreeNode
              key={subFolder.id}
              folder={subFolder}
              allFolders={allFolders}
              isSelected={isSelected}
              onSelect={onSelect}
              onCreateSubfolder={onCreateSubfolder}
              onRename={onRename}
              onDelete={onDelete}
              onMove={onMove}
              onCopy={onCopy}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FolderTreeNode: React.FC<FolderNodeProps> = (props) => {
  const subFolders = props.allFolders.filter(f => f.parent_id === props.folder.id);
  return <FolderNode {...props} subFolders={subFolders} />;
};

const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  selectedFolderId,
  onFolderSelect,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onMoveFolder,
  onCopyFolder
}) => {
  const rootFolders = folders.filter(f => !f.parent_id);

  return (
    <div className="folder-tree">
      <div 
        className={`folder-item root-item ${selectedFolderId === null ? 'selected' : ''}`}
        onClick={() => onFolderSelect(null)}
      >
        <span className="folder-icon">🏠</span>
        <span className="folder-name">All Students</span>
      </div>
      {rootFolders.map(folder => {
        const subFolders = folders.filter(f => f.parent_id === folder.id);
        return (
          <FolderNode
            key={folder.id}
            folder={folder}
            subFolders={subFolders}
            allFolders={folders}
            isSelected={selectedFolderId === folder.id}
            onSelect={() => onFolderSelect(folder.id)}
            onCreateSubfolder={() => onCreateFolder(folder.id)}
            onRename={() => onRenameFolder(folder.id)}
            onDelete={() => onDeleteFolder(folder.id)}
            onMove={() => onMoveFolder(folder.id)}
            onCopy={() => onCopyFolder(folder.id)}
          />
        );
      })}
    </div>
  );
};

export default FolderTree;


