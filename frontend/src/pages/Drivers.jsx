import { useState, useEffect } from 'react';
import { getDrivers } from '../services/api';
import DriverCard from '../components/DriverCard';
import { Flag, Loader2 } from 'lucide-react';

export default function Drivers() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await getDrivers();
                // Sort by wins (implied by API or do it here) or simply display all
                // For now, take first 50 to avoid rendering 800+ at once effectively
                setDrivers(response.data.slice(0, 50));
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
        <div className="min-h-screen bg-f1-black flex items-center justify-center text-f1-red">
            <Loader2 className="animate-spin h-12 w-12" />
        </div>
    );

    return (
        <div className="min-h-screen bg-f1-black pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-4 mb-8 border-b border-f1-charcoal pb-4">
                    <Flag className="h-8 w-8 text-f1-red" />
                    <h1 className="text-4xl text-f1-offwhite font-racing tracking-tight">F1 Legends & Drivers</h1>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-f1-red text-f1-offwhite p-4 rounded mb-8">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {drivers.map(driver => (
                        <DriverCard key={driver.driverId} driver={driver} />
                    ))}
                </div>

                <p className="text-center text-f1-warmgray mt-12 font-mono text-sm">
                    Showing top {drivers.length} drivers.
                </p>
            </div>
        </div>
    );
}
