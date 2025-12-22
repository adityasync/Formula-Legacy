import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import TeamLogo from './TeamLogo';
import { getTeamColor } from '../utils/teamColors';
import { getFlagUrl } from '../utils/countryUtils';

export default function TeamCard({ team }) {
    const teamColor = getTeamColor(team.constructorRef);
    const flagUrl = getFlagUrl(team.nationality);

    // 3D Tilt Logic
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
                transform: "translateZ(0)", // Force GPU acceleration
                willChange: "transform"     // Hint to browser
            }}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.08, zIndex: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="group h-full perspective-1000 cursor-pointer"
        >
            <Link
                to={`/teams/${team.constructorId}`}
                className="relative bg-[#111] rounded-xl overflow-hidden block h-full flex flex-col transform-gpu transition-shadow duration-300"
                style={{
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.05)'
                }}
            >
                {/* 1. Dynamic Team-Colored Glow Border (Hidden by default, reveals on hover) */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                    style={{
                        boxShadow: `0 20px 50px -10px ${teamColor}66, inset 0 0 0 2px ${teamColor}44`
                    }}
                />

                {/* 2. Enhanced Card Background */}
                <div className="absolute inset-0 z-0">
                    {/* Base gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-black" />

                    {/* Carbon Fiber Pattern */}
                    <div className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `
                                linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000),
                                linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)
                            `,
                            backgroundSize: '4px 4px',
                            backgroundPosition: '0 0, 2px 2px'
                        }}
                    />

                    {/* Diagonal Racing Stripes Overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,#fff_5px,#fff_6px)] mix-blend-overlay" />
                </div>

                {/* 3. Racing Stripe Accent (Top Edge) */}
                <div className="absolute top-0 left-0 right-0 h-1 z-20 shadow-[0_0_10px_currentColor]"
                    style={{ backgroundColor: teamColor, color: teamColor }} />

                {/* 4. Checkered Flag Sweep Animation */}
                <div className="absolute -inset-full top-0 block w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shine z-10 pointer-events-none" />

                {/* Content Container */}
                <div className="relative p-6 flex flex-col items-center text-center flex-1 z-10" style={{ transformStyle: "preserve-3d" }}>

                    {/* Logo Area */}
                    <div className="mb-5 mt-2 transform transition-transform duration-300" style={{ transform: "translateZ(40px)" }}>
                        <TeamLogo
                            teamName={team.name}
                            constructorRef={team.constructorRef}
                            className="w-24 h-24 drop-shadow-2xl"
                        />
                    </div>

                    {/* Team Name - Bold & Large */}
                    <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white uppercase mb-1 leading-none drop-shadow-lg"
                        style={{ transform: "translateZ(30px)" }}
                    >
                        {team.name}
                    </h3>

                    {/* Accent Line Under Name */}
                    <div className="h-1 w-12 mx-auto rounded-full mb-4 opacity-80"
                        style={{ backgroundColor: teamColor, transform: "translateZ(25px)", boxShadow: `0 0 10px ${teamColor}` }}
                    />

                    {/* Nationality Badge - Optimized: Removed blur */}
                    <div className="flex items-center gap-2 mb-6 px-3 py-1 bg-black/80 border border-white/5 rounded-full"
                        style={{ transform: "translateZ(20px)" }}>
                        {flagUrl && <img src={flagUrl} alt={team.nationality} className="w-4 h-3 rounded shadow-sm" />}
                        <span className="text-gray-300 font-mono text-xs uppercase tracking-widest">{team.nationality}</span>
                    </div>

                    {/* Stats Grid */}
                    {(team.totalWins !== undefined || team.firstYear) && (
                        <div className="grid grid-cols-2 gap-3 w-full mt-auto" style={{ transform: "translateZ(25px)" }}>

                            {/* Wins Stat */}
                            <div className="relative overflow-hidden rounded-lg bg-white/5 border border-white/5 p-2 flex flex-col items-center group/stat hover:bg-white/10 transition-colors">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Wins</span>
                                <div className="font-racing text-2xl text-white leading-none drop-shadow-md">
                                    {team.totalWins || 0}
                                </div>
                                {/* Corner accent */}
                                <div className="absolute bottom-0 right-0 w-2 h-2"
                                    style={{ background: `linear-gradient(to top left, ${teamColor}, transparent)` }} />
                            </div>

                            {/* Active Years Stat */}
                            <div className="relative overflow-hidden rounded-lg bg-white/5 border border-white/5 p-2 flex flex-col items-center group/stat hover:bg-white/10 transition-colors">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Active</span>
                                <div className="font-racing text-lg text-white leading-none mt-1">
                                    {team.firstYear || 'N/A'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* View Profile Hover Indicator - Sliding Up */}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end justify-center pb-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-20">
                    <span className="text-[10px] font-mono text-white font-bold uppercase tracking-[0.2em] flex items-center gap-2 drop-shadow-md">
                        View Profile <ChevronRight size={12} className="text-f1-red" />
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}
