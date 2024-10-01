import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { toast, ToastContainer } from 'react-toastify';
import { API_BASE_URL, fetchToken } from '../utils/auth';
import AddCustomerEveryBM from './AddCustomerEveryBM';
import OrderHistoryTable from './OrderHistoryTable';

const AddCustomer = ({ onBack, onCustomerAdded }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCustomer, setIsCustomer] = useState(false);
  const [orderHistoryData, setOrderHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    userTypeId: 1, // Default to Reseller
    userId: '',
    accountName: '',
    password: '',
    numberOfAccounts: '',
    baseFee: '',
    additionalAccountFees: '',
    numberOfPages: '',
    commission: '',
    additionalPageFees: '',
    numberOfFreeAccountsOrCoupons: '',
    contactNumber: '',
    userName: 'Rohit',
    createdBy: 'Ankit',
    status: true,
    profilePicture: selectedImage,
  });
  console.log("msg", formData);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFormData((prevData) => ({
        ...prevData,
        imageFile: file,
      }));
    }
  };

  const handleToggle = () => {
    setIsCustomer((prevIsCustomer) => {
      const newIsCustomer = !prevIsCustomer;
      console.log('Toggling: ', newIsCustomer ? 'Customer' : 'Reseller'); // Debugging log
      setFormData((prevData) => ({
        ...prevData,
        userTypeId: newIsCustomer ? 2 : 1, // Set userTypeId based on the new state
      }));
      return newIsCustomer;
    });
  };


  const columns = ['S.N', 'Order No', 'BM ID', 'Order Date', 'Status'];

  const fetchOrderHistory = async () => {
    setLoading(true);
    try {
      const token = await fetchToken();
      const response = await axios.get(`${API_BASE_URL}/UserManagement`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrderHistoryData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = await fetchToken();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await axios.post(
        `${API_BASE_URL}/UserManagement`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Data saved successfully', response.data);
      onCustomerAdded();
      // If successful, clear the error state
      setErrors({});
    } catch (error) {
      // Check for validation errors or generic errors
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = error.response.data.errors;

        // Get the first error field and its corresponding message
        const firstErrorField = Object.keys(errorMessages)[0];
        const firstErrorMessage = errorMessages[firstErrorField][0];

        // Set the first error for the field
        setErrors({ [firstErrorField]: firstErrorMessage });

        // Display the first error message in the toast
        toast.error(firstErrorMessage, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        // Generic error handling
        toast.error('An unexpected error occurred while saving data.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className='md:flex justify-between mb-3'>
        <div className='flex mb-2 md:mb-0 gap-2'>
          <button className='bg-customPurple hover:bg-hcolor flex gap-1 items-center text-white px-4 py-2 rounded-md' onClick={onBack}>
            <FaArrowLeft /> Back
          </button>
          <button className='flex items-center gap-1 px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded' onClick={handleSave}>
            Submit
          </button>
        </div>
        <div className='flex gap-2'>
          <div className="flex items-center space-x-4">
            <label className="flex items-center cursor-pointer">
              <div className={`font-medium ${isCustomer ? 'text-customPurple' : 'text-customPurple'}`}>
                Reseller
              </div>
              <div className="relative mx-2">
                <input type="checkbox" className="sr-only" checked={isCustomer} onChange={handleToggle} />
                <div className={`block w-14 h-8 rounded-full transition-colors ${isCustomer ? 'bg-pink-500' : 'bg-customPurple'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isCustomer ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className={`font-medium ${isCustomer ? 'text-pink-500' : 'text-gray-400'}`}>
                Customer
              </div>
            </label>
          </div>
        </div>
      </div>
      <div className='p-4 border border-customPurple rounded-md shadow-custom'>
        <div className='flex justify-between gap-20'>
          <div className='flex-1 space-y-4'>
            <div className='flex gap-2 items-center'>
              <label className='w-48'>Account Name :</label>
              <input
                className='border w-full border-gray-300 rounded-md p-2'
                type='text'
                placeholder='Enter account name'
                name='accountName'
                value={formData.accountName}
                onChange={handleInputChange}
              />
              {errors.accountName && <span className='text-red-600'>{errors.accountName}</span>}
            </div>
            <div className='flex gap-2 items-center'>
              <label className='w-48'>Contact Number :</label>
              <input
                className='border w-full border-gray-300 rounded-md p-2'
                type='text'
                placeholder='Enter contact number'
                name='contactNumber'
                value={formData.contactNumber}
                onChange={handleInputChange}
              />
              {errors.contactNumber && <span className='text-red-600'>{errors.contactNumber}</span>}
            </div>
          </div>
          <div className='flex flex-col items-center mr-20'>
            <div
              className='border-4 border-gray-200 rounded-full overflow-hidden cursor-pointer'
              onClick={() => document.getElementById('fileInput').click()}
            >
              <img src={selectedImage || 'https://metaadsapp.s3.ap-south-1.amazonaws.com/default-avatar.png'} alt='upload' className='w-28 h-28 object-cover' />
            </div>
            <input
              type='file'
              id='fileInput'
              className='hidden'
              onChange={handleImageUpload}
            />
            <label className='mt-2 cursor-pointer' onClick={() => document.getElementById('fileInput').click()}>
              <div className='py-1 text-gray-700'>
                Choose Image
              </div>
            </label>
          </div>
        </div>
        <Tabs className='rounded-t-md overflow-hidden'>
          <TabList className='flex gap-1 pt-2 mt-4 bg-customPurple rounded-t-md'>
            <Tab className='text-white px-4 py-2 ml-2 cursor-pointer rounded-t-md hover:bg-white hover:text-customPurple focus:outline-none' selectedClassName='bg-white text-customPurple border-none rounded-none'>
              Every BM/ADS
            </Tab>
            <Tab className='text-white px-4 py-2 cursor-pointer rounded-t-md hover:bg-white hover:text-customPurple focus:outline-none' selectedClassName='bg-white text-customPurple border-none '>
              Order History
            </Tab>
            <Tab className='text-white px-4 py-2 cursor-pointer rounded-t-md hover:bg-white hover:text-customPurple focus:outline-none' selectedClassName='bg-white text-customPurple border-none'>
              Membership
            </Tab>
            <Tab className='text-white px-4 py-2 cursor-pointer rounded-t-md hover:bg-white hover:text-customPurple focus:outline-none' selectedClassName='bg-white text-customPurple border-none'>
              Reward Points
            </Tab>
            <Tab className='text-white px-4 py-2 cursor-pointer rounded-t-md hover:bg-white hover:text-customPurple focus:outline-none' selectedClassName='bg-white text-customPurple border-none'>
              Referral History
            </Tab>
            <Tab className='text-white px-4 py-2 cursor-pointer rounded-t-md hover:bg-white hover:text-customPurple focus:outline-none' selectedClassName='bg-white text-customPurple border-none'>
              Other Info
            </Tab>
            <Tab className='text-white px-4 py-2 cursor-pointer rounded-t-md hover:bg-white hover:text-customPurple focus:outline-none' selectedClassName='bg-white text-customPurple border-none'>
              Return History
            </Tab>
            <Tab className='text-white px-4 py-2 cursor-pointer rounded-t-md hover:bg-white hover:text-customPurple focus:outline-none' selectedClassName='bg-white text-customPurple border-none'>
              Personal Notes
            </Tab>
          </TabList>
          <TabPanel>
            <AddCustomerEveryBM formData={formData} setFormData={setFormData} userTypeId={formData.userTypeId} />
          </TabPanel>
          <TabPanel>
            <OrderHistoryTable columns={columns} data={orderHistoryData} />
          </TabPanel>
          <TabPanel>
            <div>Membership content goes here</div>
          </TabPanel>
          <TabPanel>
            <div>Reward Points content goes here</div>
          </TabPanel>
          <TabPanel>
            <div>Referral History content goes here</div>
          </TabPanel>
          <TabPanel>
            <div>Other Info content goes here</div>
          </TabPanel>
          <TabPanel>
            <div>Return History content goes here</div>
          </TabPanel>
          <TabPanel>
            <div>Personal Notes content goes here</div>
          </TabPanel>
        </Tabs>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddCustomer;
