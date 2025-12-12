import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-f1-black flex flex-col relative overflow-hidden">
            {/* Hero Section */}
            <div className="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10">

                {/* Animated Background Elements (CSS based) */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute top-1/4 left-0 w-96 h-96 bg-f1-red rounded-full filter blur-[128px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-f1-red rounded-full filter blur-[128px] animate-pulse delay-1000"></div>
                </div>

                <h1 className="text-6xl md:text-8xl font-racing text-f1-offwhite tracking-tighter mb-4 drop-shadow-lg">
                    F1<span className="text-f1-red">PEDIA</span>
                </h1>
                <p className="text-xl md:text-2xl text-f1-warmgray font-body max-w-2xl mb-12">
                    The ultimate historic database of Formula 1.
                    <br />
                    <span className="text-f1-red font-mono text-base mt-2 block">Powered by Spring Boot & React</span>
                </p>

                <div className="flex gap-6">
                    <Link to="/drivers" className="group relative px-8 py-4 bg-f1-red text-white font-racing text-xl tracking-wider uppercase skew-x-[-10deg] hover:bg-red-700 transition-colors">
                        <span className="block skew-x-[10deg] flex items-center gap-2">
                            Start Grid <Play fill="currentColor" size={16} />
                        </span>
                    </Link>
                    <Link to="/races" className="group relative px-8 py-4 border-2 border-f1-offwhite text-f1-offwhite font-racing text-xl tracking-wider uppercase skew-x-[-10deg] hover:bg-f1-offwhite hover:text-f1-black transition-colors">
                        <span className="block skew-x-[10deg]">
                            Analysis
                        </span>
                    </Link>
                </div>
            </div>

            {/* Footer / Credits */}
            <div className="py-6 text-center text-f1-warmgray font-mono text-xs z-10">
                DATA PROVIDED BY ERGAST API (VIA CSV ETL)
            </div>
        </div>
    );
}
