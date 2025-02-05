import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = ({role}) => {
  const isAdmin = role?.toLowerCase() === "admin";
  //console.log(isAdmin)
  return (
    <div className="min-h-screen flex">
         <div className="w-64 bg-blue-300 shadow-md">
                  <div className="p-4">
                    <h2 className="text-2xl font-bold"> Admin Dashboard </h2>
                    
                  </div>
                  <nav className="mt-4">
                    <Link to="/Dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200">Home</Link>
                    <Link to="/Users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 ">Users</Link>
                    <Link to="/Profile" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200">My Profile</Link>
                    <Link to="/Notifications" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200">Notifications</Link>
                  </nav>
                </div>
    </div>
  )
}

export default Sidebar