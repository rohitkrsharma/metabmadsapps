import React, { useState, useEffect } from 'react';
import SearchBar from '../SearchBar';
import { API_BASE_URL } from '../utils/auth';
import { fetchToken } from '../utils/auth'; // Assuming fetchToken is a utility function that retrieves the token

const WalletHistory = ({ breadcrumbs, onAdd, onToggleView, view }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await fetchToken();

        const response = await fetch(`${API_BASE_URL}/BMAdsOrders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        // Check if result is an array; if not, convert it to an array
        if (Array.isArray(result)) {
          setData(result);
        } else if (result.data && Array.isArray(result.data)) {
          // Adjust this based on your API's structure
          setData(result.data);
        } else {
          console.error('Unexpected data format:', result);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='md:flex justify-between mb-4'>
        <div className="text-gray-700 flex gap-1">
          <div></div>
        </div>
        <div>
          <SearchBar onAdd={onAdd} view={view} onToggleView={onToggleView} />
        </div>
      </div>
      <div className="p-4 border border-customPurple rounded-md shadow-custom">
        <table className="min-w-full border-t border-l border-r text-xs border-b border-customPurple">
          <thead className="bg-customPurple text-white">
            <tr>
              <th className="px-4 py-2 border-r border-customPurple text-left">S.N</th>
              <th className="px-4 py-2 border-r border-customPurple text-left">Order No</th>
              <th className="px-4 py-2 border-r border-customPurple text-left">UserId</th>
              <th className="px-4 py-2 border-r border-customPurple text-left">Date</th>
              <th className="px-4 py-2 border-r border-customPurple text-left">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentData.map((item, index) => (
              <tr key={item.id} className={`border-b border-customPurple ${index % 2 === 0 ? 'bg-gray-200' : ''}`}>
                <td className="px-4 py-2 border-r border-customPurple">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="px-4 py-2 border-r border-customPurple">{item.orderNo}</td>
                <td className="px-4 py-2 border-r border-customPurple">{item.userTypeId}</td>
                <td className="px-4 py-2 border-r border-customPurple">{item.createdDate}</td>
                <td className="px-4 py-2 border-r border-customPurple">{item.topUpAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex text-xs justify-between items-center mt-2">
          <span>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} entries</span>
          <div className="flex items-center">
            <button
              className="px-3 py-1 border border-gray-300 rounded mr-2"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 border border-gray-300 rounded mx-1 ${currentPage === index + 1 ? 'bg-customPurple text-white' : ''}`}
                onClick={() => handlePageClick(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 border border-gray-300 rounded ml-2"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletHistory;
