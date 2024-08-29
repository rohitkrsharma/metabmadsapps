import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit, FaRedo, FaSave } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import EveryBmAds from './EveryBmAds';
import OrderHistoryTable from './OrderHistoryTable';
import { API_BASE_URL, fetchToken } from '../utils/auth';

const CustomerView = ({ onBack }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    userId: '',
    accountName: '',
    userName: '',
    contactNumber: '',
    profilePicture: '',
  });
  const [originalData, setOriginalData] = useState(formData);
  const [bmAdsData, setBmAdsData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchUserData = async (id) => {
    try {
      const token = await fetchToken();
      const response = await fetch(`${API_BASE_URL}/UserManagement/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error(`Error ${response.status}: ${errorDetails}`);
        throw new Error(`Error ${response.status}: ${errorDetails}`);
      }

      const data = await response.json();
      console.log("Received Data:", data);

      if (data && data.data) {
        const user = data.data;
        const profilePictureUrl = user.profilePicture ? `http://3.110.160.106:8080/${user.profilePicture}` : 'https://metaadsapp.s3.ap-south-1.amazonaws.com/default-avatar.png';
        setFormData({
          id: user.id,
          userId: user.userId,
          accountName: user.accountName,
          userName: user.userName,
          contactNumber: user.contactNumber,
          profilePicture: profilePictureUrl,
          userTypeId: user.userTypeId || 2, // Assuming 2 is 'Customer'
        });
        setOriginalData({
          id: user.id,
          userId: user.userId,
          accountName: user.accountName,
          userName: user.userName,
          contactNumber: user.contactNumber,
          profilePicture: profilePictureUrl,
          userTypeId: user.userTypeId || 2,
        });
        setSelectedImage(profilePictureUrl);
      } else {
        console.error('Unexpected response structure:', data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/crm/customer');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = await fetchToken();
      const response = await fetch(`${API_BASE_URL}/UserManagement/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      const result = await response.json();
      console.log('Save response:', result);

      setOriginalData({ ...formData, bmAdsData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleResetClick = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBmAdsDataChange = (updatedData) => {
    setBmAdsData(updatedData);
  };

  const getUserTypeLabel = () => {
    if (formData.userTypeId === 1) {
      return 'Reseller';
    } else if (formData.userTypeId === 2) {
      return 'Customer';
    }
    return '';
  };

  const getUserTypeColor = () => {
    if (formData.userTypeId === 1) {
      return 'bg-customPurple';
    } else if (formData.userTypeId === 2) {
      return 'bg-pink-500';
    }
    return '';
  };

  const orderHistoryData = [
    // Dummy data remains the same
  ];

  const columns = ['S.N', 'Order No', 'BM ID', 'Order Date', 'Status'];

  return (
    <>
      <div className='flex justify-between mb-3'>
        <div>
          <button className='bg-customPurple hover:bg-hcolor flex gap-1 items-center text-white px-4 py-2 rounded-md' onClick={handleBackClick}>
            <FaArrowLeft /> Back
          </button>
        </div>
        <div className='flex gap-2'>
          <button className='flex items-center gap-1 px-2 py-1 text-white bg-green-500 hover:bg-green-600 rounded'
            onClick={handleSaveClick}
            disabled={!isEditing}
          >
            <FaSave /> Save
          </button>
          <button className='flex items-center gap-1 px-2 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded'
            onClick={handleEditClick}
            disabled={isEditing}
          >
            <FaEdit /> Edit
          </button>
          <button className='flex items-center gap-1 px-2 py-1 text-white bg-red-500 hover:bg-red-600 rounded'
            onClick={handleResetClick}
            disabled={!isEditing}
          >
            <FaRedo /> Reset
          </button>
        </div>
      </div>
      <div className='p-4 border border-customPurple rounded-md shadow-custom'>
        <div className='flex justify-between'>
          <div className='space-y-7'>
            <div className='flex gap-2'>
              <div className='w-32'>User ID :</div>
              <div>{formData.userId}</div>
            </div>
            <div className='flex gap-2'>
              <div className='w-32'>Account Name :</div>
              {isEditing ? (
                <input
                  type='text'
                  name='accountName'
                  value={formData.accountName}
                  onChange={handleChange}
                  className='border px-2 py-1 rounded-md'
                />
              ) : (
                <div>{formData.accountName}</div>
              )}
            </div>
            <div className='flex gap-2'>
              <div className='w-32'>Contact :</div>
              {isEditing ? (
                <input
                  type='text'
                  name='contactNumber'
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className='border px-2 py-1 rounded-md'
                />
              ) : (
                <div>{formData.contactNumber}</div>
              )}
            </div>
          </div>
          <div className='flex gap-2'>
            <div>
              <div className={`${getUserTypeColor()} px-2 py-1 text-white rounded-md text-sm font-poppins`}>{getUserTypeLabel()}</div>
            </div>
            <div>
              <div className='bg-orange-600 px-2 py-1 text-white rounded-md text-sm font-poppins'>Individual</div>
            </div>
          </div>
          <div className='flex flex-col items-center mr-20'>
            <div
              className='border-4 border-gray-200 rounded-full overflow-hidden cursor-pointer'
              onClick={() => document.getElementById('fileInput').click()}
            >
              <img src={selectedImage || 'https://metaadsapp.s3.ap-south-1.amazonaws.com/default-avatar.png'} alt='Profile' className='w-32 h-32 object-cover' />
            </div>
            <input
              type='file'
              id='fileInput'
              className='hidden'
              onChange={handleImageUpload}
            />
            <label className='mt-2 cursor-pointer' onClick={() => document.getElementById('fileInput').click()}>
              <div className='py-1 text-gray-700 font-bold'>
                Choose Image
              </div>
            </label>
          </div>
        </div>
        <Tabs className='rounded-t-md overflow-hidden'>
          <TabList className='flex gap-1 pt-2 mt-4 bg-customPurple rounded-t-md'>
            <Tab className='text-white px-4 py-2 cursor-pointer ml-1 rounded-t-md hover:bg-white hover:text-customPurple focus:outline-none' selectedClassName='bg-white text-customPurple border-none rounded-none'>
              Every BM/ADS
            </Tab>
            <Tab className='text-white px-4 py-2 cursor-pointer rounded-t-md hover:bg-white hover:text-customPurple focus:outline-none' selectedClassName='bg-white text-customPurple border-none rounded-none'>
              Order History
            </Tab>
            <Tab className='text-white px-4 py-2 cursor-pointer rounded-t-md hover:bg-white hover:text-customPurple focus:outline-none' selectedClassName='bg-white text-customPurple border-none rounded-none'>
              Membership
            </Tab>
            <Tab className='text-white px-4 py-2 cursor-pointer rounded-t-md hover:bg-white hover:text-customPurple focus:outline-none' selectedClassName='bg-white text-customPurple border-none rounded-none'>
              Payments
            </Tab>
          </TabList>
          <TabPanel>
            <EveryBmAds
              userId={formData.id}
              isEditing={isEditing}
              bmAdsData={bmAdsData}
              onBmAdsDataChange={handleBmAdsDataChange}
            />
          </TabPanel>
          <TabPanel>
            <OrderHistoryTable
              data={orderHistoryData}
              columns={columns}
            />
          </TabPanel>
          <TabPanel>
            {/* Membership tab content */}
          </TabPanel>
          <TabPanel>
            {/* Payments tab content */}
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default CustomerView;
