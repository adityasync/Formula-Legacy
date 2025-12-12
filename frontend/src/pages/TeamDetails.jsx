import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConstructorById, getConstructorDrivers } from '../services/api';
import DriverCard from '../components/DriverCard';
import { Trophy, Loader2, ArrowLeft, Globe } from 'lucide-react';

export default function TeamDetails() {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [teamRes, driversRes] = await Promise.all([
                    getConstructorById(id),
                    getConstructorDrivers(id)
                ]);
                setTeam(teamRes.data);
                setDrivers(driversRes.data);
            } catch (err) {
                setError('Failed to load team details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-f1-black flex items-center justify-center text-f1-red">
            <Loader2 className="animate-spin h-12 w-12" />
        </div>
    );

    if (error || !team) return (
        <div className="min-h-screen bg-f1-black p-8 text-f1-offwhite">
            <div className="text-red-500 mb-4">{error || 'Team not found'}</div>
            <Link to="/teams" className="text-f1-red hover:underline flex items-center gap-2"><ArrowLeft size={16} /> Back to Teams</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-f1-black pb-12">
            {/* Hero Header */}
            <div className="bg-f1-charcoal border-b border-f1-red relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                    <Link to="/teams" className="inline-flex items-center gap-2 text-f1-warmgray hover:text-white mb-6 transition-colors text-sm uppercase tracking-wider">
                        <ArrowLeft size={16} /> Back to Constructors
                    </Link>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Logo Placeholder */}
                        <div className="w-32 h-32 bg-f1-black rounded-full flex items-center justify-center border-4 border-f1-offwhite shadow-lg flex-shrink-0">
                            <img
                                src={`https://ui-avatars.com/api/?name=${team.name}&background=E10600&color=fff&size=128&font-size=0.4`}
                                alt={team.name}
                                className="rounded-full"
                            />
                        </div>

                        <div>
                            <h1 className="text-5xl md:text-6xl font-racing text-f1-offwhite uppercase tracking-tighter">{team.name}</h1>
                            <div className="flex items-center gap-6 mt-4 text-f1-warmgray font-mono">
                                <span className="flex items-center gap-2"><Globe size={18} className="text-f1-red" /> {team.nationality}</span>
                                <a href={team.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors underline decoration-f1-red">
                                    Official Wiki Page
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <Trophy className="absolute -bottom-12 -right-12 text-black/20 h-96 w-96 transform rotate-12" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-racing text-f1-offwhite mb-8 border-l-4 border-f1-red pl-4">Team Drivers (All Time)</h2>

                {drivers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {drivers.map(driver => (
                            <DriverCard key={driver.driverId} driver={driver} />
                        ))}
                    </div>
                ) : (
                    <div className="text-f1-warmgray italic">No driver records found for this team.</div>
                )}
            </div>
        </div>
    );
}
