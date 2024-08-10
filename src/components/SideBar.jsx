import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaCog, FaCogs, FaShareAlt, FaShekelSign, FaUserMd } from 'react-icons/fa';
import { HiOutlineChevronDown, HiOutlineChevronRight } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

const Sidebar = ({ isCollapsed }) => {
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
                placeholder="Start typing to search..."
                className="w-full px-4 py-2 rounded-full bg-search placeholder-gray-300 focus:outline-none"
              />
            </div>
          </>
        )}
        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            <li className="flex flex-col transition-transform duration-300 transform hover:scale-105">
              <Link to="/dashboard" className={`flex items-center p-2 rounded-md ${activeMenu === 'dashboard' ? 'bg-hcolor' : 'hover:bg-hcolor'} w-full text-left`} onClick={() => handleMenuClick('dashboard')}>
                <MdDashboard data-tooltip-id="tooltip" data-tooltip-content="Dashboard" />
                {!isCollapsed && <span className="ml-4">Dashboard</span>}
              </Link>
            </li>
            <MenuItem
              title="CRM"
              icon={<FaUserMd data-tooltip-id="tooltip" data-tooltip-content="CRM" />}
              menuKey="crm"
              activeMenu={activeMenu}
              handleMenuClick={handleMenuClick}
              isCollapsed={isCollapsed}
              activeSubMenu={activeSubMenu}
              handleSubMenuClick={handleSubMenuClick}
            >
              <SubMenuLink to="/crm/customer" text="Customer" isCollapsed={isCollapsed} icon={<FaUserMd data-tooltip-id="tooltip" data-tooltip-content="Customer" />} />
            </MenuItem>
            <MenuItem
              title="BM/Ads Management"
              icon={<FaBriefcase data-tooltip-id="tooltip" data-tooltip-content="BM/Ads Management" />}
              menuKey="bm"
              activeMenu={activeMenu}
              handleMenuClick={handleMenuClick}
              isCollapsed={isCollapsed}
              activeSubMenu={activeSubMenu}
              handleSubMenuClick={handleSubMenuClick}
            >
              <SubMenuLink to="/bm/approval" text="BM/ADS Approval" isCollapsed={isCollapsed} icon={<FaBriefcase data-tooltip-id="tooltip" data-tooltip-content="BM/ADS Approval" />} />
              <SubMenuLink to="/bm/add" text="Add BM/ADS" isCollapsed={isCollapsed} icon={<FaBriefcase data-tooltip-id="tooltip" data-tooltip-content="Add BM/ADS" />} />
            </MenuItem>
            <MenuItem
              title="Wallets Management"
              icon={<FaShekelSign data-tooltip-id="tooltip" data-tooltip-content="Wallets Management" />}
              menuKey="wallets"
              activeMenu={activeMenu}
              handleMenuClick={handleMenuClick}
              isCollapsed={isCollapsed}
              activeSubMenu={activeSubMenu}
              handleSubMenuClick={handleSubMenuClick}
            >
              <SubMenuLink to="/wallet/list" text="List of Wallet / TopUp" isCollapsed={isCollapsed} icon={<FaShekelSign data-tooltip-id="tooltip" data-tooltip-content="List of Wallet" />} />
              {/* <SubMenuLink to="/wallet/topup" text="Top Up Status" isCollapsed={isCollapsed} icon={<FaShekelSign data-tooltip-id="tooltip" data-tooltip-content="Top Up Status" />} /> */}
              <SubMenuLink to="/wallet/history" text="List of BM/Ads Wallet" isCollapsed={isCollapsed} icon={<FaShekelSign data-tooltip-id="tooltip" data-tooltip-content="History of Wallet" />} />
            </MenuItem>
            <MenuItem
              title="Shared Management"
              icon={<FaShareAlt data-tooltip-id="tooltip" data-tooltip-content="Shared Management" />}
              menuKey="shared"
              activeMenu={activeMenu}
              handleMenuClick={handleMenuClick}
              isCollapsed={isCollapsed}
              activeSubMenu={activeSubMenu}
              handleSubMenuClick={handleSubMenuClick}
            >
              <SubMenuLink to="/shared/list" text="List of Shared BM/Ads" isCollapsed={isCollapsed} icon={<FaShareAlt data-tooltip-id="tooltip" data-tooltip-content="List of Shared BM/Ads" />} />
            </MenuItem>
            <MenuItem
              title="Master Setting"
              icon={<FaCogs data-tooltip-id="tooltip" data-tooltip-content="Master Setting" />}
              menuKey="master"
              activeMenu={activeMenu}
              handleMenuClick={handleMenuClick}
              isCollapsed={isCollapsed}
              activeSubMenu={activeSubMenu}
              handleSubMenuClick={handleSubMenuClick}
            >
              <SubMenuLink to="/master/network" text="Network/Token Setting" isCollapsed={isCollapsed} icon={<FaCogs data-tooltip-id="tooltip" data-tooltip-content="Network/Token Setting" />} />
              <SubMenuLink to="/master/deposit" text="Deposit Address" isCollapsed={isCollapsed} icon={<FaCogs data-tooltip-id="tooltip" data-tooltip-content="Deposit/Crypto" />} />
            </MenuItem>
            <li className="flex flex-col transition-transform duration-300 transform hover:scale-105">
              <Link to="/setting" className={`flex items-center p-2 rounded-md ${activeMenu === 'setting' ? 'bg-hcolor' : 'hover:bg-hcolor'} w-full text-left`} onClick={() => handleMenuClick('setting')}>
                <FaCog data-tooltip-id="tooltip" data-tooltip-content="Setting" />
                {!isCollapsed && <span className="ml-4">Setting</span>}
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
