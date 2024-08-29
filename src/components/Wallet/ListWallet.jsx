import React, { useEffect, useState } from 'react';
import { DuplicateIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';
import SearchBar from '../SearchBar';
import ListWalletView from './ListWalletView';
import { API_BASE_URL, fetchToken } from '../utils/auth';

const ListWallet = ({ onAdd, onToggleView, view }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editRowId, setEditRowId] = useState(null);
  const [editRowData, setEditRowData] = useState({});
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await fetchToken();
        const response = await fetch(`${API_BASE_URL}/Invoices`, {
          method: 'GET',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        if (Array.isArray(result.data)) {
          const invoices = result.data.map(invoice => ({
            id: invoice.id,
            InvoiceNo: invoice.invoiceNumber,
            Charge: invoice.chargeAmount,
            Date: new Date(invoice.invoiceDate).toLocaleDateString(),
            Token: invoice.transactionId,
            status: invoice.status,
          }));
          setData(invoices);
          setFilteredData(invoices); // Initialize filteredData with fetched data
        } else {
          console.error('Expected result.data to be an array but got:', result.data);
          setData([]);
          setFilteredData([]); // Clear filteredData if no data is fetched
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (row) => {
    if (!editRowId) {
      setSelectedRow(row);
    }
  };

  const handleBack = () => {
    setSelectedRow(null);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (row, e) => {
    e.stopPropagation();
    setEditRowId(row.id);
    setEditRowData(row);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditRowData({
      ...editRowData,
      [name]: value,
    });
  };

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    try {
      const token = await fetchToken();
      const formData = new FormData();
      // Append all necessary fields to FormData
      for (const key in editRowData) {
        formData.append(key, editRowData[key]);
      }
      if (!formData.has('transactionId')) {
        formData.append('transactionId', editRowData.Token);
      }
      const response = await fetch(`${API_BASE_URL}/Invoices/${editRowId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update data');
      }

      // Update the data in the UI
      setData(data.map(item => item.id === editRowId ? editRowData : item));
      setEditRowId(null);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };


  const handleCancelClick = (e) => {
    e.stopPropagation();
    setEditRowId(null);
  };

  const handleSearchTermChange = (term) => {
    const lowercasedTerm = term.toLowerCase();
    if (term) {
      const filtered = data.filter((item) =>
        item.InvoiceNo.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Reset filteredData when search term is cleared
    }
    setCurrentPage(1); // Reset to the first page after filtering
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (selectedRow) {
    return <ListWalletView data={selectedRow} onBack={handleBack} />;
  }

  return (
    <>
      <div className='md:flex justify-between mb-4'>
        <div className="text-gray-700 flex gap-1">
          <div></div>
        </div>
        <div>
          <SearchBar
            onAdd={onAdd}
            view={view}
            onToggleView={onToggleView}
            onSearchTermChange={handleSearchTermChange}
          />
        </div>
      </div>
      <div className="p-4 border border-customPurple rounded-md shadow-custom">
        <table className="min-w-full border-t border-l border-r text-xs border-b border-customPurple">
          <thead className="bg-customPurple text-white">
            <tr>
              <th className="px-4 py-1 border-r border-customPurple text-left">S.N</th>
              <th className="px-4 py-1 border-r border-customPurple text-left">Invoice No</th>
              <th className="px-4 py-1 border-r border-customPurple text-left">Charge $</th>
              <th className="px-4 py-1 border-r border-customPurple text-left">Date</th>
              <th className="px-4 py-1 border-r border-customPurple text-left">Token</th>
              <th className="px-4 py-1 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentData.map((item, index) => (
              <tr
                key={item.id}
                className={`cursor-pointer border-b border-customPurple ${index % 2 === 0 ? 'bg-gray-200' : ''}`}
                onClick={() => handleRowClick(item)}
              >
                <td className="px-4 py-1 border-r border-customPurple">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="px-4 py-1 border-r border-customPurple">
                  {editRowId === item.id ? (
                    <input
                      type="text"
                      name="InvoiceNo"
                      value={editRowData.InvoiceNo}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  ) : (
                    item.InvoiceNo
                  )}
                </td>
                <td className="px-4 py-1 border-r border-customPurple">
                  {editRowId === item.id ? (
                    <input
                      type="text"
                      name="Charge"
                      value={editRowData.Charge}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  ) : (
                    item.Charge
                  )}
                </td>
                <td className="px-4 py-1 border-r border-customPurple">
                  {editRowId === item.id ? (
                    <input
                      type="text"
                      name="Date"
                      value={editRowData.Date}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  ) : (
                    item.Date
                  )}
                </td>
                <td className="px-4 py-1 border-r border-customPurple">
                  {editRowId === item.id ? (
                    <input
                      type="text"
                      name="Token"
                      value={editRowData.Token}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  ) : (
                    item.Token
                  )}
                </td>
                <td className="px-4 py-1 flex space-x-2">
                  {editRowId === item.id ? (
                    <>
                      <button className="bg-blue-500 p-1 rounded text-white" onClick={handleSaveClick}>
                        Save
                      </button>
                      <button className="bg-gray-500 p-1 rounded text-white" onClick={handleCancelClick}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="bg-green-500 p-1 rounded text-white" onClick={(e) => handleEditClick(item, e)}>
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
          <span>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} results</span>
          <div>
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-2 py-1 bg-gray-200 mr-1 rounded">
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => handlePageClick(i + 1)} className={`px-2 py-1 bg-gray-200 mr-1 rounded ${currentPage === i + 1 ? 'bg-customPurple text-white' : ''}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-2 py-1 bg-gray-200 rounded">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListWallet;
