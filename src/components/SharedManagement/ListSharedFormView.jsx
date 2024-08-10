import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const ListSharedFormView = ({ data, onBack }) => {
  return (
    <>
      <div className="text-gray-700 mb-4 flex items-center justify-between gap-1">
        <div className='flex gap-2'>
          <button onClick={onBack} className='flex gap-1 items-center bg-customPurple rounded-md px-4 py-2 text-white hover:bg-hcolor'>
            <FaArrowLeft />Back
          </button>
          <button className="flex items-center bg-green-500 rounded-md px-4 py-2 text-white hover:bg-green-600">Resubmited</button>
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
              <div className="flex items-center">
                <label className='w-32'>Order No - </label>
                <div>
                  <label>{data.OrderNo}</label>
                </div>
              </div>
              <div className="flex items-center">
                <label className='w-32'>BM Name :-</label>
                <div>
                  <label>Rohit Kumar</label>
                </div>
              </div>
              <div className="flex items-center">
                <label className='w-32'>Status :-</label>
                <div>
                  <div>
                    <label>{data.status}</label>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <label className='w-32'>BM ID :-</label>
                <div>
                  <div className='flex gap-2 font-medium'>
                    <label>12345</label>
                    <label >New Resubmitted</label>
                  </div>
                  <div className='flex gap-2'>
                    <label>1234</label>
                    <label>Old</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListSharedFormView;
