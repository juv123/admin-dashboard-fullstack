import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import useAuthUser from "../hooks/useAuthUser";
const Notifications = () => {
    const { user } = useAuthUser(); // Custom hook to get logged-in user
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get notifications from the backend (Laravel)
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/notifications', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // assuming JWT token in localStorage
          },
        });
        setNotifications(response.data['notifications']);
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen flex flex-grow">
      
    <Sidebar role={user?.role} />
    <Header username={user?.username} />
    <div className="mt-28 m-12 grid grid-cols-1 lg:grid-cols-3 gap-6 w-screen">
<div className="bg-gray-50 p-6 rounded-lg shadow-md hover:bg-gray-200">
  <h2 className="text-xl font-bold">Notifications</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {notifications && notifications?.length > 0 ? (
  notifications.map((notification) => (
    <li key={notification.id} className='bg-blue-100 hover:bg-blue-400 text-lg m-3 p-2'>
      {/* Assuming notification.data is an object containing the message and action */}
      {`${notification.data?.username} has ${notification.data?.action}`}
      
      {/* Format the creation date */}
      <span> on {new Date(notification.created_at).toLocaleString()}</span>
    </li>
  ))
) : (
  <p>No new notifications</p>
)}

        </ul>
      )}
    </div>
    </div>
    </div>
  );
};

export default Notifications;
