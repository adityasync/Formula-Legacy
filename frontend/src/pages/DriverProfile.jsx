import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDriverCareer, getDriverCircuits } from '../services/api';
import { Loader2, ChevronRight, Trophy, Flag, Calendar, MapPin, ArrowLeft, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDriverPhotoOrPlaceholder } from '../utils/driverPhotos';

export default function DriverProfile() {
    const { id } = useParams();
    const [career, setCareer] = useState(null);
    const [circuits, setCircuits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [careerRes, circuitsRes] = await Promise.all([
                    getDriverCareer(id),
                    getDriverCircuits(id)
                ]);
                setCareer(careerRes.data);
                setCircuits(circuitsRes.data);
            } catch (err) {
                console.error('Failed to load driver:', err);
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

    if (!career) return (
        <div className="min-h-screen bg-black p-8 text-white">
            <p>Driver not found</p>
            <Link to="/drivers" className="text-f1-red hover:underline">← Back to Drivers</Link>
        </div>
    );

    const driverPhoto = getDriverPhotoOrPlaceholder(career.forename, career.surname);

    return (
        <div className="min-h-screen bg-black pb-12">
            {/* Hero Header */}
            <div className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link to="/drivers" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-6 text-sm">
                        <ArrowLeft size={16} /> Back to Drivers
                    </Link>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Driver Photo */}
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-f1-red flex-shrink-0">
                            <img
                                src={driverPhoto}
                                alt={`${career.forename} ${career.surname}`}
                                className="w-full h-full object-cover"
                                style={{ imageRendering: 'pixelated' }}
                            />
                        </div>

                        {/* Driver Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-5xl md:text-6xl font-racing text-white uppercase tracking-tight">
                                {career.forename} <span className="text-f1-red">{career.surname}</span>
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-gray-400 font-mono text-sm">
                                <span className="flex items-center gap-1"><MapPin size={14} /> {career.nationality}</span>
                                {career.dob && <span className="flex items-center gap-1"><Calendar size={14} /> {career.dob}</span>}
                                {career.code && <span className="bg-f1-red text-white px-2 py-0.5 text-xs">{career.code}</span>}
                            </div>
                        </div>

                        {/* Career Stats */}
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                            <StatBadge value={career.races} label="Races" />
                            <StatBadge value={career.wins} label="Wins" color="text-yellow-500" />
                            <StatBadge value={career.podiums} label="Podiums" color="text-orange-400" />
                            <StatBadge value={career.poles} label="Poles" color="text-cyan-400" />
                            <StatBadge value={career.fastest_laps} label="Fastest" color="text-purple-400" />
                            <StatBadge value={Math.round(career.total_points || 0)} label="Points" color="text-f1-red" />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-8 overflow-x-auto">
                        {['overview', 'seasons', 'circuits', 'teams'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 font-racing uppercase text-sm ${activeTab === tab
                                        ? 'bg-f1-red text-white'
                                        : 'bg-gray-900 text-gray-400 hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Career Span */}
                        <div className="bg-gray-900 border border-gray-800 p-6">
                            <h2 className="text-xl font-racing text-white mb-4 flex items-center gap-2">
                                <Flag className="text-f1-red" /> Career Overview
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-black rounded">
                                    <div className="text-3xl font-racing text-white">{career.first_year}</div>
                                    <div className="text-gray-500 text-xs font-mono">Debut Year</div>
                                </div>
                                <div className="text-center p-4 bg-black rounded">
                                    <div className="text-3xl font-racing text-white">{career.last_year}</div>
                                    <div className="text-gray-500 text-xs font-mono">Last Season</div>
                                </div>
                                <div className="text-center p-4 bg-black rounded">
                                    <div className="text-3xl font-racing text-white">{career.last_year - career.first_year + 1}</div>
                                    <div className="text-gray-500 text-xs font-mono">Seasons</div>
                                </div>
                                <div className="text-center p-4 bg-black rounded">
                                    <div className="text-3xl font-racing text-white">{career.teams?.length || 0}</div>
                                    <div className="text-gray-500 text-xs font-mono">Teams</div>
                                </div>
                            </div>
                        </div>

                        {/* Best Results */}
                        <div className="bg-gray-900 border border-gray-800 p-6">
                            <h2 className="text-xl font-racing text-white mb-4 flex items-center gap-2">
                                <Trophy className="text-f1-red" /> Best Results
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-700 text-gray-500 font-mono text-xs">
                                            <th className="text-left py-2">Race</th>
                                            <th className="text-center py-2">Year</th>
                                            <th className="text-left py-2">Team</th>
                                            <th className="text-center py-2">Pos</th>
                                            <th className="text-center py-2">Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {career.bestResults?.slice(0, 10).map((r, idx) => (
                                            <tr key={idx} className="border-b border-gray-800">
                                                <td className="py-2 text-white">{r.race}</td>
                                                <td className="py-2 text-center text-gray-400">{r.year}</td>
                                                <td className="py-2 text-gray-400">{r.team}</td>
                                                <td className="py-2 text-center">
                                                    <span className={r.position === 1 ? 'text-yellow-500 font-bold' : r.position <= 3 ? 'text-orange-400' : 'text-white'}>
                                                        P{r.position}
                                                    </span>
                                                </td>
                                                <td className="py-2 text-center text-f1-red">{r.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'seasons' && (
                    <div className="bg-gray-900 border border-gray-800 p-6">
                        <h2 className="text-xl font-racing text-white mb-4 flex items-center gap-2">
                            <Calendar className="text-f1-red" /> Season by Season
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-700 text-gray-500 font-mono text-xs uppercase">
                                        <th className="text-left py-2">Year</th>
                                        <th className="text-left py-2">Team</th>
                                        <th className="text-center py-2">Races</th>
                                        <th className="text-center py-2">Wins</th>
                                        <th className="text-center py-2">Podiums</th>
                                        <th className="text-center py-2">Poles</th>
                                        <th className="text-center py-2">Points</th>
                                        <th className="text-center py-2">WDC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {career.seasons?.map((s, idx) => (
                                        <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                                            <td className="py-2 text-white font-racing">{s.year}</td>
                                            <td className="py-2 text-gray-400">{s.team}</td>
                                            <td className="py-2 text-center text-white">{s.races}</td>
                                            <td className="py-2 text-center text-yellow-500">{s.wins || 0}</td>
                                            <td className="py-2 text-center text-orange-400">{s.podiums || 0}</td>
                                            <td className="py-2 text-center text-cyan-400">{s.poles || 0}</td>
                                            <td className="py-2 text-center text-f1-red font-bold">{s.points}</td>
                                            <td className="py-2 text-center">
                                                {s.championship_position && (
                                                    <span className={s.championship_position === 1 ? 'text-yellow-500 font-bold' : 'text-gray-400'}>
                                                        P{s.championship_position}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'circuits' && (
                    <div className="bg-gray-900 border border-gray-800 p-6">
                        <h2 className="text-xl font-racing text-white mb-4 flex items-center gap-2">
                            <MapPin className="text-f1-red" /> Circuit Performance
                        </h2>
                        <div style={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer>
                                <BarChart data={circuits.slice(0, 15)} layout="vertical" margin={{ left: 120 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis type="number" stroke="#666" />
                                    <YAxis type="category" dataKey="circuit" stroke="#666" tick={{ fill: '#fff', fontSize: 11 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600' }} />
                                    <Bar dataKey="wins" fill="#FFD700" name="Wins" stackId="a" />
                                    <Bar dataKey="podiums" fill="#E10600" name="Podiums" stackId="a" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="overflow-x-auto mt-6">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-700 text-gray-500 font-mono text-xs">
                                        <th className="text-left py-2">Circuit</th>
                                        <th className="text-left py-2">Country</th>
                                        <th className="text-center py-2">Races</th>
                                        <th className="text-center py-2">Avg Finish</th>
                                        <th className="text-center py-2">Wins</th>
                                        <th className="text-center py-2">Podiums</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {circuits.slice(0, 20).map((c, idx) => (
                                        <tr key={idx} className="border-b border-gray-800">
                                            <td className="py-2 text-white">{c.circuit}</td>
                                            <td className="py-2 text-gray-400">{c.country}</td>
                                            <td className="py-2 text-center text-white">{c.races}</td>
                                            <td className="py-2 text-center text-cyan-400">{c.avg_finish}</td>
                                            <td className="py-2 text-center text-yellow-500">{c.wins}</td>
                                            <td className="py-2 text-center text-orange-400">{c.podiums}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'teams' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {career.teams?.map((team, idx) => (
                            <Link
                                key={idx}
                                to={`/teams/${team.constructor_id}`}
                                className="bg-gray-900 border border-gray-800 p-6 hover:border-f1-red transition-colors"
                            >
                                <h3 className="text-xl font-racing text-white mb-2">{team.name}</h3>
                                <p className="text-gray-500 text-sm mb-4">{team.from_year} - {team.to_year}</p>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <div>
                                        <div className="text-white font-racing text-lg">{team.races}</div>
                                        <div className="text-gray-500">Races</div>
                                    </div>
                                    <div>
                                        <div className="text-yellow-500 font-racing text-lg">{team.wins}</div>
                                        <div className="text-gray-500">Wins</div>
                                    </div>
                                    <div>
                                        <div className="text-f1-red font-racing text-lg">{Math.round(team.points)}</div>
                                        <div className="text-gray-500">Points</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatBadge({ value, label, color = 'text-white' }) {
    return (
        <div className="text-center">
            <div className={`text-2xl font-racing ${color}`}>{value || 0}</div>
            <div className="text-gray-500 text-xs font-mono">{label}</div>
        </div>
    );
}
