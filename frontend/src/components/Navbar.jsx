import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Timer, Users, TrendingUp, MapPin } from 'lucide-react';
import { sfx } from '../utils/audio';

export default function Navbar() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome && !scrolled
                ? 'bg-transparent'
                : 'bg-black/95 backdrop-blur-sm'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Racing stripe top - show when scrolled or not on home */}
            <div className={`h-1 bg-gradient-to-r from-f1-red via-orange-500 to-f1-red transition-opacity duration-300 ${isHome && !scrolled ? 'opacity-0' : 'opacity-100'
                }`}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo only - no text */}
                    <Link to="/" className="flex items-center group">
                        <img
                            src="/logo.png"
                            alt="F1PEDIA"
                            className="h-10 w-auto transition-transform group-hover:scale-105"
                        />
                    </Link>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/drivers" icon={<Users size={16} />} text="Drivers" active={location.pathname.startsWith('/drivers')} />
                        <NavLink to="/teams" icon={<Trophy size={16} />} text="Teams" active={location.pathname.startsWith('/teams')} />
                        <NavLink to="/circuits" icon={<MapPin size={16} />} text="Circuits" active={location.pathname.startsWith('/circuits')} />
                        <NavLink to="/races" icon={<Timer size={16} />} text="Races" active={location.pathname === '/races'} />
                        <NavLink to="/analytics" icon={<TrendingUp size={16} />} text="Analytics" active={location.pathname === '/analytics'} />
                    </div>
                </div>
            </div>

            <div className={`h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent transition-opacity duration-300 ${isHome && !scrolled ? 'opacity-0' : 'opacity-100'
                }`}></div>
        </motion.nav>
    );
}

function NavLink({ to, icon, text, active }) {
    return (
        <Link to={to} onClick={() => sfx.gearShift()} onMouseEnter={() => sfx.hover()}>
            <motion.div
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-racing uppercase tracking-wider transition-all
                    ${active
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
            >
                {icon}
                {text}

                {/* Active indicator - racing stripe */}
                {active && (
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-f1-red"
                        layoutId="navbar-indicator"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                )}
            </motion.div>
        </Link>
    );
}
