import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDrivers } from '../services/api';
import DriverCard from '../components/DriverCard';
import Footer from '../components/Footer';
import { Loader2, Star, Users, ChevronRight } from 'lucide-react';

export default function Drivers() {
    const [allDrivers, setAllDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('legends');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const driversPerPage = 24;

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await getDrivers();
                setAllDrivers(response.data);
            } catch (err) {
                setError('Failed to load drivers. Is the backend running?');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDrivers();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="animate-spin h-12 w-12 text-f1-red mx-auto mb-4" />
                <p className="text-gray-500 font-mono text-sm">Loading drivers...</p>
            </div>
        </div>
    );

    // Filter logic
    const filteredDrivers = allDrivers.filter(d => {
        const fullSearch = `${d.forename} ${d.surname}`.toLowerCase();
        return fullSearch.includes(searchTerm.toLowerCase());
    });

    const legends = filteredDrivers.filter(d => {
        if (d.dob) return new Date(d.dob).getFullYear() < 1980;
        return d.driverId < 200;
    });

    const currentEra = filteredDrivers.filter(d => {
        if (d.dob) return new Date(d.dob).getFullYear() >= 1980;
        return d.driverId >= 200;
    });

    const displayedList = activeTab === 'all' ? filteredDrivers
        : activeTab === 'legends' ? legends
            : currentEra;

    // Pagination logic
    const totalPages = Math.ceil(displayedList.length / driversPerPage);
    const indexOfLastDriver = currentPage * driversPerPage;
    const indexOfFirstDriver = indexOfLastDriver - driversPerPage;
    const currentDriversPage = displayedList.slice(indexOfFirstDriver, indexOfLastDriver);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to page 1 on search
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <div className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Breadcrumb ... (Unchanged) */}
                    <motion.div
                        className="flex items-center gap-2 text-gray-500 text-sm font-mono mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-f1-red">Drivers</span>
                    </motion.div>

                    {/* Title with racing accent */}
                    <motion.div
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-16 bg-f1-red"></div>
                            <div>
                                <h1 className="text-5xl md:text-6xl text-white font-racing tracking-tight uppercase">
                                    Driver <span className="text-f1-red">Archive</span>
                                </h1>
                                <p className="text-gray-500 font-mono text-sm mt-2">
                                    {allDrivers.length} legends, champions, and drivers of Formula 1
                                </p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search Driver..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full md:w-64 bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-f1-red font-mono text-sm uppercase placeholder-gray-500"
                            />
                        </div>
                    </motion.div>

                    {/* Tabs */}
                    <motion.div
                        className="flex gap-2 flex-wrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <TabButton
                            active={activeTab === 'all'}
                            onClick={() => handleTabChange('all')}
                            icon={<Users className="w-4 h-4" />}
                            label="All Time"
                            count={filteredDrivers.length}
                        />
                        <TabButton
                            active={activeTab === 'legends'}
                            onClick={() => handleTabChange('legends')}
                            icon={<Star className="w-4 h-4" />}
                            label="Legends"
                            count={legends.length}
                        />
                        <TabButton
                            active={activeTab === 'current'}
                            onClick={() => handleTabChange('current')}
                            icon={<Users className="w-4 h-4" />}
                            label="Modern Era"
                            count={currentEra.length}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="bg-red-900/30 border border-f1-red text-white p-4 rounded mb-8 font-mono text-sm">
                        ⚠ {error}
                    </div>
                )}

                {/* Driver Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[50vh]">
                    {currentDriversPage.map((driver, i) => (
                        <motion.div
                            key={driver.driverId}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <DriverCard driver={driver} />
                        </motion.div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-4">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 hover:bg-gray-700 transition"
                        >
                            Prev
                        </button>
                        <span className="text-gray-500 font-mono text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 hover:bg-gray-700 transition"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Footer info */}
                <div className="mt-8 flex items-center justify-center gap-4">
                    <div className="h-px flex-1 bg-gray-800"></div>
                    <p className="text-gray-600 font-mono text-xs uppercase tracking-wider">
                        Showing {currentDriversPage.length} of {displayedList.length} drivers
                    </p>
                    <div className="h-px flex-1 bg-gray-800"></div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

function TabButton({ active, onClick, icon, label, count }) {
    return (
        <motion.button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 font-racing text-lg uppercase tracking-wider transition-all border-b-2 ${active
                ? 'bg-f1-red text-white border-f1-red'
                : 'bg-gray-900 text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                }`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
        >
            {icon}
            {label}
            <span className={`text-xs px-2 py-0.5 rounded font-mono ${active ? 'bg-black/30' : 'bg-gray-800'}`}>
                {count}
            </span>
        </motion.button>
    );
}
