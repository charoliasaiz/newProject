import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Database from './Database';

const Root = () => {
  // Check if the user is authenticated (has a valid token)


  return (
    <Router>
      <Routes>
        
          <Route path="/Database" element={<Database />} />
        
          <Route path="/" element={<App />} />
        
      </Routes>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
