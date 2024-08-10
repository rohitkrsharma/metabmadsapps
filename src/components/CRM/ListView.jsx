import React, { useState, useEffect } from 'react';
import { API_BASE_URL, fetchToken } from '../utils/auth';

const UserListView = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Function to fetch user data
  const fetchUsersData = async () => {
    try {
      const token = await fetchToken();
      const response = await fetch(`${API_BASE_URL}/UserManagement`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { data } = await response.json(); // Assuming `data` is the key holding the array of user objects.
      setUsersData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUsersData([]);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  // Function to toggle selection of a user
  const toggleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Function to handle select all users
  const handleSelectAll = () => {
    if (selectedUsers.length === usersData.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(usersData.map((user) => user.id));
    }
  };

  // Get the current page data
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = usersData.slice(startIndex, startIndex + pageSize);

  // Function to handle next page
  const handleNextPage = () => {
    if (startIndex + pageSize < usersData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(usersData.length / pageSize);

  return (
    <>
      <div className="flex justify-between mb-3">
        <h1 className="text-xl font-bold">User List</h1>
      </div>
      <div className="overflow-x-auto border border-customPurple rounded-md shadow-custom p-4">
        <table className="min-w-full bg-white text-xs">
          <thead className="bg-customPurple text-white">
            <tr>
              <th className="px-2 py-1 border border-customPurple text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === usersData.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4"
                />
              </th>
              <th className="px-4 py-2 border border-customPurple text-left">UserId</th>
              <th className="px-4 py-2 border border-customPurple text-left">Account Name</th>
              <th className="px-4 py-2 border border-customPurple text-left">Member Since</th>
              <th className="px-4 py-2 border border-customPurple text-left">User Type</th>
              <th className="px-4 py-2 border border-customPurple text-left">Contact</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((user, index) => (
              <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-200' : ''}>
                <td className="px-2 py-1 border border-customPurple">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleSelectUser(user.id)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="px-1 py-1 border border-customPurple">{user.userId}</td>
                <td className="px-1 py-1 border border-customPurple">{user.accountName}</td>
                <td className="px-1 py-1 border border-customPurple">{new Date(user.createdDate).toLocaleDateString()}</td>
                <td className="px-1 py-1 border border-customPurple">{user.userTypeId}</td>
                <td className="px-1 py-1 border border-customPurple">{user.contactNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex text-xs justify-between items-center mt-2">
          <span>
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, usersData.length)} of {usersData.length} entries
          </span>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded mr-2"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 border border-gray-300 rounded ${currentPage === i + 1 ? 'bg-customPurple text-white' : ''
                  }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 border border-gray-300 rounded ml-2"
              onClick={handleNextPage}
              disabled={startIndex + pageSize >= usersData.length}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserListView;
