import { DuplicateIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';
import React, { useEffect, useState } from 'react';
import SearchBar from '../SearchBar';
import { getCryptoNetworkById, getCryptoNetworks, updateCryptoNetwork } from '../utils/auth';
import NetworkAdd from './NetworkAdd';
import NetworkDetailView from './NetworkTokenFormView';

const TableComponent = ({ view, onToggleView }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data state
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNetworkData, setSelectedNetworkData] = useState(null);
  const entriesPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getCryptoNetworks();
      if (Array.isArray(result.data)) {
        setData(result.data);
        setFilteredData(result.data);
      } else {
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    }
  };

  const fetchNetworkData = async (id) => {
    try {
      const result = await getCryptoNetworkById(id);
      setSelectedNetworkData(result.data);
    } catch (error) {
      console.error('Error fetching network data:', error);
      setSelectedNetworkData(null);
    }
  };

  const handleRowClick = (row) => {
    if (editingRowId !== row.id) {
      fetchNetworkData(row.id); // Fetch individual network data
      setSelectedRow(row);
    }
  };

  const handleBack = () => {
    setSelectedRow(null);
    setIsAdding(false);
    setEditingRowId(null);
    setSelectedNetworkData(null); // Reset selected network data on back
  };

  const totalPages = Math.ceil(data.length / entriesPerPage);
  const currentData = filteredData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSave = (newData) => {
    setData((prevData) => [...prevData, newData]);
    setIsAdding(false);
  };

  const handleEditClick = (row) => {
    setEditingRowId(row.id);
    setEditFormData({
      ...row,
      status: row.status.toString(), // Convert status to string for the select input
      cryptoNetworkImage: row.cryptoNetworkImage // Initialize the image field to avoid undefined issues
    });
    setEditImageFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setEditImageFile(e.target.files[0]);
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('Id', editFormData.id);
      formData.append('cryptoNetworkName', editFormData.cryptoNetworkName);
      formData.append('cryptoNetworkDescription', editFormData.cryptoNetworkDescription);
      formData.append('status', editFormData.status === 'true');
      if (editImageFile) {
        formData.append('imageFile', editImageFile);
      } else {
        formData.append('cryptoNetworkImage', editFormData.cryptoNetworkImage);
      }
      formData.append('UpdatedBy', 'rohit');

      // Update the backend
      const result = await updateCryptoNetwork(editingRowId, formData);
      if (result && result.data) {
        // Update local state immediately
        setData((prevData) =>
          prevData.map((item) =>
            item.id === editingRowId
              ? { ...item, ...editFormData, status: editFormData.status === 'true' }
              : item
          )
        );
        setEditingRowId(null);
        setEditImageFile(null); // Reset image file state after successful edit
      }
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedRow && editingRowId === null && selectedNetworkData) {
    return <NetworkDetailView data={selectedNetworkData} onBack={handleBack} onSave={(updatedData) => {
      setData((prevData) => prevData.map(item => item.id === updatedData.id ? updatedData : item));
      setSelectedNetworkData(updatedData);
    }} />;
  }

  const handleSearchTermChange = (term) => {
    const lowercasedTerm = term.toLowerCase();
    if (term) {
      const filtered = data.filter((item) =>
        item.cryptoNetworkName.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Reset filteredData when search term is cleared
    }
    setCurrentPage(1); // Reset to the first page after filtering
  };

  if (isAdding) {
    return <NetworkAdd onBack={handleBack} onSave={handleSave} />;
  }

  return (
    <>
      <div className='flex justify-between mb-4'>
        <div className="breadcrumb text-gray-700">
        </div>
        <div>
          <SearchBar
            onToggleView={onToggleView}
            currentView={view} onAdd={() => setIsAdding(true)}
            onSearchTermChange={handleSearchTermChange}
          />
        </div>
      </div>
      <div className="p-4 border border-customPurple rounded-md shadow-custom">
        {isLoading && <div className="loader">Loading...</div>}
        <table className="min-w-full cursor-pointer border-t border-l border-r text-xs border-b border-customPurple">
          <thead className="bg-customPurple text-white">
            <tr>
              <th className="px-4 py-1 border-r border-customPurple text-left">S.N</th>
              <th className="px-4 py-1 border-r border-customPurple text-left">Network Name</th>
              <th className="px-4 py-1 border-r border-customPurple text-left">Image</th>
              <th className="px-4 py-1 border-r border-customPurple text-left">Status</th>
              <th className="px-4 py-1 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentData.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-customPurple ${index % 2 === 0 ? 'bg-gray-200' : ''}`}
                onClick={() => handleRowClick(item)}
                style={{ cursor: editingRowId !== item.id ? 'pointer' : 'default' }}
              >
                <td className="px-4 py-1 border-r border-customPurple">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                <td className="px-4 py-1 border-r border-customPurple">
                  {editingRowId === item.id ? (
                    <input
                      type="text"
                      name="cryptoNetworkName"
                      value={editFormData.cryptoNetworkName}
                      onChange={handleInputChange}
                      className="form-control w-full p-2 border border-gray-300 rounded"
                    />
                  ) : (
                    item.cryptoNetworkName
                  )}
                </td>
                <td className="px-4 py-1 border-r border-customPurple">
                  {editingRowId === item.id ? (
                    <>
                      <input
                        type="file"
                        name="imageFile"
                        onChange={handleFileChange}
                        className="form-control w-full p-2 border border-gray-300 rounded"
                      />
                      {editFormData.cryptoNetworkImage && !editImageFile && (
                        <img src={`http://3.110.160.106:8080/${editFormData.cryptoNetworkImage}`} alt={editFormData.cryptoNetworkName} className="h-6 mt-2" />
                      )}
                    </>
                  ) : (
                    <img src={`http://3.110.160.106:8080/${item.cryptoNetworkImage}`} alt={item.cryptoNetworkName} className="h-6" />
                  )}
                </td>
                <td className="px-4 py-1 border-r border-customPurple">
                  {editingRowId === item.id ? (
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleInputChange}
                      className="form-control w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  ) : (
                    item.status ? 'Active' : 'Inactive'
                  )}
                </td>
                <td className="px-4 py-1 flex space-x-2">
                  {editingRowId === item.id ? (
                    <>
                      <button className="bg-green-500 p-1 rounded text-white" onClick={handleSaveEdit}>
                        Save
                      </button>
                      <button className="bg-gray-500 p-1 rounded text-white" onClick={() => setEditingRowId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="bg-green-500 p-1 rounded text-white" onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}>
                        <PencilIcon className="h-3 w-3" />
                      </button>
                      <button className="bg-yellow-500 p-1 rounded text-white">
                        <DuplicateIcon className="h-3 w-3" />
                      </button>
                      <button className="bg-red-500 p-1 rounded text-white">
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex text-xs justify-between items-center mt-2">
          <span>Showing {((currentPage - 1) * entriesPerPage) + 1} to {Math.min(currentPage * entriesPerPage, data.length)} of {data.length} entries</span>
          <div className="flex items-center space-x-1">
            <button onClick={handlePrevious} disabled={currentPage === 1} className={`px-3 py-1 border border-gray-300 rounded ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}>Previous</button>
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                onClick={() => handlePageChange(page + 1)}
                className={`px-3 py-1 border border-gray-300 rounded ${currentPage === page + 1 ? 'bg-customPurple text-white' : ''}`}
              >
                {page + 1}
              </button>
            ))}
            <button onClick={handleNext} disabled={currentPage === totalPages} className={`px-3 py-1 border border-gray-300 rounded ${currentPage === totalPages ? 'cursor-not-allowed' : ''}`}>Next</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableComponent;
