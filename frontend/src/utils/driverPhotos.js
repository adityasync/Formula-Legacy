// Maps driver surnames to their 8-bit portrait filenames
const driverPhotoMap = {
    'Hamilton': 'lewis_hamilton_8bit.png',
    'Schumacher': 'michael_schumacher_8bit.png',
    'Verstappen': 'max_verstappen_8bit.png',
    'Vettel': 'sebastian_vettel_8bit.png',
    'Prost': 'alain_prost_8bit.png',
    'Senna': 'ayrton_senna_8bit.png',
    'Alonso': 'fernando_alonso_8bit.png',
    'Mansell': 'nigel_mansell_8bit.png',
    'Stewart': 'jackie_stewart_8bit.png',
    'Lauda': 'niki_lauda_8bit.png',
    'Clark': 'jim_clark_8bit.png',
    'Fangio': 'juan_manuel_fangio_8bit.png',
    'Piquet': 'nelson_piquet_8bit.png',
    'Rosberg': 'nico_rosberg_8bit.png',
    'Hill': 'damon_hill_8bit.png', // Also covers Graham Hill
    'Räikkönen': 'kimi_raikkonen_8bit.png',
    'Häkkinen': 'mika_hakkinen_8bit.png',
    'Moss': 'stirling_moss_8bit.png',
    'Button': 'jenson_button_8bit.png',
    'Brabham': 'jack_brabham_8bit.png',
    'Fittipaldi': 'emerson_fittipaldi_8bit.png',
    'Ascari': 'alberto_ascari_8bit.png',
    'Coulthard': 'david_coulthard_8bit.png',
    'Andretti': 'mario_andretti_8bit.png',
    'Jones': 'alan_jones_8bit.png',
    'Reutemann': 'carlos_reutemann_8bit.png',
    'Barrichello': 'rubens_barrichello_8bit.png',
    'Massa': 'felipe_massa_8bit.png',
    'Villeneuve': 'jacques_villeneuve_8bit.png',
    'Berger': 'gerhard_berger_8bit.png',
    'Bottas': 'valtteri_bottas_8bit.png',
    'Hunt': 'james_hunt_8bit.png',
    'Peterson': 'ronnie_peterson_8bit.png',
    'Leclerc': 'charles_leclerc_8bit.png',
    'Ricciardo': 'daniel_ricciardo_8bit.png',
    'Norris': 'lando_norris_8bit.png',
    'Sainz': 'carlos_sainz_8bit.png',
    'Russell': 'george_russell_8bit.png',
};

export function getDriverPhoto(surname) {
    const filename = driverPhotoMap[surname];
    if (filename) {
        return `/assets/${filename}`;
    }
    return null;
}

export function getDriverPhotoOrPlaceholder(forename, surname) {
    const photo = getDriverPhoto(surname);
    if (photo) return photo;
    // Fallback to UI Avatars
    return `https://ui-avatars.com/api/?name=${forename}+${surname}&background=E10600&color=fff&size=128`;
}

export default driverPhotoMap;
