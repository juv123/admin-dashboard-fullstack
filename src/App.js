import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Users from './components/Users';
import Profile from './components/Profile';
import AddUser from './components/AddUser';
import Notifications from './components/Notifications';



function App() {
  return (
    <>
    
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/AddUser" element={<AddUser />} />
        <Route path="/Notifications" element={<Notifications />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
