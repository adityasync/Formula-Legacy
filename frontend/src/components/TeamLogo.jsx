import { getTeamColor, getTeamTextColor } from '../utils/teamColors';

export default function TeamLogo({ teamName, constructorRef, className = "w-16 h-16" }) {
    const primaryColor = getTeamColor(constructorRef);
    const textColor = getTeamTextColor(primaryColor);

    // Generate initials (e.g. "Red Bull" -> "RB", "Ferrari" -> "FE" (to distinguish)
    const getInitials = (name) => {
        if (!name) return 'F1';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const initials = getInitials(teamName);

    return (
        <div
            className={`
                relative flex items-center justify-center shrink-0 drop-shadow-2xl ${className}
                transition-transform duration-500 ease-out group-hover:rotate-[10deg] group-hover:scale-110
            `}
            style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                // Vibrant gradient: Primary to slightly lighter/saturated version
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor})`,
                boxShadow: `0 4px 15px ${primaryColor}66`
            }}
        >
            {/* Glossy Sheen Overlay (Top-Left) creates the dimension without darkening */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/10 pointer-events-none" />

            {/* Subtle Inner Glow/Pulse on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10 mix-blend-overlay animate-pulse-slow" />

            {/* Subtle Carbon Fiber Texture (Very transparent) */}
            <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,#000,#000_1px,transparent_1px,transparent_3px)] mix-blend-multiply" />

            {/* Inner Hexagon Border */}
            <div className="absolute inset-[2px] bg-black/10"
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            />

            {/* Initials */}
            <span
                className="relative font-racing text-2xl md:text-3xl tracking-tighter z-10"
                style={{
                    color: textColor,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
            >
                {initials}
            </span>
        </div>
    );
}
