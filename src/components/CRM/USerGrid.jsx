import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import SearchBar from '../SearchBar';
import AddCustomer from './AddCustomer';
import { API_BASE_URL, fetchToken } from '../utils/auth';
import UserListView from './ListView';

const UserGrid = () => {
  const [view, setView] = useState('grid');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = await fetchToken();
      const response = await fetch(`${API_BASE_URL}/UserManagement`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();

      if (Array.isArray(data.data)) {
        const mappedUsers = data.data.map(user => ({
          acName: user.accountName,
          memberSince: user.createdDate.split('T')[0],
          id: user.id,
          contact: user.contactNumber,
          userTypeId: user.userTypeId,
          profilePicture: user.profilePicture,
        }));
        setUsers(mappedUsers);
        setFilteredUsers(mappedUsers); // Initialize filtered users
      } else {
        throw new Error('Unexpected data format');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchTermChange = (term) => {
    const lowercasedTerm = term.toLowerCase();
    const filtered = users.filter(user =>
      user.acName.toLowerCase().includes(lowercasedTerm) ||
      user.contact.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredUsers(filtered); // Update filtered users
  };

  const onToggleView = (view) => {
    setView(view);
  };

  const onAddCustomer = () => {
    setShowAddCustomer(true);
  };

  const onBack = () => {
    setShowAddCustomer(false);
  };

  const onCustomerAdded = () => {
    setShowAddCustomer(false);
    fetchUsers(); // Refresh the grid after adding a new customer
  };

  const ProfileCard = ({ acName, memberSince, id, contact, userTypeId, profilePicture }) => {
    const cardClasses = classNames(
      'bg-white border rounded-lg overflow-hidden shadow-custom',
      {
        'border-pink-500 shadow-pink-500': userTypeId === 2,
        'border-purple-500 shadow-purple-500': userTypeId === 1,
      }
    );

    return (
      <div className={cardClasses}>
        <div className="p-4">
          <div className='flex gap-5'>
            <img
              alt="Profile"
              src={profilePicture ? `http://3.110.160.106:8080/${profilePicture}` : "https://metaadsapp.s3.ap-south-1.amazonaws.com/profile_user.png"}
              className="w-16 h-16 rounded-full"
            />
            <div className='flex flex-col space-y-1 uppercase'>
              <div className='flex gap-1'>
                <div className='text-xs text-gray-400 font-medium'>A/C Name :</div>
                <div className='text-xs text-gray-600 font-medium'>{acName}</div>
              </div>
              <div className='flex gap-1'>
                <div className='text-xs text-gray-400 font-medium'>Member Since :</div>
                <div className='text-xs text-gray-600 font-medium'>{memberSince}</div>
              </div>
              <div className='flex gap-1'>
                <div className='text-xs text-gray-400 font-medium'>User ID :</div>
                <div className='text-xs text-gray-600 font-medium'>{id}</div>
              </div>
              <div className='flex gap-1'>
                <div className='text-xs text-gray-400 font-medium'>Contact :</div>
                <div className='text-xs text-gray-600 font-medium'>{contact}</div>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center gap-2 mt-5">
            {userTypeId === 1 && (
              <div className="text-xs  px-2 py-1 border border-purple-700 rounded-md text-purple-700 font-medium">Reseller</div>
            )}
            {userTypeId === 2 && (
              <div className="text-xs border border-pink-600 px-2 py-1 rounded-md text-pink-600 font-medium">Customer</div>
            )}
            <div
              className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 rounded-md text-white font-medium cursor-pointer"
              onClick={() => navigate(`/customer-view/${id}`)}
            >
              View Details
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleFilterChange = (filters) => {
    if (filters.length === 0) {
      // If no filter is selected, show all users
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => {
        // Check if 'Reseller' is selected and userTypeId is 1
        if (filters.includes('Reseller') && user.userTypeId === 1) {
          return true;
        }
        // Check if 'Customer' is selected and userTypeId is 2
        if (filters.includes('Customer') && user.userTypeId === 2) {
          return true;
        }
        return false;
      });
      setFilteredUsers(filtered);
    }
  };

  return (
    <>
      {!showAddCustomer && (
        <div className='flex justify-between mb-3'>
          <div></div>
          <div>
            <SearchBar
              onSearchTermChange={handleSearchTermChange}
              onAdd={onAddCustomer}
              onToggleView={onToggleView}
              currentView={view}
              showAddAndView={true}
              searchPlaceholder="Search by name or contact number"
              filterOptions={['Customer', 'Reseller']}
              groupByOptions={['Groupbyname', 'Groupbyname1', 'Groupbyname2']}
              favoritesOptions={['Favorite', 'Favorite1']}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      )}
      {showAddCustomer ? (
        <AddCustomer onBack={onBack} onCustomerAdded={onCustomerAdded} />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <ProfileCard
                key={user.id}
                acName={user.acName}
                memberSince={user.memberSince}
                id={user.id}
                contact={user.contact}
                userTypeId={user.userTypeId}
                profilePicture={user.profilePicture}
              />
            ))
          ) : (
            <div>No users found</div>
          )}
        </div>
      ) : (
        <UserListView users={filteredUsers} />  // Pass filtered users to list view
      )}
    </>
  );
};

export default UserGrid;
