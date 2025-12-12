import { useState } from 'react';
import { Trophy, Flag, Calendar } from 'lucide-react';
import { getDriverPhotoOrPlaceholder } from '../utils/driverPhotos';

// F1 Wheel component that spins on click
function F1Wheel({ isSpinning, driverPhoto, driverName }) {
    return (
        <div className={`relative w-20 h-20 ${isSpinning ? 'animate-spin' : ''}`} style={{ animationDuration: '0.6s' }}>
            {/* Outer tyre */}
            <div className="absolute inset-0 rounded-full bg-gray-900 border-4 border-gray-700">
                {/* Tread pattern */}
                <div className="absolute inset-1 rounded-full border-2 border-dashed border-gray-600"></div>
                {/* Tread grooves */}
                <div className="absolute inset-0 rounded-full" style={{
                    background: 'repeating-conic-gradient(from 0deg, transparent 0deg 10deg, rgba(0,0,0,0.3) 10deg 20deg)'
                }}></div>
            </div>
            {/* Inner rim */}
            <div className="absolute inset-3 rounded-full bg-gray-800 border-2 border-gray-600"></div>
            {/* Driver photo center */}
            <div className="absolute inset-4 rounded-full overflow-hidden border-2 border-f1-red">
                <img
                    src={driverPhoto}
                    alt={driverName}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'pixelated' }}
                />
            </div>
        </div>
    );
}

export default function DriverStatsCard({ driver }) {
    const [expanded, setExpanded] = useState(false);
    const [spinning, setSpinning] = useState(false);

    const driverPhoto = getDriverPhotoOrPlaceholder(driver.forename, driver.surname);

    const handleClick = () => {
        if (!expanded) {
            setSpinning(true);
            setTimeout(() => {
                setSpinning(false);
                setExpanded(true);
            }, 600);
        } else {
            setExpanded(false);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`bg-f1-charcoal border-l-4 border-f1-red rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:bg-gray-800 ${expanded ? 'ring-2 ring-f1-red' : ''}`}
        >
            {/* Header */}
            <div className="p-4 flex items-center gap-4">
                <F1Wheel isSpinning={spinning} driverPhoto={driverPhoto} driverName={`${driver.forename} ${driver.surname}`} />

                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-racing text-f1-offwhite truncate">
                        {driver.forename} {driver.surname}
                    </h3>
                    <p className="text-f1-warmgray text-sm font-mono uppercase tracking-wider">
                        {driver.code || '---'} • {driver.nationality}
                    </p>
                </div>

                <div className="text-right">
                    <div className="text-2xl font-racing text-f1-red">{driver.totalPoints?.toFixed(0) || 0}</div>
                    <div className="text-xs text-f1-warmgray font-mono uppercase">Points</div>
                </div>
            </div>

            {/* Expandable Stats */}
            <div className={`overflow-hidden transition-all duration-500 ${expanded ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pb-4 border-t border-gray-700">
                    <div className="grid grid-cols-4 gap-3 pt-4">
                        <StatBox icon={<Trophy className="w-5 h-5 text-yellow-500" />} value={driver.wins || 0} label="Wins" />
                        <StatBox icon={<Trophy className="w-5 h-5 text-orange-400" />} value={driver.podiums || 0} label="Podiums" />
                        <StatBox icon={<Flag className="w-5 h-5 text-f1-red" />} value={driver.races || 0} label="Races" />
                        <StatBox icon={<Calendar className="w-5 h-5 text-cyan-400" />} value={driver.yearsActive || 'N/A'} label="Years" small />
                    </div>
                    <p className="text-center text-xs text-f1-warmgray mt-3 font-mono">Click to collapse</p>
                </div>
            </div>
        </div>
    );
}

function StatBox({ icon, value, label, small }) {
    return (
        <div className="bg-f1-black rounded-lg p-3 text-center">
            <div className="flex justify-center mb-1">{icon}</div>
            <div className={`font-racing text-f1-offwhite ${small ? 'text-sm' : 'text-xl'}`}>{value}</div>
            <div className="text-[10px] text-f1-warmgray font-mono uppercase">{label}</div>
        </div>
    );
}
