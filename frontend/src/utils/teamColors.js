export const getTeamColor = (constructorRef) => {
    const colors = {
        // Modern Era
        'red_bull': '#0600EF', // Deep Blue
        'ferrari': '#E8002D', // Vivid Red
        'mercedes': '#00D2BE', // Teal
        'mclaren': '#FF8700', // Papaya Orange
        'aston_martin': '#225941', // Racing Green
        'alpine': '#0093CC', // Alpine Blue
        'williams': '#00A0DE', // Bright Cyan
        'rb': '#6692FF',
        'sauber': '#52E252',
        'haas': '#B6BABD',

        // Historic / Recent
        'alpha_tauri': '#5E8FAA',
        'alphatauri': '#5E8FAA',
        'toro_rosso': '#469BFF',
        'racing_point': '#F596C8',
        'force_india': '#F596C8',
        'renault': '#FFF500',
        'lotus_f1': '#E5C554', // Black & Gold
        'marussia': '#6E0000',
        'manor': '#323232',
        'caterham': '#005030',
        'hrt': '#A6904F',
        'virgin': '#C82121',
        'bmw_sauber': '#FFFFFF', // White with blue/red stripes
        'toyota': '#E3211D',
        'honda': '#CD222B', // Or white/red
        'super_aguri': '#CA2E34',
        'spyker': '#FF7120',
        'midland': '#808080',
        'minardi': '#000000', // Often black/gold or black/white
        'bar': '#E8E8E8', // BAT 
        'jaguar': '#004225', // Racing Green
        'arrows': '#FFA500',
        'prost': '#00009C', // French Blue
        'benetton': '#00A0DD', // Light Blue (mostly)
        'jordan': '#F5D304', // Yellow
        'stewart': '#FFFFFF', // White tartan
        'tyrrell': '#2F4F4F',
        'ligier': '#0055A5',

        // Legends
        'brabham': '#1C2754', // Dark Blue/White
        'lotus-ford': '#102F23', // Classic Green/Yellow
        'lotus-climax': '#102F23',
        'cooper': '#102F23',
        'cooper-climax': '#102F23',
        'vanwall': '#102F23',
        'maserati': '#CE2329',
        'alfa': '#9B0000', // Burgundy Red
        'alfa_romeo': '#9B0000',
        'matra': '#094C9B',
        'march': '#E82128',
    };

    // Normalize input key slightly
    const key = (constructorRef || '').toLowerCase().replace(/\s+/g, '_');
    return colors[key] || colors[constructorRef] || '#333333'; // Default to dark gray
};

export const getTeamTextColor = (bgColor) => {
    // Simple logic: if bg is light, return black, else white
    // This is a rough approximation.
    const darkBackgrounds = [
        '#333333', '#1C2754', '#102F23', '#225941', '#6E0000',
        '#004225', '#00009C', '#0055A5', '#2F4F4F', '#F91536', '#3671C6'
    ];

    // Convert hex to logic if needed, but for now simple override
    if (['#FFFFFF', '#E8E8E8', '#FFF500', '#F5D304', '#6692FF', '#52E252', '#6CD3BF'].includes(bgColor)) {
        return '#000000';
    }
    return '#FFFFFF';
};
