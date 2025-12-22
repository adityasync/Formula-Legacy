import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getConstructorsWithStats } from '../services/api';
import TeamCard from '../components/TeamCard';
import SmartLoader from '../components/SmartLoader';
import { ChevronRight, Search, Shuffle, Filter, Trophy, Calendar } from 'lucide-react';

export default function Teams() {
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNationality, setSelectedNationality] = useState('All');
    const [sortBy, setSortBy] = useState('wins'); // name, wins, year

    // Derived state for unique nationalities
    const [nationalities, setNationalities] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await getConstructorsWithStats();
                setTeams(response.data);
                setFilteredTeams(response.data);

                // Extract unique nationalities
                const nats = [...new Set(response.data.map(t => t.nationality))].sort();
                setNationalities(['All', ...nats]);
            } catch (err) {
                setError('Failed to load teams.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    // Filter & Sort Logic
    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        let result = teams.filter(t => {
            const matchesSearch = t.name.toLowerCase().includes(lowerSearch) ||
                t.nationality.toLowerCase().includes(lowerSearch);
            const matchesNat = selectedNationality === 'All' || t.nationality === selectedNationality;
            return matchesSearch && matchesNat;
        });

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'wins') {
                return (b.totalWins || 0) - (a.totalWins || 0);
            } else if (sortBy === 'year') {
                return (a.firstYear || 9999) - (b.firstYear || 9999);
            } else {
                return a.name.localeCompare(b.name);
            }
        });

        setFilteredTeams(result);
    }, [searchTerm, selectedNationality, sortBy, teams]);

    const handleRandomTeam = () => {
        if (teams.length > 0) {
            const random = teams[Math.floor(Math.random() * teams.length)];
            window.location.href = `/teams/${random.constructorId}`;
        }
    };

    if (loading) return <SmartLoader message="Loading constructors..." />;

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Dynamic Background Effects */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                {/* Moving Grid */}
                <div className="absolute inset-0 bg-[url('/assets/grid-bg.svg')] bg-center [mask-image:linear-gradient(to_bottom,transparent,black)] animate-pulse" />
                {/* Decorative Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-f1-red/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
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
                        <span className="text-f1-red">Teams</span>
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
                                    Constructor <span className="text-f1-red">Archive</span>
                                </h1>
                                <p className="text-gray-400 font-mono text-sm mt-2 flex items-center gap-2">
                                    <span className="bg-gray-800 px-2 py-0.5 rounded text-white">{teams.length}</span>
                                    TEAMS IN HISTORY
                                </p>
                            </div>
                        </div>

                        {/* Interactive Controls */}
                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            {/* Random Team Button */}
                            <button
                                onClick={handleRandomTeam}
                                className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-f1-red text-white px-4 py-3 rounded border border-gray-700 hover:border-f1-red transition-all font-racing uppercase tracking-wider text-sm shadow-lg hover:shadow-f1-red/20 group"
                            >
                                <Shuffle size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                                <span>Discover Random</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Search & Filter Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col lg:flex-row gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800/50 backdrop-blur-md"
                    >
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search teams (e.g. Ferrari, British)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-f1-red transition-colors font-mono text-sm uppercase placeholder:normal-case focus:ring-1 focus:ring-f1-red/50"
                            />
                            <div className="absolute left-3 top-3.5 text-gray-500">
                                <Search size={18} />
                            </div>
                        </div>

                        {/* Filters Container */}
                        <div className="flex gap-4">
                            {/* Nationality Filter */}
                            <div className="relative w-full md:w-48">
                                <div className="absolute left-3 top-3.5 text-gray-500 pointer-events-none z-10">
                                    <Filter size={16} />
                                </div>
                                <select
                                    value={selectedNationality}
                                    onChange={(e) => setSelectedNationality(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-f1-red transition-colors font-mono text-xs uppercase appearance-none cursor-pointer hover:bg-gray-800/50"
                                >
                                    {nationalities.map(nat => (
                                        <option key={nat} value={nat}>{nat === 'All' ? 'Nation: All' : nat}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-4 w-2 h-2 border-r border-b border-gray-500 rotate-45 pointer-events-none" />
                            </div>

                            {/* Sort Filter */}
                            <div className="relative w-full md:w-48">
                                <div className="absolute left-3 top-3.5 text-gray-500 pointer-events-none z-10">
                                    {sortBy === 'wins' ? <Trophy size={16} className="text-yellow-500" /> : <Calendar size={16} />}
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-f1-red transition-colors font-mono text-xs uppercase appearance-none cursor-pointer hover:bg-gray-800/50"
                                >
                                    <option value="name">Sort: A-Z</option>
                                    <option value="wins">Most Wins</option>
                                    <option value="year">Oldest First</option>
                                </select>
                                <div className="absolute right-4 top-4 w-2 h-2 border-r border-b border-gray-500 rotate-45 pointer-events-none" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="bg-red-900/30 border border-f1-red text-white p-4 rounded mb-8 font-mono text-sm backdrop-blur-md">
                        ⚠ {error}
                    </div>
                )}

                {/* Teams Grid */}
                {filteredTeams.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 pb-20">
                        <AnimatePresence mode='wait'>
                            {filteredTeams.map((team, i) => (
                                <motion.div
                                    key={team.constructorId}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: i < 12 ? i * 0.05 : 0 }}
                                    layout // layout matches shared layout ids if simple filter
                                >
                                    <TeamCard team={team} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500 font-mono flex flex-col items-center">
                        <Search size={48} className="mb-4 opacity-20" />
                        <p>No teams found matching your criteria.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedNationality('All'); setSortBy('wins'); }}
                            className="mt-4 text-f1-red hover:underline text-sm"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}

                {/* Footer info */}
                <div className="mt-8 flex items-center justify-center gap-4 opacity-50">
                    <div className="h-px flex-1 bg-gray-800"></div>
                    <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em]">
                        Showing {filteredTeams.length} of {teams.length} Constructors
                    </p>
                    <div className="h-px flex-1 bg-gray-800"></div>
                </div>
            </div>
        </div>
    );
}
