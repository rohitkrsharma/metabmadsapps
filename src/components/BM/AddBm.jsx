import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { API_BASE_URL, fetchToken } from '../utils/auth';
import { DateTime } from 'luxon';

const timeZoneOptions = [
  { value: 'Asia/Kolkata', label: 'Asia/India' },
  { value: 'America/Toronto', label: 'Canada/Toronto' },
  { value: 'America/New_York', label: 'USA/New York' },
  { value: 'Europe/London', label: 'UK/London' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin' }
];

const AddBM = ({ onBack, showBackButton }) => {
  const [formData, setFormData] = useState({
    Id: '0',
    UserTypeId: '2',
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
      [id]: type === 'checkbox' ? (checked ? 12 : 0) : value,
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
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      console.log('Data submitted successfully:', responseData);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="container">
      <div className='flex gap-3 mb-3'>
        {showBackButton && (
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
              {/* <div className="mt-2 text-sm text-gray-700">Current Time: {currentTime}</div> */}
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
          <div className="form-check flex items-center">
            <input
              type="checkbox"
              id="redeemCheckbox"
              className="form-check-input h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={formData.RedeemedAmount === 12}
              onChange={handleChange}
            />
            <label htmlFor="redeemCheckbox" className="ml-2 block text-md text-gray-900 font-bold">Redeem</label>
            <span className="ml-2 text-gray-500 font-bold text-md">$12</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBM;
