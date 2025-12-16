import { Trophy, Flag, Calendar, Medal, Percent, Activity, ArrowRight, Timer, Zap, PieChart as PieChartIcon, Globe, AlertTriangle, Grid } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function TeamOverview({ team, driverStats, seasons, dashboardStats, statusStats, geoStats, heatmapStats, setActiveTab }) {
    // Calculations
    const totalPoints = driverStats.reduce((sum, d) => sum + (d.totalPoints || 0), 0);
    const totalWins = driverStats.reduce((sum, d) => sum + (d.wins || 0), 0);
    const totalPodiums = driverStats.reduce((sum, d) => sum + (d.podiums || 0), 0);
    const totalRaces = seasons.reduce((sum, s) => sum + (s.races || 0), 0);
    const yearsActive = seasons.length;

    // Win Rate
    const winRate = totalRaces > 0 ? ((totalWins / totalRaces) * 100).toFixed(1) : 0;
    const podiumRate = totalRaces > 0 ? ((totalPodiums / totalRaces) * 100).toFixed(1) : 0;

    // Sparkline Data (Last 5 seasons, reversed to be chronological)
    const recentForm = [...seasons].reverse().slice(-5);

    // Dashboard Stats (default to 0 if not loaded yet)
    const poles = dashboardStats?.totalPoles || 0;
    const fastestLaps = dashboardStats?.totalFastestLaps || 0;
    const distributionData = dashboardStats?.resultDistribution || [];

    // Heatmap Processing
    // Get unique years and rounds size to build grid
    const years = [...new Set(heatmapStats.map(h => h.year))].sort((a, b) => b - a); // Descending
    const maxRounds = Math.max(...heatmapStats.map(h => h.round), 0);

    return (
        <div className="space-y-8 fade-in pb-12">
            {/* Top Row: Key Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Wins Card */}
                <div className="bg-f1-charcoal p-4 rounded-lg border border-f1-warmgray/20 relative overflow-hidden group hover:border-f1-red/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Trophy size={48} />
                    </div>
                    <div className="flex items-center gap-2 text-f1-warmgray text-xs uppercase tracking-wider mb-1">
                        <Trophy size={14} className="text-yellow-500" /> Total Wins
                    </div>
                    <div className="text-3xl font-racing text-white">{totalWins}</div>
                    <div className="text-xs text-f1-warmgray mt-1 font-mono">
                        <span className="text-yellow-500 font-bold">{winRate}%</span> Win Rate
                    </div>
                </div>

                {/* Podiums Card */}
                <div className="bg-f1-charcoal p-4 rounded-lg border border-f1-warmgray/20 relative overflow-hidden group hover:border-f1-red/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Medal size={48} />
                    </div>
                    <div className="flex items-center gap-2 text-f1-warmgray text-xs uppercase tracking-wider mb-1">
                        <Medal size={14} className="text-orange-400" /> Podiums
                    </div>
                    <div className="text-3xl font-racing text-white">{totalPodiums}</div>
                    <div className="text-xs text-f1-warmgray mt-1 font-mono">
                        <span className="text-orange-400 font-bold">{podiumRate}%</span> Rate
                    </div>
                </div>

                {/* Poles Card */}
                <div className="bg-f1-charcoal p-4 rounded-lg border border-f1-warmgray/20 relative overflow-hidden group hover:border-f1-red/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Timer size={48} />
                    </div>
                    <div className="flex items-center gap-2 text-f1-warmgray text-xs uppercase tracking-wider mb-1">
                        <Timer size={14} className="text-f1-offwhite" /> Poles
                    </div>
                    <div className="text-3xl font-racing text-white">{poles}</div>
                    <div className="text-xs text-f1-warmgray mt-1 font-mono">Qualifying Kings</div>
                </div>

                {/* Fastest Laps Card */}
                <div className="bg-f1-charcoal p-4 rounded-lg border border-f1-warmgray/20 relative overflow-hidden group hover:border-f1-red/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={48} />
                    </div>
                    <div className="flex items-center gap-2 text-f1-warmgray text-xs uppercase tracking-wider mb-1">
                        <Zap size={14} className="text-cyan-400" /> Fastest Laps
                    </div>
                    <div className="text-3xl font-racing text-white">{fastestLaps}</div>
                    <div className="text-xs text-f1-warmgray mt-1 font-mono">Pure Pace</div>
                </div>

                {/* Races / Experience Card */}
                <div className="bg-f1-charcoal p-4 rounded-lg border border-f1-warmgray/20 relative overflow-hidden group hover:border-f1-red/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Flag size={48} />
                    </div>
                    <div className="flex items-center gap-2 text-f1-warmgray text-xs uppercase tracking-wider mb-1">
                        <Flag size={14} className="text-f1-red" /> Races
                    </div>
                    <div className="text-3xl font-racing text-white">{totalRaces}</div>
                    <div className="text-xs text-f1-warmgray mt-1 font-mono">
                        {yearsActive} Seasons
                    </div>
                </div>

                {/* Recent Form Sparkline Card */}
                <div className="bg-f1-charcoal p-4 rounded-lg border border-f1-warmgray/20 relative overflow-hidden">
                    <div className="flex items-center gap-2 text-f1-warmgray text-xs uppercase tracking-wider mb-1">
                        <Activity size={14} className="text-cyan-400" /> Recent
                    </div>
                    <div className="h-12 -ml-2 mb-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={recentForm}>
                                <Line type="monotone" dataKey="points" stroke="#22d3ee" strokeWidth={2} dot={false} />
                                <Tooltip content={<></>} cursor={{ stroke: '#fff', strokeWidth: 1 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-xs text-f1-warmgray font-mono text-right">
                        Trend
                    </div>
                </div>
            </div>

            {/* Middle Row: Result Mix & Global Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Result Distribution Chart */}
                <div className="bg-f1-charcoal border border-f1-warmgray/20 rounded-lg p-6 flex flex-col h-96">
                    <h3 className="text-lg font-racing text-f1-offwhite mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                        <PieChartIcon className="text-f1-red" size={20} /> Result Mix
                    </h3>
                    <div className="flex-1 relative min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', color: '#fff', borderRadius: '4px' }} itemStyle={{ color: '#fff' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <div className="text-3xl font-racing text-white">{totalRaces}</div>
                                <div className="text-xs text-gray-500 uppercase">Starts</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Global Performance (Bar Chart) */}
                <div className="bg-f1-charcoal border border-f1-warmgray/20 rounded-lg p-6 flex flex-col h-96">
                    <h3 className="text-lg font-racing text-f1-offwhite mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                        <Globe className="text-cyan-400" size={20} /> Global Performance <span className="text-xs text-gray-500 font-sans normal-case ml-auto">Top Countries by Avg Pts</span>
                    </h3>
                    <div className="flex-1 relative min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={geoStats} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="country" type="category" width={100} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff' }}
                                    cursor={{ fill: '#ffffff10' }}
                                />
                                <Bar dataKey="avgPoints" fill="#e10600" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Points Heatmap & Reliability */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Points Heatmap (Spans 2 cols) */}
                <div className="col-span-1 lg:col-span-2 bg-f1-charcoal border border-f1-warmgray/20 rounded-lg p-6">
                    <h3 className="text-lg font-racing text-f1-offwhite mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                        <Grid className="text-yellow-500" size={20} /> Points Heatmap <span className="text-xs text-gray-500 font-sans normal-case ml-auto">Year x Round</span>
                    </h3>
                    <div className="overflow-x-auto">
                        <div className="min-w-[600px]">
                            {/* Grid Header */}
                            <div className="flex mb-1">
                                <div className="w-12 text-xs text-gray-500"></div>
                                {Array.from({ length: maxRounds }).map((_, i) => (
                                    <div key={i} className="flex-1 text-center text-xs text-gray-600 font-mono">{i + 1}</div>
                                ))}
                            </div>
                            {/* Grid Rows */}
                            {years.map(year => (
                                <div key={year} className="flex mb-1 items-center">
                                    <div className="w-12 text-xs text-f1-warmgray font-mono">{year}</div>
                                    {Array.from({ length: maxRounds }).map((_, i) => {
                                        const round = i + 1;
                                        const raceData = heatmapStats.find(h => h.year === year && h.round === round);
                                        // Color logic
                                        let bgClass = "bg-gray-800/20"; // Skipped/Not held
                                        let text = "";
                                        let title = "";

                                        if (raceData) {
                                            title = `${raceData.raceName}: ${raceData.points} pts`;
                                            if (raceData.points > 25) bgClass = "bg-yellow-500 text-black font-bold"; // Huge haul (1-2 finish?)
                                            else if (raceData.points >= 15) bgClass = "bg-f1-red text-white";
                                            else if (raceData.points >= 8) bgClass = "bg-red-700 text-white"; // Good points
                                            else if (raceData.points > 0) bgClass = "bg-red-900/60 text-gray-300"; // Minor points
                                            else if (raceData.bestPos <= 10) bgClass = "bg-gray-700 text-gray-400"; // Finished, no points
                                            else bgClass = "bg-gray-800 text-gray-600"; // DNF or poor

                                            text = raceData.points > 0 ? raceData.points : "";
                                        }

                                        return (
                                            <div key={i} title={title} className={`flex-1 aspect-square mx-[1px] rounded-[2px] ${bgClass} flex items-center justify-center text-[10px] cursor-help transition-opacity hover:opacity-80`}>
                                                {text}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reliability Analysis */}
                <div className="col-span-1 bg-f1-charcoal border border-f1-warmgray/20 rounded-lg p-6">
                    <h3 className="text-lg font-racing text-f1-offwhite mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                        <AlertTriangle className="text-orange-400" size={20} /> Reliability Analysis
                    </h3>
                    <div className="space-y-4">
                        {statusStats.slice(0, 10).map((stat, idx) => (
                            <div key={idx} className="group">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-f1-warmgray group-hover:text-white transition-colors">{stat.status}</span>
                                    <span className="text-xs font-mono text-gray-500">{stat.count}x</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${stat.category === 'Finished' ? 'bg-green-500' : stat.category === 'Mechanical' ? 'bg-orange-500' : stat.category === 'Accident' ? 'bg-red-500' : 'bg-gray-500'}`}
                                        style={{ width: `${(stat.count / totalRaces) * 100}%` }} // Simplified % logic relative to total races (rough)
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Legends Table */}
                <div className="col-span-1 lg:col-span-3 bg-f1-charcoal border border-f1-warmgray/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                        <h3 className="text-lg font-racing text-f1-offwhite flex items-center gap-2">
                            <Trophy className="text-yellow-500" size={20} /> Hall of Fame
                        </h3>
                        <button
                            onClick={() => setActiveTab('drivers')}
                            className="text-xs font-mono text-f1-red hover:text-white flex items-center gap-1 transition-colors"
                        >
                            View All <ArrowRight size={12} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-500 font-mono text-xs uppercase">
                                    <th className="text-left py-2 font-normal">Driver</th>
                                    <th className="text-center py-2 font-normal">Races</th>
                                    <th className="text-center py-2 font-normal">Wins</th>
                                    <th className="text-center py-2 font-normal">Podiums</th>
                                    <th className="text-right py-2 font-normal">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {driverStats.slice(0, 5).map((d, idx) => (
                                    <tr key={idx} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors group">
                                        <td className="py-3 font-racing text-f1-offwhite text-lg group-hover:text-f1-red transition-colors cursor-pointer">
                                            {d.forename} {d.surname}
                                        </td>
                                        <td className="py-3 text-center text-f1-warmgray">{d.races}</td>
                                        <td className="py-3 text-center">
                                            <span className={d.wins > 0 ? "text-yellow-500 font-bold" : "text-gray-600"}>{d.wins}</span>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className={d.podiums > 0 ? "text-orange-400 font-bold" : "text-gray-600"}>{d.podiums}</span>
                                        </td>
                                        <td className="py-3 text-right text-white font-bold font-mono">{d.totalPoints}</td>
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
