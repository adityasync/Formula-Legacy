import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Settings, X } from 'lucide-react';
import { useAudioStore, sfx } from '../utils/audio';

export default function AudioSettings() {
    const [isOpen, setIsOpen] = useState(false);
    const { muted, volume, sfxEnabled, toggleMute, setVolume, setSfxEnabled } = useAudioStore();

    const handleToggle = () => {
        sfx.click();
        setIsOpen(!isOpen);
    };

    const handleVolumeChange = (e) => {
        setVolume(parseFloat(e.target.value));
    };

    const handleMuteToggle = () => {
        toggleMute();
        if (!muted) {
            // Will be muted after toggle
        } else {
            sfx.click();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Settings Button */}
            <motion.button
                onClick={handleToggle}
                className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-f1-red transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </motion.button>

            {/* Settings Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="absolute bottom-16 right-0 w-72 bg-gray-900 border border-gray-800 p-5 shadow-xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Settings size={16} className="text-f1-red" />
                                <span className="font-racing text-lg text-white">AUDIO</span>
                            </div>
                            <button
                                onClick={handleToggle}
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Mute Toggle */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                            <span className="text-sm text-gray-400 font-mono">Master Audio</span>
                            <button
                                onClick={handleMuteToggle}
                                className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${muted ? 'bg-gray-700' : 'bg-f1-red'
                                    }`}
                            >
                                <motion.div
                                    className="w-5 h-5 bg-white rounded-full shadow-md"
                                    animate={{ x: muted ? 0 : 20 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            </button>
                        </div>

                        {/* Volume Slider */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400 font-mono">Volume</span>
                                <span className="text-sm text-white font-mono">{Math.round(volume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={handleVolumeChange}
                                disabled={muted}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-f1-red disabled:opacity-50"
                            />
                        </div>

                        {/* SFX Toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400 font-mono">UI Sound Effects</span>
                            <button
                                onClick={() => {
                                    setSfxEnabled(!sfxEnabled);
                                    if (!sfxEnabled) sfx.click();
                                }}
                                disabled={muted}
                                className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors disabled:opacity-50 ${sfxEnabled && !muted ? 'bg-f1-red' : 'bg-gray-700'
                                    }`}
                            >
                                <motion.div
                                    className="w-5 h-5 bg-white rounded-full shadow-md"
                                    animate={{ x: sfxEnabled && !muted ? 20 : 0 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            </button>
                        </div>

                        {/* Test Sound Button */}
                        <button
                            onClick={() => sfx.engineRev()}
                            disabled={muted}
                            className="w-full mt-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-sm font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
                        >
                            🏎️ Test Engine Sound
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
