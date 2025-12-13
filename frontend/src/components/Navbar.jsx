import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Timer, Users, TrendingUp, MapPin } from 'lucide-react';


export default function Navbar() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation(); // Replaces location

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Toggle scroll lock when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isHome && !scrolled && !isOpen
                ? 'bg-transparent'
                : 'bg-black/95 backdrop-blur-sm'
                } ${isOpen ? 'h-screen' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo only */}
                    <Link to="/" className="flex items-center group z-50 relative">
                        <img
                            src="/logo.png"
                            alt="Race Control"
                            className="h-10 w-auto transition-transform group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/drivers" icon={<Users size={16} />} text="Drivers" active={pathname.startsWith('/drivers')} />
                        <NavLink to="/teams" icon={<Trophy size={16} />} text="Teams" active={pathname.startsWith('/teams')} />
                        <NavLink to="/circuits" icon={<MapPin size={16} />} text="Circuits" active={pathname.startsWith('/circuits')} />
                        <NavLink to="/races" icon={<Timer size={16} />} text="Races" active={pathname === '/races'} />
                        <NavLink to="/analytics" icon={<TrendingUp size={16} />} text="Analytics" active={pathname === '/analytics'} />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden z-50 p-3 -m-1 text-white hover:text-f1-red transition-colors"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                    >
                        <div className="flex flex-col gap-1.5 w-6">
                            <motion.div
                                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                className="h-0.5 w-full bg-current origin-center"
                            />
                            <motion.div
                                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="h-0.5 w-full bg-current"
                            />
                            <motion.div
                                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                                className="h-0.5 w-full bg-current origin-center"
                            />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <motion.div
                className={`fixed inset-0 bg-black pt-24 px-6 md:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                initial={{ opacity: 0, x: '100%' }}
                animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: '100%' }}
                transition={{ type: "spring", damping: 20 }}
            >
                {/* Menu Background Accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-f1-red/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Menu Logo */}
                    <div className="mb-8 pl-2">
                        <img src="/logo.png" alt="Race Control" className="h-12 w-auto opacity-80" />
                    </div>

                    <div className="flex flex-col gap-2 text-3xl font-racing uppercase tracking-wider">
                        <MobileLink to="/drivers" onClick={() => setIsOpen(false)} text="Drivers" />
                        <MobileLink to="/teams" onClick={() => setIsOpen(false)} text="Teams" />
                        <MobileLink to="/circuits" onClick={() => setIsOpen(false)} text="Circuits" />
                        <MobileLink to="/races" onClick={() => setIsOpen(false)} text="Races" />
                        <MobileLink to="/analytics" onClick={() => setIsOpen(false)} text="Analytics" />
                    </div>

                    {/* Menu Footer */}
                    <div className="mt-auto mb-8 pt-8 border-t border-gray-900">
                        <p className="text-gray-600 font-mono text-xs uppercase tracking-widest text-center">
                            The Complete Encyclopedia of<br />Formula 1 Racing
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className={`h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent transition-opacity duration-300 ${isHome && !scrolled ? 'opacity-0' : 'opacity-100'
                }`}></div>
        </motion.nav>
    );
}

function MobileLink({ to, onClick, text }) {
    return (
        <Link to={to} onClick={onClick} className="block py-4 border-b border-gray-800 text-gray-400 hover:text-white hover:text-f1-red transition-colors">
            {text}
        </Link>
    );
}

function NavLink({ to, icon, text, active }) {
    return (
        <Link to={to}>
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
