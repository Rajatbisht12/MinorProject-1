import React, { useState, useEffect, useCallback } from 'react';
import { Folder, File, Upload, Trash2, Plus } from 'lucide-react';
import { Link } from "react-router-dom";
import './FileMangementSystem.css'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const FileManagementSystem = () => {
  const [folderName, setFolderName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);

  const fetchFilesAndFolders = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/list?path=${currentPath}`);
      const data = await response.json();
      setFiles(data.files || []);
      setFolders(data.folders || []);
    } catch (error) {
      setMessage('Error fetching files and folders: ' + error.message);
    }
  }, [currentPath]);

  useEffect(() => {
    fetchFilesAndFolders();
  }, [fetchFilesAndFolders]);

  const createFolder = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/createF`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `${currentPath}${folderName}` }),
      });
      const data = await response.text();
      setMessage(data);
      fetchFilesAndFolders();
      setFolderName('');
    } catch (error) {
      setMessage('Error creating folder: ' + error.message);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      setMessage('Please select a file to upload');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('folder', currentPath);
    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.text();
      setMessage(data);
      fetchFilesAndFolders();
      setSelectedFile(null);
    } catch (error) {
      setMessage('Error uploading file: ' + error.message);
    }
  };

  const deleteItem = async (itemName, isFolder) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${isFolder ? 'deleteFolder' : 'deleteF'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `${currentPath}${itemName}` }),
      });
      const data = await response.text();
      setMessage(data);
      fetchFilesAndFolders();
    } catch (error) {
      setMessage(`Error deleting ${isFolder ? 'folder' : 'file'}: ` + error.message);
    }
  };

  const navigateToFolder = (folderName) => {
    setCurrentPath(`${currentPath}${folderName}/`);
  };

  const navigateUp = () => {
    const newPath = currentPath.split('/').slice(0, -2).join('/') + '/';
    setCurrentPath(newPath);
  };

  return (
    <div className="file-management-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="title">File System</h1>
        <nav className="nav">
          <Link to="/" className="nav-link">My Drive</Link>
          <Link to="/" className="nav-link">Shared with me</Link>
          <Link to="/" className="nav-link">Recent</Link>
          <Link to="/" className="nav-link">Trash</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {/* Toolbar */}
        <div className="toolbar">
          <button onClick={navigateUp} className="toolbar-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="current-path">{currentPath}</span>
          <div className="toolbar-actions">
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="New folder name"
              className="folder-input"
            />
            <button onClick={createFolder} className="create-folder-button">
              <Plus className="icon" />
            </button>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="upload-button">
              <Upload className="icon" />
            </label>
            <button onClick={uploadFile} className="upload-confirm-button">
              Upload
            </button>
          </div>
        </div>

        {/* File/Folder Grid */}
        <div className="grid-container">
          {folders.map((folder) => (
            <div key={folder} className="grid-item folder" onClick={() => navigateToFolder(folder)}>
              <Folder className="icon" />
              <span className="item-name">{folder}</span>
              <button onClick={(e) => { e.stopPropagation(); deleteItem(folder, true); }} className="delete-button">
                <Trash2 className="icon" />
              </button>
            </div>
          ))}
          {files.map((file) => (
            <div key={file} className="grid-item file">
              <File className="icon" />
              <span className="item-name">{file}</span>
              <button onClick={() => deleteItem(file, false)} className="delete-button">
                <Trash2 className="icon" />
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Message display */}
      {message && (
        <div className="message-display">
          {message}
        </div>
      )}
    </div>
  );
};

export default FileManagementSystem;
