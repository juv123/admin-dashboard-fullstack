import { Trash } from 'lucide-react';
import React, { useState } from 'react';
import Header from './Header';
import useAuthUser from "../hooks/useAuthUser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from './Sidebar';
import { validateEmail, validatePasswordSyntax } from '../Utils/validations';
import axios from 'axios';
import ErrorPage from '../pages/ErrorPage';

const AddUser = () => {
  const { user, loading } = useAuthUser(); // Custom hook to get logged-in user info
  const [formData, setFormData] = useState({
    username: "",
    emailid: "",
    password: "",
    role: "Guest",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ✅ API call to create user */
  const handleAddUser = async () => {
    try {
      setIsSubmitting(true);

      // Validate email
      const emailError = validateEmail(formData.emailid);
      if (emailError) {
        toast.error(emailError);
        setIsSubmitting(false);
        return;
      }

      // Validate password
      const passwordError = validatePasswordSyntax(formData.password);
      if (passwordError) {
        toast.error(passwordError);
        setIsSubmitting(false);
        return;
      }

      // Get auth token
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setIsSubmitting(false);
        return;
      }

      // API Call
      await axios.post("http://localhost:8000/api/register", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`New user added successfully!`, {
        position: "top-right",
        autoClose: 5000,
      });

      // Reset Form
      setFormData({
        username: "",
        emailid: "",
        password: "",
        role: "Guest",
      });

    } catch (error) {
      toast.error("Failed to create user!", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancel = () => {
    setFormData({
      username: "",
      emailid: "",
      password: "",
      role: "Guest",
    });
  };

  return (
    <div className="min-h-screen flex flex-grow">
      <Sidebar role={user?.role} />
      <Header username={user?.username} />

      <div className="mt-28 m-12 grid grid-cols-1 lg:grid-cols-3 gap-6 w-screen p-6">
        {loading ? (
          // 🔥 Shimmer Skeleton UI
          <div className="bg-gray-50 p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
            <div className="flex flex-col space-y-4">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="flex gap-4 mt-4">
                <div className="h-10 bg-blue-300 rounded w-24"></div>
                <div className="h-10 bg-red-300 rounded w-24"></div>
              </div>
            </div>
          </div>
        ) : user?.role.toLowerCase() === 'admin' ? (
          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:bg-gray-200">
            <h2 className="text-xl font-bold">Add User</h2>
            <ToastContainer />

            <div className="mt-1 flex flex-col">
              <strong>Username:</strong>
              <input 
                type="text" 
                name="username" 
                value={formData.username} 
                className="border p-1 rounded" 
                onChange={handleChange} 
                disabled={isSubmitting}
              />

              <strong>Email ID:</strong>  
              <input
                type="text"
                name="emailid"
                value={formData.emailid}
                className="border p-1 rounded"
                onChange={handleChange}
                disabled={isSubmitting}
              />

              <strong>Password:</strong> 
              <input 
                type="password" 
                name="password" 
                value={formData.password}  
                className="border p-1 rounded"
                onChange={handleChange}
                disabled={isSubmitting}
              />

              {/* Buttons */}
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={handleAddUser} 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </button>

                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-700" 
                  onClick={cancel}
                  disabled={isSubmitting}
                >
                  <Trash size={16} /> Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <ErrorPage />
        )}
      </div>
    </div>
  );
};

export default AddUser;
