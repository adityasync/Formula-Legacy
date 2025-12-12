export default function DriverCard({ driver }) {
    // Determine asset path (placeholder strategy or direct mapping)
    // We stored assets as 'assets/driver_name_8bit.png' in the tracking md, 
    // but in the app we might serve them from a specific directory.
    // For now, let's assume valid image paths are constructed from refs.

    // NOTE: Backend returns 'url' but not local image path yet. 
    // We will construct the image path based on naming convention we used: 
    // e.g. "lewis_hamilton_8bit.png"

    const imageName = `${driver.forename.toLowerCase()}_${driver.surname.toLowerCase()}_8bit.png`;

    return (
        <div className="bg-f1-charcoal border-2 border-f1-warmgray rounded-lg overflow-hidden hover:border-f1-red transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group relative">
            <div className="absolute top-2 right-2 flex flex-col items-end">
                <span className="font-mono text-f1-red text-xl font-bold">#{driver.number}</span>
                <span className="font-mono text-xs text-f1-warmgray">{driver.code}</span>
            </div>

            <div className="p-4 flex justify-center bg-gray-900 border-b-2 border-f1-red relative overflow-hidden">
                {/* Background texture effect */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                {/* Placeholder for 8-bit image - real integration needs serving static assets */}
                <img
                    src={`/assets/${imageName}`}
                    alt={`${driver.forename} ${driver.surname}`}
                    className="w-32 h-32 object-cover rounded-md border-2 border-white pixelated shadow-lg z-10"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x128/222428/E10600?text=NO+IMG'; }}
                />
            </div>

            <div className="p-4">
                <h3 className="font-racing text-xl text-f1-offwhite uppercase tracking-wide truncate">
                    {driver.forename} {driver.surname}
                </h3>
                <div className="mt-2 flex items-center justify-between text-sm text-f1-warmgray font-body">
                    <span>{driver.nationality}</span>
                    {/* If we had team data here we would show it */}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="text-center p-1 bg-black/30 rounded">
                        <span className="block text-f1-red">DOB</span>
                        <span>{driver.dob}</span>
                    </div>
                    <div className="text-center p-1 bg-black/30 rounded">
                        <span className="block text-f1-red">Wiki</span>
                        <a href={driver.url} target="_blank" rel="noreferrer" className="hover:text-white underline">Link</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
