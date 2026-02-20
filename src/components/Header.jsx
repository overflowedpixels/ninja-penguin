import React, { useEffect, useState } from 'react'
import trueLogo from '../assets/Images/TruesunLogo.png';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { logAdminAction } from '../services/api';

function Header() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        if (user && user.email) {
            try {
                await logAdminAction(user.email, "LOGGED OUT", {
                    reason: "User logged out"
                });
            } catch (err) {
                console.error("Failed to post admin log:", err);
            }
        }
        await signOut(auth);
        navigate('/login');
    };

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

                    {user?.email === 'superadmin@truesuntradingcompany.com' && (
                        <Link to="/admin-logs" className="hover:text-indigo-600 text-indigo-500 transition-colors">ADMIN LOGS</Link>
                    )}

                    {user ? (
                        <button onClick={handleLogout} className="hover:text-red-600 transition-colors uppercase font-bold text-sm">LOGOUT</button>
                    ) : (
                        <Link to="/login" className="hover:text-blue-600 transition-colors">LOGIN</Link>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Header