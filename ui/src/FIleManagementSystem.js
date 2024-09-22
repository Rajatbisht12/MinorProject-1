import React, { useState } from 'react';
import './FileMangementSystem.css'; // Make sure to create this CSS file

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';// Adjust this to match your Spring Boot server URL

const FileManagementSystem = () => {
  const [folderName, setFolderName] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const createFolder = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/createF`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: folderName }),
      });
      const data = await response.text();
      setMessage(data);
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
    formData.append('folder', folderName);
    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      setMessage('Error uploading file: ' + error.message);
    }
  };

  const readFile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/readF`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: fileName }),
      });
      const data = await response.text();
      setFileContent(data);
    } catch (error) {
      setMessage('Error reading file: ' + error.message);
    }
  };

  const deleteFile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/deleteF`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: fileName }),
      });
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      setMessage('Error deleting file: ' + error.message);
    }
  };

  return (
    <div className="container">
      <h1 className="title">File Management System</h1>
      
      <div className="grid">
        <div className="card">
          <h2>Create Folder</h2>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
            className="input"
          />
          <button onClick={createFolder} className="button">
            Create Folder
          </button>
        </div>

        <div className="card">
          <h2>Upload File</h2>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="input"
          />
          <button onClick={uploadFile} className="button">
            Upload File
          </button>
        </div>

        <div className="card">
          <h2>Read File</h2>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            className="input"
          />
          <button onClick={readFile} className="button">
            Read File
          </button>
          {fileContent && (
            <div className="file-content">
              <pre>{fileContent}</pre>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Delete File</h2>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            className="input"
          />
          <button onClick={deleteFile} className="button delete">
            Delete File
          </button>
        </div>
      </div>

      {message && (
        <div className="message">
          {message}
        </div>
      )}
    </div>
  );
};

export default FileManagementSystem;