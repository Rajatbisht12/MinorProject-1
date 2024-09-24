import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App'; // Ensure this matches the file path and name

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
