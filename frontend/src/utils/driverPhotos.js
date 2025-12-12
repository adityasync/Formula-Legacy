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
    'Fangio': 'juan_fangio_8bit.png',
    'Piquet': 'nelson_piquet_8bit.png',
    'Rosberg': 'nico_rosberg_8bit.png',
    'Hill': 'damon_hill_8bit.png',
    'G. Hill': 'graham_hill_8bit.png', // Added Graham Hill
    'Graham Hill': 'graham_hill_8bit.png',
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
    // New additions
    'Webber': 'mark_webber_8bit.png',
    'Kubica': 'robert_kubica_8bit.png',
    'Pérez': 'sergio_perez_8bit.png',
    'Perez': 'sergio_perez_8bit.png',
    'Piastri': 'oscar_piastri_8bit.png',
    'Albon': 'alex_albon_8bit.png',
    'Stroll': 'lance_stroll_8bit.png',
    'Tsunoda': 'yuki_tsunoda_8bit.png',
    'Gasly': 'pierre_gasly_8bit.png',
    'Ocon': 'esteban_ocon_8bit.png',
    'Zhou': 'zhou_guanyu_8bit.png',
    'Magnussen': 'kevin_magnussen_8bit.png',
    'Hülkenberg': 'nico_hulkenberg_8bit.png',
    'Hulkenberg': 'nico_hulkenberg_8bit.png',
    'Nakajima': 'kazuki_nakajima_8bit.png',
    'Heidfeld': 'nick_heidfeld_8bit.png',
    'Kovalainen': 'heikki_kovalainen_8bit.png',
    // Generated Legends & Rookies
    'Scheckter': 'jody_scheckter_8bit.png',
    'Hawthorn': 'mike_hawthorn_8bit.png',
    'P. Hill': 'phil_hill_8bit.png',
    'Phil Hill': 'phil_hill_8bit.png',
    'K. Rosberg': 'keke_rosberg_8bit.png',
    'Keke Rosberg': 'keke_rosberg_8bit.png',
    'G. Villeneuve': 'gilles_villeneuve_8bit.png',
    'Gilles Villeneuve': 'gilles_villeneuve_8bit.png',
    'Sargeant': 'logan_sargeant_8bit.png',
    'Lawson': 'liam_lawson_8bit.png',
    'Antonelli': 'kimi_antonelli_8bit.png',
    // Mass Batch (Champs & Stars)
    'Farina': 'nino_farina_8bit.png',
    'Surtees': 'john_surtees_8bit.png',
    'Hulme': 'denny_hulme_8bit.png',
    'Rindt': 'jochen_rindt_8bit.png',
    'Ickx': 'jacky_ickx_8bit.png',
    'Regazzoni': 'clay_regazzoni_8bit.png',
    'Montoya': 'juan_pablo_montoya_8bit.png',
    'R. Schumacher': 'ralf_schumacher_8bit.png',
    'Ralf Schumacher': 'ralf_schumacher_8bit.png',
    'Alesi': 'jean_alesi_8bit.png',
    // Final Batch (Before Limit)
    'McLaren': 'bruce_mclaren_8bit.png',
    'Gurney': 'dan_gurney_8bit.png',
    'Cevert': 'francois_cevert_8bit.png',
    'Patrese': 'riccardo_patrese_8bit.png',
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
