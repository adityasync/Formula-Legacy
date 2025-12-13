import { useState, useEffect } from 'react';
import { getHeadToHead } from '../services/api';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Users, Trophy, Flag, Timer, AlertCircle } from 'lucide-react';

export default function HeadToHead() {
    const [drivers, setDrivers] = useState([]);
    const [driver1, setDriver1] = useState(null);
    const [driver2, setDriver2] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await getHeadToHead();
            setDrivers(res.data);
            if (res.data.length >= 2) {
                // Default to top 2 stats-wise
                setDriver1(res.data[0]);
                setDriver2(res.data[1]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDriverChange = (setter, id) => {
        // Convert id to number since select returns string but driverId is number
        const numId = Number(id);
        const selected = drivers.find(d => d.driverId === numId);
        if (selected) {
            setter(selected);
        }
    };

    if (loading) return <div className="text-gray-500 font-mono">Loading data...</div>;

    if (!driver1 || !driver2) return null;

    // Normalize data for Radar Chart relative to the comparison set
    const maxWins = Math.max(driver1.wins, driver2.wins);
    const maxPoles = Math.max(driver1.poles, driver2.poles);
    const maxPodiums = Math.max(driver1.podiums, driver2.podiums);

    const maxWinRate = Math.max(driver1.win_rate, driver2.win_rate);
    const maxPoleRate = Math.max(driver1.pole_rate, driver2.pole_rate);

    // Avoid division by zero
    const safeMaxWins = maxWins || 1;
    const safeMaxPoles = maxPoles || 1;
    const safeMaxPodiums = maxPodiums || 1;
    const safeMaxWinRate = maxWinRate || 1;
    const safeMaxPoleRate = maxPoleRate || 1;

    const radarData = [
        { subject: 'Wins', A: (driver1.wins / safeMaxWins) * 100, B: (driver2.wins / safeMaxWins) * 100, fullMark: 100 },
        { subject: 'Poles', A: (driver1.poles / safeMaxPoles) * 100, B: (driver2.poles / safeMaxPoles) * 100, fullMark: 100 },
        { subject: 'Podiums', A: (driver1.podiums / safeMaxPodiums) * 100, B: (driver2.podiums / safeMaxPodiums) * 100, fullMark: 100 },
        { subject: 'Win Rate', A: (driver1.win_rate / safeMaxWinRate) * 100, B: (driver2.win_rate / safeMaxWinRate) * 100, fullMark: 100 },
        { subject: 'Pole Rate', A: (driver1.pole_rate / safeMaxPoleRate) * 100, B: (driver2.pole_rate / safeMaxPoleRate) * 100, fullMark: 100 },
        { subject: 'Consistency', A: (100 - driver1.dnf_rate), B: (100 - driver2.dnf_rate), fullMark: 100 },
    ];

    return (
        <div className="space-y-8">
            {/* Controls */}
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 bg-gray-900 p-6 border border-gray-800 items-center">
                <DriverSelector
                    label="Driver A"
                    drivers={drivers}
                    selected={driver1}
                    onChange={(id) => handleDriverChange(setDriver1, id)}
                    color="text-f1-red"
                />

                {/* Mobile VS indicator */}
                <div className="flex md:hidden items-center justify-center py-2">
                    <div className="flex items-center gap-4 w-full">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-f1-red" />
                        <div className="bg-gray-800 px-4 py-2 rounded-full">
                            <span className="text-xl font-racing text-white">VS</span>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-blue-500" />
                    </div>
                </div>

                {/* Desktop VS badge */}
                <div className="hidden md:flex items-center justify-center">
                    <div className="bg-gray-800 p-4 rounded-full">
                        <span className="text-2xl font-racing text-white">VS</span>
                    </div>
                </div>
                <DriverSelector
                    label="Driver B"
                    drivers={drivers}
                    selected={driver2}
                    onChange={(id) => handleDriverChange(setDriver2, id)}
                    color="text-blue-500"
                />
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Table A */}
                <StatsCard driver={driver1} color="border-f1-red" />

                {/* Radar Chart */}
                {/* Radar Chart */}
                {/* Radar Chart */}
                <div className="bg-gray-900 border border-gray-800 p-4 min-h-[350px] md:min-h-[450px]">
                    <div className="w-full h-[300px] md:h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#333" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#fff', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name={driver1.name}
                                    dataKey="A"
                                    stroke="#E10600"
                                    fill="#E10600"
                                    fillOpacity={0.6}
                                />
                                <Radar
                                    name={driver2.name}
                                    dataKey="B"
                                    stroke="#3B82F6"
                                    fill="#3B82F6"
                                    fillOpacity={0.6}
                                />
                                <Legend />
                                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stats Table B */}
                <StatsCard driver={driver2} color="border-blue-500" />
            </div>

            <div className="text-center text-xs text-gray-500 font-mono mt-4">
                * Radar chart normalized against comparison drivers
            </div>
        </div>
    );
}

function DriverSelector({ label, drivers, selected, onChange, color }) {
    return (
        <div className="flex flex-col gap-2">
            <label className={`font-racing uppercase text-lg ${color}`}>{label}</label>
            <select
                className="bg-black text-white p-3 border border-gray-700 focus:border-f1-red outline-none font-racing text-xl"
                value={selected.driverId}
                onChange={(e) => onChange(e.target.value)}
            >
                {drivers.map(d => (
                    <option key={d.driverId} value={d.driverId}>
                        {d.name}
                    </option>
                ))}
            </select>
            <div className={`mt-2 text-4xl font-racing ${color} opacity-80`}>
                {selected.code}
            </div>
        </div>
    );
}

function StatsCard({ driver, color }) {
    return (
        <div className={`bg-gray-900 border-t-4 ${color} p-6 space-y-6`}>
            <div className="text-center">
                <h3 className="text-2xl font-racing text-white">{driver.name}</h3>
                <p className="text-gray-500 font-mono text-sm">{driver.nationality}</p>
            </div>

            <div className="space-y-4">
                <StatRow label="Wins" value={driver.wins} icon={<Trophy className="w-4 h-4 text-yellow-500" />} />
                <StatRow label="Poles" value={driver.poles} icon={<Timer className="w-4 h-4 text-purple-500" />} />
                <StatRow label="Podiums" value={driver.podiums} icon={<Flag className="w-4 h-4 text-green-500" />} />
                <StatRow label="DNF Rate" value={`${driver.dnf_rate}%`} icon={<AlertCircle className="w-4 h-4 text-red-500" />} />
                <StatRow label="Start/Ent" value={`${driver.seasons} Seasons`} icon={<Users className="w-4 h-4 text-gray-400" />} />
            </div>
        </div>
    );
}

function StatRow({ label, value, icon }) {
    return (
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                {icon}
                <span>{label}</span>
            </div>
            <span className="text-white font-racing text-xl">{value}</span>
        </div>
    );
}
