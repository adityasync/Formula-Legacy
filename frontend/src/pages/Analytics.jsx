import { useState, useEffect } from 'react';
import { getDNFCauses, getPitStopEfficiency } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Loader2, AlertTriangle, Timer, TrendingUp, ChevronRight } from 'lucide-react';

const COLORS = ['#E10600', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9', '#74B9FF', '#A29BFE', '#FD79A8', '#FDCB6E', '#6C5CE7', '#00B894', '#E17055', '#0984E3'];

export default function Analytics() {
    const [dnfData, setDnfData] = useState([]);
    const [pitStopData, setPitStopData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(2023);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [dnfRes, pitRes] = await Promise.all([
                    getDNFCauses(),
                    getPitStopEfficiency(selectedSeason)
                ]);
                setDnfData(dnfRes.data);
                setPitStopData(pitRes.data);
            } catch (err) {
                setError('Failed to load analytics data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedSeason]);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="animate-spin h-12 w-12 text-f1-red mx-auto mb-4" />
                <p className="text-gray-500 font-mono text-sm">Loading analytics...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-black p-8 text-white">
            <div className="text-red-500 font-mono">⚠ {error}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black pb-12">
            {/* Header */}
            <div className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-mono mb-4">
                        <span>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-f1-red">Analytics</span>
                    </div>

                    {/* Title */}
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-16 bg-f1-red"></div>
                        <div>
                            <h1 className="text-5xl md:text-6xl text-white font-racing tracking-tight uppercase">
                                Advanced <span className="text-f1-red">Analytics</span>
                            </h1>
                            <p className="text-gray-500 font-mono text-sm mt-2">Historical F1 data insights and statistics</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* DNF Causes Section */}
                <section className="bg-gray-900 border border-gray-800 p-6">
                    {/* Section Header with racing accent */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-f1-red"></div>
                        <AlertTriangle className="text-f1-red" />
                        <h2 className="text-2xl font-racing text-white uppercase">DNF Causes (All Time)</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Pie Chart */}
                        <div style={{ width: '100%', height: 320, minHeight: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dnfData}
                                        dataKey="count"
                                        nameKey="status"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        labelLine={false}
                                    >
                                        {dnfData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600', borderRadius: '0' }}
                                        labelStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legend Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="py-2 text-gray-500 font-mono text-xs uppercase">Cause</th>
                                        <th className="py-2 text-gray-500 font-mono text-xs uppercase text-right">Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dnfData.map((item, idx) => (
                                        <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                                            <td className="py-2 text-white flex items-center gap-2">
                                                <span className="w-3 h-3" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                                                {item.status}
                                            </td>
                                            <td className="py-2 text-white text-right font-mono">{item.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Pit Stop Efficiency Section */}
                <section className="bg-gray-900 border border-gray-800 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-f1-red"></div>
                            <Timer className="text-f1-red" />
                            <h2 className="text-2xl font-racing text-white uppercase">Pit Stop Efficiency</h2>
                        </div>

                        <div className="flex items-center gap-3 bg-black px-4 py-2 border border-gray-700">
                            <span className="text-gray-500 font-mono text-sm">SEASON</span>
                            <select
                                value={selectedSeason}
                                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                                className="bg-transparent text-white border-none font-racing text-xl focus:outline-none cursor-pointer"
                            >
                                {[2023, 2022, 2021, 2020, 2019, 2018].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ width: '100%', height: 384, minHeight: 384 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pitStopData} layout="vertical" margin={{ left: 80 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis type="number" stroke="#666" tickFormatter={(v) => `${v.toFixed(1)}s`} />
                                <YAxis type="category" dataKey="driver" stroke="#666" tick={{ fill: '#fff', fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value) => [`${value.toFixed(3)}s`, 'Avg Pit Time']}
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600', borderRadius: '0' }}
                                />
                                <Legend />
                                <Bar dataKey="avgPitSec" fill="#E10600" name="Avg Pit Time (sec)" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px flex-1 bg-gray-800"></div>
                    <p className="text-gray-600 font-mono text-xs uppercase tracking-wider">
                        F1 Analytics Dashboard
                    </p>
                    <div className="h-px flex-1 bg-gray-800"></div>
                </div>
            </div>
        </div>
    );
}
