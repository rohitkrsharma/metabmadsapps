import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { API_BASE_URL, fetchToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const AddForm = ({ onBack, onAddSuccess }) => {
  const [fileName, setFileName] = useState('No file chosen');
  const [formData, setFormData] = useState({
    USD: '',
    network: '',
    chargeAmount: '',
    transactionId: '',
    file: null,
    cryptoNetworkImage: '',
    cryptoNetworkName: '', // Add network name to form data
  });
  const [loading, setLoading] = useState(false);
  const [deposits, setDeposits] = useState([]);
  const [invoice, setInvoice] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = await fetchToken();

      // Fetch the latest invoice data
      const invoiceResponse = await fetch(`${API_BASE_URL}/Invoices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const invoiceData = await invoiceResponse.json();
      const latestInvoice = invoiceData.data.length;
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const newInvoiceNumber = `INV${today}-${(latestInvoice + 1).toString().padStart(4, '0')}`;

      setInvoice({
        invoiceNumber: newInvoiceNumber,
        invoiceDate: new Date().toISOString().split('T')[0],
      });

      // Fetch deposit data
      const depositsResponse = await fetch(`${API_BASE_URL}/CryptoAddresses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const depositsData = await depositsResponse.json();
      setDeposits(depositsData.data);
      if (depositsData.data.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          USD: depositsData.data[0].address,
          network: depositsData.data[0].cryptoNetworkId,
          cryptoNetworkImage: depositsData.data[0].cryptoNetworkImage,
          cryptoNetworkName: depositsData.data[0].cryptoNetworkName,
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : 'No file chosen');
    setFormData({ ...formData, file });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (event) => {
    const address = event.target.value;
    const selectedDeposit = deposits.find((deposit) => deposit.address === address);
    setFormData((prevData) => ({
      ...prevData,
      USD: address,
      network: selectedDeposit ? selectedDeposit.cryptoNetworkId : '',
      cryptoNetworkImage: selectedDeposit ? selectedDeposit.cryptoNetworkImage : '',
      cryptoNetworkName: selectedDeposit ? selectedDeposit.cryptoNetworkName : '', 
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedDeposit = deposits.find((deposit) => deposit.address === formData.USD);
    const submitData = new FormData();
    submitData.append('InvoiceDate', invoice.invoiceDate);
    submitData.append('CryptoAddressId', selectedDeposit ? selectedDeposit.id : '');
    submitData.append('CryptoNetworkId', selectedDeposit ? selectedDeposit.cryptoNetworkId : '');
    submitData.append('ChargeAmount', parseFloat(formData.chargeAmount));
    submitData.append('TransactionId', formData.transactionId);
    submitData.append('InvoiceDocument', invoice.invoiceNumber);
    submitData.append('DocFile', formData.file);
    submitData.append('CreatedBy', 'Rohit');

    try {
      setLoading(true);
      const token = await fetchToken();
      const response = await fetch(`${API_BASE_URL}/Invoices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title);
      }

      const result = await response.json();
      onAddSuccess(result);

      navigate('/ListWallet');
    } catch (error) {
      console.error('Error adding data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {loading && (
        <div className="fixed top-0 right-0 m-4 p-4 bg-white border border-gray-300 rounded shadow-lg">
          <p>Loading...</p>
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <button className='flex items-center gap-1 bg-customPurple rounded-md px-4 py-2 text-white hover:bg-hcolor' onClick={onBack}>
            <FaArrowLeft /> Back
          </button>
          <button className='flex items-center bg-green-500 rounded-md px-4 py-2 text-white hover:bg-green-600' onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <div>
          <button className='flex items-center bg-yellow-400 rounded-md px-4 py-2 text-white hover:bg-yellow-500'>Pending</button>
        </div>
      </div>
      <div className="bg-white border border-customPurple rounded-md shadow-custom p-4">
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-xl font-bold" id="invoiceNumber">Invoice number:</h3>
          <h3 className="text-xl font-bold">{invoice.invoiceNumber}</h3>
        </div>
        <div className="flex mb-4">
          <label className='w-44'>Invoice Date:</label>
          <div className="form-control ">
            {invoice.invoiceDate}
          </div>
        </div>
        <div className="flex mb-4">
          <label className='w-52'>USD/deposit Address:</label>
          <select
            name="USD"
            className="form-control w-full p-2 border border-gray-300 rounded"
            value={formData.USD}
            onChange={handleAddressChange}
          >
            <option value="">Select Address</option>
            {deposits.map((deposit) => (
              <option key={deposit.id} value={deposit.address}>
                {deposit.address}
              </option>
            ))}
          </select>
        </div>
        <div className="flex mb-4">
          <label className='w-44'>Network:</label>
          <div className="flex items-center">
            <img
              src={formData.cryptoNetworkImage ? `http://3.110.160.106:8080/${formData.cryptoNetworkImage}` : "https://metaadsapp.s3.ap-south-1.amazonaws.com/default_network_image.png"}
              alt="Network"
              className="w-6 h-6 mr-2"
            />
            {formData.cryptoNetworkName}
          </div>
        </div>
        <div className="flex mb-4">
          <label className='w-52'>Charge Amount:</label>
          <input
            type="text"
            name="chargeAmount"
            className="form-control w-full p-2 border border-gray-300 rounded"
            value={formData.chargeAmount}
            onChange={handleInputChange}
            placeholder="Enter amount in USDT"
          />
        </div>
        <div className="flex mb-4">
          <label className='w-52'>Hash/Transaction ID:</label>
          <input
            type="text"
            name="transactionId"
            className="form-control w-full p-2 border border-gray-300 rounded"
            value={formData.transactionId}
            onChange={handleInputChange}
            placeholder="Enter transaction ID"
          />
        </div>
        <div className="flex items-center mb-4">
          <label className='w-52'>Screenshot/Image/PDF:</label>
          <div className="flex items-center w-full">
            <label
              htmlFor="fileUpload"
              className="bg-customPurple border-2 border-customPurple text-white px-4 py-2 cursor-pointer rounded-l-md hover:bg-hcolor"
            >
              Browse
            </label>
            <input
              type="file"
              id="fileUpload"
              accept=".jpg, .jpeg, .png, .pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              type="text"
              className="form-control w-full p-2 border border-gray-300 rounded-r-md"
              value={fileName}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddForm;