// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OwnerLogin from './components/OwnerLogin'; // Adjust the path based on where you saved the component
import DashBoard from './components/DashBoard';
import Menu from './components/Menu';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          {/* Add other routes as necessary */}
          {/* Define the route for the Dashboard component */}
          <Route path="/dashboard" element={<DashBoard />} />

          {/* Define the route for the OwnerLogin */}
          <Route path="/login" element={<OwnerLogin />} />

          <Route path="/menu" element={<Menu />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

