import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

const F1_FACTS = [
    "Juan Manuel Fangio won the World Championship with 4 different teams, a record that still stands.",
    "A Formula 1 car produces so much downforce that it could theoretically drive upside down on a tunnel ceiling at 100 mph.",
    "Pit stops used to take over a minute in the 1950s. Today, the world record is 1.80 seconds (McLaren, 2023).",
    "Drivers can lose up to 4kg (8.8lbs) of body weight during a single race due to heat and G-forces.",
    "An F1 engine lasts only about 7 races, whereas a commercial car engine typically lasts for 20 years.",
    "Before 2014, F1 cars used V8, V10, and V12 engines. Now, they use 1.6-liter V6 turbo-hybrids, the most efficient engines in the world.",
    "The halo device, introduced in 2018, can withstand the weight of a double-decker bus (12 tonnes).",
    "At full speed, an F1 engine breathes 650 liters of air per second.",
    "Max Verstappen is the youngest driver to ever start a Formula 1 race at 17 years and 166 days.",
    "Lewis Hamilton is the only driver to have won a race in every season he competed in (until 2022).",
    "The 2011 Canadian Grand Prix was the longest race in history, lasting 4 hours, 4 minutes, and 39 seconds."
];

export default function SmartLoader({ message = "Loading Data..." }) {
    const [currentFact, setCurrentFact] = useState(F1_FACTS[0]);
    const [showFacts, setShowFacts] = useState(false);

    useEffect(() => {
        // Only show facts if loading takes longer than 5 seconds
        const delayTimer = setTimeout(() => {
            setShowFacts(true);
        }, 5000);

        const interval = setInterval(() => {
            setCurrentFact(prev => {
                const currentIndex = F1_FACTS.indexOf(prev);
                return F1_FACTS[(currentIndex + 1) % F1_FACTS.length];
            });
        }, 4000);

        return () => {
            clearTimeout(delayTimer);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.8),rgba(0,0,0,1)),url('/grid-bg.png')] bg-cover opacity-20 pointer-events-none" />
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-f1-red via-transparent to-f1-red opacity-50" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center gap-8 max-w-xl w-full z-10"
            >
                {/* F1 Starting Lights Animation */}
                <div className="flex gap-4 mb-4">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ backgroundColor: "#333" }}
                            animate={{ backgroundColor: ["#333", "#ef4444", "#333"] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                                repeatDelay: 1
                            }}
                            className="w-8 h-8 rounded-full border-2 border-gray-800 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        />
                    ))}
                </div>

                {/* Brand Logo & Message */}
                <div className="text-center space-y-2">
                    <span className="text-4xl font-racing text-white block">
                        Race<span className="text-f1-red"> Control</span>
                    </span>
                    <div className="text-sm font-mono text-f1-red tracking-[0.2em] uppercase animate-pulse">
                        {message}
                    </div>
                </div>

                {/* F1 Fact Card - Broadcast Graphic Style */}
                <AnimatePresence>
                    {showFacts && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full relative"
                        >
                            {/* Graphic Borders */}
                            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-f1-red rounded-l-sm" />

                            <div className="bg-gray-900 border-l-0 border-t border-r border-b border-gray-800 rounded-r-lg p-6 relative overflow-hidden">
                                {/* Diagonal decorative line */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 -rotate-45 transform translate-x-8 -translate-y-8" />

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentFact}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex items-center gap-3 mb-3 border-b border-gray-800 pb-2">
                                            <div className="bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">FACT</div>
                                            <span className="text-gray-500 font-mono text-xs uppercase tracking-wider">Telemetry Trivia</span>
                                        </div>
                                        <p className="text-gray-300 font-mono text-md leading-relaxed">
                                            {currentFact}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Technical status footer */}
                <div className="fixed bottom-8 flex items-center gap-2 text-[10px] text-gray-700 font-mono uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    System Normal • v24.1
                </div>
            </motion.div>
        </div>
    );
}
