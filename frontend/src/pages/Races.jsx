import { useState, useEffect } from 'react';
import { getRaces } from '../services/api';
import { Timer, Loader2, Calendar, MapPin, ChevronRight, Flag } from 'lucide-react';

export default function Races() {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(2023);
    const years = Array.from({ length: 75 }, (_, i) => 2024 - i);

    useEffect(() => {
        const fetchRaces = async () => {
            setLoading(true);
            try {
                const response = await getRaces(selectedYear);
                setRaces(response.data);
            } catch (err) {
                setError('Failed to load races.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRaces();
    }, [selectedYear]);

    return (
        <div className="min-h-screen bg-black pb-12">
            {/* Header */}
            <div className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-mono mb-4">
                        <span>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-f1-red">Races</span>
                    </div>

                    {/* Title and Season Selector */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-16 bg-f1-red"></div>
                            <div>
                                <h1 className="text-5xl md:text-6xl text-white font-racing tracking-tight uppercase">
                                    Race <span className="text-f1-red">Calendar</span>
                                </h1>
                                <p className="text-gray-500 font-mono text-sm mt-2">Grand Prix schedule and history</p>
                            </div>
                        </div>

                        {/* Season selector with racing style */}
                        <div className="flex items-center gap-3 bg-gray-900 px-4 py-2 border border-gray-700">
                            <Timer className="w-5 h-5 text-f1-red" />
                            <span className="text-gray-400 font-mono text-sm">SEASON</span>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="bg-black text-white border-none font-racing text-2xl focus:outline-none cursor-pointer"
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="bg-red-900/30 border border-f1-red text-white p-4 rounded mb-8 font-mono text-sm">
                        ⚠ {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin h-12 w-12 text-f1-red mb-4" />
                        <p className="text-gray-500 font-mono text-sm">Loading {selectedYear} calendar...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {races.map((race, index) => (
                            <div
                                key={race.raceId}
                                className="group bg-gray-900 border border-gray-800 hover:border-f1-red p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between"
                            >
                                <div className="flex items-center gap-5">
                                    {/* Round number with racing badge */}
                                    <div className="w-16 h-16 bg-f1-red flex flex-col items-center justify-center flex-shrink-0">
                                        <span className="text-xs text-white/70 font-mono">R</span>
                                        <span className="text-2xl font-racing text-white leading-none">{String(race.round).padStart(2, '0')}</span>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-racing text-white group-hover:text-f1-red transition-colors">
                                            {race.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} className="text-gray-600" />
                                                {race.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} className="text-gray-600" />
                                                Circuit #{race.circuitId}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 md:mt-0 flex items-center gap-3">
                                    {/* Position indicator line */}
                                    <div className="hidden md:flex items-center gap-1">
                                        <div className="h-px w-8 bg-gray-700"></div>
                                        <Flag className="w-4 h-4 text-gray-600" />
                                    </div>

                                    <a
                                        href={race.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2 bg-black border border-gray-700 text-xs font-mono text-gray-400 hover:bg-f1-red hover:border-f1-red hover:text-white transition-all flex items-center gap-2"
                                    >
                                        FULL REPORT
                                        <ChevronRight className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        ))}

                        {races.length === 0 && (
                            <div className="text-center py-20">
                                <Flag className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-500 font-mono">No race data found for {selectedYear}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 flex items-center justify-center gap-4">
                    <div className="h-px flex-1 bg-gray-800"></div>
                    <p className="text-gray-600 font-mono text-xs uppercase tracking-wider">
                        {races.length} Races in {selectedYear}
                    </p>
                    <div className="h-px flex-1 bg-gray-800"></div>
                </div>
            </div>
        </div>
    );
}
