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
      console.log('Fetched data:', data);

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

  const onToggleView = (view) => {
    setView(view);
  };

  const onAddCustomer = () => {
    setShowAddCustomer(true);
  };

  const onBack = () => {
    setShowAddCustomer(false);
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
              <div className="text-xs bg-purple-500 hover:bg-purple-600 px-2 py-1 rounded-md text-white font-medium">Reseller</div>
            )}
            {userTypeId === 2 && (
              <div className="text-xs bg-pink-500 hover:bg-pink-600 px-2 py-1 rounded-md text-white font-medium">Customer</div>
            )}
            <div
              className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 rounded-md text-white font-medium cursor-pointer"
              onClick={() => navigate(`/customer-view/${id}`)} // Use ID here
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

  return (
    <>
      {!showAddCustomer && (
        <div className='flex justify-between mb-3'>
          <div></div>
          <div><SearchBar onToggleView={onToggleView} currentView={view} onAdd={onAddCustomer} /></div>
        </div>
      )}
      {showAddCustomer ? (
        <AddCustomer onBack={onBack} />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {users.length > 0 ? (
            users.map((user) => (
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
        <UserListView users={users} />
      )}
    </>
  );
};

export default UserGrid;
