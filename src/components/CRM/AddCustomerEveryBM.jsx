import React from 'react';

const AddCustomerEveryBM = ({ formData, setFormData }) => {
  // Handle input changes specific to this component
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <div className='flex justify-between p-2 gap-5'>
        <div className='flex-1 space-y-3'>
          <div className='flex gap-2 items-center'>
            <label className='w-60'>No of Account :</label>
            <input
              className='border w-full border-gray-300 rounded-md p-2'
              type='text'
              placeholder='Enter number of accounts'
              name='numberOfAccounts'
              value={formData.numberOfAccounts}
              onChange={handleInputChange}
            />
          </div>
          <div className='flex gap-2 items-center'>
            <label className='w-60'>Base Fee :</label>
            <input
              className='border w-full border-gray-300 rounded-md p-2'
              type='text'
              placeholder='Enter base fee'
              name='baseFee'
              value={formData.baseFee}
              onChange={handleInputChange}
            />
          </div>
          <div className='flex gap-2 items-center'>
            <label className='w-60'>Additional A/C Fee :</label>
            <input
              className='border w-full border-gray-300 rounded-md p-2'
              type='text'
              placeholder='Enter additional A/C fee'
              name='additionalAccountFees'
              value={formData.additionalAccountFees}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className='flex-1'>
          <div className='flex-1 space-y-3'>
            <div className='flex gap-2 items-center'>
              <label className='w-60'>No of Page :</label>
              <input
                className='border w-full border-gray-300 rounded-md p-2'
                type='text'
                placeholder='Enter number of pages'
                name='numberOfPages'
                value={formData.numberOfPages}
                onChange={handleInputChange}
              />
            </div>
            <div className='flex gap-2 items-center'>
              <label className='w-60'>Commission :</label>
              <input
                className='border w-full border-gray-300 rounded-md p-2'
                type='text'
                placeholder='Enter commission'
                name='commission'
                value={formData.commission}
                onChange={handleInputChange}
              />
            </div>
            <div className='flex gap-2 items-center'>
              <label className='w-60'>A/C Free/Free coupon :</label>
              <input
                className='border w-full border-gray-300 rounded-md p-2'
                type='text'
                placeholder='Enter A/C free or free coupon'
                name='numberOfFreeAccountsOrCoupons'
                value={formData.numberOfFreeAccountsOrCoupons}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <hr className='my-10 border-gray-300' />
      </div>
      <div className='text-red-600 font-extrabold text-lg'>
        Free Coupon
      </div>
      <div className='flex-1 justify-between'>
        <div className='flex gap-2 items-center'>
          <label className='w-44'>No of A/C :</label>
          <input
            className='border w-1/3 border-gray-300 rounded-md p-2'
            type='text'
            placeholder='Enter free coupon account no'
            name='couponFee'
            value={formData.couponFee}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </>
  );
};

export default AddCustomerEveryBM;
