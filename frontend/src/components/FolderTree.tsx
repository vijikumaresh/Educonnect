import React, { useState, useMemo } from 'react';
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
  searchTerm?: string;
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
  onCopy,
  searchTerm = ''
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
          {subFolders.map(subFolder => {
            // Recursively get all descendants to check for matches
            const getDescendants = (folderId: string): Folder[] => {
              const directChildren = allFolders.filter(f => f.parent_id === folderId);
              const allDescendants = [...directChildren];
              directChildren.forEach(child => {
                allDescendants.push(...getDescendants(child.id));
              });
              return allDescendants;
            };
            
            // Get filtered subfolders for this child
            const childSubFolders = searchTerm
              ? allFolders.filter(f => {
                  if (f.parent_id !== subFolder.id) return false;
                  const searchLower = searchTerm.toLowerCase();
                  const nameMatches = f.name.toLowerCase().includes(searchLower);
                  const descendants = getDescendants(f.id);
                  const descendantMatches = descendants.some(desc => 
                    desc.name.toLowerCase().includes(searchLower)
                  );
                  return nameMatches || descendantMatches;
                })
              : allFolders.filter(f => f.parent_id === subFolder.id);
            
            return (
              <FolderTreeNode
                key={subFolder.id}
                folder={subFolder}
                subFolders={childSubFolders}
                allFolders={allFolders}
                isSelected={isSelected}
                onSelect={onSelect}
                onCreateSubfolder={onCreateSubfolder}
                onRename={onRename}
                onDelete={onDelete}
                onMove={onMove}
                onCopy={onCopy}
                searchTerm={searchTerm}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const FolderTreeNode: React.FC<FolderNodeProps> = (props) => {
  const searchTerm = props.searchTerm || '';
  
  // Recursively get all descendants
  const getDescendants = (folderId: string): Folder[] => {
    const directChildren = props.allFolders.filter(f => f.parent_id === folderId);
    const allDescendants = [...directChildren];
    directChildren.forEach(child => {
      allDescendants.push(...getDescendants(child.id));
    });
    return allDescendants;
  };
  
  const subFolders = searchTerm
    ? props.allFolders.filter(f => {
        if (f.parent_id !== props.folder.id) return false;
        const searchLower = searchTerm.toLowerCase();
        const nameMatches = f.name.toLowerCase().includes(searchLower);
        const descendants = getDescendants(f.id);
        const descendantMatches = descendants.some(desc => 
          desc.name.toLowerCase().includes(searchLower)
        );
        return nameMatches || descendantMatches;
      })
    : props.allFolders.filter(f => f.parent_id === props.folder.id);
    
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
  const [searchTerm, setSearchTerm] = useState('');

  // Function to recursively check if a folder or any of its descendants match the search term
  const folderMatchesSearch = (folder: Folder, allFolders: Folder[], searchTerm: string): boolean => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const folderNameMatches = folder.name.toLowerCase().includes(searchLower);
    
    // Get all descendants recursively
    const getDescendants = (folderId: string): Folder[] => {
      const directChildren = allFolders.filter(f => f.parent_id === folderId);
      const allDescendants = [...directChildren];
      directChildren.forEach(child => {
        allDescendants.push(...getDescendants(child.id));
      });
      return allDescendants;
    };
    
    const descendants = getDescendants(folder.id);
    const anyDescendantMatches = descendants.some(desc => 
      desc.name.toLowerCase().includes(searchLower)
    );
    
    return folderNameMatches || anyDescendantMatches;
  };

  // Function to get filtered subfolders (only those that match or have matching children)
  const getFilteredSubfolders = (parentId: string | null, allFolders: Folder[], searchTerm: string): Folder[] => {
    if (!searchTerm.trim()) {
      return allFolders.filter(f => f.parent_id === parentId);
    }
    
    return allFolders.filter(f => 
      f.parent_id === parentId && folderMatchesSearch(f, allFolders, searchTerm)
    );
  };

  // Filter root folders based on search term
  const filteredRootFolders = useMemo(() => {
    if (!searchTerm.trim()) {
      return folders.filter(f => !f.parent_id);
    }
    
    return folders.filter(f => 
      !f.parent_id && folderMatchesSearch(f, folders, searchTerm)
    );
  }, [folders, searchTerm]);

  return (
    <div className="folder-tree">
      {/* Search Input */}
      <div className="folder-search-container">
        <input
          type="text"
          className="folder-search-input"
          placeholder="Search districts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="folder-search-clear"
            onClick={() => setSearchTerm('')}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div 
        className={`folder-item root-item ${selectedFolderId === null ? 'selected' : ''}`}
        onClick={() => onFolderSelect(null)}
      >
        <span className="folder-icon">🏠</span>
        <span className="folder-name">All Students</span>
      </div>
      {filteredRootFolders.length === 0 && searchTerm ? (
        <div className="folder-search-empty">
          <p>No folders found matching "{searchTerm}"</p>
        </div>
      ) : (
        filteredRootFolders.map(folder => {
          const subFolders = getFilteredSubfolders(folder.id, folders, searchTerm);
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
              searchTerm={searchTerm}
            />
          );
        })
      )}
    </div>
  );
};

export default FolderTree;


