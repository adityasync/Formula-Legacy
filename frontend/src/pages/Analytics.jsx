import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    getDNFCauses, getPitStopEfficiency, getPoleToWin, getGridPerformance,
    getQualifyingProgression, getFastestLaps, getTeammateBattles, getPointsEfficiency,
    getChampionshipBattle, getConstructorTrends, getConstructorChampionship, getCircuitReliability
} from '../services/api';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Legend, LineChart, Line, ScatterChart, Scatter, ZAxis, Area, AreaChart
} from 'recharts';
import Footer from '../components/Footer';
import { Loader2, TrendingUp, ChevronRight, Trophy, Timer, Zap, Target, Users, Flag, Swords, AlertCircle } from 'lucide-react';
import HeadToHead from './HeadToHead';

const COLORS = ['#E10600', '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9D4EDD', '#F72585', '#4CC9F0'];

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(2023);
    const [activeTab, setActiveTab] = useState('head-to-head');

    // Data states
    const [poleToWin, setPoleToWin] = useState([]);
    const [gridPerf, setGridPerf] = useState([]);
    const [qualiProg, setQualiProg] = useState([]);
    const [fastestLaps, setFastestLaps] = useState([]);
    const [teammateBattles, setTeammateBattles] = useState([]);
    const [pointsEff, setPointsEff] = useState([]);
    const [dnfData, setDnfData] = useState([]);
    const [pitStops, setPitStops] = useState([]);
    const [championshipData, setChampionshipData] = useState([]);
    const [constructorTrends, setConstructorTrends] = useState([]);
    const [winDistribution, setWinDistribution] = useState([]);
    const [constructorChampData, setConstructorChampData] = useState([]);
    const [gapToLeaderData, setGapToLeaderData] = useState([]);
    const [circuitReliability, setCircuitReliability] = useState([]);

    useEffect(() => {
        loadData();
    }, [selectedSeason]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [
                poleRes, gridRes, qualiRes, flRes, tmRes, peRes, dnfRes, pitRes, champRes, constTrendsRes, constChampRes, circuitRelRes
            ] = await Promise.all([
                getPoleToWin(),
                getGridPerformance(selectedSeason),
                getQualifyingProgression(selectedSeason),
                getFastestLaps(selectedSeason),
                getTeammateBattles(selectedSeason),
                getPointsEfficiency(selectedSeason),
                getDNFCauses(),
                getPitStopEfficiency(selectedSeason),
                getChampionshipBattle(selectedSeason),
                getConstructorTrends(),
                getConstructorChampionship(selectedSeason),
                getCircuitReliability()
            ]);

            setPoleToWin(poleRes.data);
            setGridPerf(gridRes.data);
            setQualiProg(qualiRes.data);
            setFastestLaps(flRes.data);
            setTeammateBattles(tmRes.data);
            setPointsEff(peRes.data);
            setDnfData(dnfRes.data.slice(0, 10));
            setPitStops(pitRes.data);

            // Process championship data for line chart
            const champByDriver = {};
            champRes.data.forEach(row => {
                if (!champByDriver[row.driver]) champByDriver[row.driver] = [];
                champByDriver[row.driver].push({ round: row.round, points: row.points, race: row.race, wins: row.wins });
            });
            const topDrivers = Object.entries(champByDriver)
                .sort((a, b) => (b[1][b[1].length - 1]?.points || 0) - (a[1][a[1].length - 1]?.points || 0))
                .slice(0, 5);
            setChampionshipData(topDrivers);

            // Calculate Win Distribution
            const wins = Object.entries(champByDriver)
                .map(([driver, data]) => ({
                    driver,
                    value: data[data.length - 1]?.wins || 0
                }))
                .filter(d => d.value > 0)
                .sort((a, b) => b.value - a.value);
            setWinDistribution(wins);

            // Process Constructor Trends
            // Recharts need: [{year: 2014, Mercedes: 701, RedBull: 405...}, ...]
            const trendsByYear = {};
            constTrendsRes.data.forEach(row => {
                if (!trendsByYear[row.year]) trendsByYear[row.year] = { year: row.year };
                trendsByYear[row.year][row.constructor] = row.points;
            });
            setConstructorTrends(Object.values(trendsByYear).sort((a, b) => a.year - b.year));

            // Process Constructor Championship (Backend)
            const constChampMap = {};
            constChampRes.data.forEach(row => {
                if (!constChampMap[row.constructor]) constChampMap[row.constructor] = [];
                constChampMap[row.constructor].push({ round: row.round, points: row.points, race: row.race });
            });
            const topConstructors = Object.entries(constChampMap)
                .sort((a, b) => (b[1][b[1].length - 1]?.points || 0) - (a[1][a[1].length - 1]?.points || 0))
                .slice(0, 5);
            setConstructorChampData(topConstructors);

            // Circuit Reliability
            setCircuitReliability(circuitRelRes.data.slice(0, 15)); // Top 15 worst tracks

            // Calculate Gap to Leader (Championship Tab)
            if (topDrivers.length > 0) {
                const leaderData = topDrivers[0][1]; // Assuming sorted by points
                const gapData = [];

                // Iterate through rounds
                leaderData.forEach(r => {
                    const roundGap = { round: r.round };
                    topDrivers.forEach(([driver, dData]) => {
                        const driverRound = dData.find(d => d.round === r.round);
                        if (driverRound) {
                            roundGap[driver] = leaderData.find(l => l.round === r.round)?.points - driverRound.points;
                        }
                    });
                    gapData.push(roundGap);
                });
                setGapToLeaderData(gapData);
            }

            console.log('Analytics data loaded');

        } catch (err) {
            console.error('Failed to load analytics:', err);
            setError(err.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="animate-spin h-12 w-12 text-f1-red mx-auto mb-4" />
                <p className="text-gray-500 font-mono text-sm">Loading F1 analytics...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <p className="text-red-500 font-mono text-sm mb-4">Error: {error}</p>
                <button onClick={loadData} className="bg-f1-red text-white px-4 py-2 font-racing">Retry</button>
            </div>
        </div>
    );

    const tabs = [
        { id: 'head-to-head', label: 'Head-to-Head', icon: <Swords className="w-4 h-4" /> },
        { id: 'qualifying', label: 'Qualifying', icon: <Timer className="w-4 h-4" /> },
        { id: 'race', label: 'Race Pace', icon: <Zap className="w-4 h-4" /> },
        { id: 'championship', label: 'Championship', icon: <Trophy className="w-4 h-4" /> },
        { id: 'teams', label: 'Teams', icon: <Users className="w-4 h-4" /> },
        { id: 'reliability', label: 'Reliability', icon: <Target className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <div className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-mono mb-4">
                        <span>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-f1-red">Analytics</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-16 bg-f1-red"></div>
                            <div>
                                <h1 className="text-4xl md:text-5xl text-white font-racing tracking-tight uppercase">
                                    F1 <span className="text-f1-red">Technical Analytics</span>
                                </h1>
                                <p className="text-gray-500 font-mono text-sm mt-2">Deep dive into performance data</p>
                            </div>
                        </div>

                        {/* Season Selector - Hidden for Head-to-Head (Career Stats) */}
                        {activeTab !== 'head-to-head' && (
                            <div className="flex items-center gap-3 bg-gray-900 px-4 py-2 border border-gray-700">
                                <Flag className="w-5 h-5 text-f1-red" />
                                <span className="text-gray-400 font-mono text-sm">SEASON</span>
                                <select
                                    value={selectedSeason}
                                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                                    className="bg-black text-white border-none font-racing text-2xl focus:outline-none cursor-pointer"
                                >
                                    {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 font-racing uppercase tracking-wider text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'bg-f1-red text-white'
                                    : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-700'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'head-to-head' && (
                    <HeadToHead />
                )}

                {activeTab === 'qualifying' && (
                    <div className="space-y-8">
                        {/* Qualifying Progression */}
                        <AnalyticsCard title="Qualifying Performance" icon={<Timer />} subtitle={`${selectedSeason} Season`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-700 text-gray-500 font-mono text-xs uppercase">
                                            <th className="text-left py-3 px-2">Driver</th>
                                            <th className="text-left py-3 px-2">Team</th>
                                            <th className="text-center py-3 px-2">Sessions</th>
                                            <th className="text-center py-3 px-2">Made Q2</th>
                                            <th className="text-center py-3 px-2">Made Q3</th>
                                            <th className="text-center py-3 px-2">Q3 Rate</th>
                                            <th className="text-center py-3 px-2">Poles</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {qualiProg.slice(0, 15).map((row, idx) => (
                                            <tr key={idx} className="border-b border-gray-800 hover:bg-gray-900">
                                                <td className="py-3 px-2 text-white font-racing">{row.driver}</td>
                                                <td className="py-3 px-2 text-gray-400 font-mono text-xs">{row.team}</td>
                                                <td className="py-3 px-2 text-center text-white">{row.sessions}</td>
                                                <td className="py-3 px-2 text-center text-white">{row.made_q2}</td>
                                                <td className="py-3 px-2 text-center text-white">{row.made_q3}</td>
                                                <td className="py-3 px-2 text-center">
                                                    <span className="text-f1-red font-bold">{row.q3_rate}%</span>
                                                </td>
                                                <td className="py-3 px-2 text-center text-yellow-500 font-bold">{row.poles}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </AnalyticsCard>

                        <AnalyticsCard title="Pole Position to Win Conversion" icon={<Trophy />} subtitle="All-time (min 5 poles)">
                            <div className="w-full h-[300px] md:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={poleToWin.slice(0, 15)} layout="vertical" margin={{ left: 120 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis type="number" stroke="#666" tickFormatter={v => `${v}%`} domain={[0, 100]} />
                                        <YAxis type="category" dataKey="driver" stroke="#666" tick={{ fill: '#fff', fontSize: 11 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600' }}
                                            formatter={(v, name) => [name === 'conversion_rate' ? `${v}%` : v, name === 'conversion_rate' ? 'Win Rate' : name === 'poles' ? 'Poles' : 'Wins']}
                                        />
                                        <Bar dataKey="conversion_rate" fill="#E10600" name="Win Rate %" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </AnalyticsCard>

                        {/* Teammate Battles */}
                        <AnalyticsCard title="Qualifying Head-to-Head" icon={<Users />} subtitle={`${selectedSeason} Teammate Battles`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {teammateBattles.map((battle, idx) => (
                                    <div key={idx} className="bg-gray-900 p-4 border border-gray-800">
                                        <div className="text-f1-red font-mono text-xs mb-2">{battle.team}</div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-center flex-1">
                                                <div className="text-white font-racing text-lg">{battle.driver1?.split(' ').pop()}</div>
                                                <div className="text-2xl font-racing text-green-500">{battle.driver1_wins}</div>
                                            </div>
                                            <div className="text-gray-600 font-mono text-sm px-4">vs</div>
                                            <div className="text-center flex-1">
                                                <div className="text-white font-racing text-lg">{battle.driver2?.split(' ').pop()}</div>
                                                <div className="text-2xl font-racing text-orange-500">{battle.driver2_wins}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnalyticsCard>
                    </div>
                )}

                {activeTab === 'race' && (
                    <div className="space-y-8">
                        {/* Grid Performance */}
                        <AnalyticsCard title="Overtaking Performance" icon={<Zap />} subtitle={`${selectedSeason} - Positions Gained/Lost`}>
                            <div className="w-full h-[300px] md:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={gridPerf.slice(0, 15)} layout="vertical" margin={{ left: 120 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis type="number" stroke="#666" />
                                        <YAxis type="category" dataKey="driver" stroke="#666" tick={{ fill: '#fff', fontSize: 11 }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600' }} />
                                        <Bar dataKey="avg_positions_gained" fill="#4CC9F0" name="Avg Positions Gained" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </AnalyticsCard>

                        {/* Points Efficiency */}
                        <AnalyticsCard title="Points Efficiency" icon={<Target />} subtitle={`${selectedSeason} - Points Per Race`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-700 text-gray-500 font-mono text-xs uppercase">
                                            <th className="text-left py-3 px-2">Driver</th>
                                            <th className="text-left py-3 px-2">Team</th>
                                            <th className="text-center py-3 px-2">Races</th>
                                            <th className="text-center py-3 px-2">Points</th>
                                            <th className="text-center py-3 px-2">Pts/Race</th>
                                            <th className="text-center py-3 px-2">Points Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pointsEff.slice(0, 15).map((row, idx) => (
                                            <tr key={idx} className="border-b border-gray-800 hover:bg-gray-900">
                                                <td className="py-3 px-2 text-white font-racing">{row.driver}</td>
                                                <td className="py-3 px-2 text-gray-400 font-mono text-xs">{row.team}</td>
                                                <td className="py-3 px-2 text-center text-white">{row.races}</td>
                                                <td className="py-3 px-2 text-center text-white">{row.total_points}</td>
                                                <td className="py-3 px-2 text-center text-f1-red font-bold">{row.points_per_race}</td>
                                                <td className="py-3 px-2 text-center text-green-500">{row.points_rate}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </AnalyticsCard>

                        {/* Fastest Laps */}
                        <AnalyticsCard title="Fastest Lap Kings" icon={<Timer />} subtitle={`${selectedSeason} Season`}>
                            <div className="w-full h-[250px] md:h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={fastestLaps}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="driver" stroke="#666" tick={{ fill: '#fff', fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                                        <YAxis stroke="#666" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600' }} />
                                        <Bar dataKey="fastest_laps" fill="#9D4EDD" name="Fastest Laps" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </AnalyticsCard>
                    </div>
                )}

                {activeTab === 'championship' && (
                    <div className="space-y-8">
                        {/* Championship Battle Line Chart */}
                        <AnalyticsCard title="Championship Battle" icon={<Trophy />} subtitle={`${selectedSeason} Points Progression`}>
                            <div className="w-full h-[300px] md:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart margin={{ left: 20, right: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis
                                            dataKey="round"
                                            type="number"
                                            domain={[1, 'dataMax']}
                                            stroke="#666"
                                            tick={{ fill: '#fff' }}
                                            label={{ value: 'Round', position: 'bottom', fill: '#666' }}
                                        />
                                        <YAxis stroke="#666" tick={{ fill: '#fff' }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600' }} />
                                        <Legend />
                                        {championshipData.map(([driver, data], idx) => (
                                            <Line
                                                key={driver}
                                                data={data}
                                                type="monotone"
                                                dataKey="points"
                                                name={driver}
                                                stroke={COLORS[idx % COLORS.length]}
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </AnalyticsCard>

                        {/* Gap to Leader */}
                        <AnalyticsCard title="Gap to Leader" icon={<TrendingUp />} subtitle={`${selectedSeason} Points Deficit`}>
                            <div className="w-full h-[300px] md:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={gapToLeaderData} margin={{ left: 20, right: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="round" stroke="#666" tick={{ fill: '#fff' }} />
                                        <YAxis stroke="#666" tick={{ fill: '#fff' }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600' }} />
                                        <Legend />
                                        {championshipData.slice(1).map(([driver], idx) => (
                                            <Area
                                                key={driver}
                                                type="monotone"
                                                dataKey={driver}
                                                stackId="1"
                                                stroke={COLORS[(idx + 1) % COLORS.length]}
                                                fill={COLORS[(idx + 1) % COLORS.length]}
                                                fillOpacity={0.6}
                                            />
                                        ))}
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </AnalyticsCard>
                    </div>
                )}

                {activeTab === 'teams' && (
                    <div className="space-y-8">
                        {/* Pit Stop Performance */}
                        <AnalyticsCard title="Pit Stop Performance" icon={<Timer />} subtitle={`${selectedSeason} Average Times`}>
                            <div className="w-full h-[300px] md:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={pitStops.slice(0, 15)} layout="vertical" margin={{ left: 100 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis type="number" stroke="#666" tickFormatter={v => `${v.toFixed(1)}s`} />
                                        <YAxis type="category" dataKey="driver" stroke="#666" tick={{ fill: '#fff', fontSize: 11 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600' }}
                                            formatter={v => [`${v.toFixed(3)}s`, 'Avg Pit Time']}
                                        />
                                        <Bar dataKey="avgPitSec" fill="#E10600" name="Avg Pit Time" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </AnalyticsCard>

                        {/* Constructor Championship Battle (Live Season) */}
                        <AnalyticsCard title="Constructors Championship" icon={<Trophy />} subtitle={`${selectedSeason} Battle`}>
                            <div className="w-full h-[300px] md:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart margin={{ left: 20, right: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="round" type="number" domain={[1, 'dataMax']} stroke="#666" tick={{ fill: '#fff' }} />
                                        <YAxis stroke="#666" tick={{ fill: '#fff' }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600' }} />
                                        <Legend />
                                        {constructorChampData.map(([team, data], idx) => (
                                            <Line
                                                key={team}
                                                data={data}
                                                type="monotone"
                                                dataKey="points"
                                                name={team}
                                                stroke={COLORS[idx % COLORS.length]}
                                                strokeWidth={3}
                                                dot={false}
                                            />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </AnalyticsCard>

                        {/* Teammate Battles (Moved to Teams) */}
                        <AnalyticsCard title="Teammate Head-to-Head" icon={<Users />} subtitle={`${selectedSeason} Comparison`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {teammateBattles.map((battle, idx) => (
                                    <div key={idx} className="bg-gray-900 p-4 border border-gray-800">
                                        <div className="text-f1-red font-mono text-xs mb-2">{battle.team}</div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-center flex-1">
                                                <div className="text-white font-racing text-lg">{battle.driver1?.split(' ').pop()}</div>
                                                <div className="text-2xl font-racing text-green-500">{battle.driver1_wins}</div>
                                            </div>
                                            <div className="text-gray-600 font-mono text-sm px-4">vs</div>
                                            <div className="text-center flex-1">
                                                <div className="text-white font-racing text-lg">{battle.driver2?.split(' ').pop()}</div>
                                                <div className="text-2xl font-racing text-orange-500">{battle.driver2_wins}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnalyticsCard>

                        {/* Constructor Trends (Moved to Teams) */}
                        <AnalyticsCard title="Team Dominance History" icon={<TrendingUp />} subtitle="Points Trends (2014-Present)">
                            <div className="w-full h-[300px] md:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={constructorTrends} margin={{ left: 0, right: 0 }}>
                                        <defs>
                                            <linearGradient id="colorM" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00D2BE" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#00D2BE" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorRB" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0600EF" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#0600EF" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorF" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#DC0000" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#DC0000" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="year" stroke="#666" tick={{ fill: '#fff' }} />
                                        <YAxis stroke="#666" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600' }} />
                                        <Legend />
                                        <Area type="monotone" dataKey="Mercedes" stackId="1" stroke="#00D2BE" fill="url(#colorM)" />
                                        <Area type="monotone" dataKey="Red Bull" stackId="1" stroke="#0600EF" fill="url(#colorRB)" />
                                        <Area type="monotone" dataKey="Ferrari" stackId="1" stroke="#DC0000" fill="url(#colorF)" />
                                        <Area type="monotone" dataKey="McLaren" stackId="1" stroke="#FF8700" fill="#FF8700" fillOpacity={0.3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </AnalyticsCard>
                    </div>
                )}

                {activeTab === 'reliability' && (
                    <div className="space-y-8">
                        {/* DNF Causes */}
                        <AnalyticsCard title="DNF Causes Breakdown" icon={<Target />} subtitle="All-time Analysis">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="w-full h-[250px] md:h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={dnfData}
                                                dataKey="count"
                                                nameKey="status"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                            >
                                                {dnfData.map((_, idx) => (
                                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div>
                                    <table className="w-full text-sm">
                                        <tbody>
                                            {dnfData.map((item, idx) => (
                                                <tr key={idx} className="border-b border-gray-800">
                                                    <td className="py-2 flex items-center gap-2">
                                                        <span className="w-3 h-3" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                                                        <span className="text-white">{item.status}</span>
                                                    </td>
                                                    <td className="py-2 text-right text-white font-mono">{item.count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </AnalyticsCard>

                        {/* Circuit Risk Analysis */}
                        <AnalyticsCard title="High Risk Circuits" icon={<AlertCircle />} subtitle="Highest DNF Rates (>50 races)">
                            <div className="w-full h-[300px] md:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={circuitReliability} layout="vertical" margin={{ left: 120 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis type="number" stroke="#666" tickFormatter={v => `${v}%`} />
                                        <YAxis type="category" dataKey="circuit" stroke="#666" tick={{ fill: '#fff', fontSize: 11 }} width={120} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600' }}
                                            formatter={v => [`${v}%`, 'DNF Rate']}
                                        />
                                        <Bar dataKey="dnf_rate" fill="#FFD93D" name="DNF Rate" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </AnalyticsCard>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

function AnalyticsCard({ title, icon, subtitle, children }) {
    return (
        <section className="bg-gray-900 border border-gray-800">
            <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                <div className="w-1 h-8 bg-f1-red"></div>
                <span className="text-f1-red">{icon}</span>
                <div>
                    <h2 className="text-xl font-racing text-white uppercase">{title}</h2>
                    {subtitle && <p className="text-gray-500 font-mono text-xs">{subtitle}</p>}
                </div>
            </div>
            <div className="p-4">
                {children}
            </div>
        </section>
    );
}
