import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import useAuthUser from "../hooks/useAuthUser";
import ErrorPage from '../pages/ErrorPage';

const Dashboard = () => {
  const [totalusers, setTotalUsers] = useState("");
  const [users, setUsersNo] = useState("");
  const [guests, setGuestsNo] = useState("");
  const { user, loading } = useAuthUser(); // to get logged-in user info using custom hook

  const findTotalUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/users/total");
      setTotalUsers(response.data['Total_users']);
      setUsersNo(response.data['users']);
      setGuestsNo(response.data['guests']);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    findTotalUsers();
  }, []);

  // Show shimmer if loading, otherwise render dashboard or error page
  if (loading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar role={user?.role} />
        <Header username={user?.username} />
        <div className="flex-1 p-6 mt-12">
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Shimmer Loader Components */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar role={user?.role} />
      <Header username={user?.username} />
      <div className="flex-1 p-6 mt-12">
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user && user?.role.toLowerCase() === 'admin' ? (
            <>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:bg-gray-200">
                <h2 className="text-xl font-bold">Total Users</h2>
                <p className="mt-2 text-gray-600 m-7">{totalusers ? totalusers : 'No Users Found'}</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:bg-gray-300">
                <h2 className="text-xl font-bold">Users</h2>
                <p className="mt-2 text-gray-600">{users}</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:bg-gray-300">
                <h2 className="text-xl font-bold">Guests</h2>
                <p className="mt-2 text-gray-600">{guests}</p>
              </div>
            </>
          ) : (
            <ErrorPage /> // Show error page only for non-admin users
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
