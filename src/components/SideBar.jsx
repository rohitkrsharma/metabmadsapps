import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaCog, FaCogs, FaShareAlt, FaShekelSign, FaUserMd } from 'react-icons/fa';
import { HiOutlineChevronDown, HiOutlineChevronRight } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Sidebar = ({ isCollapsed }) => {
  const { t } = useTranslation(); // Initialize translation function
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    const subPath = location.pathname.split('/')[2];
    setActiveMenu(path);
    setActiveSubMenu(subPath);
  }, [location]);

  const handleMenuClick = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
      setActiveSubMenu(null);
    } else {
      setActiveMenu(menu);
      setActiveSubMenu(null); // Reset submenu when main menu changes
    }
  };

  const handleSubMenuClick = (subMenu) => {
    setActiveSubMenu(subMenu);
  };

  useEffect(() => {
    if (isCollapsed) {
      setActiveMenu(null);
      setActiveSubMenu(null);
    }
  }, [isCollapsed]);

  return (
    <div className={`flex ${isCollapsed ? 'w-20' : 'w-[270px]'} h-screen bg-customPurple text-white overflow-hidden transition-all duration-500`}>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between p-4 relative">
          <Link to="/dashboard">
            <img src="https://metaadsapp.s3.ap-south-1.amazonaws.com/img_logo.png" alt="Logo" className="rounded-full" />
          </Link>
        </div>
        {!isCollapsed && (
          <>
            <div className="flex items-center p-4">
              <img src="https://metaadsapp.s3.ap-south-1.amazonaws.com/profile_user.png" alt="User" className="h-10 w-10 rounded-full" />
              <div className="ml-4">
                <h4 className="text-white">Maria Gomez</h4>
                <p className="text-gray-300">Administrator</p>
              </div>
            </div>
            <div className="p-4 text-sm">
              <input
                type="text"
                placeholder={t('search_placeholder')}
                className="w-full px-4 py-2 rounded-full bg-search placeholder-gray-300 focus:outline-none"
              />
            </div>
          </>
        )}
        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            <li className="flex flex-col transition-transform duration-300 transform hover:scale-105">
              <Link to="/dashboard" className={`flex items-center p-2 rounded-md ${activeMenu === 'dashboard' ? 'bg-hcolor' : 'hover:bg-hcolor'} w-full text-left`} onClick={() => handleMenuClick('dashboard')}>
                <MdDashboard data-tooltip-id="tooltip" data-tooltip-content={t('dashboard')} />
                {!isCollapsed && <span className="ml-4">{t('dashboard')}</span>}
              </Link>
            </li>
            <MenuItem
              title={t('crm')}
              icon={<FaUserMd data-tooltip-id="tooltip" data-tooltip-content={t('crm')} />}
              menuKey="crm"
              activeMenu={activeMenu}
              handleMenuClick={handleMenuClick}
              isCollapsed={isCollapsed}
              activeSubMenu={activeSubMenu}
              handleSubMenuClick={handleSubMenuClick}
            >
              <SubMenuLink to="/crm/customer" text={t('customer')} isCollapsed={isCollapsed} icon={<FaUserMd data-tooltip-id="tooltip" data-tooltip-content={t('customer')} />} />
            </MenuItem>
            <MenuItem
              title={t('bm')}
              icon={<FaBriefcase data-tooltip-id="tooltip" data-tooltip-content={t('bmAdsManagement')} />}
              menuKey="bm"
              activeMenu={activeMenu}
              handleMenuClick={handleMenuClick}
              isCollapsed={isCollapsed}
              activeSubMenu={activeSubMenu}
              handleSubMenuClick={handleSubMenuClick}
            >
              <SubMenuLink to="/bm/approval" text={t('bm_approval')} isCollapsed={isCollapsed} icon={<FaBriefcase data-tooltip-id="tooltip" data-tooltip-content={t('bmAdsApproval')} />} />
              <SubMenuLink to="/bm/add" text={t('bm_add')} isCollapsed={isCollapsed} icon={<FaBriefcase data-tooltip-id="tooltip" data-tooltip-content={t('addBM')} />} />
            </MenuItem>
            <MenuItem
              title={t('wallets_management')}
              icon={<FaShekelSign data-tooltip-id="tooltip" data-tooltip-content={t('walletsManagement')} />}
              menuKey="wallets_management"
              activeMenu={activeMenu}
              handleMenuClick={handleMenuClick}
              isCollapsed={isCollapsed}
              activeSubMenu={activeSubMenu}
              handleSubMenuClick={handleSubMenuClick}
            >
              <SubMenuLink to="/wallet/list" text={t('wallet_list')} isCollapsed={isCollapsed} icon={<FaShekelSign data-tooltip-id="tooltip" data-tooltip-content={t('listWallets')} />} />
              <SubMenuLink to="/wallet/history" text={t('wallet_history')} isCollapsed={isCollapsed} icon={<FaShekelSign data-tooltip-id="tooltip" data-tooltip-content={t('walletHistory')} />} />
            </MenuItem>
            <MenuItem
              title={t('shared_management')}
              icon={<FaShareAlt data-tooltip-id="tooltip" data-tooltip-content={t('sharedManagement')} />}
              menuKey="shared"
              activeMenu={activeMenu}
              handleMenuClick={handleMenuClick}
              isCollapsed={isCollapsed}
              activeSubMenu={activeSubMenu}
              handleSubMenuClick={handleSubMenuClick}
            >
              <SubMenuLink to="/shared/list" text={t('shared_list')} isCollapsed={isCollapsed} icon={<FaShareAlt data-tooltip-id="tooltip" data-tooltip-content={t('listSharedBM')} />} />
            </MenuItem>
            <MenuItem
              title={t('master_setting')}
              icon={<FaCogs data-tooltip-id="tooltip" data-tooltip-content={t('masterSetting')} />}
              menuKey="master"
              activeMenu={activeMenu}
              handleMenuClick={handleMenuClick}
              isCollapsed={isCollapsed}
              activeSubMenu={activeSubMenu}
              handleSubMenuClick={handleSubMenuClick}
            >
              <SubMenuLink to="/master/network" text={t('network')} isCollapsed={isCollapsed} icon={<FaCogs data-tooltip-id="tooltip" data-tooltip-content={t('networkTokenSetting')} />} />
              <SubMenuLink to="/master/deposit" text={t('deposit')} isCollapsed={isCollapsed} icon={<FaCogs data-tooltip-id="tooltip" data-tooltip-content={t('depositAddress')} />} />
            </MenuItem>
            <li className="flex flex-col transition-transform duration-300 transform hover:scale-105">
              <Link to="/setting" className={`flex items-center p-2 rounded-md ${activeMenu === 'setting' ? 'bg-hcolor' : 'hover:bg-hcolor'} w-full text-left`} onClick={() => handleMenuClick('setting')}>
                <FaCog data-tooltip-id="tooltip" data-tooltip-content={t('setting')} />
                {!isCollapsed && <span className="ml-4">{t('setting')}</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <Tooltip id="tooltip" place="right" effect="solid" />
    </div>
  );
};

const MenuItem = ({ title, icon, menuKey, activeMenu, handleMenuClick, isCollapsed, children, activeSubMenu, handleSubMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(activeMenu === menuKey);
  }, [activeMenu, menuKey]);

  const handleClick = () => {
    handleMenuClick(menuKey);
    setIsOpen(!isOpen);
  };

  return (
    <li className="flex flex-col">
      <button
        className={`flex items-center p-2 rounded-md w-full text-left ${isOpen ? 'bg-hcolor' : 'hover:bg-hcolor'} transition-transform duration-300 transform hover:scale-105`}
        onClick={handleClick}
      >
        {icon}
        {!isCollapsed && <span className="ml-4">{title}</span>}
        {!isCollapsed && children && (
          <div className="ml-auto transition-transform duration-300">
            {isOpen ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
          </div>
        )}
      </button>
      <ul className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'} ${isCollapsed ? 'pl-4' : 'pl-8'}`}>
        {React.Children.map(children, (child) => React.cloneElement(child, { activeSubMenu, handleSubMenuClick }))}
      </ul>
    </li>
  );
};

const SubMenuLink = ({ to, text, isCollapsed, icon, activeSubMenu, handleSubMenuClick }) => {
  const subMenuKey = to.split('/')[2];

  return (
    <Link
      to={to}
      className={`flex items-center p-2 gap-1 rounded-md ${activeSubMenu === subMenuKey ? 'bg-hcolor' : 'hover:bg-hcolor'} transition-transform duration-300 transform hover:scale-105`}
      onClick={() => handleSubMenuClick(subMenuKey)}
    >
      {icon} {/* Display icon regardless of collapse state */}
      {!isCollapsed && <span className="flex items-center rounded-md w-full text-left">{text}</span>}
    </Link>
  );
};

export default Sidebar;
