import React, { useEffect, useState } from 'react';
import { DuplicateIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';
import SearchBar from '../SearchBar';
import { fetchToken, API_BASE_URL } from '../utils/auth';
import DepositeFormView from './DepositeFormView';

const DepositCrypto = ({ breadcrumbs, view, onToggleView, onAdd }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editAddress, setEditAddress] = useState('');
  const [cryptoNetworkId, setCryptoNetworkId] = useState(0);
  const [cryptoNetworkName, setCryptoNetworkName] = useState('');
  const [cryptoNetworkImage, setCryptoNetworkImage] = useState('');
  const [status, setStatus] = useState(true);
  const [updatedBy, setUpdatedBy] = useState('');
  const [updatedDate, setUpdatedDate] = useState(new Date().toISOString());
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState(null);

  const fetchData = async () => {
    try {
      const token = await fetchToken();
      const response = await fetch(`${API_BASE_URL}/CryptoAddresses`, {
        method: 'GET',
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (Array.isArray(result.data)) {
        setData(result.data);
        setFilteredData(result.data); // Set both data and filteredData
      } else {
        console.error('Expected result.data to be an array but got:', result.data);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    }
  };

  const handleRowClick = async (row) => {
    setSelectedRow(row);
    await fetchSelectedRowData(row.id);
  };

  const fetchSelectedRowData = async (id) => {
    try {
      const token = await fetchToken();
      const response = await fetch(`${API_BASE_URL}/CryptoAddresses/${id}`, {
        method: 'GET',
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.success) {
        setFormData(result.data);
        setEditAddress(result.data.address);
        setCryptoNetworkId(result.data.cryptoNetworkId);
        setCryptoNetworkName(result.data.cryptoNetworkName);
        setCryptoNetworkImage(result.data.cryptoNetworkImage);
        setStatus(result.data.status || true);
        setUpdatedBy(result.data.updatedBy);
        setUpdatedDate(result.data.updatedDate || new Date().toISOString());
      } else {
        console.error('API error:', result.message);
        setFormData(null);
      }
    } catch (error) {
      console.error('Error fetching selected row data:', error);
      setFormData(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBack = () => {
    setSelectedRow(null);
    setFormData(null);
  };

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
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

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setEditRowId(item.id);
    setEditAddress(item.address);
    setCryptoNetworkId(item.cryptoNetworkId);
    setCryptoNetworkName(item.cryptoNetworkName);
    setCryptoNetworkImage(item.cryptoNetworkImage);
    setStatus(item.status || true);
    setUpdatedBy(item.updatedBy);
    setUpdatedDate(item.updatedDate || new Date().toISOString());
  };

  const handleSaveClick = async () => {
    try {
      if (!editAddress.trim()) {
        alert('Address field cannot be empty.');
        return;
      }

      const networkId = parseInt(cryptoNetworkId, 10);
      if (isNaN(networkId)) {
        alert('Crypto Network ID must be a valid number.');
        return;
      }

      const formData = new FormData();
      formData.append('id', editRowId);
      formData.append('address', editAddress.trim());
      formData.append('cryptoNetworkId', networkId);
      formData.append('status', status);
      formData.append('updatedBy', updatedBy.trim() || '');
      formData.append('updatedDate', updatedDate || new Date().toISOString());

      const token = await fetchToken();
      const response = await fetch(`${API_BASE_URL}/CryptoAddresses/${editRowId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Update failed: ${errorData.title || 'Unknown error'}`);
      }

      const updatedData = data.map((item) =>
        item.id === editRowId
          ? {
            ...item,
            address: editAddress.trim(),
            cryptoNetworkId: networkId,
            status,
            updatedBy: updatedBy.trim() || '',
            updatedDate: updatedDate || new Date().toISOString(),
          }
          : item
      );
      setData(updatedData);
      setFilteredData(updatedData); // Also update filtered data

      setEditRowId(null);
      setEditAddress('');
      setCryptoNetworkId(0);
      setStatus(true);
      setUpdatedBy('');
      setUpdatedDate(new Date().toISOString());
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleCancelClick = () => {
    setEditRowId(null);
    setEditAddress('');
    setCryptoNetworkId(0);
    setStatus(true);
    setUpdatedBy('');
    setUpdatedDate(new Date().toISOString());
  };

  const handleSearchTermChange = (term) => {
    const lowercasedTerm = term.toLowerCase();
    if (term) {
      const filtered = data.filter((item) =>
        item.address.toLowerCase().includes(lowercasedTerm) ||
        item.cryptoNetworkName.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Reset filteredData when search term is cleared
    }
    setCurrentPage(1); // Reset to the first page after filtering
  };

  if (selectedRow) {
    return (
      <DepositeFormView
        data={formData}
        onBack={handleBack}
        setData={setData}
        dataList={data}
      />
    );
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <div className="text-gray-700 flex gap-1">

        </div>
        <div>
          <SearchBar
            onToggleView={onToggleView}
            currentView={view} onAdd={onAdd}
            onSearchTermChange={handleSearchTermChange}
          />
        </div>
      </div>
      <div className="p-4 border border-customPurple rounded-md shadow-custom">
        <table className="min-w-full cursor-pointer border-t border-l border-r text-xs border-b border-customPurple">
          <thead className="bg-customPurple text-white">
            <tr>
              <th className="px-4 py-1 border-r border-customPurple text-left">S.N</th>
              <th className="px-4 py-1 border-r border-customPurple text-left">Address</th>
              <th className="px-4 py-1 border-r border-customPurple text-left">Network</th>
              <th className="px-4 py-1 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentData.map((item, index) => (
              <tr
                key={item.id}
                onClick={() => handleRowClick(item)}
                className={`border-b border-customPurple ${index % 2 === 0 ? 'bg-gray-200' : ''
                  }`}
              >
                <td className="px-4 py-1 border-r border-customPurple">
                  {(currentPage - 1) * entriesPerPage + index + 1}
                </td>
                <td className="px-4 py-1 border-r border-customPurple">
                  {editRowId === item.id ? (
                    <input
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="border px-2 py-1 w-full"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    item.address
                  )}
                </td>
                <td className="px-4 py-1 border-r border-customPurple">

                  <div className='flex gap-2 items-center'>
                    <img
                      src={`http://3.110.160.106:8080/${item.cryptoNetworkImage}`}
                      alt="Network"
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://media.istockphoto.com/id/1367699775/photo/nft-non-fungible-token-golden-coins-falling-trendy-cryptocurrencies-and-coins-on-the.jpg?s=1024x1024&w=is&k=20&c=-hIyE7TTcGTOsBdCf_YDwvE7vVzg7i6KybLpCvd3OrM=';
                      }}
                    />
                    <span>{item.cryptoNetworkName}</span>
                  </div>
                </td>

                <td className="px-4 py-1 flex space-x-2">
                  {editRowId === item.id ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveClick();
                        }}
                        className="bg-green-500 p-1 rounded text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelClick();
                        }}
                        className="bg-red-500 p-1 rounded text-white"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => handleEditClick(item, e)}
                      className="bg-green-500 p-1 rounded text-white"
                    >
                      <PencilIcon className="h-3 w-3" />
                    </button>
                  )}
                  <button className="bg-yellow-500 p-1 rounded text-white">
                    <DuplicateIcon className="h-3 w-3" />
                  </button>
                  <button className="bg-red-500 p-1 rounded text-white">
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex text-xs justify-between items-center mt-2">
          <span>
            Showing {(currentPage - 1) * entriesPerPage + 1} to{' '}
            {Math.min(currentPage * entriesPerPage, data.length)} of {data.length}{' '}
            entries
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-3 py-1 border border-gray-300 rounded ${currentPage === 1 ? 'cursor-not-allowed' : ''
                }`}
            >
              Previous
            </button>
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                onClick={() => handlePageChange(page + 1)}
                className={`px-3 py-1 border border-gray-300 rounded ${currentPage === page + 1 ? 'bg-customPurple text-white' : ''
                  }`}
              >
                {page + 1}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border border-gray-300 rounded ${currentPage === totalPages ? 'cursor-not-allowed' : ''
                }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DepositCrypto;
