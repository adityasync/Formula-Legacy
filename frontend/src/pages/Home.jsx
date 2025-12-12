import { Link } from 'react-router-dom';
import { Play, Users, Trophy, Timer, ChevronRight } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Red glow */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-f1-red/20 rounded-full blur-[150px]"></div>

                {/* Racing grid lines */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="h-full w-full" style={{
                        backgroundImage: 'linear-gradient(0deg, white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }}></div>
                </div>

                {/* Speed lines */}
                <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-f1-red/30 to-transparent"></div>
                <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-f1-red/20 to-transparent"></div>
            </div>

            {/* Hero Section */}
            <div className="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10 py-16">
                {/* Racing badge */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-px w-12 bg-f1-red"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 grid grid-cols-2 grid-rows-2">
                            <div className="bg-white"></div>
                            <div className="bg-black border border-gray-700"></div>
                            <div className="bg-black border border-gray-700"></div>
                            <div className="bg-white"></div>
                        </div>
                        <span className="text-gray-400 font-mono text-xs uppercase tracking-[0.3em]">Since 1950</span>
                    </div>
                    <div className="h-px w-12 bg-f1-red"></div>
                </div>

                {/* Main Title */}
                <h1 className="text-7xl md:text-9xl font-racing text-white tracking-tighter mb-4">
                    F1<span className="text-f1-red">PEDIA</span>
                </h1>

                {/* Racing underline */}
                <div className="flex items-center gap-1 mb-6">
                    <div className="h-1 w-24 bg-f1-red"></div>
                    <div className="h-1 w-8 bg-orange-500"></div>
                    <div className="h-1 w-4 bg-yellow-500"></div>
                </div>

                <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-4">
                    The ultimate historic database of <span className="text-white font-semibold">Formula 1</span>
                </p>
                <p className="text-gray-600 font-mono text-sm mb-12">
                    860+ Drivers • 210+ Constructors • 1000+ Races
                </p>

                {/* CTA Buttons */}
                <div className="flex gap-4 mb-16">
                    <Link
                        to="/drivers"
                        className="group relative px-8 py-4 bg-f1-red text-white font-racing text-xl tracking-wider uppercase overflow-hidden hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <Play fill="currentColor" size={18} />
                        START GRID
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/analytics"
                        className="px-8 py-4 border-2 border-gray-600 text-white font-racing text-xl tracking-wider uppercase hover:border-f1-red hover:text-f1-red transition-colors"
                    >
                        ANALYTICS
                    </Link>
                </div>

                {/* Quick navigation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                    <QuickLink to="/drivers" icon={<Users className="w-6 h-6" />} title="DRIVERS" subtitle="All-time legends" />
                    <QuickLink to="/teams" icon={<Trophy className="w-6 h-6" />} title="TEAMS" subtitle="Constructors" />
                    <QuickLink to="/races" icon={<Timer className="w-6 h-6" />} title="RACES" subtitle="Grand Prix history" />
                </div>
            </div>

            {/* Checkered footer */}
            <div className="relative z-10 py-6">
                <div className="flex justify-center mb-4">
                    {[...Array(16)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 ${i % 2 === 0 ? 'bg-white' : 'bg-black border border-gray-800'}`}></div>
                    ))}
                </div>
                <p className="text-center text-gray-600 font-mono text-xs uppercase tracking-wider">
                    Powered by Ergast API • Spring Boot • React
                </p>
            </div>
        </div>
    );
}

function QuickLink({ to, icon, title, subtitle }) {
    return (
        <Link
            to={to}
            className="group bg-gray-900/50 border border-gray-800 p-5 flex items-center gap-4 hover:border-f1-red hover:bg-gray-900 transition-all"
        >
            <div className="text-f1-red group-hover:scale-110 transition-transform">{icon}</div>
            <div className="text-left">
                <div className="text-lg font-racing text-white group-hover:text-f1-red transition-colors">{title}</div>
                <div className="text-xs text-gray-500 font-mono">{subtitle}</div>
            </div>
            <ChevronRight className="ml-auto w-5 h-5 text-gray-700 group-hover:text-f1-red group-hover:translate-x-1 transition-all" />
        </Link>
    );
}
