import React from 'react'
import { Twitter, Linkedin, MapPin, Mail, Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tighter">TrueSun</h2>
            <p className="text-sm leading-relaxed mb-6 text-slate-400">
              Innovating for the future. We build digital experiences that matter, delivering quality and performance in every line of code.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                <Linkedin size={20} />
              </a>

            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Our Team</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Column 4: Contact & Devs */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-blue-500 shrink-0" />
                <span>123 Innovation Drive,<br />Tech City, TC 90210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <a href="mailto:hello@true.com" className="hover:text-white transition-colors">hello@true.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2026 TRUE. All rights reserved.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-1 text-slate-500">
              <span>Developed with</span>
              <Heart size={14} className="text-red-500 fill-current animate-pulse" />
              <span>by</span>
              <span className="text-slate-300 font-medium">Sreelekshmi</span>
              <span>&</span>
              <span className="text-slate-300 font-medium">Jithu</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer