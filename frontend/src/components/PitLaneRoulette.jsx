import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, X, ChevronRight } from 'lucide-react';
import { getTeamColor } from '../utils/teamColors';
import TeamLogo from './TeamLogo';

export default function PitLaneRoulette({ teams, isOpen, onClose }) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [finalTeam, setFinalTeam] = useState(null);
    const [countdown, setCountdown] = useState(null);

    // Reset when opened
    useEffect(() => {
        if (isOpen && teams.length > 0) {
            setFinalTeam(null);
            setCountdown(null);
            setCurrentTeam(teams[0]);
        }
    }, [isOpen, teams]);

    const startSpin = () => {
        setIsSpinning(true);
        setFinalTeam(null);

        // Sound effect here ideally (revving engine)

        // Slot machine effect: cycle teams rapidly
        let spinCount = 0;
        const maxSpins = 30; // Number of flips before stopping
        const speed = 50; // ms per flip

        const interval = setInterval(() => {
            const random = teams[Math.floor(Math.random() * teams.length)];
            setCurrentTeam(random);
            spinCount++;

            if (spinCount > maxSpins) {
                clearInterval(interval);
                setIsSpinning(false);

                // Pick final winner
                const winner = teams[Math.floor(Math.random() * teams.length)];
                setFinalTeam(winner);
                setCurrentTeam(winner);

                // Start Countdown to navigate
                startCountdown(winner.constructorId);
            }
        }, speed);
    };

    const startCountdown = (id) => {
        setCountdown(3);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Launch!
                    setTimeout(() => {
                        window.location.href = `/teams/${id}`;
                    }, 500);
                    return "GO!";
                }
                return prev - 1;
            });
        }, 800);
    };

    if (!isOpen) return null;

    const teamColor = currentTeam ? getTeamColor(currentTeam.constructorRef) : '#333';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
            >
                <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white p-2">
                    <X size={32} />
                </button>

                <div className="flex flex-col items-center w-full max-w-lg p-8 relative">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-racing text-white uppercase tracking-tighter mb-2 italic">Pit Lane Roulette</h2>
                        <div className="h-1 w-24 bg-f1-red mx-auto skew-x-[-20deg]" />
                    </div>

                    {/* The Machine Display */}
                    <div className="relative w-full aspect-square max-w-sm bg-gray-900 border-4 border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center mb-8 group">

                        {/* Background Glow */}
                        <div className="absolute inset-0 opacity-30 transition-colors duration-200"
                            style={{ background: `radial-gradient(circle, ${teamColor}, transparent)` }} />

                        {/* Current Team Display */}
                        <AnimatePresence mode='wait'>
                            {currentTeam && (
                                <motion.div
                                    key={currentTeam.constructorId}
                                    initial={{ y: 20, opacity: 0.5 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0.5 }}
                                    transition={{ duration: 0.1 }}
                                    className="flex flex-col items-center z-10"
                                >
                                    <TeamLogo
                                        teamName={currentTeam.name}
                                        constructorRef={currentTeam.constructorRef}
                                        className="w-40 h-40 mb-6 drop-shadow-2xl"
                                    />
                                    <h3
                                        className="text-3xl font-racing text-white uppercase text-center leading-none"
                                        style={{ textShadow: `0 0 20px ${teamColor}` }}
                                    >
                                        {currentTeam.name}
                                    </h3>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Countdown Overlay */}
                        {countdown && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                <motion.div
                                    key={countdown}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1.5, opacity: 1 }}
                                    exit={{ scale: 2, opacity: 0 }}
                                    className={`text-8xl font-black italic tracking-tighter ${countdown === "GO!" ? "text-green-500" : "text-white"}`}
                                >
                                    {countdown}
                                </motion.div>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    {!finalTeam && (
                        <button
                            onClick={startSpin}
                            disabled={isSpinning}
                            className={`
                                relative overflow-hidden px-12 py-4 bg-f1-red text-white font-racing text-2xl uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(225,6,0,0.4)]
                                hover:shadow-[0_0_50px_rgba(225,6,0,0.6)] hover:scale-105 active:scale-95 transition-all
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {isSpinning ? 'Revving...' : 'SPIN TO DISCOVER'}
                        </button>
                    )}

                    {finalTeam && !countdown && (
                        <div className="text-gray-400 font-mono text-sm animate-pulse">Launching...</div>
                    )}

                </div>
            </motion.div>
        </AnimatePresence>
    );
}
