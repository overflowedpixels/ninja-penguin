import React from 'react';
import { Link } from 'react-router-dom';
import img from "../assets/Images/Image404.webp";

const Page401 = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-4">Oops!</h2>
                   <img src={img} alt="Broken Solar Panel" className='w-full h-full'/>
                <p className="text-lg text-gray-600 mb-8">
                    The page you are looking for is not found.
                </p>
                <Link
                    to="/"
                    className="text-blue-600 border-2 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-800 p-3 rounded-lg"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default Page401;
