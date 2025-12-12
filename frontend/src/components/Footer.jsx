import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="relative bg-black border-t border-gray-900 mt-16">
            {/* Full-width checkered flag banner */}
            <div className="absolute left-0 right-0 -top-4 flex">
                {[...Array(100)].map((_, i) => (
                    <div key={i} className="flex flex-col flex-1">
                        <div className={`h-4 ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`} />
                        <div className={`h-4 ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`} />
                    </div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <Link to="/" className="flex items-center gap-3 group">
                            <motion.img
                                src="/logo.png"
                                alt="F1PEDIA"
                                className="h-12 w-auto"
                                whileHover={{ scale: 1.05 }}
                            />
                            <span className="text-4xl font-racing text-white group-hover:text-f1-red transition-colors">
                                <span className="text-f1-red group-hover:text-white">PEDIA</span>
                            </span>
                        </Link>
                        <p className="text-gray-600 font-mono text-xs tracking-wider mt-2">
                            THE COMPLETE F1 ARCHIVE • 1950—2024
                        </p>
                    </div>

                    <nav className="flex flex-wrap justify-center gap-6">
                        {['Drivers', 'Teams', 'Races', 'Circuits', 'Analytics'].map((item) => (
                            <Link
                                key={item}
                                to={`/${item.toLowerCase()}`}
                                className="text-gray-500 hover:text-f1-red transition-colors font-mono text-sm uppercase tracking-wider"
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Racing stripe divider */}
                <div className="flex items-center gap-2 mt-12">
                    <div className="h-px flex-1 bg-gray-800" />
                    <div className="flex gap-1">
                        <div className="w-8 h-1 bg-f1-red" />
                        <div className="w-4 h-1 bg-orange-500" />
                        <div className="w-2 h-1 bg-yellow-500" />
                    </div>
                    <div className="h-px flex-1 bg-gray-800" />
                </div>

                <p className="text-center text-gray-700 font-mono text-xs mt-8">
                    Data sourced from Ergast Developer API
                </p>
            </div>
        </footer>
    );
}
