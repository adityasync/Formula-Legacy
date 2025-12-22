import { useMemo } from 'react';
import { motion } from 'framer-motion';
import geoData from '../data/f1-circuits.json';

export default function CircuitMap({ circuitId, name, location, country, className = "" }) {
    // 1. Find the matching feature
    const feature = useMemo(() => {
        if (!geoData || !geoData.features) return null;

        // Try to match by name or location
        // Normalize strings for comparison
        const norm = (str) => str?.toLowerCase().replace(/[^a-z0-9]/g, '');
        const targetName = norm(name);
        const targetLocation = norm(location);
        const targetCountry = norm(country);

        return geoData.features.find(f => {
            const fName = norm(f.properties.Name);
            const fLocation = norm(f.properties.Location);
            // Some checks
            return fName && targetName && (fName.includes(targetName) || targetName.includes(fName)) ||
                fLocation && targetLocation && fLocation === targetLocation;
        });
    }, [name, location, country]);

    // 2. Convert coordinates to SVG path
    const pathData = useMemo(() => {
        if (!feature || feature.geometry.type !== "LineString") return null;

        const coords = feature.geometry.coordinates;
        if (!coords || coords.length === 0) return null;

        // Find bounding box
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        coords.forEach(([x, y]) => {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        });

        const width = maxX - minX;
        const height = maxY - minY;

        // Add some padding
        const padding = Math.max(width, height) * 0.1;

        // Projection function: map long/lat to 0-100 space (keeping aspect ratio)
        // Note: Y is flipped in SVG (0 is top), Lat increases upwards (up is positive).
        // So we map Lat (y) from [minY, maxY] to [100, 0] or similar.

        // Let's create a ViewBox
        // We can just output the points directly if we set the viewBox correctly
        // But flipping Y is important because geo coords: +Y is North, SVG: +Y is Down.

        // Let's normalize to 0-100 for simplicity in styling
        const scale = 100 / Math.max(width, height);

        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        // Center offsets
        const dx = (100 - scaledWidth) / 2;
        const dy = (100 - scaledHeight) / 2;

        const pathPoints = coords.map(([x, y]) => {
            const px = ((x - minX) * scale) + dx;
            // Flip Y: SVG 0 is top. Max lat (maxY) should be at top (small Y). 
            // We map y from [minY, maxY] -> [0, scaledHeight]
            // Then flip: scaledHeight - ((y - minY) * scale)
            // Then center vertically: + dy
            const py = (100 - dy) - ((y - minY) * scale);
            return `${px},${py}`;
        }).join(" L ");

        return `M ${pathPoints}`;
    }, [feature]);

    if (!feature || !pathData) {
        return (
            <div className={`flex items-center justify-center bg-gray-900/50 rounded-lg border border-gray-800 ${className}`}>
                <span className="text-gray-600 text-xs font-mono">Map Unavailable</span>
            </div>
        );
    }

    return (
        <div className={`relative flex items-center justify-center p-4 ${className}`}>
            <svg
                viewBox="-10 -10 120 120"
                className="w-full h-full drop-shadow-[0_0_15px_rgba(255,24,1,0.3)]"
                style={{ overflow: 'visible' }}
            >
                {/* Track Outline (Glow blur) */}
                <motion.path
                    d={pathData}
                    fill="none"
                    stroke="#FF1801"
                    strokeWidth="4"
                    strokeOpacity="0.2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />
                {/* Track Base */}
                <motion.path
                    d={pathData}
                    fill="none"
                    stroke="#333"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />

                {/* Active drawing track */}
                <motion.path
                    d={pathData}
                    fill="none"
                    stroke="#FF1801" // F1 Red
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                />
            </svg>

            {/* Optional: Label */}
            {/* <div className="absolute bottom-2 right-2 text-[10px] text-gray-500 font-mono">
                {feature.properties.Name}
            </div> */}
        </div>
    );
}
