import axios from "axios";

// auth.js
export const fetchToken = async () => {
  try {
    const response = await fetch('http://3.110.160.106:8080/api/Auth/Token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
      body: JSON.stringify({
        clientId: 'testuser',
        clientSecret: 'testpassword',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch token');
    }

    const result = await response.json();
    return result.token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
};

// Admin Login

export const fetchAdminToken = async (userId, password) => {
  try {
    const response = await axios.post('http://3.110.160.106:8080/api/Auth/AdminLogin', {
      userId,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
    });

    return response.data.token;
  } catch (error) {
    console.error('Error fetching admin token:', error);
    throw error;
  }
};

// usermanagement

export const API_BASE_URL = 'http://3.110.160.106:8080/api';


const BASE_URL = 'http://3.110.160.106:8080/api/CryptoNetworks';

export const getCryptoNetworks = async () => {
  const token = await fetchToken();
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const updateCryptoNetwork = async (networkId, formData) => {
  const token = await fetchToken();
  try {
    const response = await axios.put(`${BASE_URL}/${networkId}`, formData, {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

// New function to fetch a specific network by ID
export const getCryptoNetworkById = async (id) => {
  const token = await fetchToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/CryptoNetworks/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto network by ID:', error);
    throw error;
  }
};


export const getCryptoNetworkDetail = async (id) => {
  return await axios.get(`http://3.110.160.106:8080/api/CryptoNetworks/${id}`);
};

