import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FileManagementSystem from './FIleManagementSystem';

const App = () => (
  <Routes>
    <Route path="/" element={<FileManagementSystem />} />
  </Routes>
);

export default App; // Make sure this line is present
