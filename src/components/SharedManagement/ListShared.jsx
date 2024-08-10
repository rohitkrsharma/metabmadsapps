import { DuplicateIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';
import SearchBar from '../SearchBar';
import ListSharedFormView from './ListSharedFormView';

const ListShared = ({ breadcrumbs, onAdd, view, onToggleView }) => {
  const data = [
    { id: 1, OrderNo: 'OR-BM-ADS-20240706-0921', BMName: 'C00456', status: 'Shared Pass', },
    { id: 2, OrderNo: 'OR-BM-ADS-20240706-0924', BMName: 'C00456', status: 'Shared Fail', },
    { id: 3, OrderNo: 'OR-BM-ADS-20240706-0925', BMName: 'C00456', status: 'Shared Pass', },
    { id: 4, OrderNo: 'OR-BM-ADS-20240706-0926', BMName: 'C00456', status: 'Shared Fail', },
    { id: 5, OrderNo: 'OR-BM-ADS-20240706-0927', BMName: 'C00456', status: 'Shared Pass', },
    { id: 6, OrderNo: 'OR-BM-ADS-20240706-0922', BMName: 'C00456', status: 'Shared Fail', },
    { id: 7, OrderNo: 'OR-BM-ADS-20240706-0920', BMName: 'C00456', status: 'Shared Pass', },
    { id: 8, OrderNo: 'OR-BM-ADS-20240706-0928', BMName: 'C00456', status: 'Shared Fail', },
    { id: 9, OrderNo: 'OR-BM-ADS-20240706-0929', BMName: 'C00456', status: 'Shared Pass', },
    { id: 10, OrderNo: 'OR-BM-ADS-20240706-0930', BMName: 'C00456', status: 'Shared Fail', },
    { id: 11, OrderNo: 'OR-BM-ADS-20240706-0931', BMName: 'C00456', status: 'Shared Pass', },
  ];

  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const getStatusButtonColor = (status) => {
    switch (status) {
      case 'Shared Pass':
        return 'bg-green-500';
      case 'Shared Fail':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  const handleBack = () => {
    setSelectedRow(null);
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

  const handleEditClick = (row) => {
    if (row.status === 'Shared Fail') {
      setSelectedRow({ ...row, isEditing: true });
    }
  };

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = data.slice(startIndex, startIndex + pageSize);

  if (selectedRow) {
    if (selectedRow.isEditing) {
    }
    return <ListSharedFormView data={selectedRow} onBack={handleBack} />;
  }

  return (
    <>
      <div className='flex justify-between mb-4'>
        <div className="text-gray-700 flex gap-1">

        </div>
        <div>
          <SearchBar onAdd={onAdd} showAddAndView={true} view={view} onToggleView={onToggleView} />
        </div>
      </div>
      <div className="p-4 border border-customPurple rounded-md shadow-custom">
        <table className="min-w-full border-t border-l border-r text-xs border-b border-customPurple">
          <thead className="bg-customPurple text-white">
            <tr>
              <th className="px-4 py-1 border-r border-customPurple text-left">S.N</th>
              <th className="px-4 py-1 border-r border-customPurple text-left">Order No</th>
              <th className="px-4 py-1 border-r border-customPurple text-left">BM Name</th>
              <th className="px-4 py-1 border-r border-customPurple text-left">Status</th>
              <th className="px-4 py-1 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentPageData.map((item, index) => (
              <tr key={item.id} className={`border-b border-customPurple cursor-pointer ${index % 2 === 0 ? 'bg-gray-200' : ''}`} onClick={() => handleRowClick(item)}>
                <td className="px-4 py-1 border-r border-customPurple">{startIndex + index + 1}</td>
                <td className="px-4 py-1 border-r border-customPurple">{item.OrderNo}</td>
                <td className="px-4 py-1 border-r border-customPurple">{item.BMName}</td>
                <td className="px-4 py-1 border-r border-customPurple">
                  <button className={`px-2 py-1 text-white rounded ${getStatusButtonColor(item.status)}`}>
                    {item.status}
                  </button>
                </td>
                <td className="px-4 py-1 flex space-x-2">
                  <button className="bg-green-500 p-1 rounded text-white" onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}>
                    <PencilIcon data-tooltip-id="tooltip" data-tooltip-content="Edit" className="h-3 w-3" />
                  </button>
                  <button className="bg-yellow-500 p-1 rounded text-white">
                    <DuplicateIcon data-tooltip-id="tooltip" data-tooltip-content="Duplicate" className="h-3 w-3" />
                  </button>
                  <button className="bg-red-500 p-1 rounded text-white">
                    <TrashIcon data-tooltip-id="tooltip" data-tooltip-content="Delete" className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex text-xs justify-between items-center mt-2">
          <span>Showing {startIndex + 1} to {Math.min(startIndex + pageSize, data.length)} of {data.length} entries</span>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded" onClick={handlePreviousPage} disabled={currentPage === 1}>
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
            <button className="px-3 py-1 border border-gray-300 rounded" onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListShared;
