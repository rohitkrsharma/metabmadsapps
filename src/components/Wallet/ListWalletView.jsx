import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL, fetchToken } from '../utils/auth';

const ListWalletView = ({ data, onBack }) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [status, setStatus] = useState('Pending');  // Default to "Pending"
  const [remarks, setRemarks] = useState('');
  const [showRemarks, setShowRemarks] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await fetchToken();
        const response = await axios.get(`${API_BASE_URL}/Invoices/${data.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoiceData(response.data.data);
      } catch (error) {
        console.error('Error fetching detailed data:', error);
      }
    };

    fetchData();
  }, [data.id]);

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);

    if (selectedStatus === 'Pending') {
      setShowRemarks(false);
      setRemarks('');
    } else {
      setShowRemarks(true);
    }
    setErrorMessage('');  // Clear error message on status change
  };

  const handleSubmit = async () => {
    if (status !== 'Pending' && !remarks) {
      setErrorMessage('Remarks are required for this status.');
      return;

    }

    try {
      const token = await fetchToken();
      const statusMapping = {
        Pending: 0,
        Approved: 1,
        'Re-open': 2,
        Rejected: 3
      };

      // Prepare form data
      const formData = new FormData();
      formData.append('InvoiceId', invoiceData.id);
      formData.append('Remarks', remarks); // Ensure remarks is sent, even if empty for Pending
      formData.append('Status', statusMapping[status]);
      formData.append('StatusText', status);
      formData.append('CreatedBy', 'currentUser'); // Replace 'currentUser' with actual user data
      formData.append('CreatedDate', new Date().toISOString());

      const response = await axios.post(
        `${API_BASE_URL}/Invoices/ApproveInvoice`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Set the correct content type
          },
        }
      );

      console.log('API Response:', response.data);
      setStatus('Pending');
      setRemarks('');
      setShowRemarks(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Error submitting data:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        const errorData = error.response.data.errors;
        if (errorData.Remarks) {
          setErrorMessage(errorData.Remarks[0]);
        } else if (errorData.CreatedBy) {
          setErrorMessage(errorData.CreatedBy[0]);
        } else {
          setErrorMessage('Failed to submit the data. Please try again.');
        }
      } else {
        setErrorMessage('Failed to submit the data. Please try again.');
      }
    }
  };

  return (
    <div>
      <div className="text-gray-700 mb-4 flex items-center justify-between gap-1">
        <button onClick={onBack} className='flex gap-1 items-center bg-customPurple rounded-md px-4 py-2 text-white hover:bg-hcolor'>
          <FaArrowLeft />Back
        </button>
        <div className='flex gap-5 items-center justify-center'>
          <div className="flex items-center">
            <label className='w-14'>Status:</label>
            <select
              className="border border-gray-300 rounded-md p-2"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="Pending">Select</option>
              <option value="Approved">Approved</option>
              <option value="Re-open">Re-open</option>
              <option value="Rejected">Reject</option>
            </select>
          </div>

          {showRemarks && (
            <div className="flex items-center">
              <label className='w-32'>Remarks:</label>
              <textarea
                rows={1}
                className="border border-gray-300 rounded-md p-2 w-full"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter your remarks"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              className="bg-customPurple text-white px-4 py-2 rounded-md hover:bg-hcolor"
              onClick={handleSubmit}
              disabled={status === 'Pending'}
            >
              Submit
            </button>
          </div>
          {errorMessage && (
            <div className="mt-4 text-red-500 font-semibold">
              {errorMessage}
            </div>
          )}
        </div>
      </div>

      {invoiceData ? (
        <div className="form-row mt-3">
          <div className="p-5 border border-customPurple rounded-md shadow-custom">
            <div className='flex flex-wrap justify-between'>
              <div className="space-y-8">
                <div className="flex items-center gap-5 font-bold">
                  <label>Invoice No - </label>
                  <div>
                    <label>{invoiceData.invoiceNumber}</label>
                  </div>
                </div>
                <div className="flex items-center">
                  <label className='w-32'>Charge :-</label>
                  <div>
                    <label>${invoiceData.chargeAmount}</label>
                  </div>
                </div>
                <div className="flex items-center">
                  <label className='w-32'>Network :-</label>
                  <div>
                    <label>{invoiceData.cryptoNetworkId}</label>
                  </div>
                </div>
                <div className="flex items-center">
                  <label className='w-32'>Date :-</label>
                  <div>
                    <label>{new Date(invoiceData.invoiceDate).toISOString()}</label>
                  </div>
                </div>
                <div className="flex items-center">
                  <label className='mr-2'>Hash/Transacation Id:- </label>
                  <div>
                    <label>{invoiceData.transactionId}</label>
                  </div>
                </div>
                <div className="flex items-center">
                  <label className='mr-2'>Screenshot/Image/pdf :-</label>
                  <div>
                    <label>{invoiceData.invoiceDocument}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ListWalletView;
