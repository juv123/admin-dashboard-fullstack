import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthUser from "../hooks/useAuthUser";
import Header from './Header';
import ErrorPage from '../pages/ErrorPage';

const Users = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuthUser();
  const [isEditable, setEditable] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const roles = ["Admin", "User", "Guest"];
  const [loading, setLoading] = useState(true); // Loading state for users
  const [userLoading, setUserLoading] = useState(true); // Loading state for user

  const listUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/users");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error fetching users!', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    listUsers();
  }, []);

  useEffect(() => {
    if (user) {
      setUserLoading(false);
    }
  }, [user]);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const toggleEdit = () => {
    setEditable(!isEditable);
  };

  const handleUpdateRole = async (userid, role) => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      await axios.put(`http://localhost:8000/api/users/${userid}/update/role`, {
        role: role
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`Role changed to ${role} successfully!`, {
        position: "top-right",
        autoClose: 5000,
      });
      setEditable(false);
    } catch (error) {
      toast.error("Failed to update role!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const deleteUser = async (user) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found");
      return;
    }

    if (window.confirm('Are you sure you want to remove this User?')) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${user.id}/delete`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(
          <>
            <span className='text-red-500'>{user.username}</span>&nbsp;&nbsp;has been removed.
          </>,
          {
            autoClose: 5000,
            hideProgressBar: false,
          }
        );
      } catch (error) {
        toast.error('Something went wrong. Please try again!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
        console.error('Error deleting User:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <Header username={user?.username} />
      <div className="flex-1 p-6">
        {loading || userLoading ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Shimmer effect */}
              {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-200 p-6 rounded-lg shadow-md animate-pulse mt-20">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-300 rounded w-2/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {user && user?.role.toLowerCase() === 'admin' ? (
              <>
                <div className="flex justify-end mt-10">
                  <Link
                    to="/AddUser"
                    className="block py-3 px-4 w-20 h-16 mb-2 rounded-lg bg-cover bg-center bg-green-300 hover:bg-green-600 transition duration-200 ease-in-out"
                    style={{
                      backgroundImage: "url('https://th.bing.com/th/id/OIP.1zfZ7k3kNYybNm-EvbzrlgHaHa?w=216&h=216&c=7&r=0&o=5&pid=1.7')"
                    }}
                  />
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map((user) => (
                    <div key={user.id} className="bg-gray-50 p-6 rounded-lg shadow-md hover:bg-gray-200">
                      <h2 className="text-xl font-bold text-blue-500">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</h2>
                      <p className="mt-2 text-gray-600">{user.emailid}</p>
                      <p className="mt-2 text-gray-600">role:{user.role}</p>

                      <div className="flex gap-2 mt-2">
                        {isEditable && (
                          <div>
                            <label htmlFor="role">Select Role: </label>
                            <select
                              id="role"
                              value={selectedRole}
                              onChange={handleRoleChange}
                              className="border p-2"
                            >
                              <option value="">Select Role</option>
                              {roles.map((role, index) => (
                                <option key={index} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              className="w-16 h-7 m-2 rounded-lg bg-green-300 hover:bg-green-600 transition duration-200 ease-in-out"
                              onClick={() => handleUpdateRole(user.id, selectedRole)}
                            >
                              Update
                            </button>
                          </div>
                        )}
                      </div>
                      <button className="w-16 h-7 rounded-lg bg-green-300 hover:bg-green-600 transition duration-200 ease-in-out" onClick={toggleEdit}>
                        {isEditable ? 'Cancel' : 'Edit'}
                      </button>
                      {!isEditable && (
                        <button className="w-16 h-7 m-2 rounded-lg bg-red-300 hover:bg-red-600 transition duration-200 ease-in-out" onClick={() => deleteUser(user)}>
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <ErrorPage /> // Show error page only for non-admin users
            )}
          </>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Users;
