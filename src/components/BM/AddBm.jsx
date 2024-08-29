import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { API_BASE_URL, fetchToken } from '../utils/auth';
import { DateTime } from 'luxon';
import { toast, ToastContainer } from 'react-toastify';

const timeZoneOptions = [
  { value: 'Asia/Kolkata', label: 'Asia/India' },
  { value: 'America/Toronto', label: 'Canada/Toronto' },
  { value: 'America/New_York', label: 'USA/New York' },
  { value: 'Europe/London', label: 'UK/London' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin' }
];

const AddBM = ({ onBack, showBackButton, isAddingFromAdd }) => {
  const [formData, setFormData] = useState({
    Id: '0',
    UserTypeId: '3',
    UserManagementId: '4',
    OrderNo: '',
    Name: '',
    BMId: '',
    NumberOfAccounts: '',
    NumberOfPages: '',
    AccountTimeZone: '',
    SelfProfileLink: '',
    TopUpAmount: '',
    RedeemedAmount: 0,
    Status: 1,
    CreatedBy: 'Admin',
    CreatedDate: new Date().toISOString(),
    UpdatedBy: 'Admin',
    UpdatedDate: new Date().toISOString(),
  });

  const [timeZonesWithCurrentTime, setTimeZonesWithCurrentTime] = useState([]);

  useEffect(() => {
    const updateTimeZones = () => {
      const updatedOptions = timeZoneOptions.map(option => {
        const currentTime = DateTime.now().setZone(option.value).toFormat('hh:mm a');
        return {
          ...option,
          label: `${option.label} (${currentTime})`
        };
      });
      setTimeZonesWithCurrentTime(updatedOptions);
    };

    // Initial update
    updateTimeZones();

    // Update every minute
    const interval = setInterval(updateTimeZones, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = await fetchToken();
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }

      const response = await fetch(`${API_BASE_URL}/BMAdsOrders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        // Check if error data contains validation errors
        if (errorData.errors) {
          const errorMessages = errorData.errors;

          // Get the first error field and its corresponding message
          const firstErrorField = Object.keys(errorMessages)[0];
          const firstErrorMessage = errorMessages[firstErrorField][0];

          // Show toast for the first error message
          toast.error(firstErrorMessage, {
            position: 'top-right',
            autoClose: 3000,
          });
        }
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Data submitted successfully:', responseData);

      // Show success toast message
      toast.success('Data submitted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });

      // After successful submission, open AdsApproval page or update state
      // Example: navigate('/ads-approval');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="container">
      <div className='flex gap-3 mb-3'>
        {showBackButton && !isAddingFromAdd && (
          <div className="gap-2 flex">
            <button
              className='flex items-center gap-1 bg-customPurple rounded-md px-4 py-2 text-white hover:bg-hcolor'
              onClick={onBack}
            >
              <FaArrowLeft /> Back
            </button>
          </div>
        )}
        <div>
          <button
            onClick={handleSubmit}
            className="flex items-center bg-green-500 rounded-md px-4 py-2 text-white hover:bg-green-600">
            Submit
          </button>
        </div>
      </div>
      <div className="p-4 border bg-white border-customPurple rounded-md shadow-custom">
        <div className="mb-4">
          {/* <h5 id="orderNumber" className="text-lg font-bold">Order No: {formData.OrderNo}</h5> */}
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='flex items-center gap-5'>
              <label htmlFor="Name" className="text-sm font-medium w-36 text-gray-700">Name :</label>
              <input
                type="text"
                id="Name"
                className="form-control w-full p-2 border border-gray-300 rounded"
                placeholder="Enter name"
                value={formData.Name}
                onChange={handleChange}
              />
            </div>
            <div className='flex items-center gap-5'>
              <label htmlFor="BMId" className="text-sm font-medium w-36 text-gray-700">BM ID :</label>
              <input
                type="text"
                id="BMId"
                className="form-control w-full p-2 border border-gray-300 rounded"
                placeholder="Enter BM ID"
                value={formData.BMId}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='flex items-center gap-5'>
              <label htmlFor="NumberOfAccounts" className="text-sm font-medium w-36 text-gray-700">No of A/C :</label>
              <input
                type="text"
                id="NumberOfAccounts"
                className="form-control w-full p-2 border border-gray-300 rounded"
                placeholder="Enter No of A/C"
                value={formData.NumberOfAccounts}
                onChange={handleChange}
              />
            </div>
            <div className='flex items-center gap-5'>
              <label htmlFor="NumberOfPages" className="text-sm font-medium w-36 text-gray-700">No of Pages :</label>
              <input
                type="text"
                id="NumberOfPages"
                className="form-control w-full p-2 border border-gray-300 rounded"
                placeholder="Enter No of Pages"
                value={formData.NumberOfPages}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='flex items-center gap-5'>
              <label htmlFor="AccountTimeZone" className="text-sm font-medium w-36 text-gray-700">A/C Time Zone :</label>
              <select
                id="AccountTimeZone"
                className="form-control w-full p-2 border border-gray-300 rounded"
                value={formData.AccountTimeZone}
                onChange={handleChange}
              >
                <option value="">Select Time Zone</option>
                {timeZonesWithCurrentTime.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex items-center gap-5'>
              <label htmlFor="SelfProfileLink" className="text-sm font-medium w-36 text-gray-700">Self Profile Link :</label>
              <input
                type="text"
                id="SelfProfileLink"
                className="form-control w-full p-2 border border-gray-300 rounded"
                placeholder="Enter Self Profile Link"
                value={formData.SelfProfileLink}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='flex items-center gap-5'>
              <label htmlFor="TopUpAmount" className="text-sm font-medium w-36 text-gray-700">Top Up Amount :</label>
              <input
                type="text"
                id="TopUpAmount"
                className="form-control w-full p-2 border border-gray-300 rounded"
                placeholder="Enter Top Up Amount"
                value={formData.TopUpAmount}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='flex items-center gap-5'>
            <input
              type="checkbox"
              id="redeem"
              className="form-checkbox"
              checked={formData.redeem}
              onChange={handleChange}
            />
            <label htmlFor="redeem" className="text-sm font-medium text-gray-700">Redeem</label>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddBM;
