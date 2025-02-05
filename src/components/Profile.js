import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import useAuthUser from "../hooks/useAuthUser";
import { Pencil, Trash } from "lucide-react"; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { validateEmail, validatePassword } from '../Utils/validations';

const Profile = () => {
  const { user, loading } = useAuthUser(); // Custom hook to get logged-in user
  const [isEditing, setIsEditing] = useState(false);
  const [requirePasswordChange, setPasswordChange] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [formData, setFormData] = useState({
    currentpassword: "",
    newpassword: "",
    newpassword_confirmation: "",
  });
  const hiddenPassword = '********';
  const navigate = useNavigate();

  // Update state when input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enable edit mode and copy user details
  const editProfile = (user) => {
    setIsEditing(true);
    setUpdatedProfile({ ...user }); // Copy user data into state
  };

  // API call to update profile
  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      if (!updatedProfile || Object.keys(updatedProfile).length === 0) {
        toast.error("Please fill the fields needed to be updated!", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }
      if (updatedProfile.emailid) {
        const emailError = validateEmail(updatedProfile.emailid);
        if (emailError) {
          toast.error(emailError);
          return;
        }
      }
      
      await axios.put("http://localhost:8000/api/profile/update", updatedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
      toast.success(`Profile Updated successfully!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        style: {
          backgroundColor: '#4caf50',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '10px',
          padding: '15px 25px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }
      });
      setUpdatedProfile({});
    } catch (error) {
      toast.error("Failed to update profile!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handlePasswordChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // API call to update password
  const handlePasswordUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    if (!formData || Object.keys(formData).length === 0) {
      toast.error("Please fill all the required fields!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    try {
      const passwordError = validatePassword(
        formData.newpassword,
        formData.newpassword_confirmation,
        formData.currentpassword
      );
      if (passwordError) {
        toast.error(passwordError);
        return;
      }
      await axios.put("http://localhost:8000/api/changepassword", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
      toast.success(`Password Changed Successfully!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        style: {
          backgroundColor: '#4caf50',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '10px',
          padding: '15px 25px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }
      });
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update Password!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Cancel editing
  const cancel = () => {
    setIsEditing(false);
    setPasswordChange(false);
    setUpdatedProfile({});
  };

  return (
    <div className="min-h-screen flex flex-grow">
      <Sidebar role={user?.role} />
      <Header username={user?.username} />
      <div className="mt-28 m-12 grid grid-cols-1 lg:grid-cols-3 gap-6 w-screen">
        <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:bg-gray-200">
          <h2 className="text-xl font-bold">My Profile</h2>
          <ToastContainer />

          <div className="mt-1 flex flex-col">
            <strong>Username:</strong>
            {loading ? (
              <div className="h-8 bg-gray-300 rounded w-1/2 mb-3"></div>
            ) : (
              isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={updatedProfile.username}
                  className="border p-1 rounded"
                  onChange={handleChange}
                />
              ) : (
                user?.username
              )
            )}

            <strong>Email:</strong>
            {loading ? (
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-3"></div>
            ) : (
              isEditing ? (
                <input
                  type="text"
                  name="emailid"
                  value={updatedProfile.emailid}
                  className="border p-1 rounded"
                  onChange={handleChange}
                />
              ) : (
                user?.emailid
              )
            )}

            <strong>Password:</strong>
            {loading ? (
              <div className="h-8 bg-gray-300 rounded w-40 mb-3"></div>
            ) : (
              hiddenPassword
            )}

            <button
              disabled={loading}
              className={`bg-blue-500 text-white px-4 py-2 rounded w-40 hover:bg-blue-700 mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => setPasswordChange(true)}
            >
              {!loading && 'Change Password'}
            </button>

            <strong>Role:</strong>
            {loading ? (
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-3"></div>
            ) : (
              user?.role
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
              {isEditing ? (
                <button
                  disabled={loading}
                  onClick={handleUpdate}
                  className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Save
                </button>
              ) : (
                <button
                  disabled={loading}
                  onClick={() => setIsEditing(true)}
                  className={`bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Pencil size={16} />  {!loading && 'Edit'}
                </button>
              )}
              {isEditing && (
                <button
                  disabled={loading}
                  onClick={cancel}
                  className={`bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Trash size={16} /> Cancel
                </button>
              )}
            </div>
          </div>

          {requirePasswordChange && (
            <div className="mt-1 flex flex-col">
              <strong>Current Password:</strong>
              <input
                type="text"
                name="currentpassword"
                value={formData.currentpassword}
                className="border p-1 rounded"
                onChange={handlePasswordChange}
              />
              <strong>New Password:</strong>
              <input
                type="text"
                name="newpassword"
                value={formData.newpassword}
                className="border p-1 rounded"
                onChange={handlePasswordChange}
              />
              <strong>Confirm Password:</strong>
              <input
                type="text"
                name="newpassword_confirmation"
                value={formData.newpassword_confirmation}
                className="border p-1 rounded"
                onChange={handlePasswordChange}
              />
              <button
                disabled={loading}
                onClick={handlePasswordUpdate}
                className={`bg-blue-500 text-white px-4 py-2 rounded w-40 mt-2 hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Update Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
