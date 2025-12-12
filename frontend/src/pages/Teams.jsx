import { useState, useEffect } from 'react';
import { getConstructors } from '../services/api';
import { Trophy, Loader2, ExternalLink } from 'lucide-react';

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
        <div className="min-h-screen bg-f1-black flex items-center justify-center text-f1-red">
            <Loader2 className="animate-spin h-12 w-12" />
        </div>
    );

    return (
        <div className="min-h-screen bg-f1-black pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-4 mb-8 border-b border-f1-charcoal pb-4">
                    <Trophy className="h-8 w-8 text-f1-red" />
                    <h1 className="text-4xl text-f1-offwhite font-racing tracking-tight">F1 Constructors</h1>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-f1-red text-f1-offwhite p-4 rounded mb-8">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map(team => (
                        <Link to={`/teams/${team.constructorId}`} key={team.constructorId} className="block group">
                            <div className="bg-f1-charcoal border-l-4 border-f1-red p-6 rounded hover:bg-gray-900 transition-colors relative overflow-hidden h-full">
                                <div className="relative z-10">
                                    <h2 className="text-2xl font-racing text-f1-offwhite mb-2 group-hover:text-f1-red transition-colors">{team.name}</h2>
                                    <p className="text-f1-warmgray mb-4 text-sm font-mono uppercase tracking-widest">{team.nationality}</p>
                                </div>
                                {/* Decorative background element */}
                                <Trophy className="absolute -bottom-4 -right-4 text-f1-black opacity-30 h-32 w-32 transform rotate-12 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
