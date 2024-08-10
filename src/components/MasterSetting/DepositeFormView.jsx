import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit, FaRedo, FaSave } from 'react-icons/fa';
import { API_BASE_URL, fetchToken } from '../utils/auth';

const DepositeFormView = ({ data, onBack, setData, dataList }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [depositeData, setDepositeData] = useState({});
  const [networks, setNetworks] = useState([]);

  // Fetch network data on component mount
  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const token = await fetchToken(); // Fetch the token
        const response = await fetch(`${API_BASE_URL}/CryptoNetworks`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the Authorization header
          },
        });
        const result = await response.json();
        setNetworks(result.data);
      } catch (error) {
        console.error('Error fetching networks:', error);
      }
    };

    fetchNetworks();
  }, []);

  // Initialize depositeData when data prop changes
  useEffect(() => {
    if (data) {
      setDepositeData(data);
    }
  }, [data]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    console.log('Saving data:', depositeData);

    if (!depositeData.address) {
      console.error('Address field is required.');
      return;
    }

    try {
      const token = await fetchToken();

      // Prepare data for the PUT request using FormData
      const formData = new FormData();
      formData.append('address', depositeData.address);
      formData.append('status', depositeData.status);

      const response = await fetch(`${API_BASE_URL}/CryptoAddresses/${depositeData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        throw new Error('Network response was not ok');
      }

      // Update the data list
      const updatedDataList = dataList.map(item =>
        item.id === depositeData.id ? { ...item, address: depositeData.address, status: depositeData.status } : item
      );
      setData(updatedDataList);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleReset = () => {
    setDepositeData(data || {});
    setIsEditing(false); // Reset editing mode
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepositeData({ ...depositeData, [name]: value });
  };

  // Find the corresponding network by ID
  const currentNetwork = networks.find(
    (network) => network.id === depositeData.cryptoNetworkId
  );

  return (
    <div className="p-4">
      <div className="text-gray-700 mb-4 flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1 bg-customPurple rounded-md px-4 py-2 text-white hover:bg-hcolor"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded"
          >
            <FaSave /> Save
          </button>
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
          >
            <FaRedo /> Reset
          </button>
        </div>
      </div>

      <div className="form-row mt-3">
        <div className="p-6 border border-customPurple rounded-md shadow-md">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Address:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={depositeData.address || ''}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                />
              ) : (
                <span>{depositeData.address || 'N/A'}</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Network:</label>
              <div className="flex items-center gap-2 flex-1">
                {currentNetwork ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={`http://3.110.160.106:8080/${currentNetwork.cryptoNetworkImage}`}
                      alt={currentNetwork.cryptoNetworkName}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://media.istockphoto.com/id/1367699775/photo/nft-non-fungible-token-golden-coins-falling-trendy-cryptocurrencies-and-coins-on-the.jpg?s=1024x1024&w=is&k=20&c=-hIyE7TTcGTOsBdCf_YDwvE7vVzg7i6KybLpCvd3OrM=';
                      }}
                    />
                    <span>{currentNetwork.cryptoNetworkName}</span>
                  </div>
                ) : (
                  <span>Unknown Network</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Status:</label>
              <span>{depositeData.status ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositeFormView;
