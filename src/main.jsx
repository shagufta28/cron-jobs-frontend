import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {CronJobProvider} from '../src/context/CronJobContext'



// Get the root element from the DOM
const rootElement = document.getElementById('root');

// Create a React root for the application
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <CronJobProvider>
    <App />
  </CronJobProvider>
);
