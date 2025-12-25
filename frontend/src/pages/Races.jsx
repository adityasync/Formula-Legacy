import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRaces } from '../services/api';
import RaceCard from '../components/RaceCard';
import SmartLoader from '../components/SmartLoader';
import { Calendar, MapPin, ChevronRight, Flag, Timer, Search, Trophy } from 'lucide-react';

/**
 * Races Page - High Octane Edition
 * Displays the race calendar with a premium grid layout and hero section.
 */
export default function Races() {
    const [races, setRaces] = useState([]);
    const [filteredRaces, setFilteredRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(2023);
    const [searchTerm, setSearchTerm] = useState('');

    // Future: Fetch dynamic years from backend
    const years = Array.from({ length: 75 }, (_, i) => 2024 - i);

    useEffect(() => {
        const fetchRaces = async () => {
            setLoading(true);
            try {
                const response = await getRaces(selectedYear);
                setRaces(response.data);
                setFilteredRaces(response.data);
            } catch (err) {
                setError('Failed to load races.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRaces();
    }, [selectedYear]);

    // Search Filter Logic
    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = races.filter(race => {
            return race.name.toLowerCase().includes(lowerSearch) ||
                (race.circuit?.name || '').toLowerCase().includes(lowerSearch) ||
                (race.circuit?.country || '').toLowerCase().includes(lowerSearch);
        });
        setFilteredRaces(filtered);
    }, [searchTerm, races]);

    if (loading) return <SmartLoader message={`Loading ${selectedYear} Season...`} />;

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Dynamic Background Effects */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/assets/grid-bg.svg')] bg-center [mask-image:linear-gradient(to_bottom,transparent,black)] animate-pulse" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-f1-red/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            {/* Header Content */}
            <div className="relative z-10 bg-gradient-to-b from-gray-900/90 to-black/80 backdrop-blur-sm border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Breadcrumb */}
                    <motion.div
                        className="flex items-center gap-2 text-gray-500 text-sm font-mono mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-f1-red">Races</span>
                    </motion.div>

                    {/* Title Area */}
                    <motion.div
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-16 bg-f1-red shadow-[0_0_15px_rgba(225,6,0,0.5)]"></div>
                            <div>
                                <h1 className="text-5xl md:text-6xl text-white font-racing tracking-tight uppercase drop-shadow-lg">
                                    Race <span className="text-f1-red">Calendar</span>
                                </h1>
                                <p className="text-gray-400 font-mono text-sm mt-2 flex items-center gap-2">
                                    <span className="bg-gray-800 px-2 py-0.5 rounded text-white">{filteredRaces.length}</span>
                                    ROUNDS CONFIRMED
                                </p>
                            </div>
                        </div>

                        {/* Season Selector */}
                        <div className="flex items-center gap-3 bg-gray-900 px-4 py-2 border border-gray-700 rounded hover:border-f1-red transition-colors shadow-lg">
                            <Timer className="w-5 h-5 text-f1-red" />
                            <span className="text-gray-400 font-mono text-sm">SEASON</span>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="bg-transparent text-white border-none font-racing text-2xl focus:outline-none cursor-pointer appearance-none pl-2"
                                style={{
                                    backgroundImage: "none" // Remove default arrow
                                }}
                            >
                                {years.map(year => (
                                    <option key={year} value={year} className="bg-black">{year}</option>
                                ))}
                            </select>
                        </div>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative max-w-md"
                    >
                        <input
                            type="text"
                            placeholder="Search Grand Prix..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/50 border border-gray-700 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-f1-red transition-colors font-mono text-sm uppercase placeholder:normal-case focus:ring-1 focus:ring-f1-red/50"
                        />
                        <div className="absolute left-3 top-3.5 text-gray-500">
                            <Search size={18} />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
                {error && (
                    <div className="bg-red-900/30 border border-f1-red text-white p-4 rounded mb-8 font-mono text-sm backdrop-blur-md">
                        ⚠ {error}
                    </div>
                )}

                {filteredRaces.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredRaces.map((race, i) => (
                                <motion.div
                                    key={race.raceId}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i < 8 ? i * 0.05 : 0 }}
                                    className="h-[280px] relative" // Fixed height for consistent grid
                                >
                                    <RaceCard race={race} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-20 flex flex-col items-center opacity-50">
                        <Flag className="w-16 h-16 text-gray-600 mb-4" />
                        <h3 className="text-xl text-white font-racing">No Races Found</h3>
                        <p className="text-gray-500 font-mono mt-2">Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
