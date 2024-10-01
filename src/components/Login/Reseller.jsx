import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { API_BASE_URL, fetchToken } from '../utils/auth';

const AdminLogin = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const token = await fetchToken();
      const response = await axios.post(
        `${API_BASE_URL}/Auth/AdminLogin`,
        {
          userId: username,
          password: password,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'accept': '*/*',
          },
        }
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
        const { id } = response.data.data; // Extract the id from the response data
        localStorage.setItem('adminId', id); // Save id to localStorage

        // Successfully logged in, navigate to dashboard
        navigate('/dashboard');
      } else {
        // Show toast notification for invalid credentials
        toast.error('Please use valid credentials');
      }
    } catch (error) {
      // Handle error and show toast notification
      toast.error('Invalid UserId or Password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-poppins">
      {/* ToastContainer should be added once in your component tree */}
      <ToastContainer />
      <div className="flex flex-col-reverse md:flex-row p-6 gap-5 bg-white shadow-md rounded-3xl max-w-5xl mx-auto">
        <div className="w-[70%] flex flex-col items-center justify-between">
          <div className="flex flex-col mt-10">
            <div className="flex gap-2 items-center">
              <h1 className="text-4xl font-bold mb-4 text-center text-pink-600">Login as an Admin</h1>
              <img
                src="https://metaadsapp.s3.ap-south-1.amazonaws.com/Login-reseller-icon.png"
                alt="Small"
                className="mb-4"
              />
            </div>
            <p className="mb-6">
              Today is a new day. It's your day. You shape it.<br />
              Sign in to start managing your coin.
            </p>
            <div className="space-y-4">
              <div>
                <label>User Id</label>
                <input
                  type="text"
                  placeholder="example@gmail.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="p-2 mt-1 border-2 rounded-xl w-full"
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="at least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 mt-1 border-2 rounded-xl w-full"
                />
              </div>
              <button
                onClick={handleLogin}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-xl w-full"
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="mt-auto">
            <p className="text-center mt-5 text-gray-400">© 2024 ALL RIGHTS RESERVED</p>
          </div>
        </div>
        <div className="flex">
          <img
            src="https://metaadsapp.s3.ap-south-1.amazonaws.com/Login-reseller.png"
            alt="Large"
            className="rounded-3xl w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
