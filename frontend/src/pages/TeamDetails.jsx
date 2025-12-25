import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getConstructorById, getConstructorDriverStats, getConstructorSeasons, getConstructorCircuits, getConstructorDashboardStats, getConstructorStatusBreakdown, getConstructorPointsHeatmap, getConstructorGeoPerformance } from '../services/api';
import { Trophy, ArrowLeft, Globe, Flag, Calendar } from 'lucide-react';
import { getDriverPhotoOrPlaceholder } from '../utils/driverPhotos';
import TeamAnalytics from '../components/teams/TeamAnalytics';
import TeamSeasons from '../components/teams/TeamSeasons';
import TeamCircuits from '../components/teams/TeamCircuits';
import TeamOverview from '../components/teams/TeamOverview';
import SmartLoader from '../components/SmartLoader';

/**
 * TeamDetails Page
 * Displays comprehensive details for a specific constructor, including
 * overview, season history, circuit performance, and driver roster.
 */
export default function TeamDetails() {
    const { id, "*": tabParam } = useParams();
    const navigate = useNavigate();
    // const location = useLocation(); // Unused

    const [team, setTeam] = useState(null);
    const [driverStats, setDriverStats] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [circuits, setCircuits] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [statusStats, setStatusStats] = useState([]);
    const [geoStats, setGeoStats] = useState([]);
    const [heatmapStats, setHeatmapStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sync state with URL param or default to 'overview'
    const activeTab = tabParam || 'overview';

    const handleTabChange = (tab) => {
        // Navigate to the new tab URL
        // If tab is 'overview', we can either go to /teams/:id or /teams/:id/overview
        // Let's stick to explicit paths for cleaner refreshing
        navigate(`/teams/${id}/${tab}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [teamRes, statsRes, seasonsRes, circuitsRes, dashboardRes, statusRes, geoRes, heatmapRes] = await Promise.all([
                    getConstructorById(id),
                    getConstructorDriverStats(id),
                    getConstructorSeasons(id),
                    getConstructorCircuits(id),
                    getConstructorDashboardStats(id),
                    getConstructorStatusBreakdown(id),
                    getConstructorGeoPerformance(id),
                    getConstructorPointsHeatmap(id)
                ]);
                setTeam(teamRes.data);
                setDriverStats(statsRes.data);
                setSeasons(seasonsRes.data);
                setCircuits(circuitsRes.data);
                setDashboardStats(dashboardRes.data);
                setStatusStats(statusRes.data);
                setGeoStats(geoRes.data);
                setHeatmapStats(heatmapRes.data);
            } catch (err) {
                setError('Failed to load team details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <SmartLoader message="Analyzing Team Telemetry..." />;

    if (error || !team) return (
        <div className="min-h-screen bg-f1-black p-8 text-f1-offwhite">
            <div className="text-red-500 mb-4">{error || 'Team not found'}</div>
            <Link to="/teams" className="text-f1-red hover:underline flex items-center gap-2"><ArrowLeft size={16} /> Back to Teams</Link>
        </div>
    );

    const totalPoints = driverStats.reduce((sum, d) => sum + (d.totalPoints || 0), 0);
    const totalWins = driverStats.reduce((sum, d) => sum + (d.wins || 0), 0);
    const totalPodiums = driverStats.reduce((sum, d) => sum + (d.podiums || 0), 0);

    return (
        <div className="min-h-screen bg-f1-black pb-12">
            {/* Hero Header */}
            <div className="bg-f1-charcoal border-b border-f1-red relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                    <Link to="/teams" className="inline-flex items-center gap-2 text-f1-warmgray hover:text-white mb-6 transition-colors text-sm uppercase tracking-wider">
                        <ArrowLeft size={16} /> Back to Constructors
                    </Link>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 bg-f1-black rounded-full flex items-center justify-center border-4 border-f1-offwhite shadow-lg flex-shrink-0">
                            <img
                                src={`https://ui-avatars.com/api/?name=${team.name}&background=E10600&color=fff&size=128&font-size=0.4`}
                                alt={team.name}
                                className="rounded-full"
                            />
                        </div>

                        <div className="flex-1">
                            <h1 className="text-5xl md:text-6xl font-racing text-f1-offwhite uppercase tracking-tighter">{team.name}</h1>
                            <div className="flex items-center gap-6 mt-4 text-f1-warmgray font-mono">
                                <span className="flex items-center gap-2"><Globe size={18} className="text-f1-red" /> {team.nationality}</span>
                                <a href={team.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors underline decoration-f1-red">
                                    Official Wiki Page
                                </a>
                            </div>
                        </div>

                        <div className="flex gap-6 text-center">
                            <div>
                                <div className="text-4xl font-racing text-f1-red">{totalPoints.toLocaleString()}</div>
                                <div className="text-xs text-f1-warmgray font-mono uppercase">Total Points</div>
                            </div>
                            <div>
                                <div className="text-4xl font-racing text-yellow-500">{totalWins}</div>
                                <div className="text-xs text-f1-warmgray font-mono uppercase">Wins</div>
                            </div>
                            <div>
                                <div className="text-4xl font-racing text-orange-500">{totalPodiums}</div>
                                <div className="text-xs text-f1-warmgray font-mono uppercase">Podiums</div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-12 overflow-x-auto">
                        {['overview', 'seasons', 'circuits', 'analytics', 'drivers'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`px-6 py-2 font-racing uppercase text-sm tracking-wider transition-colors ${activeTab === tab
                                    ? 'bg-f1-red text-white'
                                    : 'bg-black/40 text-f1-warmgray hover:text-white hover:bg-black/60'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <Trophy className="absolute -bottom-12 -right-12 text-black/20 h-96 w-96 transform rotate-12" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <TeamOverview
                        team={team}
                        driverStats={driverStats}
                        seasons={seasons}
                        dashboardStats={dashboardStats}
                        statusStats={statusStats}
                        geoStats={geoStats}
                        heatmapStats={heatmapStats}
                        setActiveTab={handleTabChange}
                    />
                )}

                {/* Seasons Tab */}
                {activeTab === 'seasons' && (
                    <div className="fade-in">
                        <TeamSeasons seasons={seasons} />
                    </div>
                )}

                {/* Circuits Tab */}
                {activeTab === 'circuits' && (
                    <div className="fade-in">
                        <TeamCircuits circuits={circuits} />
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="fade-in">
                        <TeamAnalytics driverStats={driverStats} />
                    </div>
                )}

                {/* Drivers Tab */}
                {activeTab === 'drivers' && (
                    <div className="fade-in">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-racing text-f1-offwhite border-l-4 border-f1-red pl-4">Team Drivers</h2>
                            <span className="text-f1-warmgray font-mono text-sm">{driverStats.length} Drivers Found</span>
                        </div>

                        {driverStats.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {driverStats.map(driver => (
                                    <TeamDriverCard key={driver.driverId} driver={driver} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-f1-warmgray italic">No driver records found for this team.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// F1 Wheel SVG component
function F1Wheel({ spinning }) {
    return (
        <div className={`w-10 h-10 flex-shrink-0 ${spinning ? 'animate-spin' : ''}`} style={{ animationDuration: '0.5s' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Outer tyre */}
                <circle cx="50" cy="50" r="48" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
                {/* Tread pattern */}
                <circle cx="50" cy="50" r="44" fill="none" stroke="#444" strokeWidth="6" strokeDasharray="12 6" />
                {/* Rim */}
                <circle cx="50" cy="50" r="32" fill="#2a2a2a" />
                <circle cx="50" cy="50" r="28" fill="#333" />
                {/* Center hub */}
                <circle cx="50" cy="50" r="14" fill="#E10600" />
                <circle cx="50" cy="50" r="8" fill="#1a1a1a" />
                {/* Spokes */}
                {[0, 72, 144, 216, 288].map((angle, i) => (
                    <line
                        key={i}
                        x1="50"
                        y1="50"
                        x2={50 + 22 * Math.cos((angle * Math.PI) / 180)}
                        y2={50 + 22 * Math.sin((angle * Math.PI) / 180)}
                        stroke="#555"
                        strokeWidth="4"
                    />
                ))}
            </svg>
        </div>
    );
}

// Card with photo on TOP, wheel + name below
function TeamDriverCard({ driver }) {
    const [expanded, setExpanded] = useState(false);
    const [spinning, setSpinning] = useState(false);

    const driverPhoto = getDriverPhotoOrPlaceholder(driver.forename, driver.surname);

    const handleClick = (e) => {
        e.stopPropagation();
        if (!expanded) {
            setSpinning(true);
            setTimeout(() => {
                setSpinning(false);
                setExpanded(true);
            }, 500);
        } else {
            setExpanded(false);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`relative bg-f1-charcoal border-2 border-f1-warmgray rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:border-f1-red ${expanded ? 'ring-2 ring-f1-red' : ''}`}
        >
            {/* Code badge - top right */}
            <div className="absolute top-2 right-2 flex flex-col items-end z-10">
                <span className="font-mono text-f1-red text-sm font-bold">#{driver.code || 'N/A'}</span>
            </div>

            {/* Driver Photo on TOP */}
            <div className="p-4 flex justify-center bg-gray-900 border-b-2 border-f1-red relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <img
                    src={driverPhoto}
                    alt={`${driver.forename} ${driver.surname}`}
                    className="w-32 h-32 object-cover rounded-md border-2 border-white shadow-lg z-10"
                    style={{ imageRendering: 'pixelated' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x128/222428/E10600?text=NO+IMG'; }}
                />
            </div>

            {/* Name section with wheel on left */}
            <div className="p-4 flex items-center gap-3">
                {/* Wheel on left */}
                <F1Wheel spinning={spinning} />

                {/* Name and nationality */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        {/* Driver Number - racing style */}
                        {driver.number && (
                            <span
                                className="font-racing text-white/20 select-none"
                                style={{ fontSize: '2.5rem', lineHeight: 1 }}
                            >
                                {driver.number}
                            </span>
                        )}
                        <h3 className="font-racing text-lg text-f1-offwhite uppercase tracking-wide truncate">
                            {driver.forename} {driver.surname}
                        </h3>
                    </div>
                    <p className="text-sm text-f1-warmgray">{driver.nationality}</p>
                </div>

                {/* Points with gradient */}
                <div className="text-right">
                    <div
                        className="text-xl font-racing font-bold"
                        style={{
                            background: 'linear-gradient(135deg, #E10600 0%, #FF6B35 50%, #FFD700 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    >
                        {driver.totalPoints?.toFixed(0) || 0}
                    </div>
                    <div className="text-xs text-f1-warmgray font-mono">PTS</div>
                </div>
            </div>

            {/* Expandable stats section */}
            <div className={`overflow-hidden transition-all duration-500 ${expanded ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 pt-0 border-t border-gray-700">
                    <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                        <div className="text-center p-2 bg-black/30 rounded">
                            <Trophy className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                            <span className="block text-f1-offwhite text-lg font-racing">{driver.wins || 0}</span>
                            <span className="text-f1-warmgray">Wins</span>
                        </div>
                        <div className="text-center p-2 bg-black/30 rounded">
                            <Trophy className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                            <span className="block text-f1-offwhite text-lg font-racing">{driver.podiums || 0}</span>
                            <span className="text-f1-warmgray">Podiums</span>
                        </div>
                        <div className="text-center p-2 bg-black/30 rounded">
                            <Flag className="w-4 h-4 text-f1-red mx-auto mb-1" />
                            <span className="block text-f1-offwhite text-lg font-racing">{driver.races || 0}</span>
                            <span className="text-f1-warmgray">Races</span>
                        </div>
                        <div className="text-center p-2 bg-black/30 rounded">
                            <Calendar className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                            <span className="block text-f1-offwhite text-sm font-racing">{driver.yearsActive || 'N/A'}</span>
                            <span className="text-f1-warmgray">Years</span>
                        </div>
                    </div>
                    <p className="text-center text-xs text-f1-warmgray mt-3 font-mono">Click to collapse</p>
                </div>
            </div>
        </div>
    );
}
