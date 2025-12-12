import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getConstructors } from '../services/api';
import { Trophy, Loader2, ChevronRight } from 'lucide-react';

export default function Teams() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await getConstructors();
                setTeams(response.data);
            } catch (err) {
                setError('Failed to load teams.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="animate-spin h-12 w-12 text-f1-red mx-auto mb-4" />
                <p className="text-gray-500 font-mono text-sm">Loading constructors...</p>
            </div>
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
                        <span className="text-f1-red">Teams</span>
                    </div>

                    {/* Title with racing accent */}
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-16 bg-f1-red"></div>
                        <div>
                            <h1 className="text-5xl md:text-6xl text-white font-racing tracking-tight uppercase">
                                Constructor <span className="text-f1-red">Archive</span>
                            </h1>
                            <p className="text-gray-500 font-mono text-sm mt-2">All Formula 1 teams throughout history</p>
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

                {/* Teams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.map(team => (
                        <Link
                            to={`/teams/${team.constructorId}`}
                            key={team.constructorId}
                            className="group bg-gray-900 border border-gray-800 hover:border-f1-red p-6 transition-all hover:bg-gray-900/80"
                        >
                            <div className="flex items-center gap-4">
                                {/* Team initial badge */}
                                <div className="w-14 h-14 bg-f1-red flex items-center justify-center font-racing text-2xl text-white flex-shrink-0">
                                    {team.name.charAt(0)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-racing text-white truncate group-hover:text-f1-red transition-colors">
                                        {team.name}
                                    </h2>
                                    <p className="text-gray-500 text-sm font-mono">{team.nationality}</p>
                                </div>

                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-f1-red group-hover:translate-x-1 transition-all" />
                            </div>

                            {/* Racing stripe accent */}
                            <div className="mt-4 flex gap-1">
                                <div className="h-1 flex-1 bg-f1-red group-hover:bg-f1-red transition-colors"></div>
                                <div className="h-1 w-8 bg-gray-800 group-hover:bg-orange-500 transition-colors"></div>
                                <div className="h-1 w-4 bg-gray-800 group-hover:bg-yellow-500 transition-colors"></div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-12 flex items-center justify-center gap-4">
                    <div className="h-px flex-1 bg-gray-800"></div>
                    <p className="text-gray-600 font-mono text-xs uppercase tracking-wider">
                        {teams.length} Constructors
                    </p>
                    <div className="h-px flex-1 bg-gray-800"></div>
                </div>
            </div>
        </div>
    );
}
