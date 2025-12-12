import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCircuitsWithStats } from '../services/api';
import { Loader2, ChevronRight, MapPin, Flag, Calendar } from 'lucide-react';

export default function Circuits() {
    const [circuits, setCircuits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCircuits = async () => {
            try {
                const res = await getCircuitsWithStats();
                setCircuits(res.data);
            } catch (err) {
                console.error('Failed to load circuits:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCircuits();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="animate-spin h-12 w-12 text-f1-red" />
        </div>
    );

    // Group by country
    const byCountry = circuits.reduce((acc, c) => {
        if (!acc[c.country]) acc[c.country] = [];
        acc[c.country].push(c);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-black pb-12">
            {/* Header */}
            <div className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-mono mb-4">
                        <span>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-f1-red">Circuits</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-2 h-16 bg-f1-red"></div>
                        <div>
                            <h1 className="text-5xl md:text-6xl text-white font-racing tracking-tight uppercase">
                                Circuit <span className="text-f1-red">Archive</span>
                            </h1>
                            <p className="text-gray-500 font-mono text-sm mt-2">{circuits.length} circuits across {Object.keys(byCountry).length} countries</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {circuits.map(circuit => (
                        <Link
                            key={circuit.circuit_id}
                            to={`/circuits/${circuit.circuit_id}`}
                            className="group bg-gray-900 border border-gray-800 hover:border-f1-red p-5 transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg font-racing text-white truncate group-hover:text-f1-red transition-colors">
                                        {circuit.name}
                                    </h2>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                        <MapPin size={14} />
                                        <span>{circuit.location}, {circuit.country}</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-f1-red transition-colors" />
                            </div>

                            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                                <div className="bg-black p-2 rounded">
                                    <div className="text-white font-racing text-lg">{circuit.total_races}</div>
                                    <div className="text-gray-500">Races</div>
                                </div>
                                <div className="bg-black p-2 rounded">
                                    <div className="text-cyan-400 font-racing text-lg">{circuit.first_race}</div>
                                    <div className="text-gray-500">First</div>
                                </div>
                                <div className="bg-black p-2 rounded">
                                    <div className="text-f1-red font-racing text-lg">{circuit.last_race}</div>
                                    <div className="text-gray-500">Last</div>
                                </div>
                            </div>

                            {/* Racing stripe */}
                            <div className="mt-4 flex gap-1">
                                <div className="h-1 flex-1 bg-gray-800 group-hover:bg-f1-red transition-colors"></div>
                                <div className="h-1 w-8 bg-gray-800 group-hover:bg-orange-500 transition-colors"></div>
                                <div className="h-1 w-4 bg-gray-800 group-hover:bg-yellow-500 transition-colors"></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
