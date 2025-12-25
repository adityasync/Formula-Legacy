import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRace, getRaceResults, getRaceLapTimes, getRacePitStops, getRaceQualifying } from '../services/api';
import SmartLoader from '../components/SmartLoader';
import { ChevronLeft, Flag, Timer, TrendingUp, History, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getTeamColor } from '../utils/teamColors';

export default function RaceDetails() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [race, setRace] = useState(null);
    const [results, setResults] = useState([]);
    const [lapTimes, setLapTimes] = useState([]);
    const [pitStops, setPitStops] = useState([]);
    const [qualifying, setQualifying] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all data in parallel
                const [raceRes, resultsRes, lapsRes, pitsRes, qualiRes] = await Promise.all([
                    getRace(id),
                    getRaceResults(id),
                    getRaceLapTimes(id),
                    getRacePitStops(id),
                    getRaceQualifying(id)
                ]);

                setRace(raceRes.data);
                setResults(resultsRes.data);
                setLapTimes(lapsRes.data);
                setPitStops(pitsRes.data);
                setQualifying(qualiRes.data);
            } catch (error) {
                console.error("Failed to load race data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <SmartLoader message="Analyzing Race Strategy..." />;
    if (!race) return <div className="text-white text-center py-20">Race not found</div>;

    // --- Logic: Race Winner ---
    const winner = results.find(r => r.position === 1);

    // --- Logic: Lap Chart Data & Colors ---
    const lapChartData = [];
    if (lapTimes.length > 0) {
        // Group lap times by lap number
        const lapsMap = {};
        lapTimes.forEach(lt => {
            if (!lapsMap[lt.id.lap]) lapsMap[lt.id.lap] = { lap: lt.id.lap };
            // Use driver surname as the data key
            lapsMap[lt.id.lap][lt.driver.surname] = lt.position;
        });
        // Convert map to array for Recharts
        for (const lap in lapsMap) {
            lapChartData.push(lapsMap[lap]);
        }
    }

    // Determine Top 10 Drivers to show on chart (to avoid overcrowding)
    // We prefer using final Race Results for this, falling back to Qualifying if results aren't ready
    const driverDataSource = results.length > 0 ? results : qualifying;

    // Sort drivers by position (handle nulls if any)
    const sortedDrivers = [...driverDataSource].sort((a, b) => {
        const posA = a.position || 999;
        const posB = b.position || 999;
        return posA - posB;
    });

    const topDrivers = [];
    const driverColors = {};

    sortedDrivers.slice(0, 10).forEach(entry => {
        const surname = entry.driver.surname;
        topDrivers.push(surname);

        // Map driver to team color using constructorRef
        if (entry.constructor && entry.constructor.constructorRef) {
            driverColors[surname] = getTeamColor(entry.constructor.constructorRef);
        } else {
            driverColors[surname] = '#FFFFFF'; // Fallback white
        }
    });

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* --- Header Section --- */}
            <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-black border-b border-gray-800 pt-8 pb-12 px-4 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/assets/grid-bg.svg')] opacity-10 pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <Link to="/races" className="inline-flex items-center text-gray-400 hover:text-f1-red transition-colors mb-6 text-sm font-mono uppercase tracking-widest">
                        <ChevronLeft size={16} className="mr-1" />
                        Back to Calendar
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-racing uppercase tracking-tighter mb-2">
                                <span className="text-f1-red inline-block mr-3">R{race.round}</span>
                                {race.name}
                            </h1>
                            <div className="flex items-center gap-4 text-gray-400 font-mono text-sm">
                                <span className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-f1-red rounded-full" /> {race.date}
                                </span>
                                <span className="flex items-center gap-2">
                                    <MapPin size={14} /> {race.circuit.name}
                                </span>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex bg-gray-800/50 p-1 rounded-lg backdrop-blur-sm border border-white/5">
                            <button onClick={() => setActiveTab('overview')}
                                className={`px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'overview' ? 'bg-f1-red text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                                Overview
                            </button>
                            <button onClick={() => setActiveTab('laps')}
                                className={`px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'laps' ? 'bg-f1-red text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                                Lap Chart
                            </button>
                            <button onClick={() => setActiveTab('pits')}
                                className={`px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'pits' ? 'bg-f1-red text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                                Pit Strategy
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="max-w-7xl mx-auto px-4 mt-8">

                {/* Tab: Overview (Winner + Qualifying + Stats) */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Left: Qualifying Results List */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#111] border border-white/10 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold font-racing flex items-center gap-2">
                                    <Flag className="text-f1-red" /> Qualifying
                                </h3>
                            </div>
                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {qualifying.map((q, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded hover:bg-white/10 transition-colors border-l-2 border-transparent hover:border-f1-red">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-gray-500 w-6 text-right font-bold">{q.position}</span>
                                            <span className="text-white font-bold">{q.driver.surname}</span>
                                            <span className="text-xs text-gray-400 hidden sm:inline">{q.constructor.name}</span>
                                        </div>
                                        <span className="font-mono text-f1-red text-sm">{q.q3 || q.q2 || q.q1}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right: Winner & Stats */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">

                            {/* Winner Card */}
                            <div className="bg-gradient-to-br from-f1-red to-red-900 rounded-xl p-6 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('/assets/checker-pattern.png')] opacity-10 mix-blend-overlay group-hover:opacity-20 transition-opacity"></div>
                                <h3 className="text-lg font-bold uppercase tracking-widest opacity-80 mb-2">Race Winner</h3>

                                <div className="relative z-10 mt-4">
                                    <div className="text-5xl font-racing mb-1">
                                        {winner ? winner.driver.surname : 'TBD'}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-xl font-bold opacity-90">
                                            {winner ? winner.constructor.name : 'UnknownTeam'}
                                        </div>
                                        {winner && <div className="text-lg font-mono opacity-80">{winner.time}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Circuit Information */}
                            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                                <h3 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4">Circuit Info</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-lg">
                                        <div className="text-lg font-mono text-white truncate mb-1">{race.circuit.location || 'N/A'}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Location</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-lg">
                                        <div className="text-lg font-mono text-white mb-1">{race.circuit.alt ? `${race.circuit.alt}m` : 'N/A'}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Altitude</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Tab: Lap Chart */}
                {activeTab === 'laps' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] border border-white/10 rounded-xl p-6 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-racing flex items-center gap-2">
                                <TrendingUp className="text-f1-red" /> Race Pace & Position
                            </h3>
                            <span className="text-xs text-gray-500 font-mono bg-gray-900 px-3 py-1 rounded-full border border-gray-700">
                                Top 10 Drivers
                            </span>
                        </div>

                        <div className="h-[500px] w-full">
                            {lapTimes.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lapChartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis
                                            dataKey="lap"
                                            stroke="#666"
                                            label={{ value: 'Lap Number', position: 'insideBottom', offset: -5, fill: '#666' }}
                                            tick={{ fill: '#666' }}
                                        />
                                        <YAxis
                                            reversed
                                            stroke="#666"
                                            domain={[1, 20]}
                                            tick={{ fill: '#666' }}
                                            label={{ value: 'Position', angle: -90, position: 'insideLeft', fill: '#666' }}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                            itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                                            labelStyle={{ color: '#888', marginBottom: '5px' }}
                                        />
                                        <Legend verticalAlign="top" height={36} iconType="circle" />

                                        {topDrivers.map((driver) => (
                                            <Line
                                                key={driver}
                                                type="monotone"
                                                dataKey={driver}
                                                stroke={driverColors[driver] || '#FFFFFF'}
                                                strokeWidth={3}
                                                dot={false}
                                                activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                                                connectNulls
                                            />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 font-mono opacity-50">
                                    <TrendingUp size={48} className="mb-4 text-gray-700" />
                                    <div>No lap data available for this race.</div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Tab: Pit Stops */}
                {activeTab === 'pits' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] border border-white/10 rounded-xl p-6">
                        <h3 className="text-xl font-bold font-racing mb-6 flex items-center gap-2">
                            <Timer className="text-f1-red" /> Pit Stop Strategy
                        </h3>
                        {pitStops.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-white/5 text-gray-200 uppercase font-bold font-mono text-xs">
                                        <tr>
                                            <th className="px-4 py-3 rounded-tl-lg">Driver</th>
                                            <th className="px-4 py-3">Stop #</th>
                                            <th className="px-4 py-3">Lap</th>
                                            <th className="px-4 py-3">Time</th>
                                            <th className="px-4 py-3 rounded-tr-lg">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {pitStops.map((stop, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-4 py-3 font-medium text-white group-hover:text-f1-red transition-colors">
                                                    {stop.driver.surname}
                                                </td>
                                                <td className="px-4 py-3 font-mono">{stop.stop}</td>
                                                <td className="px-4 py-3 text-white font-bold">{stop.lap}</td>
                                                <td className="px-4 py-3 font-mono text-gray-500">{stop.time}</td>
                                                <td className="px-4 py-3 font-mono text-white flex items-center gap-3">
                                                    <div className="w-24 bg-gray-800 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="bg-f1-red h-full transition-all duration-500"
                                                            style={{ width: `${Math.min((stop.milliseconds / 25000) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                    {stop.duration}s
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-500 flex flex-col items-center opacity-50">
                                <Timer size={48} className="mb-4 text-gray-700" />
                                <div>No pit stop data available.</div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
