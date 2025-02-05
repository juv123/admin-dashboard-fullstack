import axios from 'axios';
import React from 'react'

const Header = ({username}) => {
    const handleLogout = async () => {
        const token = localStorage.getItem('token'); // Get token
    
        if (!token) {
            console.error("No token found");
            return;
        }
    
        try {
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            localStorage.removeItem('token'); // Remove token from storage
            window.location.href = '/'; // Redirect to login page
            console.log('Logged out successfully');
        } catch (error) {
            console.error('Logout failed', error.response?.data);
        }
    };
  return (    
    <header className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between shadow-md fixed top-0 left-0 w-full z-50">
      {/* Left: App Title */}
      <h1 className="text-xl font-bold mx-96">Admin Dashboard</h1>

      {/* Right: Username & Logout Button */}
      <div className="flex items-center gap-6">
        <span className="text-sm">{username}</span>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 px-4 py-1.5 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header