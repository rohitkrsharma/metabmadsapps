import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit, FaRedo, FaSave } from 'react-icons/fa';
import { API_BASE_URL, fetchToken } from '../utils/auth'; // Adjust import path if necessary

const NetworkDetailView = ({ data, onBack, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [networkData, setNetworkData] = useState(data);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setNetworkData({
        ...data,
        status: data.status ? "Active" : "Inactive"
      });
    }
  }, [data]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true); // Start loading
    setIsEditing(false); // Stop editing

    const networkId = networkData?.id; // Ensure networkId is being set
    const token = await fetchToken();

    if (!networkId) {
      console.error('Network ID is undefined');
      setIsLoading(false);
      return;
    }

    // Prepare the form data for file upload
    const formData = new FormData();
    formData.append('Id', networkId);
    formData.append('cryptoNetworkName', networkData.cryptoNetworkName);
    formData.append('status', networkData.status === 'Active');

    if (file) {
      formData.append('imageFile', file);
    }

    try {
      const url = `${API_BASE_URL}/CryptoNetworks/${networkId}`;
      console.log('Sending request to API...');
      console.log('Request URL:', url);
      console.log('Form Data:', formData);

      const response = await fetch(url, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const responseText = await response.text(); // Get response text for debugging

      console.log('Response Status:', response.status);
      console.log('Response Text:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to update network. Status: ${response.status}, Message: ${responseText}`);
      }

      // Notify parent component with the updated data
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Update response:', result);
      } catch (jsonError) {
        console.error('Error parsing response JSON:', jsonError);
      }

      if (result && result.data) {
        setNetworkData({
          ...result.data,
          status: result.data.status ? "Active" : "Inactive"
        });
        onSave(result.data); // Notify parent component
      }

    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };


  const handleReset = () => {
    if (data) {
      setNetworkData({
        ...data,
        status: data.status ? "Active" : "Inactive"
      });
    }
    setFile(null); // Reset the file input as well
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNetworkData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div>
      <div className="text-gray-700 mb-4 flex items-center justify-between gap-1">
        <div className='flex gap-1'>
          <button onClick={onBack} className='flex items-center gap-1 bg-customPurple rounded-md px-4 py-2 text-white hover:bg-hcolor'>
            <FaArrowLeft /> Back
          </button>
        </div>

        <div className='flex gap-2'>
          <button onClick={handleSave} className='flex items-center gap-1 px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded' disabled={isLoading}>
            <FaSave /> {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleEdit} className='flex items-center gap-1 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded' disabled={isEditing}>
            <FaEdit /> Edit
          </button>
          <button onClick={handleReset} className='flex items-center gap-1 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded'>
            <FaRedo /> Reset
          </button>
        </div>
      </div>
      <div className="mt-3">
        <div className="p-10 border border-customPurple rounded-md shadow-custom">
          <div className='flex'>
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <label className='w-32'>Network Name:</label>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="cryptoNetworkName"
                      value={networkData.cryptoNetworkName || ''}
                      onChange={handleChange}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    <label>{networkData.cryptoNetworkName}</label>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-5">
                <label className='w-32'>Image:</label>
                <div>
                  {isEditing ? (
                    <>
                      <input
                        type="file"
                        name="cryptoNetworkImage"
                        onChange={handleFileChange}
                        className="border rounded px-2 py-1"
                      />
                      {networkData.cryptoNetworkImage && !file && (
                        <img className="w-10 mt-2" src={`http://3.110.160.106:8080/${networkData.cryptoNetworkImage}`} alt={networkData.cryptoNetworkName} />
                      )}
                    </>
                  ) : (
                    <img className="w-10" src={`http://3.110.160.106:8080/${networkData.cryptoNetworkImage}`} alt={networkData.cryptoNetworkName} />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-5">
                <label className='w-32'>Status:</label>
                <div>
                  {isEditing ? (
                    <select
                      name="status"
                      value={networkData.status}
                      onChange={handleChange}
                      className="border rounded px-2 py-1"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  ) : (
                    <label>{networkData.status}</label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkDetailView;
