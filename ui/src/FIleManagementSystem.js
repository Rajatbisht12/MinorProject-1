import React, { useState, useEffect, useCallback } from 'react';
import { Folder, File, Upload, Trash2, Plus } from 'lucide-react';
import { Link } from "react-router-dom";


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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">File System</h1>
        </div>
        <nav className="mt-4">
          <Link to="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">My Drive</Link>
          <Link to="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Shared with me</Link>
          <Link to="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Recent</Link>
          <Link to="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Trash</Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={navigateUp} className="text-gray-600 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-lg font-medium">{currentPath}</span>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="New folder name"
              className="border rounded px-2 py-1"
            />
            <button onClick={createFolder} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              <Plus className="h-5 w-5" />
            </button>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              <Upload className="h-5 w-5" />
            </label>
            <button onClick={uploadFile} className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
              Upload
            </button>
          </div>
        </div>

        {/* File/Folder Grid */}
        <div className="p-6 overflow-auto h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {folders.map((folder) => (
              <div key={folder} className="bg-white p-4 rounded shadow-sm hover:shadow-md cursor-pointer flex items-center justify-between" onClick={() => navigateToFolder(folder)}>
                <div className="flex items-center">
                  <Folder className="h-6 w-6 text-yellow-500 mr-2" />
                  <span className="truncate">{folder}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteItem(folder, true); }} className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            {files.map((file) => (
              <div key={file} className="bg-white p-4 rounded shadow-sm hover:shadow-md flex items-center justify-between">
                <div className="flex items-center">
                  <File className="h-6 w-6 text-blue-500 mr-2" />
                  <span className="truncate">{file}</span>
                </div>
                <button onClick={() => deleteItem(file, false)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message display */}
      {message && (
        <div className="absolute bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg">
          {message}
        </div>
      )}
    </div>
  );
};

export default FileManagementSystem;