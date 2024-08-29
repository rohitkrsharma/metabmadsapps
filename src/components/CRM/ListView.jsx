import React, { useState } from 'react';

const UserListView = ({ users }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  // Get the current page data
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = users.slice(startIndex, startIndex + pageSize);

  // Function to handle next page
  const handleNextPage = () => {
    if (startIndex + pageSize < users.length) {
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
  const totalPages = Math.ceil(users.length / pageSize);

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
                  checked={selectedUsers.length === users.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4"
                />
              </th>
              <th className="px-4 py-2 border border-customPurple text-left">Account Name</th>
              <th className="px-4 py-2 border border-customPurple text-left">Contact</th>
              <th className="px-4 py-2 border border-customPurple text-left">Member Since</th>
              <th className="px-4 py-2 border border-customPurple text-left">User Type</th>
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
                <td className="px-1 py-1 border border-customPurple">{user.acName}</td>
                <td className="px-1 py-1 border border-customPurple">{user.contact}</td>
                <td className="px-1 py-1 border border-customPurple">{new Date(user.memberSince).toLocaleDateString()}</td>
                <td className="px-2 py-1  text-left border border-customPurple">
                  {user.userTypeId === 1 ? (
                    <span className="bg-purple-500 text-white px-2 py-1 rounded-md">Reseller</span>
                  ) : (
                    <span className="bg-pink-500 text-white px-2 py-1 rounded-md">Customer</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex text-xs justify-between items-center mt-2">
          <span>
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, users.length)} of {users.length} entries
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
                className={`px-3 py-1 border border-gray-300 rounded ${currentPage === i + 1 ? 'bg-customPurple text-white' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 border border-gray-300 rounded"
              onClick={handleNextPage}
              disabled={startIndex + pageSize >= users.length}
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
