import React, { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AddBM from './components/BM/AddBm';
import AdsApproval from './components/BM/AdsApproval';
import CustomerView from './components/CRM/Customer_view';
import UserListView from './components/CRM/ListView';
import UserGrid from './components/CRM/USerGrid';
import Dashboard from './components/Dashboard';
import LandingPage from './components/Login/LandingPage';
import AdminLogin from './components/Login/Reseller';
import DepositCrypto from './components/MasterSetting/DepositCrypto';
import DepositeAdd from './components/MasterSetting/DepositeAdd';
import NetworkAdd from './components/MasterSetting/NetworkAdd';
import NetworkTokenSetting from './components/MasterSetting/NetworkTokenSetting';
import Navbar from './components/Navbar';
import Setting from './components/Setting.jsx/Setting';
import ListShared from './components/SharedManagement/ListShared';
import Sidebar from './components/SideBar';
import AddForm from './components/Wallet/AddWallet';
import ListWallet from './components/Wallet/ListWallet';
import WalletHistory from './components/Wallet/WalletHistory';

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddBM, setShowAddBM] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);
  const [showDeposite, setShowDeposite] = useState(false);
  const [view, setView] = useState('grid');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  // const breadcrumbs = ['Master Setting', 'DepositCrypto'];
  // const listBreadcrumbs = ['Wallet', 'ListWallet'];
  // const adsapproval = ['BM/ADS Management', 'AdsApproval'];

  const onToggleView = (newView) => {
    setView(newView);
  };

  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/" element={<Navigate to="/landing" />} />
        <Route path="/*" element={
          isAuthenticated ? (
            <div className="flex h-screen overflow-hidden bg-gray-100 font-Palatino">
              <Sidebar isCollapsed={isCollapsed} toggleCollapsed={toggleCollapsed} />
              <div className="flex flex-col flex-grow">
                <Navbar isCollapsed={isCollapsed} toggleCollapsed={toggleCollapsed} />
                <div className="flex-grow overflow-y-auto p-4">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/crm/customer" element={
                      view === 'grid' ? (
                        <UserGrid onToggleView={onToggleView} />
                      ) : (
                        <UserListView onToggleView={onToggleView} />
                      )
                    } />
                    <Route path="/bm/approval" element={
                      showAddBM ? (
                        <AddBM onBack={() => setShowAddBM(false)} showBackButton={true} />
                      ) : (
                        <AdsApproval view={view} onToggleView={onToggleView} onAdd={() => setShowAddBM(true)} />
                      )
                    } />
                    <Route path="/bm/add" element={<AddBM />} />
                    <Route path="/wallet/list" element={
                      showAddForm ? (
                        <AddForm onBack={() => setShowAddForm(false)} />
                      ) : (
                        <ListWallet view={view} onToggleView={onToggleView} onAdd={() => setShowAddForm(true)} />
                      )
                    } />
                    {/* <Route path="/wallet/topup" element={<TopUpStatus view={view} onToggleView={onToggleView} breadcrumbs={topupBreadcrumbs} />} /> */}
                    <Route path="/wallet/history" element={<WalletHistory view={view} onToggleView={onToggleView} />} />
                    <Route path="/shared/list" element={<ListShared />} />
                    <Route path="/master/network" element={showNetwork ? (<NetworkAdd onBack={() => setShowNetwork(false)} />) : (<NetworkTokenSetting onAdd={() => setShowNetwork(true)} view={view} onToggleView={onToggleView} />)} />
                    <Route path="/master/deposit" element={showDeposite ? (<DepositeAdd onBack={() => { setShowDeposite(false) }} />) : (<DepositCrypto onAdd={() => setShowDeposite(true)} view={view} onToggleView={onToggleView} />)} />
                    <Route path="/setting" element={<Setting />} />
                    <Route path="/customer-view/:userId" element={<CustomerView />} />
                  </Routes>
                </div>
              </div>
            </div>
          ) : (
            <Navigate to="/landing" />
          )
        } />
      </Routes>
    </Router>
  );
};

export default App;
