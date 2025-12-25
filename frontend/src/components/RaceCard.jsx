import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import { getFlagUrl } from '../utils/countryUtils';

export default function RaceCard({ race }) {
    // 3D Tilt Logic
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

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

    // Data Extraction
    const country = race.circuit?.country || race.circuit?.location || 'Unknown';
    const flagUrl = getFlagUrl(country);
    const roundNumber = String(race.round).padStart(2, '0');

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
                transform: "translateZ(0)",
                willChange: "transform"
            }}
            initial={{ scale: 1, opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="group relative h-full perspective-1000 cursor-pointer"
        >
            <Link
                to={`/races/${race.raceId}`}
                className="block h-full relative bg-[#111] rounded-2xl overflow-hidden transform-gpu transition-shadow duration-300"
                style={{
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.05)'
                }}
            >
                {/* 1. Carbon Fiber & Texture Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-black" />
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at center, transparent 0%, #000 100%),
                                repeating-linear-gradient(45deg, #111 0px, #111 2px, #000 2px, #000 4px)
                            `
                        }}
                    />
                </div>

                {/* 2. Top "Lanyard" Hole / Accent (Paddock Pass Style) */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 z-20" />
                <div className="absolute top-1.5 inset-x-0 h-0.5 bg-black/50 z-20" />

                {/* 3. Dynamic Glow Border on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl z-10"
                    style={{
                        boxShadow: `inset 0 0 0 1px rgba(225, 6, 0, 0.3), 0 20px 40px -10px rgba(225, 6, 0, 0.2)`
                    }}
                />

                {/* Content Container */}
                <div className="relative z-10 p-5 flex flex-col h-full" style={{ transformStyle: "preserve-3d" }}>

                    {/* Header: Round & Flag */}
                    <div className="flex justify-between items-start mb-4" style={{ transform: "translateZ(20px)" }}>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-0.5">Round</span>
                            <span className="text-4xl font-racing text-white leading-none tracking-tighter text-outline-red">
                                {roundNumber}
                            </span>
                        </div>
                        {flagUrl && (
                            <div className="w-10 h-7 rounded shadow-lg overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-300">
                                <img src={flagUrl} alt={country} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Circuit Info */}
                    <div className="flex-1 mb-4" style={{ transform: "translateZ(30px)" }}>
                        <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-f1-red transition-colors duration-300 line-clamp-2">
                            {race.name.replace('Grand Prix', '').trim()}
                        </h3>
                        <div className="text-[10px] uppercase tracking-widest text-f1-red font-bold mb-3">Grand Prix</div>

                        <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                            <MapPin size={12} className="text-gray-600" />
                            <span className="truncate">{race.circuit?.name || `Circuit #${race.circuitId}`}</span>
                        </div>
                    </div>

                    {/* Footer: Date & CTA */}
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between" style={{ transform: "translateZ(20px)" }}>
                        <div className="flex items-center gap-2 text-gray-300">
                            <div className="p-1.5 bg-white/5 rounded">
                                <Calendar size={14} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Date</span>
                                <span className="text-xs font-mono">{race.date}</span>
                            </div>
                        </div>

                        {/* Slide-in Chevron */}
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-f1-red group-hover:text-white transition-colors duration-300">
                            <ChevronRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
