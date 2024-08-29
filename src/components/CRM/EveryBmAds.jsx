import React, { useEffect, useState } from 'react';
import { API_BASE_URL, fetchToken } from '../utils/auth';

const EveryBmAds = ({ userId, isEditing }) => {
  const [bmAdsData, setBmAdsData] = useState({
    accountName: '',
    baseFee: '',
    additionalFee: '',
    pageName: '',
    commission: '',
    couponFee: '',
    noOfAccount: ''

  });

  const fetchBmAdsData = async (id) => {
    try {
      const token = await fetchToken();
      const response = await fetch(`${API_BASE_URL}/UserManagement/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      const data = result.data;
      console.log("Fetched Data:", data);

      setBmAdsData({
        noOfAccount: data.numberOfAccounts,
        accountName: data.accountName,
        baseFee: data.baseFee,
        additionalFee: data.additionalAccountFees,
        pageName: data.numberOfPages,
        commission: data.commission,
        couponFee: data.numberOfFreeAccountsOrCoupons,
      });
    } catch (error) {
      console.error('Error fetching BM Ads data:', error);
      setBmAdsData({
        accountName: '',
        baseFee: '',
        additionalFee: '',
        pageName: '',
        commission: '',
        couponFee: '',
        noOfAccount: '',
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBmAdsData(userId);
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBmAdsData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <div className='flex justify-between mt-2 gap-5'>
        <div className='flex-1 space-y-5'>
          <div className='flex gap-2 items-center'>
            <label className='w-60'>No of Account :</label>
            {isEditing ? (
              <input
                type='text'
                name='noOfAccount'
                value={bmAdsData.noOfAccount}
                onChange={handleChange}
                className='border px-2 py-1 rounded-md'
              />
            ) : (
              <label>{bmAdsData.noOfAccount}</label>
            )}
          </div>
          <div className='flex gap-2 items-center'>
            <label className='w-60'>Base Fee :</label>
            {isEditing ? (
              <input
                type='text'
                name='baseFee'
                value={bmAdsData.baseFee}
                onChange={handleChange}
                className='border px-2 py-1 rounded-md'
              />
            ) : (
              <label>{bmAdsData.baseFee}</label>
            )}
          </div>
          <div className='flex gap-2 items-center'>
            <label className='w-60'>Additional A/C Fee :</label>
            {isEditing ? (
              <input
                type='text'
                name='additionalFee'
                value={bmAdsData.additionalFee}
                onChange={handleChange}
                className='border px-2 py-1 rounded-md'
              />
            ) : (
              <label>{bmAdsData.additionalFee}</label>
            )}
          </div>
        </div>
        <div className='flex-1'>
          <div className='flex-1 space-y-5'>
            <div className='flex gap-2 items-center'>
              <label className='w-60'>No of Page :</label>
              {isEditing ? (
                <input
                  type='text'
                  name='pageName'
                  value={bmAdsData.pageName}
                  onChange={handleChange}
                  className='border px-2 py-1 rounded-md'
                />
              ) : (
                <label>{bmAdsData.pageName}</label>
              )}
            </div>
            <div className='flex gap-2 items-center'>
              <label className='w-60'>Commission :</label>
              {isEditing ? (
                <input
                  type='text'
                  name='commission'
                  value={bmAdsData.commission}
                  onChange={handleChange}
                  className='border px-2 py-1 rounded-md'
                />
              ) : (
                <label>{bmAdsData.commission}</label>
              )}
            </div>
            <div className='flex gap-2 items-center'>
              <label className='w-60'>A/C Free/Free coupon :</label>
              {isEditing ? (
                <input
                  type='text'
                  name='couponFee'
                  value={bmAdsData.couponFee}
                  onChange={handleChange}
                  className='border px-2 py-1 rounded-md'
                />
              ) : (
                <label>{bmAdsData.couponFee}</label>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr className='my-10 border-gray-300' />
      <div className='text-red-600 font-extrabold text-lg'>
        Free Coupon
      </div>
      <div className='flex-1 justify-between'>
        <div className='flex gap-2 items-center'>
          <label className='w-44'>No of A/C :</label>
          {isEditing ? (
            <input
              type='text'
              name='couponFee'
              value={bmAdsData.couponFee}
              onChange={handleChange}
              className='border px-2 py-1 rounded-md'
            />
          ) : (
            <label>{bmAdsData.couponFee}</label>
          )}
        </div>
        <div></div>
      </div>
    </>
  );
};

export default EveryBmAds;
