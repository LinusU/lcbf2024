export type Level = 'vaults' | 'quayside'

export interface Location {
  name: string
  level: Level
}

export const locations: Record<Level, Location[]> = {
  vaults: [
    { name: 'NV1', level: 'vaults' },
    { name: 'NV2', level: 'vaults' },
    { name: 'NV3', level: 'vaults' },
    { name: 'NV4', level: 'vaults' },
    { name: 'NV5', level: 'vaults' },
    { name: 'NV6', level: 'vaults' },
    { name: 'SV1', level: 'vaults' },
    { name: 'SV2', level: 'vaults' },
    { name: 'SV5', level: 'vaults' },
    { name: 'SV6', level: 'vaults' },
    { name: 'SV7', level: 'vaults' },
    { name: 'Porter\'s Walk North', level: 'vaults' },
    { name: 'North Bandstand', level: 'vaults' },
    { name: 'Porter\'s Walk South', level: 'vaults' },
    { name: 'Central Staircase', level: 'vaults' },
    { name: 'North Vault Courtyard', level: 'vaults' },
    { name: 'North Fountain', level: 'vaults' },
    { name: 'South Fountain', level: 'vaults' },
    { name: 'Hogshead Passage', level: 'vaults' },
  ],
  quayside: [
    { name: 'Little Gallery', level: 'quayside' },
    { name: 'Quayside Walkway', level: 'quayside' },
    { name: 'West Mall Bridge', level: 'quayside' },
    { name: 'QS1', level: 'quayside' },
    { name: 'QS3', level: 'quayside' },
    { name: 'QS7', level: 'quayside' },
    { name: 'Food Court', level: 'quayside' },
  ],
}

export function getBreweryLocation(breweryName: string): Location | null {
  switch (breweryName) {
    case '40FT Brewery & Taproom':
    case '903 Brewers':
    case 'ABYSS Brewing':
    case 'Amundsen Brewery':
    case 'Anspach & Hobday':
    case 'Arbor Ales':
    case 'Attic Brew Co.':
    case 'Badger Brewery (Hall & Woodhouse)':
    case 'Basqueland Brewing':
    case 'Bluntrock Brewery':
    case 'Brass Castle Brewery':
    case 'Brasserie d&#39;Achouffe':
    case 'Braybrooke Beer Co':
    case 'Brew By Numbers':
    case 'Brewery John Martin & Brewery Timmermans':
    case 'Brick Brewery':
    case 'Brixton Brewery':
    case 'Brockley Brewery':
    case 'Brouwerij Haacht Brasserie':
    case 'Budějovický Budvar':
    case 'Cervejaria Altezza':
    case 'Cloudwater Brew Co.':
    case 'Coyote Hole Craft Beverages':
    case 'DEYA Brewing Company':
    case 'DMC Brewery':
    case 'Dark Revolution':
    case 'Disruption Is Brewing':
    case 'Distortion Brewing':
    case 'Dookit Brewing ':
    case 'Double-Barrelled Brewery':
    case 'Dugges Bryggeri':
    case 'East London Brewing Company ':
    case 'Elusive Brewing':
    case 'Exale Brewing':
    case 'Fair Isle Brewing':
    case 'Fierce Beer':
    case 'Firkin Brewery':
    case 'Freedom Brewery':
    case 'Full Circle Brew Co':
    case 'Fyne Ales':
    case 'Galway Bay Brewery':
    case 'Garage Beer Co.':
    case 'Geipel Brewing':
    case 'German Kraft Brewery':
    case 'Gosnells':
    case 'Gravity Well Brewing Co':
    case 'Great Beyond Brewing Company':
    case 'Hackney Brewery':
    case 'Hackney Church Brew Co.':
    case 'Hammerton AF (Alcohol Free)':
    case 'Hammerton Brewery':
    case 'Hop Union Brewery':
    case 'Howling Hops':
    case 'Ice Breaker Brewing Co.':
    case 'Ideal Day':
    case 'Indie Rabble':
    case 'Jiddler&#39;s Tipple':
    case 'Jimbrew Brewing Co.':
    case 'Kicking Goat Ciderworks':
    case 'Laine Brew Co':
    case 'Libertalia Brewing Company':
    case 'Loch Lomond Brewery':
    case 'London Brewing Co':
    case 'Lost In Town':
    case 'Lost and Grounded Brewers':
    case 'Luda Brewing Co':
    case 'Mad Squirrel Brewery':
    case 'Mammoth Beer':
    case 'Missing Link Brewing':
    case 'Mondo Brewing Company ':
    case 'Moonwake':
    case 'Moot Brew Co':
    case 'Mortalis Brewing Company':
    case 'Neckstamper Brewing':
    case 'New Bristol Brewery':
    case 'North':
    case 'Northern Monk':
    case 'Oak Highlands Brewery':
    case 'Only With Love':
    case 'Orbit Beers':
    case 'Origins Brewing':
    case 'Orion Breweries, Ltd.':
    case 'Partizan Brewing':
    case 'Pastore Brewing and Blending':
    case 'Perivale Brewery':
    case 'Phantom Brewing Co.':
    case 'Pillars Brewery ':
    case 'Pinnora Brewing':
    case 'Pivovar Matuška':
    case 'Pretty Decent Beer Co':
    case 'Pulpt':
    case 'Red Fin Cider ':
    case 'Renegade Brewery':
    case 'Rooster&#39;s Brewing Co':
    case 'SALT':
    case 'Sagrado':
    case 'Sakiškės Brewery / Sakiškių Alus':
    case 'Seagrove Public':
    case 'Signature Brew':
    case 'Siren Craft Brew':
    case 'Sly Fox Brewing Company':
    case 'Small Beer Brew Co':
    case 'St Austell Brewery':
    case 'Stannary Brewing Company':
    case 'Stone & Wood':
    case 'Stone Brewing':
    case 'Sureshot Brewing':
    case 'Tap East':
    case 'The Beerblefish Brewing Company Limited ':
    case 'The Five Points Brewing Company':
    case 'The Gipsy Hill Brewing Co.':
    case 'The Goodness Brewing Company':
    case 'The Kernel Brewery':
    case 'The Virginia Beer Co. (VBC)':
    case 'Tiny Rebel Brewing Co':
    case 'To Øl CPH':
    case 'To Øl':
    case 'Toast Brewing ':
    case 'Turning Point Beer':
    case 'Twisted Wheel Brew Co.':
    case 'Two Chefs Brewing':
    case 'UnBarred Brewery':
    case 'Vault City Brewing':
    case 'Verdant Brewing Co':
    case 'Vibrant Forest Brewery':
    case 'Werewolf Beer':
    case 'Wild Card Brewery':
    case 'Woodforde&#39;s Brewery':
    case 'Xylo Brewing Ltd':
      // return locations.vaults.find(location => location.name === 'NV1')!
      // return locations.vaults.find(location => location.name === 'NV2')!
      // return locations.vaults.find(location => location.name === 'NV3')!
      // return locations.vaults.find(location => location.name === 'NV4')!
      // return locations.vaults.find(location => location.name === 'NV5')!
      // return locations.vaults.find(location => location.name === 'NV6')!
      // return locations.vaults.find(location => location.name === 'SV1')!
      // return locations.vaults.find(location => location.name === 'SV2')!
      // return locations.vaults.find(location => location.name === 'SV5')!
      // return locations.vaults.find(location => location.name === 'SV6')!
      // return locations.vaults.find(location => location.name === 'SV7')!
      // return locations.vaults.find(location => location.name === 'Porter\'s Walk North')!
      // return locations.vaults.find(location => location.name === 'North Bandstand')!
      // return locations.vaults.find(location => location.name === 'Porter\'s Walk South')!
      // return locations.vaults.find(location => location.name === 'Central Staircase')!
      // return locations.vaults.find(location => location.name === 'North Vault Courtyard')!
      // return locations.vaults.find(location => location.name === 'North Fountain')!
      // return locations.vaults.find(location => location.name === 'South Fountain')!
      // return locations.vaults.find(location => location.name === 'Hogshead Passage')!
      // return locations.quayside.find(location => location.name === 'Little Gallery')!
      // return locations.quayside.find(location => location.name === 'Quayside Walkway')!
      // return locations.quayside.find(location => location.name === 'West Mall Bridge')!
      // return locations.quayside.find(location => location.name === 'QS1')!
      // return locations.quayside.find(location => location.name === 'QS3')!
      // return locations.quayside.find(location => location.name === 'QS7')!
      // return locations.quayside.find(location => location.name === 'Food Court')!
      return null

    default:
      return null
  }
}
