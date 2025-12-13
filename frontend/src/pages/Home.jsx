import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Users, Trophy, MapPin, ArrowRight, Play, ChevronDown, BarChart3, Flag, Calendar, Zap, Award } from 'lucide-react';
import { sfx } from '../utils/audio';

export default function Home() {
    const [loaded, setLoaded] = useState(false);
    const containerRef = useRef(null);
    const horizontalRef = useRef(null);

    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    useEffect(() => {
        // Play start lights sound
        sfx.startBeep();
        const timer = setTimeout(() => setLoaded(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const { scrollYProgress: horizontalProgress } = useScroll({
        target: horizontalRef,
        offset: ["start start", "end end"]
    });
    const horizontalX = useTransform(horizontalProgress, [0, 1], ["0%", "-75%"]);

    return (
        <div ref={containerRef} className="bg-black text-white">
            {/* Loading Screen - F1 Start Lights */}
            <AnimatePresence>
                {!loaded && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
                    >
                        <div className="flex gap-6 mb-12">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-12 h-12 rounded-full border-4 border-gray-800"
                                    initial={{ backgroundColor: '#1a1a1a' }}
                                    animate={{
                                        backgroundColor: '#DC0000',
                                        boxShadow: '0 0 30px rgba(220,0,0,0.8)'
                                    }}
                                    transition={{ delay: i * 0.2, duration: 0.1 }}
                                />
                            ))}
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="flex items-center justify-center gap-4"
                        >
                            <span className="text-6xl font-racing text-white">
                                F1<span className="text-f1-red">PEDIA</span>
                            </span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 z-50 origin-left bg-gradient-to-r from-f1-red via-orange-500 to-yellow-500"
                style={{ scaleX: smoothProgress }}
            />

            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 opacity-[0.02]" style={{
                        backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 100px, white 100px, white 102px)`
                    }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] md:w-[1000px] h-[600px] bg-f1-red/10 rounded-full blur-[200px]" />

                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute h-px bg-gradient-to-r from-transparent via-f1-red/50 to-transparent"
                            style={{ top: `${20 + i * 15}%`, left: 0, right: 0 }}
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={loaded ? { x: '100%', opacity: [0, 1, 0] } : {}}
                            transition={{ duration: 2, delay: i * 0.2 + 0.5, repeat: Infinity, repeatDelay: 3 }}
                        />
                    ))}
                </div>

                <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={loaded ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mb-12"
                    >
                        <div className="inline-flex items-center gap-4 px-6 py-3 border border-white/10 bg-white/5 backdrop-blur-sm">
                            <div className="flex gap-1">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className={`w-2 h-2 ${i % 2 === 0 ? 'bg-white' : 'bg-black border border-white/30'}`} />
                                ))}
                            </div>
                            <span className="text-sm font-mono tracking-[0.2em] text-gray-300 uppercase">Since 1950</span>
                            <div className="flex gap-1">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className={`w-2 h-2 ${i % 2 === 0 ? 'bg-white' : 'bg-black border border-white/30'}`} />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <div className="overflow-hidden mb-6">
                        <motion.div
                            className="flex items-center justify-center gap-4"
                            initial={{ y: 300 }}
                            animate={loaded ? { y: 0 } : {}}
                            transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.5 }}
                        >
                            <h1 className="text-6xl md:text-[10rem] lg:text-[12rem] font-racing leading-none tracking-tighter text-white">
                                F1<span className="text-f1-red">PEDIA</span>
                            </h1>
                        </motion.div>
                    </div>

                    <motion.div
                        className="flex items-center justify-center gap-2 mb-8"
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={loaded ? { opacity: 1, scaleX: 1 } : {}}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        <div className="h-2 w-32 bg-f1-red" />
                        <div className="h-2 w-16 bg-orange-500" />
                        <div className="h-2 w-8 bg-yellow-500" />
                    </motion.div>

                    <motion.p
                        className="text-xl md:text-2xl text-gray-400 mb-12"
                        initial={{ opacity: 0 }}
                        animate={loaded ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 1.2 }}
                    >
                        The Complete Encyclopedia of Formula 1 Racing
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap justify-center gap-6 mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={loaded ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 1.4 }}
                    >
                        {[
                            { value: '75', label: 'YEARS' },
                            { value: '862+', label: 'DRIVERS' },
                            { value: '1,124', label: 'RACES' },
                            { value: '34', label: 'CHAMPIONS' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                className="text-center px-8 py-4 bg-gray-900/50 border-l-4 border-f1-red"
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(225,6,0,0.1)' }}
                            >
                                <div className="text-4xl font-racing text-white tabular-nums">{stat.value}</div>
                                <div className="text-xs font-mono text-gray-500 tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={loaded ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 1.6 }}
                    >
                        <Link to="/drivers">
                            <motion.button
                                className="group relative px-14 py-6 bg-f1-red text-white font-racing text-xl tracking-wider uppercase overflow-hidden"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="relative z-10 flex items-center gap-4">
                                    <Play fill="currentColor" size={20} />
                                    Start Exploring
                                    <ArrowRight size={24} />
                                </span>
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={loaded ? { opacity: 1 } : {}}
                    transition={{ delay: 2 }}
                >
                    <motion.div
                        className="flex flex-col items-center gap-3"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">Scroll to explore</span>
                        <ChevronDown className="w-6 h-6 text-f1-red" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ===== F1 HISTORY TIMELINE ===== */}
            <section className="relative py-32 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />

                <div className="relative z-10 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-4 mb-6">
                            <Calendar className="w-5 h-5 text-f1-red" />
                            <span className="text-xs font-mono text-gray-600 tracking-widest uppercase">Through the decades</span>
                        </div>
                        <h2 className="text-4xl md:text-8xl font-racing">
                            <span className="text-white">75 YEARS OF</span>
                            <br />
                            <span className="text-f1-red">RACING HISTORY</span>
                        </h2>
                    </motion.div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Center line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-f1-red via-orange-500 to-f1-red" />

                        {[
                            {
                                era: '1950s',
                                title: 'THE BEGINNING',
                                description: 'Formula 1 is born. The first World Championship held at Silverstone. Alfa Romeo, Ferrari, and Maserati dominate.',
                                highlight: 'First Champion: Giuseppe Farina (1950)',
                                color: '#B8860B',
                            },
                            {
                                era: '1960s',
                                title: 'THE BRITISH ERA',
                                description: 'Cooper revolutionizes with rear-engine cars. Jim Clark and Graham Hill become legends. Lotus innovations change racing.',
                                highlight: 'Jim Clark wins 25 races, 2 titles',
                                color: '#00A651',
                            },
                            {
                                era: '1970s',
                                title: 'GROUND EFFECTS',
                                description: 'Aerodynamics become crucial. Lotus introduces ground effects. Lauda vs Hunt rivalry captivates the world.',
                                highlight: 'Lauda comeback after Nürburgring crash',
                                color: '#FFD700',
                            },
                            {
                                era: '1980s',
                                title: 'TURBO ERA',
                                description: 'Turbocharged engines dominate. McLaren-Honda partnership begins. Prost and Senna rivalry ignites.',
                                highlight: 'Senna vs Prost: F1\'s greatest rivalry',
                                color: '#FF8C00',
                            },
                            {
                                era: '1990s',
                                title: 'TECHNOLOGY REVOLUTION',
                                description: 'Active suspension, traction control emerge. Williams and Benetton rise. Schumacher begins his dominance.',
                                highlight: 'Williams wins 5 Constructors\' titles',
                                color: '#0057A0',
                            },
                            {
                                era: '2000s',
                                title: 'SCHUMACHER ERA',
                                description: 'Michael Schumacher and Ferrari rewrite records. 5 consecutive titles. Alonso ends the red reign.',
                                highlight: 'Schumacher: 7 titles, 91 wins',
                                color: '#DC0000',
                            },
                            {
                                era: '2010s',
                                title: 'HYBRID DOMINANCE',
                                description: 'Red Bull dominates early with Vettel. Mercedes-Hamilton era begins in 2014. 6 consecutive double titles.',
                                highlight: 'Hamilton matches Schumacher\'s 7 titles',
                                color: '#00D2BE',
                            },
                            {
                                era: '2020s',
                                title: 'NEW ERA',
                                description: 'Ground effect cars return. Verstappen dominance begins. Cost cap and sustainability focus reshape F1.',
                                highlight: 'Verstappen: 4 consecutive titles',
                                color: '#1E41FF',
                            },
                        ].map((era, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className={`relative flex items-center mb-16 md:mb-24 ${i % 2 === 0 ? 'md:justify-start' : 'md:justify-end'} justify-end`}
                            >
                                {/* Timeline dot */}
                                <motion.div
                                    className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-black"
                                    style={{ backgroundColor: era.color }}
                                    whileHover={{ scale: 1.5 }}
                                />

                                {/* Era card */}
                                <motion.div
                                    className={`w-full ml-12 md:ml-0 md:w-[45%] p-6 md:p-8 bg-gray-900/50 border border-gray-800 backdrop-blur-sm 
                                    ${i % 2 === 0 ? 'md:mr-auto md:text-right md:pr-16 text-left' : 'md:ml-auto md:text-left md:pl-16 text-left'}`}
                                    whileHover={{ borderColor: era.color, backgroundColor: `${era.color}10` }}
                                >
                                    <div className="text-4xl md:text-6xl font-racing mb-2" style={{ color: era.color }}>{era.era}</div>
                                    <h3 className="text-xl md:text-2xl font-racing text-white mb-3">{era.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{era.description}</p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/50 border-l-2" style={{ borderColor: era.color }}>
                                        <Zap className="w-3 h-3" style={{ color: era.color }} />
                                        <span className="text-xs font-mono text-gray-300">{era.highlight}</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HORIZONTAL SCROLL SHOWCASE ===== */}
            <section ref={horizontalRef} className="relative h-[400vh]">
                <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                    <div className="absolute top-8 left-0 right-0 flex justify-between px-8 text-xs font-mono text-gray-700">
                        <span>START</span>
                        <span>SECTOR 1</span>
                        <span>SECTOR 2</span>
                        <span>SECTOR 3</span>
                        <span>FINISH</span>
                    </div>

                    <div className="absolute top-14 left-8 right-8 h-1 bg-gray-900">
                        <motion.div
                            className="h-full bg-f1-red"
                            style={{ scaleX: horizontalProgress, transformOrigin: 'left' }}
                        />
                    </div>

                    <motion.div
                        className="flex gap-8 pl-[10vw]"
                        style={{ x: horizontalX }}
                    >
                        {[
                            { title: 'DRIVERS', subtitle: 'Every legend who ever sat behind the wheel', stat: '862+', icon: Users, to: '/drivers', number: '01' },
                            { title: 'TEAMS', subtitle: 'Complete constructor history from 1950', stat: '211+', icon: Trophy, to: '/teams', number: '02' },
                            { title: 'CIRCUITS', subtitle: 'Every track that has hosted a Grand Prix', stat: '77', icon: MapPin, to: '/circuits', number: '03' },
                            { title: 'ANALYTICS', subtitle: 'Deep performance insights and data', stat: '∞', icon: BarChart3, to: '/analytics', number: '04' },
                        ].map((item, i) => (
                            <Link key={i} to={item.to}>
                                <motion.div
                                    className="relative w-[80vw] md:w-[50vw] h-[70vh] p-12 bg-gray-950 border border-gray-900 overflow-hidden group"
                                    whileHover={{ borderColor: '#E10600' }}
                                >
                                    <div className="absolute top-0 right-0 text-[20rem] font-racing text-white/[0.02] leading-none select-none">
                                        {item.number}
                                    </div>
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-f1-red via-orange-500 to-f1-red opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative z-10 h-full flex flex-col">
                                        <div className="flex items-start justify-between mb-8">
                                            <item.icon className="w-12 h-12 text-f1-red" />
                                            <span className="text-xs font-mono text-gray-700 tracking-widest">SECTOR {item.number}</span>
                                        </div>
                                        <div className="text-8xl font-racing text-f1-red mb-4">{item.stat}</div>
                                        <h3 className="text-5xl font-racing text-white mb-6 group-hover:text-f1-red transition-colors">{item.title}</h3>
                                        <p className="text-lg text-gray-500 mb-auto max-w-md">{item.subtitle}</p>
                                        <motion.div className="flex items-center gap-3 text-f1-red font-mono uppercase tracking-wider" whileHover={{ x: 10 }}>
                                            <Flag className="w-4 h-4" />
                                            Enter Section
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ===== ALL-TIME RECORDS ===== */}
            <section className="relative py-32 px-6 bg-gradient-to-b from-gray-950 to-black overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-4 mb-6">
                            <Award className="w-5 h-5 text-f1-red" />
                            <span className="text-xs font-mono text-gray-600 tracking-widest uppercase">The records that define greatness</span>
                        </div>
                        <h2 className="text-4xl md:text-8xl font-racing text-white">
                            ALL-TIME <span className="text-f1-red">RECORDS</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {[
                            { record: '104', label: 'MOST WINS', holder: 'Lewis Hamilton', team: 'Mercedes/McLaren', color: '#00D2BE' },
                            { record: '7', label: 'MOST TITLES', holder: 'Hamilton & Schumacher', team: '', color: '#FFD700' },
                            { record: '105', label: 'MOST POLES', holder: 'Lewis Hamilton', team: 'Mercedes/McLaren', color: '#00D2BE' },
                            { record: '77', label: 'MOST FASTEST LAPS', holder: 'Michael Schumacher', team: 'Ferrari/Benetton', color: '#DC0000' },
                            { record: '19', label: 'WINS IN A SEASON', holder: 'Max Verstappen (2023)', team: 'Red Bull', color: '#1E41FF' },
                            { record: '16', label: 'CONSTRUCTORS TITLES', holder: 'Ferrari', team: '', color: '#DC0000' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 bg-gray-900/30 border border-gray-800 group"
                                whileHover={{ borderColor: item.color, backgroundColor: `${item.color}10` }}
                            >
                                <div className="text-6xl font-racing mb-2" style={{ color: item.color }}>{item.record}</div>
                                <div className="text-xs font-mono text-gray-500 tracking-widest mb-4">{item.label}</div>
                                <div className="text-xl font-racing text-white">{item.holder}</div>
                                {item.team && <div className="text-sm font-mono" style={{ color: item.color }}>{item.team}</div>}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CHAMPIONS SECTION ===== */}
            <section className="relative py-32 px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px]">
                        <div className="flex items-end justify-center gap-4">
                            <div className="w-20 md:w-32 h-32 md:h-48 bg-white" />
                            <div className="w-20 md:w-32 h-48 md:h-64 bg-white" />
                            <div className="w-20 md:w-32 h-24 md:h-40 bg-white" />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-4 mb-6">
                            <div className="h-px w-16 bg-f1-red" />
                            <span className="text-xs font-mono text-gray-600 tracking-widest uppercase">Hall of Fame</span>
                            <div className="h-px w-16 bg-f1-red" />
                        </div>
                        <h2 className="text-4xl md:text-8xl font-racing">
                            <span className="text-white">WORLD</span> <span className="text-f1-red">CHAMPIONS</span>
                        </h2>
                    </motion.div>

                    <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-16">
                        <ChampionCard position={2} name="M. SCHUMACHER" titles={7} team="Ferrari" color="#DC0000" height="h-80" />
                        <ChampionCard position={1} name="L. HAMILTON" titles={7} team="Mercedes" color="#00D2BE" height="h-96" featured />
                        <ChampionCard position={3} name="M. VERSTAPPEN" titles={4} team="Red Bull" color="#1E41FF" height="h-72" />
                    </div>

                    <div className="text-center">
                        <Link to="/drivers">
                            <motion.button
                                className="px-12 py-5 border border-gray-800 font-racing text-lg tracking-wider uppercase"
                                whileHover={{ borderColor: '#E10600', backgroundColor: 'rgba(225,6,0,0.1)' }}
                            >
                                View All Champions <ArrowRight className="inline-block ml-3 w-5 h-5" />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="relative py-24 px-6 border-t border-gray-900">
                <div className="max-w-7xl mx-auto">
                    {/* Full-width checkered flag banner */}
                    <div className="absolute left-0 right-0 -top-4 flex">
                        {[...Array(100)].map((_, i) => (
                            <div key={i} className="flex flex-col flex-1">
                                <div className={`h-4 ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`} />
                                <div className={`h-4 ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`} />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                        <div>
                            <div className="text-5xl font-racing mb-2">F1<span className="text-f1-red">PEDIA</span></div>
                            <p className="text-gray-600 font-mono text-sm tracking-wider">THE COMPLETE F1 ARCHIVE • 1950—2024</p>
                        </div>
                        <nav className="flex flex-wrap justify-center gap-8">
                            {['Drivers', 'Teams', 'Races', 'Circuits', 'Analytics'].map((item) => (
                                <Link key={item} to={`/${item.toLowerCase()}`} className="text-gray-500 hover:text-f1-red transition-colors font-mono text-sm uppercase tracking-wider">
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function ChampionCard({ position, name, titles, team, color, height, featured }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: position === 1 ? 0 : position === 2 ? 0.1 : 0.2 }}
            className={`w-full md:w-72 ${height}`}
        >
            <motion.div
                className={`h-full p-8 bg-gray-950 border ${featured ? 'border-f1-red' : 'border-gray-900'} relative overflow-hidden`}
                whileHover={{ y: -10, borderColor: color }}
            >
                <div className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center font-racing text-2xl text-black"
                    style={{ backgroundColor: position === 1 ? '#FFD700' : position === 2 ? '#C0C0C0' : '#CD7F32' }}>
                    P{position}
                </div>
                <div className="absolute top-0 right-0 w-2 h-full" style={{ backgroundColor: color }} />
                <div className="pt-12 text-center">
                    <div className="text-6xl font-racing mb-2" style={{ color }}>{titles}×</div>
                    <div className="text-xs font-mono text-gray-500 tracking-widest mb-6">WORLD CHAMPION</div>
                    <div className="text-2xl font-racing text-white mb-2">{name}</div>
                    <div className="text-sm font-mono" style={{ color }}>{team}</div>
                </div>
            </motion.div>
        </motion.div>
    );
}
