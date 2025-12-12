import { useState, useEffect } from 'react';
import { getDrivers } from '../services/api';
import DriverCard from '../components/DriverCard';
import { Loader2, Star, Users, ChevronRight } from 'lucide-react';

export default function Drivers() {
    const [allDrivers, setAllDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('legends');

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await getDrivers();
                setAllDrivers(response.data);
            } catch (err) {
                setError('Failed to load drivers. Is the backend running?');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDrivers();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="animate-spin h-12 w-12 text-f1-red mx-auto mb-4" />
                <p className="text-gray-500 font-mono text-sm">Loading drivers...</p>
            </div>
        </div>
    );

    const legends = allDrivers.filter(d => {
        if (d.dob) return new Date(d.dob).getFullYear() < 1975;
        return d.driverId < 200;
    }).slice(0, 50);

    const currentDrivers = allDrivers.filter(d => {
        if (d.dob) return new Date(d.dob).getFullYear() >= 1975;
        return d.driverId >= 200;
    }).slice(0, 50);

    const displayedDrivers = activeTab === 'legends' ? legends : currentDrivers;

    return (
        <div className="min-h-screen bg-black pb-12">
            {/* Header */}
            <div className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-mono mb-4">
                        <span>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-f1-red">Drivers</span>
                    </div>

                    {/* Title with racing accent */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-2 h-16 bg-f1-red"></div>
                        <div>
                            <h1 className="text-5xl md:text-6xl text-white font-racing tracking-tight uppercase">
                                Driver <span className="text-f1-red">Archive</span>
                            </h1>
                            <p className="text-gray-500 font-mono text-sm mt-2">The legends and champions of Formula 1</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                        <TabButton
                            active={activeTab === 'legends'}
                            onClick={() => setActiveTab('legends')}
                            icon={<Star className="w-4 h-4" />}
                            label="Legends"
                            count={legends.length}
                        />
                        <TabButton
                            active={activeTab === 'current'}
                            onClick={() => setActiveTab('current')}
                            icon={<Users className="w-4 h-4" />}
                            label="Current Era"
                            count={currentDrivers.length}
                        />
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

                {/* Driver Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedDrivers.map(driver => (
                        <DriverCard key={driver.driverId} driver={driver} />
                    ))}
                </div>

                {/* Footer info */}
                <div className="mt-12 flex items-center justify-center gap-4">
                    <div className="h-px flex-1 bg-gray-800"></div>
                    <p className="text-gray-600 font-mono text-xs uppercase tracking-wider">
                        Showing {displayedDrivers.length} {activeTab === 'legends' ? 'legendary' : 'current'} drivers
                    </p>
                    <div className="h-px flex-1 bg-gray-800"></div>
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label, count }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 font-racing text-lg uppercase tracking-wider transition-all border-b-2 ${active
                    ? 'bg-f1-red text-white border-f1-red'
                    : 'bg-gray-900 text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                }`}
        >
            {icon}
            {label}
            <span className={`text-xs px-2 py-0.5 rounded font-mono ${active ? 'bg-black/30' : 'bg-gray-800'}`}>
                {count}
            </span>
        </button>
    );
}
