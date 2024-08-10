import { DuplicateIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';
import React, { useState, useEffect } from 'react';
import SearchBar from '../SearchBar';
import AdsApprovalFormView from './AdsApprovalFormView';
import { fetchToken } from '../utils/auth';

const AdsApproval = ({ breadcrumbs, onAdd, view, onToggleView }) => {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({});
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await fetchToken();
        const response = await fetch('http://3.110.160.106:8080/api/BMAdsOrders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusButtonColor = (status) => {
    switch (status) {
      case 'Done':
        return 'bg-green-600';
      case 'Pending':
        return 'bg-purple-500';
      case 'Processing':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  const handleBack = () => {
    setSelectedRow(null);
    setEditingRow(null); // Clear edit state on back
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(data.length / pageSize)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = data.slice(startIndex, startIndex + pageSize);

  const handleEdit = (row) => {
    setEditingRow(row.id);
    setFormData(row);
  };

  const handleSave = async () => {
    try {
      const token = await fetchToken();
      const response = await fetch(`http://3.110.160.106:8080/api/BMAdsOrders/${editingRow}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Data updated successfully:', result);
      // Refresh data after successful update
      const updatedData = data.map(item => item.id === editingRow ? result : item);
      setData(updatedData);
      setEditingRow(null); // Exit edit mode
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleDelete = async (id) => {
    try {
      const token = await fetchToken();
      const response = await fetch(`http://3.110.160.106:8080/api/BMAdsOrders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Data deleted successfully:', result);
      // Remove the deleted item from the list
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (selectedRow) {
    return <AdsApprovalFormView data={selectedRow} onBack={handleBack} />;
  }

  return (
    <>
      <div className='md:flex justify-between mb-4'>
        <div>
          {/* Breadcrumbs if needed */}
        </div>
        <div>
          <SearchBar onAdd={onAdd} showAddAndView={true} view={view} onToggleView={onToggleView} />
        </div>
      </div>
      <div className='overflow-x-auto'>
        <div className="p-4 border border-customPurple rounded-md shadow-custom overflow-x-auto">
            <div>
              <table className="min-w-full border-t border-l border-r text-xs border-b border-customPurple">
                <thead className="bg-customPurple text-white">
                  <tr>
                    <th className="px-4 py-1 border-r border-customPurple text-left">S.N</th>
                    <th className="px-4 py-1 border-r border-customPurple text-left">Order No</th>
                    <th className="px-4 py-1 border-r border-customPurple text-left">BM ID</th>
                    <th className="px-4 py-1 border-r border-customPurple text-left">Order Date</th>
                    <th className="px-4 py-1 border-r border-customPurple text-left">Status</th>
                    <th className="px-4 py-1 border-r border-customPurple text-left">BM Name</th>
                    <th className="px-4 py-1 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {currentPageData.map((item, index) => (
                    <tr key={item.id} className={`border-b border-customPurple cursor-pointer ${index % 2 === 0 ? 'bg-gray-200' : ''}`} onClick={() => handleRowClick(item)}>
                      <td className="px-4 py-1 border-r border-customPurple">{startIndex + index + 1}</td>
                      <td className="px-4 py-1 border-r border-customPurple">{item.orderNo}</td>
                      <td className="px-4 py-1 border-r border-customPurple">{item.bmId}</td>
                      <td className="px-4 py-1 border-r border-customPurple">{item.createdDate}</td>
                      <td className="px-4 py-1 border-r border-customPurple">
                        <button className={`px-2 py-1 text-white rounded ${getStatusButtonColor(item.status)}`}>
                          {item.status}
                        </button>
                      </td>
                      <td className="px-4 py-1 border-r border-customPurple">{item.name}</td>
                      <td className="px-4 py-1 flex space-x-2">
                        <button className="bg-green-500 p-1 rounded text-white" onClick={(e) => { e.stopPropagation(); handleEdit(item); }}>
                          <PencilIcon data-tooltip-id="tooltip" data-tooltip-content="Edit" className="h-3 w-3" />
                        </button>
                        <button className="bg-yellow-500 p-1 rounded text-white" onClick={(e) => { e.stopPropagation(); }}>
                          <DuplicateIcon data-tooltip-id="tooltip" data-tooltip-content="Duplicate" className="h-3 w-3" />
                        </button>
                        <button className="bg-red-500 p-1 rounded text-white" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
                          <TrashIcon data-tooltip-id="tooltip" data-tooltip-content="Delete" className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex text-xs justify-between mt-4">
                <div>
                  Page {currentPage} of {totalPages}
                </div>
                <div className='flex space-x-1'>
                  <button
                    onClick={handlePreviousPage}
                    className='px-2 py-1 bg-gray-300 rounded disabled:bg-gray-200 disabled:cursor-not-allowed'
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
                    onClick={handleNextPage}
                    className='px-2 py-1 bg-gray-300 rounded disabled:bg-gray-200 disabled:cursor-not-allowed'
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default AdsApproval;
