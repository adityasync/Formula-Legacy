import { Link, useLocation } from 'react-router-dom';
import { Trophy, Timer, Users, TrendingUp, MapPin } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();

    return (
        <nav className="bg-black sticky top-0 z-50">
            {/* Racing stripe top */}
            <div className="h-1 bg-gradient-to-r from-f1-red via-orange-500 to-f1-red"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo with checkered flag */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 grid grid-cols-2 grid-rows-2 rounded overflow-hidden">
                            <div className="bg-white"></div>
                            <div className="bg-f1-red"></div>
                            <div className="bg-f1-red"></div>
                            <div className="bg-white"></div>
                        </div>
                        <span className="font-racing text-2xl tracking-tighter text-white group-hover:text-f1-red transition-colors">
                            F1<span className="text-f1-red group-hover:text-white">PEDIA</span>
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center">
                        <NavLink to="/drivers" icon={<Users size={16} />} text="Drivers" active={location.pathname.startsWith('/drivers')} />
                        <NavLink to="/teams" icon={<Trophy size={16} />} text="Teams" active={location.pathname.startsWith('/teams')} />
                        <NavLink to="/circuits" icon={<MapPin size={16} />} text="Circuits" active={location.pathname.startsWith('/circuits')} />
                        <NavLink to="/races" icon={<Timer size={16} />} text="Races" active={location.pathname === '/races'} />
                        <NavLink to="/analytics" icon={<TrendingUp size={16} />} text="Analytics" active={location.pathname === '/analytics'} />
                    </div>
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-f1-red to-transparent"></div>
        </nav>
    );
}

function NavLink({ to, icon, text, active }) {
    return (
        <Link
            to={to}
            className={`relative flex items-center gap-2 px-4 py-2 mx-1 text-sm font-racing uppercase tracking-wider transition-all rounded
                ${active
                    ? 'text-white bg-f1-red'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
        >
            {icon}
            {text}
        </Link>
    );
}
