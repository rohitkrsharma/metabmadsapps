/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { HiBell, HiMenu, HiMenuAlt1 } from 'react-icons/hi';

const Navbar = ({ isCollapsed, toggleCollapsed }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (profileOpen) {
      setProfileOpen(false);
    }
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    if (notificationsOpen) {
      setNotificationsOpen(false);
    }
  };


  return (
    <div className="bg-white text-black relative flex justify-end items-center p-4">
      <button onClick={toggleCollapsed} className='absolute top-[20px] left-[20px] text-gray-600 z-40'>
        {isCollapsed ? (
          <HiMenu className="text-2xl " />
        ) : (
          <HiMenuAlt1 className="text-2xl" />
        )}
      </button>
      <button
        className="flex items-center px-4 py-2 bg-customPurple font-medium text-white rounded-md hover:bg-hcolor"
      >
        <FaWallet className='mr-2' />
        Wallet $5000
      </button>
      <div>
      </div>
      <div className="relative ml-4">
        <button
          onClick={toggleNotifications}
        >
          <HiBell className='w-8 h-6' />
        </button>
        {notificationsOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-2">
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Notification 1</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Notification 2</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Notification 3</a>
          </div>
        )}
      </div>
      <div className="relative ml-4">
        <button
          onClick={toggleProfile}
        >
          <img className='w-8 rounded-full' src='https://metaadsapp.s3.ap-south-1.amazonaws.com/profile_user.png' alt='profile' />
        </button>
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-2">
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Profile 1</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Profile 2</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Logout</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
