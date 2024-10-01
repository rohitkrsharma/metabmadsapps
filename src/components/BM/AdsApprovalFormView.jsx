import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { API_BASE_URL, fetchToken } from '../utils/auth';

const AdsApprovalFormView = ({ data, onBack }) => {
  const [userManagementData, setUserManagementData] = useState(null);
  const [bmAdsOrdersData, setBmAdsOrdersData] = useState(null);

  useEffect(() => {
    if (data.data.id) {
      fetchUserManagementData(data.data.id);
      fetchBMAdsOrdersData(data.data.id);
    }
  }, [data.data.id]);

  const fetchUserManagementData = async (id) => {
    try {
      const token = await fetchToken();
      const response = await fetch(`${API_BASE_URL}/UserManagement/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('User Management Data:', result);
      setUserManagementData(result);
    } catch (error) {
      console.error('Error fetching User Management data:', error);
    }
  };

  const fetchBMAdsOrdersData = async (id) => {
    try {
      const token = await fetchToken();
      const response = await fetch(`${API_BASE_URL}/BMAdsOrders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('BM Ads Orders Data:', result);
      setBmAdsOrdersData(result);
    } catch (error) {
      console.error('Error fetching BM Ads Orders data:', error);
    }
  };

  const calculateTotal = (baseFee, topUpAmount, commission, additionalAccountFees, additionalPageFees, redeemedAmount) => {
    return (
      (parseFloat(baseFee) || 0) +
      (parseFloat(topUpAmount) || 0) +
      (parseFloat(commission) || 0) +
      (parseFloat(additionalAccountFees) || 0) +
      (parseFloat(additionalPageFees) || 0) -
      (parseFloat(redeemedAmount) || 0)
    ).toFixed(2);
  };
  return (
    <div>
      <div className="text-gray-700 mb-4 flex items-center gap-1">
        <button onClick={onBack} className='flex gap-1 items-center bg-customPurple rounded-md px-4 py-2 text-white hover:bg-hcolor'>
          <FaArrowLeft />Back
        </button>
      </div>
      <div className="flex gap-3 justify-between">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col gap-1 p-1">
            <div className="p-1.5 border border-gray-300 bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors duration-300 text-center rounded-md active:bg-purple-700 active:text-white text-sm">Accept</div>
            <div className="p-1.5 border border-gray-300 bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors duration-300 text-center rounded-md text-sm">Checked</div>
            <div className="p-1.5 border border-gray-300 bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors duration-300 text-center rounded-md text-sm">Share Fail</div>
          </div>
          <div className="flex flex-col gap-1 p-1">
            <div className="p-1.5 border border-gray-300 bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors duration-300 text-center rounded-md text-sm">Draft</div>
            <div className="p-1.5 border border-gray-300 bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors duration-300 text-center rounded-md text-sm">A/C Arrived</div>
            <div className="p-1.5 border border-gray-300 bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors duration-300 text-center rounded-md text-sm">Share Pass</div>
          </div>
          <div className="flex flex-col gap-1 p-1">
            <div className="p-1.5 border border-gray-300 bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors duration-300 text-center rounded-md text-sm">Applied</div>
            <div className="p-1.5 border border-gray-300 bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors duration-300 text-center rounded-md text-sm">Meta-team-received</div>
          </div>
        </div>
        <div>
          <div className="bttn-group flex">
            <div className="bttn active text-sm">Draft</div>
            <div className="bttn next text-sm">Applied</div>
            <div className="bttn next next-inner text-sm">Checked</div>
            <div className="bttn next next-inner text-sm">Meta-team-received</div>
            <div className="bttn next next-inner text-sm">A/C Arrived</div>
            <div className="bttn next next-inner text-sm">Share Fail</div>
            <div className="bttn next next-inner text-sm">Share Pass</div>
          </div>
        </div>
      </div>
      <div className="form-row mt-3">
        <div className="p-5 border border-customPurple rounded-md shadow-custom">
          <div className='flex space-x-0 flex-wrap lg:space-x-60'>
            <div className="space-y-8">
              <div className="flex items-center gap-5 font-bold">
                <label>Order No - </label>
                <div>
                  <label>{data.data.orderNo}</label>
                </div>
              </div>
              <div className="flex items-center">
                <label className='w-32'>BM Name :-</label>
                <div>
                  <label>{data.data.name}</label>
                </div>
              </div>
              <div className="flex items-center">
                <label className='w-32'>BM ID :-</label>
                <div>
                  <div className='flex flex-col'>
                    <label>{data.data.bmId}</label>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <label className='w-32'>No of A/C :-</label>
                <div>
                  <div>
                    <label>{data.data.numberOfAccounts}</label>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <label className='w-32'>Time Zone :-</label>
                <div>
                  <div>
                    <label>{data.data.accountTimeZone}</label>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <label className='w-32'>Topup Amount :-</label>
                <div>
                  <div>
                    <label>{data.data.topUpAmount}</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8 flex flex-col">
              <div className="flex items-center gap-5 mt-5 font-bold"></div>
              <div className="flex items-center gap-5">
                <label className='w-32'>Order Date :-</label>
                <div>
                  <label>{data.data.createdDate}</label>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <label className='w-32'>Related user :-</label>
                <div>
                  <div>
                    <label>{data.data.userTypeId}</label>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <label className='w-32'>No Of Page :-</label>
                <div>
                  <div>
                    <label>{data.data.numberOfPages}</label>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <label className='w-32'>Self profile Link :-</label>
                <div>
                  <div>
                    <label>{data.data.selfProfileLink}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            {
              userManagementData && bmAdsOrdersData && (
                <table className="lg:w-[54%] w-full border-collapse border border-customPurple">
                  <tbody>
                    <tr className="bg-gray-200">
                      <td className="border border-customPurple px-4 py-2">Base fare</td>
                      <td className="border border-customPurple px-4 py-2">{userManagementData.data.baseFee} USD</td>
                    </tr>
                    <tr>
                      <td className="border border-customPurple px-4 py-2">Top Up</td>
                      <td className="border border-customPurple px-4 py-2">{data.data.topUpAmount} USD</td>
                    </tr>
                    <tr className="bg-gray-200">
                      <td className="border border-customPurple px-4 py-2">Commission</td>
                      <td className="border border-customPurple px-4 py-2">{userManagementData.data.commission} USD</td>
                    </tr>
                    <tr>
                      <td className="border border-customPurple px-4 py-2">A/C fee</td>
                      <td className="border border-customPurple px-4 py-2">{userManagementData.data.additionalAccountFees} USD</td>
                    </tr>
                    <tr className="bg-gray-200">
                      <td className="border border-customPurple px-4 py-2">Page Fee</td>
                      <td className="border border-customPurple px-4 py-2">{userManagementData.data.additionalPageFees} USD</td>
                    </tr>
                    <tr>
                      <td className="border border-customPurple px-4 py-2">Redeem BM</td>
                      <td className="border border-customPurple px-4 py-2">{data.data.redeemedAmount} USD</td>
                    </tr>
                    <tr className="font-bold bg-gray-200">
                      <td className="border border-customPurple px-4 py-2">Total</td>
                      <td className="border border-customPurple px-4 py-2">
                        {calculateTotal(
                          userManagementData.baseFee,
                          data.data.topUpAmount,
                          userManagementData.commission,
                          userManagementData.additionalAccountFees,
                          userManagementData.additionalPageFees,
                          data.data.redeemedAmount
                        )} USD
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsApprovalFormView;
