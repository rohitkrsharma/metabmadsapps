import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { API_BASE_URL, fetchToken } from '../utils/auth'; // Adjust import path if necessary

const NetworkAdd = ({ onBack, onSave }) => {
  const [networkName, setNetworkName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Add state for error messages

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleSave = async () => {
    setIsLoading(true); // Start loading
    setErrorMessage(''); // Reset error message
    const token = await fetchToken(); // Fetch token from utility

    const formData = new FormData();
    formData.append('Id', 0);
    formData.append('CryptoNetworkName', networkName);
    formData.append('CryptoNetworkDescription', networkName);
    formData.append('CryptoNetworkImage', selectedImage ? selectedImage : ''); // Append the image URL if available
    if (imageFile) {
      formData.append('ImageFile', imageFile); // Append the actual file
    } else {
      formData.append('ImageFile', ''); // Send empty value if no file is selected
    }
    formData.append('Status', isActive ? true : false); // Convert boolean to string
    formData.append('CreatedBy', 'Rohit'); // Send empty value

    try {
      const url = `${API_BASE_URL}/CryptoNetworks`;
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const responseText = await response.text(); // Get response text for debugging

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText); // Parse JSON if possible
        } catch (jsonError) {
          console.error('Error parsing response JSON:', jsonError);
          throw new Error(`Failed to save network. Status: ${response.status}`);
        }

        if (errorData && errorData.message) {
          setErrorMessage(errorData.message); // Set error message from backend
        } else {
          throw new Error(`Failed to save network. Status: ${response.status}`);
        }

        return; // Exit the function early on error
      }

      // Notify parent component with the new data
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Error parsing response JSON:', jsonError);
      }

      if (result && result.data) {
        onSave(result.data);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setErrorMessage(error.message); // Set error message for unexpected errors
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <>
      <div className='flex gap-2 mb-4'>
        <button
          className='flex items-center gap-1 bg-customPurple rounded-md px-4 py-2 text-white hover:bg-hcolor'
          onClick={onBack}
        >
          <FaArrowLeft /> Back
        </button>
        <button
          className="flex items-center bg-green-500 rounded-md px-4 py-2 text-white hover:bg-green-600"
          onClick={handleSave}
          disabled={isLoading} // Disable button during loading
        >
          {isLoading ? 'Saving...' : 'Submit'}
        </button>
      </div>
      <div className="p-4 border border-customPurple rounded-md shadow-custom max-w-3xl">
        {isLoading && <div className="loader">Loading...</div>} {/* Loader */}
        {errorMessage && (
          <div className="alert alert-error text-red-500 mb-4">
            {errorMessage} {/* Display error message */}
          </div>
        )}
        <form>
          <div className="mb-4 flex justify-end">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={isActive} onChange={handleToggle} name="status" id="status" />
                <div className={`block w-14 h-8 rounded-full transition-colors ${isActive ? 'bg-customPurple' : 'bg-red-500'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isActive ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className={`ml-3 font-medium ${isActive ? 'text-customPurple' : 'text-red-500'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </div>
            </label>
          </div>

          <div className="mb-8 flex">
            <label className="w-44 text-gray-700" htmlFor="networkName">Network Name:</label>
            <input
              type="text"
              id="networkName"
              name="networkName"
              className="form-control w-full p-2 border border-gray-300 rounded"
              value={networkName}
              onChange={(e) => setNetworkName(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="text-gray-700 w-32" htmlFor="fileInput">Image:</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="fileInput"
                name="cryptoNetworkImage"
                className="hidden"
                onChange={handleImageUpload}
              />
              <div
                className="border-4 border-gray-200 rounded-full overflow-hidden cursor-pointer"
                onClick={() => document.getElementById('fileInput').click()}
              >
                <img
                  src={selectedImage || 'https://metaadsapp.s3.ap-south-1.amazonaws.com/default-avatar.png'}
                  alt="upload"
                  className="w-24 h-24 object-cover"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default NetworkAdd;
