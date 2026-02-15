import React from 'react'
import trueLogo from '../assets/Images/TruesunLogo.png';
import { Link } from 'react-router-dom';
function Header() {
    return (
        <header className="bg-white shadow-sm relative z-50">
            <div className="max-w-7xl mx-auto px-8 sm: lg: h-20 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center justify-center">
                    <img src={trueLogo} alt="TrueSun" className="h-15 w-auto" />
                </div>

                {/* Links */}
                <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-slate-700 uppercase tracking-wide">
                    <Link to="/" className="hover:text-blue-600 transition-colors">HOME</Link>
                    <Link to="/dashboard" className="hover:text-blue-600 transition-colors">DASHBOARD</Link>
                    <Link to="/form" className="hover:text-blue-600 transition-colors">FORM</Link>
                </nav>
            </div>
        </header>
    )
}

export default Header