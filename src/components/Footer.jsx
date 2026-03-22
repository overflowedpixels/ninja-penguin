import React from 'react'
import { Twitter, Linkedin, MapPin, Mail, Heart,Instagram } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tighter">True Sun<br></br>Trading Company</h2>
            <p className="text-sm leading-relaxed mb-6 text-slate-400">
              True Sun is a leading solar distributor dedicated to providing high-quality solar energy solutions to both residential and commercial clients
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/_true_sun_trading_company?utm_source=ig_web_button_share_sheet&igsh=ODdmZWVhMTFiMw==" className="hover:text-white transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/company/true-sun-trading-company/" className="hover:text-white transition-colors duration-200">
                <Linkedin size={20} />
              </a>

            </div>
          </div>

           

           

          {/* Column 4: Contact & Devs */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-blue-500 shrink-0" />
                <span>True Sun Trading Company, 1st Floor, 5/351 Theempalanngatt Building, M C Road, Mathumoola, Vazhappalli East, Changanacherry, Kottayam – 686103</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <a href="mailto:technicaltruesuntradingcompany@gmail.com," className="hover:text-white transition-colors">technicaltruesuntradingcompany@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2026 True Sun Trading Company All rights reserved.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-1 text-slate-500">
              <span>Developed with</span>
              <Heart size={14} className="text-red-500 fill-current animate-pulse" />
              <span>by</span>
              <a href="https://www.fennechron.com"><span className="text-slate-300 font-medium">Fennechron Labs</span></a>
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
