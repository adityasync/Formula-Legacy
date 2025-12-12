import { useState, useEffect } from 'react';
import { getRaces } from '../services/api';
import { Timer, Loader2, Calendar, MapPin } from 'lucide-react';

export default function Races() {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(2023); // Default to recent season
    const years = Array.from({ length: 75 }, (_, i) => 2024 - i); // Generate years 2024 down to 1950

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
        <div className="min-h-screen bg-f1-black pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-f1-charcoal pb-4">
                    <div className="flex items-center gap-4">
                        <Timer className="h-8 w-8 text-f1-red" />
                        <h1 className="text-4xl text-f1-offwhite font-racing tracking-tight">Race Calendar</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-f1-warmgray font-mono text-sm">SEASON:</span>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="bg-f1-charcoal text-f1-offwhite border border-f1-warmgray rounded px-3 py-1 font-mono text-sm focus:outline-none focus:border-f1-red"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-f1-red text-f1-offwhite p-4 rounded mb-8">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20 text-f1-red">
                        <Loader2 className="animate-spin h-12 w-12" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {races.map(race => (
                            <div key={race.raceId} className="bg-f1-charcoal p-4 rounded flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-900 transition-colors border-l-4 border-transparent hover:border-f1-red group">
                                <div className="flex items-center gap-6">
                                    <div className="text-center w-16 pt-1">
                                        <span className="block text-2xl font-racing text-f1-red">R{race.round}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-racing text-f1-offwhite group-hover:text-f1-red transition-colors">{race.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-f1-warmgray mt-1">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {race.date}</span>
                                            <span className="flex items-center gap-1"><MapPin size={14} /> Circuit ID: {race.circuitId}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 w-full md:w-auto text-right">
                                    <a
                                        href={race.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-block px-4 py-2 bg-black/50 text-xs font-mono text-f1-warmgray rounded hover:bg-f1-red hover:text-white transition-colors"
                                    >
                                        FULL REPORT
                                    </a>
                                </div>
                            </div>
                        ))}
                        {races.length === 0 && (
                            <div className="text-center py-20 text-f1-warmgray font-mono">
                                No race data found for {selectedYear}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
