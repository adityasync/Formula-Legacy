import { Link } from 'react-router-dom';
import { Trophy, Timer, Users, Flag } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="bg-f1-black border-b-4 border-f1-red text-f1-offwhite sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <Flag className="h-8 w-8 text-f1-red" fill="currentColor" />
                            <span className="font-racing text-2xl tracking-tighter">F1PEDIA</span>
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink to="/drivers" icon={<Users size={18} />} text="Drivers" />
                                <NavLink to="/teams" icon={<Trophy size={18} />} text="Teams" />
                                <NavLink to="/races" icon={<Timer size={18} />} text="Races" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ to, icon, text }) {
    return (
        <Link
            to={to}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-f1-charcoal hover:text-f1-red transition-colors duration-200 font-body uppercase tracking-widest"
        >
            {icon}
            {text}
        </Link>
    );
}
