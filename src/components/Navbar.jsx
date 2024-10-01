/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { FaGlobe, FaWallet } from 'react-icons/fa';
import { HiBell, HiMenu, HiMenuAlt1 } from 'react-icons/hi';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const Navbar = ({ isCollapsed, toggleCollapsed }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { t, i18n } = useTranslation(); // Access translation function
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang); // Function to change language
    setDropdownOpen(false);
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
      <button className="flex items-center px-4 py-2 bg-customPurple font-medium text-white rounded-md hover:bg-hcolor">
        <FaWallet className='mr-2' />
        {t('wallet')} $5000
      </button>
      <div className="relative ml-4">
        {/* Globe icon and dropdown */}
        <FaGlobe
          className="text-2xl cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg w-40 z-50">
            <ul className="list-none p-2">
              <li>
                <button
                  onClick={() => changeLanguage('en')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  English
                </button>
              </li>
              <li>
                <button
                  onClick={() => changeLanguage('fr')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Français
                </button>
              </li>
              <li>
                <button
                  onClick={() => changeLanguage('zh')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  中文
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="relative ml-4">
        <button onClick={toggleNotifications}>
          <HiBell className='w-8 h-6' />
        </button>
        {notificationsOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-2 z-50">
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">{t('notification1')}</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">{t('notification2')}</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">{t('notification3')}</a>
          </div>
        )}
      </div>
      <div className="relative ml-4">
        <button onClick={toggleProfile}>
          <img className='w-8 rounded-full' src='https://metaadsapp.s3.ap-south-1.amazonaws.com/profile_user.png' alt='profile' />
        </button>
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-2 z-50">
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">{t('profile1')}</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">{t('profile2')}</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">{t('logout')}</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
