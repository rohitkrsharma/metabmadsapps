import { DuplicateIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';

const OrderHistoryTable = ({ data, columns }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(data.length / recordsPerPage);

  const handleClickNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handleClickPrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

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

  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentPageData = data.slice(startIndex, startIndex + recordsPerPage);

  return (
    <>
      <table className='min-w-full border text-xs'>
        <thead className='bg-customPurple text-white'>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className='px-4 py-1 border border-customPurple text-left'>
                {column}
              </th>
            ))}
            <th className='px-4 py-1 text-left'>Action</th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          {currentPageData.map((row, index) => (
            <tr
              key={row.id}
              className={`border border-customPurple cursor-pointer ${index % 2 === 0 ? 'bg-gray-200' : ''}`}
            >
              <td className='px-4 py-1 border border-customPurple'>{startIndex + index + 1}</td>
              <td className='px-4 py-1 border border-customPurple'>{row.OrderNo}</td>
              <td className='px-4 py-1 border border-customPurple'>{row.BMID}</td>
              <td className='px-4 py-1 border border-customPurple'>{row.Date}</td>
              <td className='px-4 py-1 border border-customPurple'>
                <button className={`px-2 py-1 text-white rounded ${getStatusButtonColor(row.status)}`}>
                  {row.status}
                </button>
              </td>
              <td className='px-4 py-1 flex space-x-2 border '>
                <button className='bg-green-500 p-1 rounded text-white'>
                  <PencilIcon className='h-3 w-3' />
                </button>
                <button className='bg-yellow-500 p-1 rounded text-white'>
                  <DuplicateIcon className='h-3 w-3' />
                </button>
                <button className='bg-red-500 p-1 rounded text-white'>
                  <TrashIcon className='h-3 w-3' />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex text-xs justify-between items-center mt-2'>
        <span>Showing {startIndex + 1} to {Math.min(startIndex + recordsPerPage, data.length)} of {data.length} entries</span>
        <div className='flex items-center space-x-2'>
          <button
            className='px-3 py-1 border border-gray-300 rounded'
            onClick={handleClickPrev}
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
            className='px-3 py-1 border border-gray-300 rounded'
            onClick={handleClickNext}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderHistoryTable;
