// Map nationalities to ISO 2-letter country codes for flag rendering
export const getCountryCode = (nationality) => {
    if (!nationality) return null;

    // Normalize string
    const nat = nationality.toLowerCase().trim();

    const mapping = {
        'american': 'US',
        'american-italian': 'US', // Specific case
        'argentinian': 'AR',
        'australian': 'AU',
        'austrian': 'AT',
        'belgian': 'BE',
        'brazilian': 'BR',
        'british': 'GB',
        'canadian': 'CA',
        'chilean': 'CL',
        'chinese': 'CN',
        'colombian': 'CO',
        'czech': 'CZ',
        'danish': 'DK',
        'dutch': 'NL',
        'east german': 'DE', // Use DE for now
        'finnish': 'FI',
        'french': 'FR',
        'german': 'DE',
        'hungarian': 'HU',
        'indian': 'IN',
        'indonesian': 'ID',
        'irish': 'IE',
        'italian': 'IT',
        'japanese': 'JP',
        'liechtensteiner': 'LI',
        'malaysian': 'MY',
        'mexican': 'MX',
        'monegasque': 'MC',
        'new zealander': 'NZ',
        'polish': 'PL',
        'portuguese': 'PT',
        'rhodesian': 'ZW', // Historical -> Zimbabwe
        'russian': 'RU',
        'south african': 'ZA',
        'spanish': 'ES',
        'swedish': 'SE',
        'swiss': 'CH',
        'thai': 'TH',
        'uruguayan': 'UY',
        'venezuelan': 'VE',
        'hong kong': 'HK',
        'israeli': 'IL',
        'saudi': 'SA',
        'singaporean': 'SG'
    };

    return mapping[nat] || null;
};

// Helper to get flag emoji/image URL if needed
export const getFlagUrl = (nationality) => {
    const code = getCountryCode(nationality);
    if (!code) return null;
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
};
