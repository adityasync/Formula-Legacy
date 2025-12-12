import { Link } from 'react-router-dom';
import { getDriverPhotoOrPlaceholder } from '../utils/driverPhotos';

export default function DriverCard({ driver }) {
    const driverPhoto = getDriverPhotoOrPlaceholder(driver.forename, driver.surname);

    return (
        <Link
            to={`/drivers/${driver.driverId}`}
            className="group bg-f1-charcoal border-2 border-f1-warmgray rounded-lg overflow-hidden hover:border-f1-red transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl relative block"
        >
            <div className="absolute top-2 right-2 flex flex-col items-end z-10">
                <span className="font-mono text-f1-red text-xl font-bold">#{driver.number || '00'}</span>
                <span className="font-mono text-xs text-f1-warmgray">{driver.code}</span>
            </div>

            <div className="p-4 flex justify-center bg-gray-900 border-b-2 border-f1-red relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <img
                    src={driverPhoto}
                    alt={`${driver.forename} ${driver.surname}`}
                    className="w-32 h-32 object-cover rounded-md border-2 border-white shadow-lg z-10"
                    style={{ imageRendering: 'pixelated' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x128/222428/E10600?text=NO+IMG'; }}
                />
            </div>

            <div className="p-4">
                <h3 className="font-racing text-xl text-f1-offwhite uppercase tracking-wide truncate group-hover:text-f1-red transition-colors">
                    {driver.forename} {driver.surname}
                </h3>
                <div className="mt-2 flex items-center justify-between text-sm text-f1-warmgray font-body">
                    <span>{driver.nationality}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="text-center p-1 bg-black/30 rounded">
                        <span className="block text-f1-red">DOB</span>
                        <span>{driver.dob || 'N/A'}</span>
                    </div>
                    <div className="text-center p-1 bg-black/30 rounded">
                        <span className="block text-f1-red">Profile</span>
                        <span className="text-white group-hover:text-f1-red">View →</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
