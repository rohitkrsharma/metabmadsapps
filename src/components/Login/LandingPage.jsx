import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
      <div className='min-h-screen flex items-center justify-center bg-purple-400 font-poppins'>
        <div
          className="bg-cover rounded-3xl flex items-center justify-center bg-center px-5 md:py-10 md:px-10"
          style={{ backgroundImage: `url(https://metaadsapp.s3.ap-south-1.amazonaws.com/background_Image.jpg)` }}
        >
          <div className='space-y-14'>
            <div className='md:flex text-white font-poppins gap-40'>
              <div className="">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Hurry up, make money</h1>
                <p className="mb-6 text-sm md:text-lg">
                  In publishing and graphic design, Lorem ipsum is a <br />
                  Placeholder text commonly.
                </p>
                <div className="w-16 h-1 md:w-32 md:h-2 bg-blue-600 rounded-md mx-auto md:mx-0"></div>
              </div>
              <div className='rounded-xl'>
                <img src='https://metaadsapp.s3.ap-south-1.amazonaws.com/Banner_Image.png' alt='banner' className='rounded-xl w-96' />
              </div>
            </div>
            <div className="flex  items-center">
              <div className="flex gap-5 bg-pink-500 p-5 rounded-3xl h-48 shadow-md ">
                <div className="flex flex-col justify-center items-center font-poppins">
                  <div className='text-white'>
                    <h2 className="text-3xl font-bold mb-4">Login as a Admin</h2>
                    <p className="mb-6">Use your mobile and win prizes</p>
                    <button onClick={handleLoginClick} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md">
                      <img src='https://metaadsapp.s3.ap-south-1.amazonaws.com/butto_icon.png' alt='button' className='w-4' />
                      Login Account
                    </button>
                  </div>
                </div>
                <div className="">
                  <img
                    src="https://metaadsapp.s3.ap-south-1.amazonaws.com/login_as_reseller.png"
                    alt="Card"
                    className="rounded-3xl h-40"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div></>

  );
};

export default LandingPage;
