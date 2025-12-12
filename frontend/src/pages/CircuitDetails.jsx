import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCircuitStats } from '../services/api';
import { Loader2, ChevronRight, Trophy, MapPin, ArrowLeft, Flag, Timer, Calendar } from 'lucide-react';

export default function CircuitDetails() {
    const { id } = useParams();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getCircuitStats(id);
                setStats(res.data);
            } catch (err) {
                console.error('Failed to load circuit:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="animate-spin h-12 w-12 text-f1-red" />
        </div>
    );

    if (!stats) return (
        <div className="min-h-screen bg-black p-8 text-white">
            <p>Circuit not found</p>
            <Link to="/circuits" className="text-f1-red hover:underline">← Back to Circuits</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-black pb-12">
            {/* Header */}
            <div className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link to="/circuits" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-6 text-sm">
                        <ArrowLeft size={16} /> Back to Circuits
                    </Link>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-racing text-white uppercase tracking-tight">
                                {stats.name}
                            </h1>
                            <div className="flex items-center gap-4 mt-2 text-gray-400">
                                <span className="flex items-center gap-1"><MapPin size={16} /> {stats.location}, {stats.country}</span>
                                {stats.url && (
                                    <a href={stats.url} target="_blank" rel="noreferrer" className="text-f1-red hover:underline text-sm">
                                        Wikipedia →
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 text-center">
                            <div className="bg-gray-900 border border-gray-800 px-6 py-3">
                                <div className="text-3xl font-racing text-white">{stats.total_races}</div>
                                <div className="text-xs text-gray-500 font-mono">RACES</div>
                            </div>
                            <div className="bg-gray-900 border border-gray-800 px-6 py-3">
                                <div className="text-3xl font-racing text-cyan-400">{stats.first_race}</div>
                                <div className="text-xs text-gray-500 font-mono">FIRST</div>
                            </div>
                            <div className="bg-gray-900 border border-gray-800 px-6 py-3">
                                <div className="text-3xl font-racing text-f1-red">{stats.last_race}</div>
                                <div className="text-xs text-gray-500 font-mono">LAST</div>
                            </div>
                            <div className="bg-gray-900 border border-gray-800 px-6 py-3">
                                <div className="text-3xl font-racing text-orange-400">{stats.dnfRate || 0}%</div>
                                <div className="text-xs text-gray-500 font-mono">DNF RATE</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Recent Winners */}
                <div className="bg-gray-900 border border-gray-800 p-6">
                    <h2 className="text-xl font-racing text-white mb-4 flex items-center gap-2">
                        <Calendar className="text-f1-red" /> Recent Races
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-700 text-gray-500 font-mono text-xs">
                                    <th className="text-left py-2">Year</th>
                                    <th className="text-left py-2">Race</th>
                                    <th className="text-left py-2">Winner</th>
                                    <th className="text-left py-2">Team</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentRaces?.map((race, idx) => (
                                    <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="py-2 text-white font-racing">{race.year}</td>
                                        <td className="py-2 text-gray-400">{race.name}</td>
                                        <td className="py-2 text-yellow-500">{race.winner}</td>
                                        <td className="py-2 text-gray-400">{race.team}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Winners */}
                    <div className="bg-gray-900 border border-gray-800 p-6">
                        <h2 className="text-xl font-racing text-white mb-4 flex items-center gap-2">
                            <Trophy className="text-f1-red" /> Most Wins (Drivers)
                        </h2>
                        <div className="space-y-2">
                            {stats.topWinners?.map((w, idx) => (
                                <Link
                                    key={idx}
                                    to={`/drivers/${w.driver_id}`}
                                    className="flex items-center justify-between p-3 bg-black hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 h-6 flex items-center justify-center font-racing text-sm ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : idx === 2 ? 'bg-orange-600 text-white' : 'bg-gray-700 text-white'}`}>
                                            {idx + 1}
                                        </span>
                                        <span className="text-white">{w.driver}</span>
                                    </div>
                                    <span className="text-f1-red font-racing text-lg">{w.wins}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Top Constructors */}
                    <div className="bg-gray-900 border border-gray-800 p-6">
                        <h2 className="text-xl font-racing text-white mb-4 flex items-center gap-2">
                            <Flag className="text-f1-red" /> Most Wins (Constructors)
                        </h2>
                        <div className="space-y-2">
                            {stats.topConstructors?.map((c, idx) => (
                                <Link
                                    key={idx}
                                    to={`/teams/${c.constructor_id}`}
                                    className="flex items-center justify-between p-3 bg-black hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 h-6 flex items-center justify-center font-racing text-sm ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : idx === 2 ? 'bg-orange-600 text-white' : 'bg-gray-700 text-white'}`}>
                                            {idx + 1}
                                        </span>
                                        <span className="text-white">{c.constructor}</span>
                                    </div>
                                    <span className="text-f1-red font-racing text-lg">{c.wins}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fastest Laps */}
                <div className="bg-gray-900 border border-gray-800 p-6">
                    <h2 className="text-xl font-racing text-white mb-4 flex items-center gap-2">
                        <Timer className="text-f1-red" /> Fastest Laps (All Time)
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-700 text-gray-500 font-mono text-xs">
                                    <th className="text-left py-2">Driver</th>
                                    <th className="text-left py-2">Year</th>
                                    <th className="text-left py-2">Lap Time</th>
                                    <th className="text-left py-2">Speed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.fastestLaps?.map((lap, idx) => (
                                    <tr key={idx} className="border-b border-gray-800">
                                        <td className="py-2 text-white">{lap.driver}</td>
                                        <td className="py-2 text-gray-400">{lap.year}</td>
                                        <td className="py-2 text-purple-400 font-mono">{lap.fastest_lap_time}</td>
                                        <td className="py-2 text-cyan-400 font-mono">{lap.fastest_lap_speed} km/h</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
