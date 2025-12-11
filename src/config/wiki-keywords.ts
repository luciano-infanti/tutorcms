export const TIBIA_WIKI_URL = 'https://tibia.fandom.com/wiki'
export const RUBINOT_WIKI_URL = 'https://wiki.rubinot.com'

export const WIKI_BASE_URL = 'https://tibia.fandom.com/wiki';

export const KEYWORDS: Record<string, string> = {
    // =========================================================================
    //  CORE GAME SYSTEMS & MECHANICS
    // =========================================================================
    'Tibia Wiki': 'Main_Page',
    'Imbuing': 'Imbuing',
    'Imbuements': 'Imbuing',
    'Charms': 'Charms',
    'Bestiary': 'Bestiary',
    'Bosstiary': 'Bosstiary',
    'Wheel of Destiny': 'Wheel_of_Destiny',
    'Prey System': 'Prey_System',
    'Hunting Task': 'Prey_System',
    'Daily Reward': 'Daily_Reward_System',
    'Exercise Weapons': 'Exercise_Weapon',
    'Stamina': 'Stamina',
    'Cyclopedia': 'Cyclopedia',
    'Bazaar': 'Char_Bazaar',
    'Rashid': 'Rashid',
    'Yasir': 'Yasir',
    'Green Djinn': 'Green_Djinn',
    'Blue Djinn': 'Blue_Djinn',
    'Hirelings': 'Hireling',
    'Houses': 'Houses',
    'Guilds': 'Guilds',
    'PVP': 'Player_Killing',
    'Blessings': 'Blessings',
    'Soul Points': 'Soul_Points',

    // =========================================================================
    //  MAJOR END-GAME QUESTS (Access & Rewards)
    // =========================================================================
    'Soul War': 'Soul_War_Quest',
    'Rotten Blood': 'Rotten_Blood_Quest',
    'Primal Ordeal': 'Primal_Ordeal_Quest',
    'The Secret Library': 'The_Secret_Library_Quest',
    'Grave Danger': 'Grave_Danger_Quest',
    'Feaster of Souls': 'Feaster_of_Souls_Quest',
    'Heart of Destruction': 'Heart_of_Destruction_Quest',
    'Ferumbras Ascendant': 'Ferumbras\'_Ascendant_Quest',
    'The Dream Courts': 'The_Dream_Courts_Quest',
    'The Order of the Lion': 'The_Order_of_the_Lion_Quest',
    'The Order of the Cobra': 'The_Order_of_the_Cobra_Quest',
    'The Order of the Falcon': 'The_Order_of_the_Falcon_Quest',
    'Opticording Sphere': 'Opticording_Sphere_Quest',
    'Kilmaresh': 'Kilmaresh_Quest',
    'Dark Trails': 'Dark_Trails_Quest',
    'Forgotten Knowledge': 'Forgotten_Knowledge_Quest',
    'Cults of Tibia': 'Cults_of_Tibia_Quest',
    'Dangerous Depths': 'Dangerous_Depths_Quest',
    'The First Dragon': 'The_First_Dragon_Quest',
    'Threatened Dreams': 'Threatened_Dreams_Quest',
    'Grimvale': 'Grimvale_Quest',
    'Bigfoot\'s Burden': 'Bigfoot\'s_Burden_Quest', // Warzone 1-3
    'Warzone': 'Bigfoot\'s_Burden_Quest',

    // =========================================================================
    //  CLASSIC & HARDCORE QUESTS
    // =========================================================================
    'Pits of Inferno': 'The_Pits_of_Inferno_Quest',
    'POI': 'The_Pits_of_Inferno_Quest',
    'The Inquisition': 'The_Inquisition_Quest',
    'Inq': 'The_Inquisition_Quest',
    'Wrath of the Emperor': 'Wrath_of_the_Emperor_Quest',
    'WOTE': 'Wrath_of_the_Emperor_Quest',
    'Children of the Revolution': 'Children_of_the_Revolution_Quest',
    'The New Frontier': 'The_New_Frontier_Quest',
    'Desert Dungeon': 'The_Desert_Dungeon_Quest',
    '10k Quest': 'The_Desert_Dungeon_Quest',
    'Banshee Quest': 'The_Queen_of_the_Banshees_Quest',
    'Demon Helmet': 'The_Demon_Helmet_Quest',
    'Annihilator': 'The_Annihilator_Quest',
    'Behemoth Quest': 'Behemoth_Quest',
    'Postman': 'The_Postman_Missions_Quest',
    'Djinn War': 'The_Djinn_War_-_Marid_Faction', // or Efreet
    'Shattered Isles': 'The_Shattered_Isles_Quest', // Goroma access
    'Ice Islands': 'The_Ice_Islands_Quest',
    'Blood Brothers': 'Blood_Brothers_Quest',
    'Ape City': 'The_Ape_City_Quest',

    // =========================================================================
    //  BOSSES: WORLD SPAWNS (NEMESIS)
    // =========================================================================
    'Ferumbras': 'Ferumbras',
    'Morgaroth': 'Morgaroth',
    'Ghazbaran': 'Ghazbaran',
    'Orshabaal': 'Orshabaal',
    'Zulazza the Corruptor': 'Zulazza_the_Corruptor',
    'Chayenne': 'Chayenne',
    'Gaz\'haragoth': 'Gaz\'haragoth',
    'Omrafir': 'Omrafir',
    'The Pale Worm': 'The_Pale_Worm',
    'Tyrn': 'Tyrn',
    'Hirintror': 'Hirintror',
    'Ocyakao': 'Ocyakao',
    'The Welter': 'The_Welter',
    'White Pale': 'White_Pale',
    'Shlorg': 'Shlorg',
    'Zushuka': 'Zushuka',
    'Furyosa': 'Furyosa',
    'Crustacea Gigantica': 'Crustacea_Gigantica',
    'Midnight Panther': 'Midnight_Panther',
    'Undead Cavebear': 'Undead_Cavebear',
    'Yeti': 'Yeti',

    // =========================================================================
    //  BOSSES: DAILY / FARMABLE (META)
    // =========================================================================
    'Grand Master Oberon': 'Grand_Master_Oberon',
    'Oberon': 'Grand_Master_Oberon',
    'Scarlett Etzel': 'Scarlett_Etzel',
    'Scarlett': 'Scarlett_Etzel',
    'Drume': 'Drume',
    'Timira the Many-Headed': 'Timira_the_Many-Headed',
    'Timira': 'Timira_the_Many-Headed',
    'The Brainstealer': 'The_Brainstealer',
    'Goshnar\'s Megalomania': 'Goshnar\'s_Megalomania',
    'Megalomania': 'Goshnar\'s_Megalomania',
    'Magma Bubble': 'Magma_Bubble',
    'Bakragore': 'Bakragore',
    'Tentugly': 'Tentugly',
    'Urmahlullu': 'Urmahlullu_the_Weakened',
    'King Zelos': 'King_Zelos',
    'Zelos': 'King_Zelos',
    'Lady Tenebris': 'Lady_Tenebris',
    'Lloyd': 'Lloyd',
    'The Time Guardian': 'The_Time_Guardian',
    'Brokul': 'Brokul',
    'Grand Mother Foulscale': 'Grand_Mother_Foulscale',
    'Ratmiral Blackwhiskers': 'Ratmiral_Blackwhiskers',
    'Mitmah Vanguard': 'Mitmah_Vanguard',
    'Ahau': 'Ahau',
    'Irgix the Flimsy': 'Irgix_the_Flimsy',
    'Vok the Freakish': 'Vok_the_Freakish',
    'Kusuma': 'Kusuma',
    'Sugar Daddy': 'Sugar_Daddy', // Acknowledging content often searched

    // =========================================================================
    //  HUNTING GROUNDS (META)
    // =========================================================================
    'Cobras': 'Cobra_Bastion',
    'Cobra Bastion': 'Cobra_Bastion',
    'Falcons': 'Falcon_Bastion',
    'Falcon Bastion': 'Falcon_Bastion',
    'Issavi': 'Issavi',
    'Goannas': 'Issavi',
    'Sphinx': 'Issavi',
    'Roshamuul': 'Roshamuul',
    'Prison': 'Roshamuul_Prison',
    'Guzzlemaws': 'Guzzlemaw_Valley',
    'Flimsies': 'Port_Hope_Flimsy_Lost_Soul', // Often refers to Lost Souls in PH
    'Buried Cathedral': 'Buried_Cathedral',
    'Asuras': 'Asura_Palace',
    'Mirror': 'The_Secret_Library_Quest', // Often refers to Asura Mirror
    'True Asuras': 'Asura_Vaults',
    'Skeletons': 'Darashia_Elite_Skeleton',
    'Feyrist': 'Feyrist',
    'Werehyenas': 'Werehyena',
    'Werelions': 'Werelion',
    'Winter Court': 'Dream_Courts',
    'Summer Court': 'Dream_Courts',
    'Carnivors': 'Carnivor_Rock',
    'Spectres': 'Buried_Cathedral', // General term often used for Gazer/Burster spots
    'Gazer Spectres': 'Haunted_Tomb',
    'Burster Spectres': 'Buried_Cathedral',
    'Ripper Spectres': 'Buried_Cathedral',
    'Oramond': 'Oramond',
    'Catacombs': 'Oramond_Catacombs',
    'Wildlife Raid': 'Oramond',
    'Glooth Bandits': 'Glooth_Factory',
    'Hero Cave': 'Hero_Cave',
    'Grim Reapers': 'Drefia_Grim_Reaper_Dungeons',
    'Banuta': 'Banuta',
    'Goroma': 'Goroma',
    'Medusa Tower': 'Medusa_Tower',
    'Draken Walls': 'Razachai',
    'Lizard City': 'Razzagorn',
    'Souleaters': 'Souleater_Mountains',
    'Pirates': 'Nargor',
    'Exotic Cave': 'Exotic_Cave',

    // =========================================================================
    //  BEST IN SLOT (BIS) & ENDGAME EQUIPMENT
    // =========================================================================
    // Sets
    'Sanguine Set': 'Sanguine_Set',
    'Soul Set': 'Soul_Set',
    'Primal Set': 'Primal_Set',
    'Falcon Set': 'Falcon_Set',
    'Cobra Set': 'Cobra_Set',
    'Lion Set': 'Lion_Set',
    'Gnome Set': 'Gnome_Set',
    'Umbral Master': 'Umbral_Master_Creation',

    // Weapons
    'Soulbleeder': 'Soulbleeder',
    'Sanguine Bow': 'Sanguine_Bow',
    'Soulpiercer': 'Soulpiercer',
    'Sanguine Crossbow': 'Sanguine_Crossbow',
    'Soulmaimer': 'Soulmaimer',
    'Sanguine Cudgel': 'Sanguine_Cudgel',
    'Soulcrusher': 'Soulcrusher',
    'Sanguine Bludgeon': 'Sanguine_Bludgeon',
    'Soulshredder': 'Soulshredder',
    'Sanguine Razor': 'Sanguine_Razor',
    'Soulcutter': 'Soulcutter',
    'Sanguine Blade': 'Sanguine_Blade',
    'Soulbiter': 'Soulbiter',
    'Sanguine Hatchet': 'Sanguine_Hatchet',
    'Souleater': 'Souleater',
    'Sanguine Axe': 'Sanguine_Axe',
    'Soulhexer': 'Soulhexer',
    'Sanguine Coil': 'Sanguine_Coil',
    'Soultainer': 'Soultainer',
    'Sanguine Rod': 'Sanguine_Rod',

    // Armor/Legs/Boots/Helmets
    'Spiritthorn Armor': 'Spiritthorn_Armor',
    'Spiritthorn Helm': 'Spiritthorn_Helmet',
    'Spiritthorn Ring': 'Spiritthorn_Ring',
    'Alicorn Headguard': 'Alicorn_Headguard',
    'Alicorn Quiver': 'Alicorn_Quiver',
    'Alicorn Ring': 'Alicorn_Ring',
    'Arboreal Crown': 'Arboreal_Crown',
    'Arboreal Armor': 'Arboreal_Armor',
    'Arboreal Ring': 'Arboreal_Ring',
    'Falcon Greaves': 'Falcon_Greaves',
    'Falcon Plate': 'Falcon_Plate',
    'Falcon Coif': 'Falcon_Coif',
    'Gnome Legs': 'Gnome_Legs',
    'Gnome Helmet': 'Gnome_Helmet',
    'Gnome Armor': 'Gnome_Armor',
    'Soulwalkers': 'Soulwalkers',
    'Pair of Soulwalkers': 'Pair_of_Soulwalkers',
    'Soulstrider': 'Soulstrider',
    'Soulshanks': 'Soulshanks',
    'Soulmantle': 'Soulmantle',
    'Soulshell': 'Soulshell',

    // =========================================================================
    //  LEGENDARY & RARE ITEMS
    // =========================================================================
    'Ferumbras\' Hat': 'Ferumbras\'_Hat',
    'Golden Helmet': 'Golden_Helmet',
    'Blessed Shield': 'Blessed_Shield',
    'Magic Longsword': 'Magic_Longsword',
    'Dragon Scale Legs': 'Dragon_Scale_Legs',
    'DSL': 'Dragon_Scale_Legs',
    'Horned Helmet': 'Horned_Helmet',
    'Winged Helmet': 'Winged_Helmet',
    'Great Shield': 'Great_Shield',
    'Thunder Hammer': 'Thunder_Hammer',
    'Warlord Sword': 'Warlord_Sword',
    'Crown': 'Crown',
    'Ball Gown': 'Ball_Gown',
    'Amazon Armor': 'Amazon_Armor',
    'Amazon Shield': 'Amazon_Shield',
    'Amazon Helmet': 'Amazon_Helmet',
    'Native Armor': 'Native_Armor',
    'Rose Shield': 'Rose_Shield',
    'Shield of Honour': 'Shield_of_Honour',
    'Grey Tome': 'Grey_Tome',
    'Yellow Rose': 'Yellow_Rose',
    'Blue Tome': 'Blue_Tome',
    'Chayenne\'s Key': 'Magical_Key',
    'Music Box': 'Music_Box',
    'Epaminondas Doll': 'Epaminondas_Doll',
    'Fan Doll': 'Fan_Doll'
};

export const RUBINOT_WIKI_BASE = 'https://wiki.rubinot.com';

export const RUBINOT_KEYWORDS: Record<string, string> = {
    // =========================================================================
    //  CUSTOM SYSTEMS (The "Meta" of RubinOT)
    // =========================================================================
    'Linked Tasks': 'linked-tasks',
    'Prestige Arena': 'prestige-arena',
    'Battle Pass': 'battle-pass',
    'Obelisk': 'obelisk',
    'Mini Obelisk': 'obelisk', // Often searched for resetting bosses
    'Huntfinder': 'huntfinder',
    'Equipment Preset': 'equipment-preset',
    'Roleta': 'roleta',
    'Roulette': 'roleta',
    'World Transfer': 'world-transfer',
    'Interactive Map': 'mapa-interativo',
    'Loyalty System': 'loyalty', // Inferred common custom system
    'Autoloot': 'commands', // Usually under commands in OTs

    // =========================================================================
    //  LINKED TASK ROOMS (Specific Farming Spots)
    // =========================================================================
    'Lothlorien\'s Room': 'linked-tasks',
    'Executioner\'s Room': 'linked-tasks',
    'Morgul\'s Room': 'linked-tasks',
    'Corrupted\'s Room': 'linked-tasks',
    'N\'Zoth\'s Room': 'linked-tasks',
    'Task Coin': 'linked-tasks', // Currency for this system

    // =========================================================================
    //  CUSTOM CHESTS (Major Loot Source)
    //  *Mappings go to specific item pages or the general chests page*
    // =========================================================================
    'Chests': 'chests',
    // Boss Drop Chests
    'Amber Chest': 'item/amber-chest',
    'Arbaziloth Chest': 'item/arbaziloth-chest',
    'Drume Chest': 'item/drume-chest',
    'Eldritch Chest': 'item/eldritch-chest',
    'Gaz\'Haragoth Chest': 'item/gazharagoth-chest',
    'Jewelry Chest': 'item/jewelry-chest',
    'Mithmah Chest': 'item/mithmah-chest',
    'Monster Chest': 'item/monster-chest',
    'Mystic Bag': 'item/mystic-bag',
    'Nightmare Chest': 'item/nightmare-chest', // Dream Courts bosses
    'Oberon Chest': 'item/oberon-chest',
    'Pale Chest': 'item/pale-chest', // Feaster of Souls bosses
    'Patriarch Chest': 'item/patriarch-chest',
    'Ratmiral Chest': 'item/ratmiral-chest',
    'Scarlett Chest': 'item/scarlett-chest',
    'Soul Chest': 'item/soul-chest', // Goshnar
    'Sugar Chest': 'item/sugar-chest',
    'Timira Chest': 'item/timira-chest',
    'Zelos Chest': 'item/zelos-chest', // Grave Danger

    // Vocation/Weapon Boxes
    'Knight\'s Chest': 'chests',
    'Paladin\'s Chest': 'chests',
    'Druid\'s Chest': 'chests',
    'Sorcerer\'s Chest': 'chests',
    'Monk\'s Chest': 'chests', // Custom Vocation?
    'Sword\'s Box': 'chests',
    'Axe\'s Box': 'chests',
    'Club\'s Box': 'chests',
    'Rod\'s Box': 'chests',
    'Wand\'s Box': 'chests',
    'Bow\'s Box': 'chests',
    'Crossbow\'s Box': 'chests',

    // =========================================================================
    //  CUSTOM COINS & CURRENCIES
    // =========================================================================
    'Coins': 'coins',
    'Castle Coin': 'coins',
    'Christmas Coin': 'coins',
    'Crimsonevil Coin': 'coins',
    'Halloween Coin': 'coins',
    'Hollowstalker Coin': 'coins',
    'Roulette Coin': 'coins',
    'Santa Coin': 'coins',
    'Sol\'zarith Coin': 'coins', // Birthday event coin
    'Rubini Token': 'coins',

    // =========================================================================
    //  CUSTOM BOSSES (Mapped to their loot source or event)
    // =========================================================================
    'Arbaziloth': 'item/arbaziloth-chest',
    'The Rootkraken': 'item/amber-chest',
    'Sugar Daddy': 'item/sugar-chest',
    'The Monster': 'item/monster-chest',
    'Soulstealer Santa': 'en/eventos-anuais/natal-2024',
    'Halloween Boss': 'en/eventos-anuais/halloween-2025',

    // =========================================================================
    //  EVENTS
    // =========================================================================
    'Halloween 2025': 'en/eventos-anuais/halloween-2025',
    'Christmas 2024': 'en/eventos-anuais/natal-2024',
    'Birthday 2025': 'en/eventos-anuais/aniversario-2025',

    // =========================================================================
    //  GAME WORLDS (Server Info)
    // =========================================================================
    'Auroria': '', // Usually main page
    'Belaria': '',
    'Bellum': '',
    'Cellenium': '',
    'Elysian': '',
    'Lunarian': '',
    'Mystian': '',
    'Solarian': '',
    'Spectrum': '',
    'Tenebrium': '',
    'Vesperia': ''
};
