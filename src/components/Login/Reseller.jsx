import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchToken } from '../utils/auth';


const AdminLogin = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log('Username:', username);
    console.log('Password:', password);

    try {
      const token = await fetchToken(username, password);
      console.log('Token:', token);

      // Store the token in local storage
      localStorage.setItem('token', token);

      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.message);
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-poppins">
      <div className="flex flex-col-reverse md:flex-row p-6 gap-5 bg-white shadow-md rounded-3xl max-w-5xl mx-auto">
        <div className="w-[70%] flex flex-col items-center justify-between ">
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
