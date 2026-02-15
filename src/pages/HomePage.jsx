import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import heroImage from '../assets/Images/women.webp'; // Using the same image
import { Phone, Mail, Globe, Search, UserPlus, FileText, FileCheck, ClipboardCheck, FileSearch, Send, FileOutput } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className=" bg-white font-sans overflow-x-hidden">

      {/* Main Hero Content */}
      <div className="relative bg-slate-900 min-h-[calc(100vh-120px)] overflow-hidden">

        {/* Diagonal White Background on Right */}
        <div
          className="absolute inset-0 bg-red-500 w-1/2 ml-[50%]"
          style={{
            clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)',
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'start',
            backgroundRepeat: 'no-repeat',

          }}
        ></div>

        <div className="max-w-7xl mx-auto h-screen relative grid grid-cols-1 lg:grid-cols-2 gap-0 items-center  ">

          {/* Text Content (Left - Dark) */}
          <div className="px-6 lg:pl-8 py-12 text-white">
            <p className="text-5xl md:text-[60px] font-extrabold leading-tight mb-6">
              UNIQUE <span className="text-blue-500">SOLUTIONS</span> <br />
              FOR <span className="text-white">RESIDENTIALS & INDUSTRIES</span>
            </p>

            <p className="text-gray-400 text-sm md:text-base max-w-lg mb-10 leading-relaxed">
              Streamline your solar installation verifications with our cutting-edge dashboard and automated reporting tools.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('#how-it-works')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 text-sm uppercase tracking-wider rounded-sm shadow-lg transition-transform transform hover:-translate-y-1"
              >
                How it works
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-transparent border border-gray-500 hover:border-white text-white font-bold py-3 px-8 text-sm uppercase tracking-wider rounded-sm transition-colors"
              >
                DASHBOARD
              </button>
            </div>

          </div>


        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started with our streamlined process in just three simple steps.
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1: Submission */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <UserPlus size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">1. Submit Request</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Customers submit a verification request with all necessary details.
                </p>
              </div>
            </div>

            {/* Step 2: Review & Rejection */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4">
                  <FileSearch size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">2. Official Review</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Officials review the request. If rejected, a reason is required and an email is sent to the EPC.
                </p>
              </div>
            </div>

            {/* Step 3: Approval Details */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                  <ClipboardCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">3. Approval & Details</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  If accepted, officials fill in mandatory details (e.g., warranty number) and approve that request.
                </p>
              </div>
            </div>

            {/* Step 4: Auto-Generation */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <FileCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">4. Auto-Generation</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A DOCX file is automatically generated with all details and sent to Premier Energies for sealing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}