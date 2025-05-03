import React from 'react';
import ReactDOM from 'react-dom'; // Correct: Import without '/client'
import './index.css';
import TimerApp from './App';
import reportWebVitals from './reportWebVitals';

// Get the DOM element where your React app will attach
const container = document.getElementById('root'); // Make sure 'root' matches your index.html's div ID

// Use the standard React 17 ReactDOM.render() method
ReactDOM.render(
  <React.StrictMode>
    <TimerApp /> {/* Your main application component */}
  </React.StrictMode>,
  container // Pass the DOM element here
);

// If you want to start measuring performance in your app...
reportWebVitals();