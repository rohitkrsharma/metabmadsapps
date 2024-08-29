import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import Select from 'react-select';
import { API_BASE_URL, fetchToken } from '../utils/auth';
import { toast, ToastContainer } from 'react-toastify';

const DepositeAdd = ({ onBack, onAdd }) => {
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [networks, setNetworks] = useState([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchNetworks();
  }, []);

  const fetchNetworks = async () => {
    try {
      const token = await fetchToken();
      const response = await fetch(`${API_BASE_URL}/CryptoNetworks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data.data)) {
        const updatedNetworks = data.data.map(net => ({
          ...net,
          cryptoNetworkImage: `http://3.110.160.106:8080/${net.cryptoNetworkImage.replace(/\\/g, '/')}`
        }));
        setNetworks(updatedNetworks);
        setNetwork(updatedNetworks?.id || '');
      } else {
        console.error('Unexpected response structure:', data);
      }
    } catch (error) {
      console.error('Error fetching networks:', error);
    }
  };

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleSave = async () => {
    if (!address.trim()) {
      toast.error('Address field cannot be empty.');
      return;
    }
    if (!network) {
      toast.error('Please select a network.');
      return;
    }

    try {
      const token = await fetchToken();
      const formData = new FormData();
      formData.append('Id', 0);
      formData.append('Address', address);
      formData.append('CryptoNetworkId', network);
      formData.append('Status', isActive);
      formData.append('CreatedBy', 'Rohit');

      const response = await fetch(`${API_BASE_URL}/CryptoAddresses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.title || 'Unknown error');
      }

      // Check if onAdd is a function before calling it
      if (typeof onAdd === 'function') {
        onAdd(responseData.data);
      } else {
        console.error('onAdd is not a function');
      }

      onBack();

    } catch (error) {
      console.error('Error adding data:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const customSingleValue = ({ data }) => (
    <div className="flex items-center">
      <img src={data.cryptoNetworkImage} alt={data.label} className="w-6 h-6 mr-2 rounded-full" />
      <span>{data.label}</span>
    </div>
  );

  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} className="flex items-center p-2 cursor-pointer hover:bg-gray-200">
        <img src={data.cryptoNetworkImage} alt={data.label} className="w-6 h-6 mr-2 rounded-full" />
        <span>{data.label}</span>
      </div>
    );
  };

  const networkOptions = networks.map((net) => ({
    value: net.id,
    label: net.cryptoNetworkName,
    cryptoNetworkImage: net.cryptoNetworkImage,
  }));

  return (
    <>
      <div className='flex gap-2 mb-4'>
        <button
          className='flex items-center gap-1 bg-customPurple rounded-md px-4 py-2 text-white hover:bg-hcolor'
          onClick={onBack}
        >
          <FaArrowLeft /> Back
        </button>
      </div>
      <div className="p-4 border border-customPurple rounded-md shadow-custom max-w-3xl">
        <form>
          <div className="mb-8 flex items-center">
            <label className="w-44 text-gray-700">Address:</label>
            <input
              type="text"
              className="form-control w-full p-2 border border-gray-300 rounded"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-8 flex items-center">
            <label className="block text-gray-700 w-36">Status:</label>
            <div className="relative w-full ml-6">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={isActive} onChange={handleToggle} />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${isActive ? 'bg-customPurple' : 'bg-red-500'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isActive ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <div className={`ml-3 font-medium ${isActive ? 'text-customPurple' : 'text-red-500'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </div>
              </label>
            </div>
          </div>
          <div className="mb-8 flex items-center">
            <label className="w-44 text-gray-700">Network:</label>
            <div className="relative w-full">
              <Select
                value={networkOptions.find(option => option.value === network)}
                onChange={(selectedOption) => setNetwork(selectedOption.value)}
                options={networkOptions}
                components={{ SingleValue: customSingleValue, Option: customOption }}
                placeholder="Select Network"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="flex items-center bg-customPurple rounded-md px-4 py-2 text-white hover:bg-hcolor"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default DepositeAdd;
