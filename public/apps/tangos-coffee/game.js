// Tango's Coffee - Game Logic
// A coffee shop game owned by Tango the Siamese cat!

const MENU_ITEMS = {
    espresso: {
        name: 'Espresso',
        emoji: '\u{2615}',
        price: 3,
        steps: ['grind', 'tamp', 'brew'],
        type: 'drink'
    },
    americano: {
        name: 'Americano',
        emoji: '\u{1FAD6}',
        price: 4,
        steps: ['grind', 'tamp', 'brew', 'water'],
        type: 'drink'
    },
    latte: {
        name: 'Latte',
        emoji: '\u{1F95B}',
        price: 5,
        steps: ['grind', 'tamp', 'brew', 'steam', 'mix', 'pour'],
        type: 'drink'
    },
    cappuccino: {
        name: 'Cappuccino',
        emoji: '\u{2615}',
        price: 5,
        steps: ['grind', 'tamp', 'brew', 'steam', 'mix', 'foam'],
        type: 'drink'
    },
    mocha: {
        name: 'Mocha',
        emoji: '\u{1F36B}',
        price: 6,
        steps: ['grind', 'tamp', 'brew', 'chocolate', 'steam', 'mix', 'pour'],
        type: 'drink'
    },
    coldbrew: {
        name: 'Cold Brew',
        emoji: '\u{1F9CA}',
        price: 5,
        steps: ['grind', 'steep', 'ice'],
        type: 'drink'
    },
    macchiato: {
        name: 'Caramel Macchiato',
        emoji: '\u{1F9CB}',
        price: 6,
        steps: ['grind', 'tamp', 'brew', 'steam', 'mix', 'caramel', 'pour'],
        type: 'drink'
    },
    flatwhite: {
        name: 'Flat White',
        emoji: '\u{1F95B}',
        price: 5,
        steps: ['grind', 'tamp', 'brew', 'steam', 'pour'],
        type: 'drink'
    },
    affogato: {
        name: 'Affogato',
        emoji: '\u{1F368}',
        price: 7,
        steps: ['scoop', 'grind', 'tamp', 'brew', 'pour'],
        type: 'drink'
    },
    chai: {
        name: 'Chai Latte',
        emoji: '\u{1F375}',
        price: 6,
        steps: ['steep', 'steam', 'vanilla', 'mix', 'pour'],
        type: 'drink'
    },
    matcha: {
        name: 'Matcha Latte',
        emoji: '\u{1F33F}',
        price: 6,
        steps: ['sift', 'whisk', 'steam', 'mix', 'pour'],
        type: 'drink'
    },
    nitro: {
        name: 'Nitro Cold Brew',
        emoji: '\u{1F9CB}',
        price: 7,
        steps: ['grind', 'steep', 'nitro', 'pour'],
        type: 'drink'
    },
    tangoSpecialty: {
        name: "Tango's Specialty",
        emoji: '\u{1F431}\u{2615}',
        price: 89,
        steps: ["scoop", "grind", "sift", "tamp", "water", "brew", "steam", "whisk", "foam", "mix", "chocolate", "caramel", "vanilla", "steep", "pour", "ice", "nitro"],
        type: 'drink',
        patiencePerStep: 4,
        patienceBaseSeconds: 12
    },
    croissant: {
        name: 'Croissant',
        emoji: '\u{1F950}',
        price: 4,
        steps: ['fridge', 'warm', 'plate'],
        type: 'food',
        patienceSeconds: 22
    },
    muffin: {
        name: 'Muffin',
        emoji: '\u{1F9C1}',
        price: 3,
        steps: ['fridge', 'plate'],
        type: 'food',
        patienceSeconds: 18
    },
    sandwich: {
        name: 'Avocado Toast',
        emoji: '\u{1F951}',
        price: 7,
        steps: ['fridge', 'toast', 'slice', 'spread', 'plate'],
        type: 'food',
        patienceSeconds: 28
    },
    cookie: {
        name: 'Cookie',
        emoji: '\u{1F36A}',
        price: 2,
        steps: ['fridge', 'warm', 'drizzle', 'plate'],
        type: 'food',
        patienceSeconds: 24
    },
    bagel: {
        name: 'Cream Cheese Bagel',
        emoji: '\u{1F96F}',
        price: 6,
        steps: ['fridge', 'slice', 'toast', 'spread', 'plate'],
        type: 'food',
        patienceSeconds: 30
    },
    brownie: {
        name: 'Brownie Bite',
        emoji: '\u{1F7EB}',
        price: 4,
        steps: ['fridge', 'warm', 'dust', 'plate'],
        type: 'food',
        patienceSeconds: 22
    },
    parfait: {
        name: 'Berry Yogurt Parfait',
        emoji: '\u{1F963}',
        price: 7,
        steps: ['fridge', 'layer', 'fruit', 'drizzle', 'plate'],
        type: 'food',
        patienceSeconds: 30
    },
    panini: {
        name: 'Caprese Panini',
        emoji: '\u{1F96A}',
        price: 8,
        steps: ['fridge', 'slice', 'stack', 'toast', 'press', 'plate'],
        type: 'food',
        patienceSeconds: 34
    },
    bottledWater: {
        name: 'Bottled Water',
        emoji: '\u{1F4A7}',
        price: 3,
        steps: [],
        type: 'ready',
        readyToGo: true
    },
    icedTeaBottle: {
        name: 'Iced Tea Bottle',
        emoji: '\u{1F9C3}',
        price: 4,
        steps: [],
        type: 'ready',
        readyToGo: true
    },
    chips: {
        name: 'Crunch Chips',
        emoji: '\u{1F35F}',
        price: 4,
        steps: [],
        type: 'ready',
        readyToGo: true
    },
    energyBar: {
        name: 'Energy Bar',
        emoji: '\u{1F36B}',
        price: 5,
        steps: [],
        type: 'ready',
        readyToGo: true
    }
};

const STEP_LABELS = {
    grind: 'Grind beans',
    tamp: 'Tamp',
    brew: 'Brew espresso',
    water: 'Add hot water',
    steam: 'Steam milk',
    pour: 'Pour & serve',
    foam: 'Add foam',
    chocolate: 'Add chocolate',
    mix: 'Mix drink',
    steep: 'Steep (12hr)',
    ice: 'Add ice',
    fridge: 'Get from fridge',
    warm: 'Warm up',
    plate: 'Plate it',
    toast: 'Toast bread',
    spread: 'Spread avocado',
    slice: 'Slice ingredients',
    drizzle: 'Drizzle syrup',
    dust: 'Dust sugar',
    layer: 'Layer yogurt',
    fruit: 'Add berries',
    stack: 'Stack fillings',
    press: 'Press panini',
    caramel: 'Add caramel',
    vanilla: 'Add vanilla',
    scoop: 'Add ice cream',
    sift: 'Sift matcha',
    whisk: 'Whisk matcha',
    nitro: 'Infuse nitro'
};

const STEP_ACTIONS = {
    tamp: { title: 'Tamp it down!', hint: 'Pull the lever to pack the grounds', emoji: '\u{1F9F1}', mode: 'lever', pulls: 3 },
    brew: { title: 'Pull the shot!', hint: 'Pull the lever to brew', emoji: '\u{1F527}', mode: 'lever', pulls: 3 },
    water: { title: 'Add hot water', hint: 'Pour into the cup', emoji: '\u{1FAD6}', mode: 'pour', pourColor: '#d9d0c2', maxOver: 12 },
    steam: { title: 'Steam the milk', hint: 'Keep the temp in the green zone', emoji: '\u2668', mode: 'heat', target: [60, 78], seconds: 3.2 },
    pour: { title: 'Pour & serve', hint: 'Pour into the cup', emoji: '\u2615', mode: 'pour', pourColor: '#7b4a2b', maxOver: 10 },
    foam: { title: 'Add foam', hint: 'Drag foam dollops on top', emoji: '\u{1FAE7}', mode: 'drop', drops: 3, dropEmoji: '\u{1FAE7}' },
    chocolate: { title: 'Drizzle chocolate', hint: 'Draw a swirl with the pipet', emoji: '\u{1F36B}', mode: 'draw', drawTarget: 700, drawColor: '#6b3e2e', foodEmoji: '\u{1F370}' },
    steep: { title: 'Steep it', hint: 'Swirl the jar in circles', emoji: '\u{1FAD9}', mode: 'draw', drawTarget: 520, drawColor: '#7b4a2b', foodEmoji: '\u{1FAD9}' },
    ice: { title: 'Add ice', hint: 'Drag ice cubes into the cup', emoji: '\u{1F9CA}', mode: 'drop', drops: 4, dropEmoji: '\u{1F9CA}' },
    warm: { title: 'Warm it up', hint: 'Keep the temp in the green zone', emoji: '\u{1F525}', mode: 'heat', target: [55, 75], seconds: 3 },
    plate: { title: 'Plate it', hint: 'Drag the item to the plate', emoji: '\u{1F37D}', mode: 'drop', drops: 1, dropEmoji: '\u{1F37D}' },
    toast: { title: 'Toast it', hint: 'Keep the temp in the green zone', emoji: '\u{1F35E}', mode: 'heat', target: [62, 80], seconds: 3.4 },
    spread: { title: 'Spread it', hint: 'Spread evenly across the toast', emoji: '\u{1F944}', mode: 'draw', drawTarget: 520, drawColor: '#6fa46f', foodEmoji: '\u{1F35E}' },
    slice: { title: 'Slice ingredients', hint: 'Cut into 5 even portions', emoji: '\u{1F52A}', mode: 'cut' },
    drizzle: { title: 'Drizzle syrup', hint: 'Draw a syrup pattern with the pipet', emoji: '\u{1F36F}', mode: 'draw', drawTarget: 650, drawColor: '#a36b1d', foodEmoji: '\u{1F95E}' },
    dust: { title: 'Dust sugar', hint: 'Draw a dusting pattern', emoji: '\u{1F9C1}', mode: 'draw', drawTarget: 520, drawColor: '#d9d1c3', foodEmoji: '\u{1F369}' },
    layer: { title: 'Layer yogurt', hint: 'Drag spoonfuls into the cup', emoji: '\u{1F963}', mode: 'drop', drops: 3, dropEmoji: '\u{1F963}' },
    fruit: { title: 'Add berries', hint: 'Drag berries into the cup', emoji: '\u{1FAD0}', mode: 'drop', drops: 4, dropEmoji: '\u{1FAD0}' },
    stack: { title: 'Stack fillings', hint: 'Drag fillings onto the stack', emoji: '\u{1F9C0}', mode: 'drop', drops: 3, dropEmoji: '\u{1F9C0}' },
    press: { title: 'Press panini', hint: 'Keep the heat steady while pressing', emoji: '\u{1F96A}', mode: 'heat', target: [60, 78], seconds: 3.6 },
    caramel: { title: 'Add caramel', hint: 'Drizzle caramel with the pipet', emoji: '\u{1F36E}', mode: 'draw', drawTarget: 620, drawColor: '#a36b1d', foodEmoji: '\u{1F95B}' },
    vanilla: { title: 'Add vanilla', hint: 'Drizzle vanilla syrup', emoji: '\u{1F33C}', mode: 'draw', drawTarget: 600, drawColor: '#e8d5a1', foodEmoji: '\u{1F95B}' },
    scoop: { title: 'Add ice cream', hint: 'Drag scoops into the cup', emoji: '\u{1F368}', mode: 'drop', drops: 2, dropEmoji: '\u{1F368}' },
    sift: { title: 'Sift matcha', hint: 'Pull the sieve to sift', emoji: '\u{1F375}', mode: 'lever', pulls: 3 },
    whisk: { title: 'Whisk matcha', hint: 'Draw quick circles to whisk', emoji: '\u{1F375}', mode: 'draw', drawTarget: 520, drawColor: '#5aa46f', foodEmoji: '\u{1F375}' },
    nitro: { title: 'Infuse nitro', hint: 'Pull the valve to infuse', emoji: '\u{1FAE7}', mode: 'lever', pulls: 3 },
    grind: { title: 'Grind the beans', hint: 'Click the grinder handle', emoji: '\u2699', mode: 'grind' },
    mix: { title: 'Mix it up', hint: 'Stir the drink', emoji: '\u{1F944}', mode: 'mix' },
    fridge: { title: 'Fridge', hint: 'Select the item for this order', emoji: '\u{1F9CA}', mode: 'fridge' }
};

const FOOD_ITEM_IDS = ['croissant', 'muffin', 'sandwich', 'cookie', 'bagel', 'brownie', 'parfait', 'panini'];
const READY_TO_GO_ITEM_IDS = Object.keys(MENU_ITEMS).filter((id) => MENU_ITEMS[id]?.readyToGo);
const BASE_UNLOCKED_ITEMS = ['espresso', 'americano', 'tangoSpecialty', 'croissant', 'muffin', 'cookie'];
const CHARITY_PAYOUT_DELAY_MS = 5 * 60 * 1000;
const AD_TEXT_COST = 5;
const AD_PHOTO_COST = 8;
const AD_DURATION_MS = 6 * 60 * 1000;
const AD_SPAWN_BOOST = 0.22;
const MAX_AD_HISTORY = 16;
const BILLBOARD_ROTATE_MS = 3800;

const CUSTOMER_EMOJIS = ['\u{1F60A}', '\u{1F604}', '\u{1F917}', '\u{1F60C}', '\u{1F642}', '\u{1F63A}', '\u{1F436}', '\u{1F430}', '\u{1F98A}', '\u{1F43B}', '\u{1F43C}'];
const UPGRADES = [
    { id: 'grinder', name: 'Better Grinder', desc: 'Grind 50% faster', cost: 50, effect: 'grindSpeed', value: 1.5 },
    { id: 'machine', name: 'Pro Espresso Machine', desc: 'Brew 40% faster', cost: 150, effect: 'brewSpeed', value: 1.4 },
    { id: 'steamer', name: 'Dual Steam Wand', desc: 'Steam milk faster', cost: 100, effect: 'steamSpeed', value: 1.5 },
    { id: 'display', name: 'Menu Board', desc: '+1 customer patience', cost: 80, effect: 'patience', value: 1 },
    { id: 'decor', name: 'Cozy Decor', desc: '+0.1 base rating', cost: 200, effect: 'rating', value: 0.1 },
    { id: 'training', name: 'Barista Training', desc: '+15% tips', cost: 120, effect: 'tips', value: 1.15 },
    { id: 'music', name: 'Jazz Playlist', desc: 'Customers wait longer', cost: 75, effect: 'patience', value: 1 },
    { id: 'pastry', name: 'Pastry Case', desc: 'Unlock Avocado Toast, Bagel, Brownie', cost: 250, effect: 'menu', value: 1 },
    { id: 'coffee-menu', name: 'Full Coffee Menu', desc: 'Unlock Latte, Cappuccino, Mocha, Cold Brew', cost: 300, effect: 'menu', value: 1 },
    { id: 'kitchen-prep', name: 'Kitchen Prep Station', desc: 'Unlock Parfait and Panini orders', cost: 450, effect: 'menu', value: 1 },
    { id: 'prep-tools', name: 'Prep Tools Set', desc: 'Warm, toast, and prep steps 30% faster', cost: 220, effect: 'prepSpeed', value: 1.3 },
    { id: 'specialty', name: 'Specialty Drinks', desc: 'Unlock Macchiato, Flat White, Chai, Matcha, Affogato, Nitro', cost: 500, effect: 'menu', value: 1 },
    { id: 'to-go', name: 'To-Go Counter', desc: 'Unlock ready to-go walk-in sales', cost: 90, effect: 'feature', value: 1 },
    { id: 'vip-service', name: 'VIP Service', desc: 'Enable picky VIP customers with 2x pay', cost: 160, effect: 'feature', value: 1 },
    { id: 'marketing', name: 'Marketing Desk', desc: 'Unlock text and camera ads', cost: 70, effect: 'feature', value: 1 }
];
const DECOR_ITEMS = [
    { id: 'plant', name: 'Potted Plant', emoji: '\u{1FAB4}', cost: 35 },
    { id: 'lamp', name: 'Table Lamp', emoji: '\u{1F6CB}', cost: 55 },
    { id: 'clock', name: 'Wall Clock', emoji: '\u{1F570}', cost: 70 },
    { id: 'cat-plush', name: 'Cat Plush', emoji: '\u{1F431}', cost: 45 },
    { id: 'flower', name: 'Flower Vase', emoji: '\u{1F338}', cost: 50 },
    { id: 'art', name: 'Coffee Art', emoji: '\u{1F5BC}', cost: 80 },
    { id: 'menu-sign', name: 'Neon Menu Sign', emoji: '\u{1F4A1}', cost: 95 },
    { id: 'books', name: 'Book Stack', emoji: '\u{1F4DA}', cost: 40 },
    { id: 'speaker', name: 'Vinyl Speaker', emoji: '\u{1F4FB}', cost: 75 },
    { id: 'rug', name: 'Mini Rug', emoji: '\u{1F9F6}', cost: 65 },
    { id: 'candle', name: 'Aroma Candle', emoji: '\u{1F56F}', cost: 42 },
    { id: 'teapot', name: 'Ceramic Teapot', emoji: '\u{1FAD6}', cost: 58 },
    { id: 'bean-sack', name: 'Bean Sack', emoji: '\u{1FAD8}', cost: 48 },
    { id: 'trophy', name: 'Cat Trophy', emoji: '\u{1F3C6}', cost: 120 },
    { id: 'bunny', name: 'Lucky Bunny', emoji: '\u{1F407}', cost: 52 },
    { id: 'fern', name: 'Hanging Fern', emoji: '\u{1F33F}', cost: 67 },
    { id: 'moon', name: 'Moon Lamp', emoji: '\u{1F319}', cost: 110 },
    { id: 'pixel-cat', name: 'Pixel Cat Poster', emoji: '\u{1F5BC}', cost: 85 },
    { id: 'origami', name: 'Origami Cranes', emoji: '\u{1F54A}', cost: 54 }
];
const FLOOR_THEMES = [
    { id: 'oak', name: 'Oak Planks', unlockAt: 0 },
    { id: 'marble', name: 'Marble Cream', unlockAt: 8000 },
    { id: 'terracotta', name: 'Terracotta', unlockAt: 18000 },
    { id: 'midnight', name: 'Midnight Tiles', unlockAt: 35000 },
    { id: 'mint-grid', name: 'Mint Grid', unlockAt: 70000 }
];
const WALL_THEMES = [
    { id: 'latte', name: 'Latte Wash', unlockAt: 0 },
    { id: 'gallery', name: 'Gallery White', unlockAt: 9000 },
    { id: 'sunset', name: 'Sunset Stucco', unlockAt: 20000 },
    { id: 'forest', name: 'Forest Panel', unlockAt: 42000 },
    { id: 'neon', name: 'Neon Night', unlockAt: 75000 }
];
const CHARITY_CAUSES = [
    { id: 'cats', emoji: '\u{1F43E}', name: 'Stray Cat Rescue Fund' },
    { id: 'library', emoji: '\u{1F4DA}', name: 'Neighborhood Library Drive' },
    { id: 'meals', emoji: '\u{1F963}', name: 'Community Meal Program' },
    { id: 'garden', emoji: '\u{1F331}', name: 'Urban Garden Project' },
    { id: 'youth', emoji: '\u{1F392}', name: 'Youth School Supplies' },
    { id: 'shelter', emoji: '\u{1F3E0}', name: 'Emergency Shelter Network' }
];
const TABLE_BASE_LAYOUT = {
    t1: { x: 18, y: 34 },
    t2: { x: 50, y: 24 },
    t3: { x: 80, y: 36 },
    t4: { x: 48, y: 72 }
};
const TOGO_COUNTER_BASE_LAYOUT = { x: 86, y: 73 };
const TABLE_DEFS = [
    { id: 't1', seats: [{ id: 't1-s1', dx: -8, dy: -8 }, { id: 't1-s2', dx: 8, dy: 8 }] },
    { id: 't2', seats: [{ id: 't2-s1', dx: -8, dy: -8 }, { id: 't2-s2', dx: 8, dy: 8 }] },
    { id: 't3', seats: [{ id: 't3-s1', dx: -8, dy: -8 }, { id: 't3-s2', dx: 8, dy: 8 }] },
    { id: 't4', seats: [{ id: 't4-s1', dx: -8, dy: -8 }, { id: 't4-s2', dx: 8, dy: 8 }] }
];

// Game State
let state = {
    money: 0,
    rating: 5.0,
    day: 1,
    prestige: 0,
    totalEarnings: 0,
    lifetimeEarnings: 0,
    customersServed: 0,
    ordersCompleted: 0,
    perfectOrders: 0,
    upgrades: {},
    queue: [],
    activeOrder: null,
    currentStepIndex: 0,
    customerPatience: 100,
    customerPatienceMax: 100,
    eatingGuests: [],
    decorOwned: {},
    placedDecor: [],
    floorTheme: 'oak',
    wallTheme: 'latte',
    tableLayout: { ...TABLE_BASE_LAYOUT },
    toGoCounterLayout: { ...TOGO_COUNTER_BASE_LAYOUT },
    layoutEditMode: false,
    charityTotalDonated: 0,
    charityCompleted: 0,
    activeCharity: null,
    charityPendingPayouts: [],
    charityLastTickAt: Date.now(),
    readyToGoSales: 0,
    miloOfferUnlocked: false,
    miloHired: false,
    miloPromptNextAt: 0,
    miloNextWorkAt: 0,
    adActive: false,
    adType: '',
    adUntil: 0,
    adImageData: '',
    adText: '',
    adHistory: [],
    patienceInterval: null,
    unlockedItems: [...BASE_UNLOCKED_ITEMS],
    difficulty: 'normal'
};

const PRESTIGE_THRESHOLD = 10000;
const MILO_UNLOCK_MONEY = 10000;
const MILO_REASK_MS = 60 * 1000;
const MILO_WORK_INTERVAL_MS = 10 * 1000;
const VIP_SPAWN_CHANCE = 0.14;
const VIP_QUEUE_WAIT_MS = 22000;
const BASE_PATIENCE = 100;
const PATIENCE_DECAY = 8;
const MINIGAME_MODAL_IDS = ['grinder-modal', 'mixer-modal', 'fridge-modal', 'action-modal', 'cutting-modal'];
const CUSTOMER_WALK_IN_MS = 1400;
let floorWalkTimer = null;
let calibrationRun = null;
let calibrationResults = null;
let pendingDecorItemId = null;
const CALIBRATION_STORAGE_KEY = 'tangos-coffee-modal-calibration-v1';
const STEP_PADDING_SECONDS = 0.5;
const DEFAULT_MODAL_SECONDS = {
    grind: 1.9,
    mix: 1.36,
    fridge: 1.3,
    slice: 4.77,
    tamp: 1.73,
    brew: 1.42,
    water: 11.71,
    steam: 4.67,
    pour: 11.95,
    foam: 1.86,
    chocolate: 1.47,
    steep: 0.95,
    ice: 2.24,
    warm: 4.19,
    plate: 0.88,
    toast: 4.92,
    spread: 1.62,
    drizzle: 1.2,
    dust: 0.86,
    layer: 1.51,
    fruit: 1.9,
    stack: 1.39,
    press: 5.47,
    caramel: 1.74,
    vanilla: 1.51,
    scoop: 1.13,
    sift: 1.54,
    whisk: 1.17,
    nitro: 1.85
};
let calibratedModalSeconds = null;

function getEatingDurationMs(item) {
    const steps = Array.isArray(item?.steps) ? item.steps.length : 0;
    if (item?.type === 'food') return 7000 + steps * 900;
    return 4200 + steps * 420;
}

function pruneEatingGuests() {
    const now = Date.now();
    state.eatingGuests = (state.eatingGuests || []).filter((g) => g.eatingUntil > now);
}

function getRestaurantTables() {
    return TABLE_DEFS.map((def) => {
        const layout = state.tableLayout?.[def.id] || TABLE_BASE_LAYOUT[def.id];
        const x = Number(layout?.x) || TABLE_BASE_LAYOUT[def.id].x;
        const y = Number(layout?.y) || TABLE_BASE_LAYOUT[def.id].y;
        return {
            id: def.id,
            x,
            y,
            seats: def.seats.map((s) => ({ id: s.id, x: x + s.dx, y: y + s.dy }))
        };
    });
}

function getRestaurantSeats() {
    return getRestaurantTables().flatMap((t) => t.seats);
}

function getRestaurantSeatMap() {
    return Object.fromEntries(getRestaurantSeats().map((s) => [s.id, s]));
}

function getSeatToTableMap() {
    return Object.fromEntries(getRestaurantTables().flatMap((t) => t.seats.map((s) => [s.id, t.id])));
}

function getRestaurantSeatCapacity() {
    return getRestaurantSeats().length;
}

function getOccupiedSeatIds() {
    const occupied = new Set((state.queue || []).map((q) => q.seatId).filter(Boolean));
    if (state.activeOrder?.seatId) occupied.add(state.activeOrder.seatId);
    (state.eatingGuests || []).forEach((g) => {
        if (g.seatId) occupied.add(g.seatId);
    });
    return occupied;
}

function getOccupiedSeatCount() {
    return getOccupiedSeatIds().size;
}

function getClosestTableIdForDecor(decor) {
    let bestId = null;
    let bestDist = Number.POSITIVE_INFINITY;
    getRestaurantTables().forEach((table) => {
        const dx = (Number(decor.x) || 0) - table.x;
        const dy = (Number(decor.y) || 0) - table.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestDist) {
            bestDist = d2;
            bestId = table.id;
        }
    });
    return bestId;
}

function getDecorTipBonusForSeat(seatId) {
    const tableId = getSeatToTableMap()[seatId];
    if (!tableId) return 0;
    const raw = (state.placedDecor || []).reduce((sum, decor) => {
        const decorTableId = getClosestTableIdForDecor(decor);
        if (decorTableId !== tableId) return sum;
        const decorItem = DECOR_ITEMS.find((d) => d.id === decor.itemId);
        if (!decorItem) return sum;
        return sum + decorItem.cost / 100;
    }, 0);
    return Math.round(raw * 100) / 100;
}

function pickRandomAvailableSeatId() {
    const occupied = getOccupiedSeatIds();
    const available = getRestaurantSeats().filter((seat) => !occupied.has(seat.id));
    if (!available.length) return null;
    return available[Math.floor(Math.random() * available.length)].id;
}

function stampWalkIn(customer) {
    customer.enteringUntil = Date.now() + CUSTOMER_WALK_IN_MS;
}

function getToGoCounterLayout() {
    const fallback = TOGO_COUNTER_BASE_LAYOUT;
    const raw = state.toGoCounterLayout || fallback;
    return {
        x: Math.max(10, Math.min(94, Number(raw.x) || fallback.x)),
        y: Math.max(16, Math.min(92, Number(raw.y) || fallback.y))
    };
}

// DOM
const moneyEl = document.getElementById('money');
const ratingEl = document.getElementById('rating');
const dayEl = document.getElementById('day');
const prestigeEl = document.getElementById('prestige');
const prestigeBox = document.getElementById('prestige-box');
const customerQueue = document.getElementById('customer-queue');
const activeCustomer = document.getElementById('active-customer');
const customerOrderText = document.getElementById('customer-order-text');
const customerTip = document.getElementById('customer-tip');
const patienceFill = document.getElementById('patience-fill');
const orderSteps = document.getElementById('order-steps');
const actionButtons = document.getElementById('action-buttons');
const tangoStatus = document.getElementById('tango-status');
const tangoChar = document.getElementById('tango');
const tangoStation = document.querySelector('.tango-station');
const customerZone = document.querySelector('.customer-zone');
const decorList = document.getElementById('decor-list');
const floorThemeList = document.getElementById('floor-theme-list');
const wallThemeList = document.getElementById('wall-theme-list');
const toggleLayoutEditBtn = document.getElementById('toggle-layout-edit');
const charityEmojiEl = document.getElementById('charity-emoji');
const charityNameEl = document.getElementById('charity-name');
const charityMetaEl = document.getElementById('charity-meta');
const charityFillEl = document.getElementById('charity-fill');
const charityStatsEl = document.getElementById('charity-stats');
const charityCustomInput = document.getElementById('charity-custom-input');
const charityCustomBtn = document.getElementById('charity-custom-btn');
const marketingLockEl = document.getElementById('marketing-lock');
const textAdCopyInput = document.getElementById('text-ad-copy');
const textAdBtn = document.getElementById('text-ad-btn');
const openCameraBtn = document.getElementById('open-camera-btn');
const photoAdBtn = document.getElementById('photo-ad-btn');
const adStatusEl = document.getElementById('ad-status');
const adPhotoPreviewEl = document.getElementById('ad-photo-preview');
const adBillboardLeftEl = document.getElementById('ad-billboard-left');
const adBillboardRightEl = document.getElementById('ad-billboard-right');
const marketingCameraEl = document.getElementById('marketing-camera');
const adCameraVideo = document.getElementById('ad-camera-video');
const adCameraCanvas = document.getElementById('ad-camera-canvas');
const workspaceEl = document.querySelector('.workspace');
const shopVisualsEl = document.querySelector('.shop-visuals');

let miloVisualEl = null;
let miloPromptEl = null;
let adCameraStream = null;
let billboardCarouselIndex = 0;
let billboardLastSwitchAt = 0;

function spawnPoopThrowAtTango(sourceSeatId = null) {
    if (!tangoStation || !tangoChar) return;
    const sourceEl = sourceSeatId
        ? document.querySelector(`.floor-customer[data-seat-id="${sourceSeatId}"]`)
        : null;
    const sourceRect = sourceEl ? sourceEl.getBoundingClientRect() : null;
    const tangoRect = tangoChar.getBoundingClientRect();

    const startX = sourceRect ? sourceRect.left + sourceRect.width / 2 : 40;
    const startY = sourceRect ? sourceRect.top + sourceRect.height / 2 : window.innerHeight - 80;
    const targetX = tangoRect.left + tangoRect.width / 2 + (Math.random() * 90 - 45);
    const targetY = tangoRect.top + tangoRect.height * 0.55 + (Math.random() * 60 - 30);

    const projectile = document.createElement('div');
    projectile.className = 'poop-throw';
    projectile.textContent = '\u{1F4A9}';
    projectile.style.left = `${startX}px`;
    projectile.style.top = `${startY}px`;
    document.body.appendChild(projectile);

    const flight = projectile.animate(
        [
            { transform: 'translate(-50%, -50%) scale(0.72) rotate(-25deg)', opacity: 0.65 },
            { transform: `translate(${(targetX - startX) * 0.75}px, ${(targetY - startY) * 0.75}px) scale(1.06) rotate(8deg)`, opacity: 1 },
            { transform: `translate(${targetX - startX}px, ${targetY - startY}px) scale(1.02) rotate(14deg)`, opacity: 1 }
        ],
        { duration: 620, easing: 'cubic-bezier(0.2, 0.8, 0.22, 1)', fill: 'forwards' }
    );

    flight.onfinish = () => {
        projectile.remove();
        const stationRect = tangoStation.getBoundingClientRect();
        const splat = document.createElement('div');
        splat.className = 'poop-splat';
        splat.textContent = '\u{1F4A9}';
        splat.style.left = `${targetX - stationRect.left}px`;
        splat.style.top = `${targetY - stationRect.top}px`;
        tangoStation.appendChild(splat);
        setTimeout(() => splat.remove(), 180000);
    };
}

// Load saved state
function loadState() {
    try {
        const saved = localStorage.getItem('tangos-coffee');
        if (saved) {
            const parsed = JSON.parse(saved);
            state = { ...state, ...parsed };
            if (!Array.isArray(state.unlockedItems)) state.unlockedItems = [];
            BASE_UNLOCKED_ITEMS.forEach((id) => {
                if (!state.unlockedItems.includes(id)) state.unlockedItems.push(id);
            });
            const hasLifetime = Object.prototype.hasOwnProperty.call(parsed, 'lifetimeEarnings');
            if (!hasLifetime || typeof state.lifetimeEarnings !== 'number') {
                state.lifetimeEarnings = state.totalEarnings || 0;
            }
            if (!Array.isArray(state.queue)) state.queue = [];
            if (!Array.isArray(state.eatingGuests)) state.eatingGuests = [];
            if (typeof state.charityTotalDonated !== 'number') state.charityTotalDonated = 0;
            if (typeof state.charityCompleted !== 'number') state.charityCompleted = 0;
            if (typeof state.readyToGoSales !== 'number') state.readyToGoSales = 0;
            if (typeof state.miloOfferUnlocked !== 'boolean') state.miloOfferUnlocked = false;
            if (typeof state.miloHired !== 'boolean') state.miloHired = false;
            if (!Number.isFinite(Number(state.miloPromptNextAt))) state.miloPromptNextAt = 0;
            if (!Number.isFinite(Number(state.miloNextWorkAt))) state.miloNextWorkAt = 0;
            if (typeof state.adActive !== 'boolean') state.adActive = false;
            if (typeof state.adType !== 'string') state.adType = '';
            if (!Number.isFinite(Number(state.adUntil))) state.adUntil = 0;
            if (typeof state.adImageData !== 'string') state.adImageData = '';
            if (typeof state.adText !== 'string') state.adText = '';
            if (!Array.isArray(state.adHistory)) state.adHistory = [];
            state.adHistory = state.adHistory
                .filter((a) => a && (a.type === 'text' || a.type === 'photo'))
                .map((a) => ({
                    id: a.id || `ad-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                    type: a.type,
                    text: typeof a.text === 'string' ? a.text.slice(0, 160) : '',
                    imageData: typeof a.imageData === 'string' ? a.imageData : '',
                    createdAt: Number(a.createdAt) || Date.now(),
                    until: Number(a.until) || 0
                }))
                .slice(0, MAX_AD_HISTORY);
            if (!Array.isArray(state.charityPendingPayouts)) state.charityPendingPayouts = [];
            state.charityPendingPayouts = state.charityPendingPayouts
                .filter((p) => p && Number.isFinite(Number(p.dueAt)) && Number.isFinite(Number(p.reward)))
                .map((p) => ({
                    id: p.id || `charity-payout-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                    donated: Math.max(0, Number(p.donated) || 0),
                    reward: Math.max(0, Number(p.reward) || 0),
                    dueAt: Number(p.dueAt)
                }));
            if (!Number.isFinite(Number(state.charityLastTickAt))) state.charityLastTickAt = Date.now();
            if (!state.tableLayout || typeof state.tableLayout !== 'object') state.tableLayout = { ...TABLE_BASE_LAYOUT };
            Object.keys(TABLE_BASE_LAYOUT).forEach((id) => {
                if (!state.tableLayout[id]) state.tableLayout[id] = { ...TABLE_BASE_LAYOUT[id] };
                state.tableLayout[id].x = Math.max(10, Math.min(90, Number(state.tableLayout[id].x) || TABLE_BASE_LAYOUT[id].x));
                state.tableLayout[id].y = Math.max(14, Math.min(86, Number(state.tableLayout[id].y) || TABLE_BASE_LAYOUT[id].y));
            });
            if (!state.toGoCounterLayout || typeof state.toGoCounterLayout !== 'object') {
                state.toGoCounterLayout = { ...TOGO_COUNTER_BASE_LAYOUT };
            }
            state.toGoCounterLayout.x = Math.max(10, Math.min(94, Number(state.toGoCounterLayout.x) || TOGO_COUNTER_BASE_LAYOUT.x));
            state.toGoCounterLayout.y = Math.max(16, Math.min(92, Number(state.toGoCounterLayout.y) || TOGO_COUNTER_BASE_LAYOUT.y));
            if (!state.decorOwned || typeof state.decorOwned !== 'object') state.decorOwned = {};
            if (!Array.isArray(state.placedDecor)) state.placedDecor = [];
            state.placedDecor = state.placedDecor
                .filter((d) => d && typeof d.itemId === 'string')
                .map((d) => ({
                    id: d.id || `decor-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                    itemId: d.itemId,
                    x: Math.max(4, Math.min(96, Number(d.x) || 50)),
                    y: Math.max(6, Math.min(94, Number(d.y) || 50))
                }));
            const seatMap = getRestaurantSeatMap();
            const seats = getRestaurantSeats();
            const used = new Set();
            state.queue = state.queue.map((q) => {
                let seatId = q.seatId;
                if (!seatId || !seatMap[seatId] || used.has(seatId)) {
                    const next = seats.find((s) => !used.has(s.id));
                    seatId = next ? next.id : null;
                }
                if (!seatId) return null;
                used.add(seatId);
                return { ...q, seatId, enteringUntil: Date.now() + 200 };
            }).filter(Boolean);
            if (!state.activeCharity || typeof state.activeCharity !== 'object') state.activeCharity = null;
        }
    } catch (e) {}
}

function saveState() {
    try {
        localStorage.setItem('tangos-coffee', JSON.stringify({
            money: state.money,
            rating: state.rating,
            day: state.day,
            prestige: state.prestige,
            totalEarnings: state.totalEarnings,
            lifetimeEarnings: state.lifetimeEarnings,
            customersServed: state.customersServed,
            ordersCompleted: state.ordersCompleted,
            perfectOrders: state.perfectOrders,
            upgrades: state.upgrades,
            decorOwned: state.decorOwned,
            placedDecor: state.placedDecor,
            floorTheme: state.floorTheme,
            wallTheme: state.wallTheme,
            tableLayout: state.tableLayout,
            toGoCounterLayout: state.toGoCounterLayout,
            layoutEditMode: state.layoutEditMode,
            charityTotalDonated: state.charityTotalDonated,
            charityCompleted: state.charityCompleted,
            activeCharity: state.activeCharity,
            charityPendingPayouts: state.charityPendingPayouts,
            charityLastTickAt: state.charityLastTickAt,
            readyToGoSales: state.readyToGoSales,
            miloOfferUnlocked: state.miloOfferUnlocked,
            miloHired: state.miloHired,
            miloPromptNextAt: state.miloPromptNextAt,
            miloNextWorkAt: state.miloNextWorkAt,
            adActive: state.adActive,
            adType: state.adType,
            adUntil: state.adUntil,
            adImageData: state.adImageData,
            adText: state.adText,
            adHistory: state.adHistory,
            unlockedItems: state.unlockedItems,
            difficulty: state.difficulty
        }));
    } catch (e) {}
}

function loadCalibrationProfile() {
    try {
        const raw = localStorage.getItem(CALIBRATION_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.modalSeconds && typeof parsed.modalSeconds === 'object') {
            calibratedModalSeconds = parsed.modalSeconds;
            calibrationResults = {
                averages: parsed.modalSeconds,
                runs: parsed.runs || 0,
                at: parsed.at || Date.now()
            };
        }
    } catch (e) {}
}

function saveCalibrationProfile(modalSeconds, runs = 0) {
    try {
        localStorage.setItem(CALIBRATION_STORAGE_KEY, JSON.stringify({
            modalSeconds,
            runs,
            at: Date.now()
        }));
    } catch (e) {}
}

function formatMoney(n) {
    return '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function formatMoneyPrecise(n) {
    return '$' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDurationShort(ms) {
    const totalSeconds = Math.max(0, Math.ceil((Number(ms) || 0) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function showToast(msg, type = '') {
    const toast = document.getElementById('notification-toast');
    toast.textContent = msg;
    toast.className = 'notification-toast show ' + type;
    setTimeout(() => toast.classList.remove('show'), 2000);
}

function hasToGoUpgrade() {
    return !!state.upgrades['to-go'];
}

function hasVipUpgrade() {
    return !!state.upgrades['vip-service'];
}

function hasMarketingUpgrade() {
    return !!state.upgrades.marketing;
}

function isAdActive() {
    if (!state.adActive) return false;
    if (!Number.isFinite(Number(state.adUntil)) || Date.now() >= Number(state.adUntil)) {
        state.adActive = false;
        state.adType = '';
        state.adUntil = 0;
        state.adImageData = '';
        state.adText = '';
        return false;
    }
    return true;
}

function formatDurationCompact(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}

function escapeHtml(raw) {
    return String(raw || '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function pushAdCreativeToHistory(ad) {
    if (!ad || (ad.type !== 'text' && ad.type !== 'photo')) return;
    const entry = {
        id: ad.id || `ad-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type: ad.type,
        text: String(ad.text || '').slice(0, 160),
        imageData: String(ad.imageData || ''),
        createdAt: Number(ad.createdAt) || Date.now(),
        until: Number(ad.until) || 0
    };
    state.adHistory = [entry, ...(state.adHistory || [])].slice(0, MAX_AD_HISTORY);
}

function buildAdCreativeListForBillboards() {
    const list = [];
    const active = isAdActive();
    if (active) {
        list.push({
            id: `active-${state.adType}-${state.adUntil}`,
            type: state.adType,
            text: state.adText || '',
            imageData: state.adImageData || '',
            createdAt: Date.now(),
            until: Number(state.adUntil) || 0,
            active: true
        });
    }
    (state.adHistory || []).forEach((a) => {
        if (!a || (a.type !== 'text' && a.type !== 'photo')) return;
        const duplicateActive = active
            && a.type === state.adType
            && Number(a.until) === Number(state.adUntil)
            && ((a.type === 'photo' && a.imageData === state.adImageData) || (a.type === 'text' && a.text === state.adText));
        if (!duplicateActive) list.push({ ...a, active: false });
    });
    return list;
}

function renderBillboardCard(ad) {
    if (!ad) return '';
    const live = ad.active ? '<span class="billboard-live">LIVE</span>' : '';
    if (ad.type === 'photo' && ad.imageData) {
        return `
            <div class="billboard-card photo">
                <img class="billboard-photo" src="${ad.imageData}" alt="Ad photo" />
                <span class="billboard-top-right">\u2615</span>
                <span class="billboard-bottom-left">Tango</span>
                ${live}
            </div>
        `;
    }
    const text = escapeHtml(ad.text || 'Fresh coffee. Cozy vibes. Visit Tango.');
    return `
        <div class="billboard-card text">
            <span class="billboard-top-right">\u2615</span>
            <p class="billboard-text-copy">${text}</p>
            <span class="billboard-bottom-left">Tango</span>
            ${live}
        </div>
    `;
}

function renderAdBillboards() {
    if (!adBillboardLeftEl || !adBillboardRightEl) return;
    const active = isAdActive();
    adBillboardLeftEl.classList.toggle('hidden', !active);
    adBillboardRightEl.classList.toggle('hidden', !active);
    if (!active) return;

    const currentAd = {
        id: `active-${state.adType}-${state.adUntil}`,
        type: state.adType,
        text: state.adText || '',
        imageData: state.adImageData || '',
        active: true
    };
    const cardHtml = renderBillboardCard(currentAd);
    adBillboardLeftEl.innerHTML = cardHtml;
    adBillboardRightEl.innerHTML = cardHtml;
}

function stopAdCamera() {
    if (adCameraStream) {
        adCameraStream.getTracks().forEach((t) => t.stop());
        adCameraStream = null;
    }
    if (marketingCameraEl) marketingCameraEl.classList.remove('active');
    if (openCameraBtn) openCameraBtn.textContent = 'Use Camera';
    if (photoAdBtn) photoAdBtn.disabled = true;
}

async function toggleAdCamera() {
    if (!hasMarketingUpgrade()) return;
    if (adCameraStream) {
        stopAdCamera();
        return;
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        adCameraStream = stream;
        if (adCameraVideo) adCameraVideo.srcObject = stream;
        if (marketingCameraEl) marketingCameraEl.classList.add('active');
        if (openCameraBtn) openCameraBtn.textContent = 'Close Camera';
        if (photoAdBtn) photoAdBtn.disabled = false;
    } catch (err) {
        showToast('Camera unavailable for photo ad.', 'negative');
    }
}

function startAd(type, options = {}) {
    const cost = type === 'photo' ? AD_PHOTO_COST : AD_TEXT_COST;
    const customText = String(options.text || '').trim();
    if (type === 'text' && !customText) {
        showToast('Write text for your ad first.', 'negative');
        return false;
    }
    if (state.money < cost) {
        showToast('Not enough money for ad.', 'negative');
        return false;
    }
    state.money -= cost;
    state.adActive = true;
    state.adType = type;
    state.adUntil = Date.now() + AD_DURATION_MS;
    state.adText = type === 'text' ? customText.slice(0, 160) : '';
    if (type !== 'photo') state.adImageData = '';
    pushAdCreativeToHistory({
        type,
        text: state.adText,
        imageData: state.adImageData,
        createdAt: Date.now(),
        until: state.adUntil
    });
    updateUI();
    saveState();
    showToast(`${type === 'photo' ? 'Photo' : 'Text'} ad is live. More customers incoming!`, 'positive');
    return true;
}

function startPhotoAdFromCamera() {
    if (!hasMarketingUpgrade()) return;
    if (!adCameraStream || !adCameraVideo || !adCameraCanvas) {
        showToast('Open camera first.', 'negative');
        return;
    }
    const ctx = adCameraCanvas.getContext('2d');
    if (!ctx) return;
    const w = adCameraCanvas.width;
    const h = adCameraCanvas.height;
    ctx.drawImage(adCameraVideo, 0, 0, w, h);
    state.adImageData = adCameraCanvas.toDataURL('image/jpeg', 0.8);
    if (startAd('photo')) {
        stopAdCamera();
    }
}

function renderMarketingPanel() {
    const unlocked = hasMarketingUpgrade();
    const active = isAdActive();
    if (marketingLockEl) marketingLockEl.style.display = unlocked ? 'none' : 'block';
    if (textAdCopyInput) {
        textAdCopyInput.disabled = !unlocked;
        textAdCopyInput.oninput = () => renderMarketingPanel();
    }
    if (textAdBtn) {
        const hasCopy = !!String(textAdCopyInput?.value || '').trim();
        textAdBtn.disabled = !unlocked || state.money < AD_TEXT_COST || !hasCopy;
        textAdBtn.textContent = `$${AD_TEXT_COST} Text Ad`;
        textAdBtn.onclick = () => {
            const adCopy = String(textAdCopyInput?.value || '').trim();
            if (startAd('text', { text: adCopy }) && textAdCopyInput) {
                textAdCopyInput.value = '';
            }
        };
    }
    if (openCameraBtn) {
        openCameraBtn.disabled = !unlocked;
        openCameraBtn.onclick = () => toggleAdCamera();
    }
    if (photoAdBtn) {
        const canPhoto = unlocked && !!adCameraStream;
        photoAdBtn.disabled = !canPhoto || state.money < AD_PHOTO_COST;
        photoAdBtn.textContent = `$${AD_PHOTO_COST} Photo Ad`;
        photoAdBtn.onclick = () => startPhotoAdFromCamera();
    }
    if (adStatusEl) {
        if (active) {
            const left = Math.max(0, state.adUntil - Date.now());
            const textSnippet = state.adType === 'text' && state.adText
                ? ` • "${state.adText.slice(0, 30)}${state.adText.length > 30 ? '…' : ''}"`
                : '';
            adStatusEl.textContent = `${state.adType === 'photo' ? 'Photo' : 'Text'} ad active • ${formatDurationCompact(left)} left • customer boost on${textSnippet}`;
        } else {
            adStatusEl.textContent = unlocked ? 'No active ad.' : 'Ads locked.';
        }
    }
    if (adPhotoPreviewEl) {
        const showPreview = active && state.adType === 'photo' && !!state.adImageData;
        adPhotoPreviewEl.classList.toggle('active', showPreview);
        if (showPreview) adPhotoPreviewEl.src = state.adImageData;
        else adPhotoPreviewEl.removeAttribute('src');
    }
    renderAdBillboards();
}

function ensureMiloVisual() {
    if (miloVisualEl && document.body.contains(miloVisualEl)) return miloVisualEl;
    if (!workspaceEl) return null;
    miloVisualEl = document.createElement('div');
    miloVisualEl.id = 'milo-kitchen';
    miloVisualEl.className = 'shop-visual milo-kitchen hidden';
    miloVisualEl.innerHTML = `
        <span class="visual-emoji">&#x1F408;</span>
        <span class="milo-name">Milo</span>
        <span class="milo-note">Kitchen Helper</span>
    `;
    if (shopVisualsEl) shopVisualsEl.appendChild(miloVisualEl);
    else workspaceEl.appendChild(miloVisualEl);
    return miloVisualEl;
}

function renderMiloVisual() {
    const el = ensureMiloVisual();
    if (!el) return;
    el.classList.toggle('hidden', !state.miloHired);
}

function ensureMiloPrompt() {
    if (miloPromptEl && document.body.contains(miloPromptEl)) return miloPromptEl;
    miloPromptEl = document.createElement('div');
    miloPromptEl.className = 'milo-offer hidden';
    miloPromptEl.innerHTML = `
        <div class="milo-offer-card">
            <div class="milo-offer-emoji">&#x1F408;</div>
            <h4>Milo Wants To Work Here!</h4>
            <p>Milo asks to join your restaurant. Hire him and he will auto-take and auto-serve one waiting order every 30 seconds.</p>
            <div class="milo-offer-actions">
                <button class="milo-btn hire">Hire Milo</button>
                <button class="milo-btn later">Not now</button>
            </div>
        </div>
    `;
    document.body.appendChild(miloPromptEl);
    const hireBtn = miloPromptEl.querySelector('.milo-btn.hire');
    const laterBtn = miloPromptEl.querySelector('.milo-btn.later');
    if (hireBtn) {
        hireBtn.onclick = () => {
            state.miloHired = true;
            state.miloPromptNextAt = 0;
            state.miloNextWorkAt = Date.now() + MILO_WORK_INTERVAL_MS;
            miloPromptEl.classList.add('hidden');
            renderMiloVisual();
            saveState();
            showToast('Milo joined your kitchen team!', 'positive');
        };
    }
    if (laterBtn) {
        laterBtn.onclick = () => {
            state.miloPromptNextAt = Date.now() + MILO_REASK_MS;
            miloPromptEl.classList.add('hidden');
            saveState();
        };
    }
    return miloPromptEl;
}

function maybePromptMiloOffer() {
    if (state.miloHired) return false;
    if (state.activeOrder) return false;
    if (!state.miloOfferUnlocked && state.money >= MILO_UNLOCK_MONEY) {
        state.miloOfferUnlocked = true;
    }
    if (!state.miloOfferUnlocked) return false;
    const now = Date.now();
    if (now < (state.miloPromptNextAt || 0)) return false;
    const prompt = ensureMiloPrompt();
    if (!prompt || !prompt.classList.contains('hidden')) return false;
    prompt.classList.remove('hidden');
    return true;
}

function popMiloEarnings(earnings) {
    const anchor = document.getElementById('milo-kitchen');
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const pop = document.createElement('div');
    pop.className = 'milo-money-pop';
    pop.textContent = `+${formatMoneyPrecise(earnings)}`;
    pop.style.left = `${rect.left + rect.width * 0.6}px`;
    pop.style.top = `${rect.top + rect.height * 0.3}px`;
    document.body.appendChild(pop);
    pop.animate(
        [
            { transform: 'translate(-50%, -50%) scale(0.84)', opacity: 0 },
            { transform: 'translate(-50%, -95%) scale(1)', opacity: 1, offset: 0.22 },
            { transform: 'translate(-50%, -190%) scale(1)', opacity: 0 }
        ],
        { duration: 950, easing: 'ease-out', fill: 'forwards' }
    ).onfinish = () => pop.remove();
}

function miloServeOneOrder() {
    if (!state.miloHired) return false;
    const now = Date.now();
    const index = state.queue.findIndex((q) => !q.enteringUntil || q.enteringUntil <= now);
    if (index < 0) return false;
    const order = state.queue.splice(index, 1)[0];
    if (!order?.item) return false;
    const difficulty = getDifficulty();
    const vipPayoutMult = order.vip ? 2 : 1;
    const mult = getMultiplier() * (difficulty.payoutMult || 1) * vipPayoutMult;
    let earnings = order.item.price * mult;
    const decorTipBonus = getDecorTipBonusForSeat(order.seatId);
    const tip = Math.floor(earnings * 0.14) + decorTipBonus;
    earnings += tip;

    state.money += earnings;
    state.totalEarnings += earnings;
    state.lifetimeEarnings += earnings;
    state.customersServed += 1;
    state.ordersCompleted += 1;
    state.rating = Math.max(1, Math.min(5, state.rating + 0.02));

    popMiloEarnings(earnings);
    showToast(`Milo served ${order.item.name}${order.vip ? ' (VIP)' : ''}: +${formatMoneyPrecise(earnings)}`, 'positive');
    renderQueue();
    updateUI();
    saveState();
    return true;
}

function processMiloSystems() {
    const wasUnlocked = !!state.miloOfferUnlocked;
    const promptShown = maybePromptMiloOffer();
    if (!wasUnlocked && state.miloOfferUnlocked) saveState();
    if (promptShown) saveState();
    if (state.miloHired && (!state.miloNextWorkAt || !Number.isFinite(Number(state.miloNextWorkAt)))) {
        state.miloNextWorkAt = Date.now() + MILO_WORK_INTERVAL_MS;
        saveState();
    }
    if (!state.miloHired) return promptShown;

    const now = Date.now();
    if (now < state.miloNextWorkAt) return promptShown;

    state.miloNextWorkAt = now + MILO_WORK_INTERVAL_MS;
    const served = miloServeOneOrder();
    if (!served) saveState();
    const el = ensureMiloVisual();
    if (el) {
        el.classList.add('working');
        setTimeout(() => el.classList.remove('working'), 600);
    }
    return true;
}

function getMultiplier() {
    return 1 + (state.prestige * 0.1);
}

function getPatienceMultiplier() {
    let m = 1;
    if (state.upgrades.display) m += 0.2;
    if (state.upgrades.music) m += 0.2;
    return m;
}

function getPatience(difficulty = getDifficulty()) {
    const diffMult = difficulty.patienceMult;
    return Math.floor(BASE_PATIENCE * getPatienceMultiplier() * diffMult);
}

function getPatienceFromSeconds(seconds, difficulty = getDifficulty()) {
    const diffMult = difficulty.patienceMult;
    return Math.max(1, Math.floor(seconds * PATIENCE_DECAY * getPatienceMultiplier() * diffMult));
}

function getStepModalSeconds(stepId) {
    const fromCalibration = calibratedModalSeconds && typeof calibratedModalSeconds[stepId] === 'number'
        ? calibratedModalSeconds[stepId]
        : null;
    const fallback = typeof DEFAULT_MODAL_SECONDS[stepId] === 'number'
        ? DEFAULT_MODAL_SECONDS[stepId]
        : 3;
    return fromCalibration || fallback;
}

function getAutoOrderSeconds(item) {
    const steps = Array.isArray(item?.steps) ? item.steps : [];
    if (!steps.length) return 10;
    const modalTotal = steps.reduce((sum, stepId) => sum + getStepModalSeconds(stepId), 0);
    const transitionPad = Math.max(0, steps.length - 1) * STEP_PADDING_SECONDS;
    return modalTotal + transitionPad;
}

function getOrderPatience(item, difficulty = getDifficulty()) {
    const autoSeconds = getAutoOrderSeconds(item);
    return getPatienceFromSeconds(autoSeconds, difficulty);
}

function isInfiniteTimeMode(difficulty = getDifficulty()) {
    return !!difficulty.infiniteTime;
}

function getRatingChange(speedBonus, perfect) {
    let change = 0;
    if (speedBonus) change += 0.05;
    if (perfect) change += 0.05;
    if (state.upgrades.decor) change += 0.02;
    if (!speedBonus && state.customerPatience < 30) change -= 0.1;
    return change;
}

function getDisplayRating() {
    return (state.rating + (state.upgrades.decor ? 0.1 : 0)).toFixed(1);
}

function getVipTopItemPool(itemIds) {
    const valid = (itemIds || []).filter((id) => MENU_ITEMS[id] && !MENU_ITEMS[id].readyToGo);
    if (!valid.length) return [];
    const topCount = Math.max(1, Math.ceil(valid.length * 0.2));
    return valid
        .slice()
        .sort((a, b) => (MENU_ITEMS[b].price || 0) - (MENU_ITEMS[a].price || 0))
        .slice(0, topCount);
}

function pruneVipQueueTimeouts() {
    const now = Date.now();
    if (!Array.isArray(state.queue) || state.queue.length === 0) return false;
    const kept = [];
    let removed = 0;
    state.queue.forEach((q) => {
        if (q?.vip && Number.isFinite(Number(q.vipExpireAt)) && now >= Number(q.vipExpireAt)) {
            removed += 1;
            return;
        }
        kept.push(q);
    });
    if (!removed) return false;
    state.queue = kept;
    state.rating = Math.max(1, state.rating - (0.05 * removed));
    showToast(removed === 1
        ? 'A VIP left: you waited too long to start their order.'
        : `${removed} VIPs left: you waited too long to start their orders.`, 'negative');
    renderQueue();
    updateUI();
    saveState();
    return true;
}

function spawnCustomer() {
    const seatId = pickRandomAvailableSeatId();
    if (!seatId) return;
    const items = (state.unlockedItems || []).filter((id) => !MENU_ITEMS[id]?.readyToGo);
    if (!items.length) return;
    const vipPool = hasVipUpgrade() ? getVipTopItemPool(items) : [];
    const isVip = hasVipUpgrade() && vipPool.length > 0 && Math.random() < VIP_SPAWN_CHANCE;
    let itemId = items[Math.floor(Math.random() * items.length)];
    if (isVip) {
        itemId = vipPool[Math.floor(Math.random() * vipPool.length)];
    } else if (items.includes('tangoSpecialty')) {
        const nonSpecial = items.filter((id) => id !== 'tangoSpecialty');
        if (Math.random() < 0.10) {
            itemId = 'tangoSpecialty';
        } else if (nonSpecial.length > 0) {
            itemId = nonSpecial[Math.floor(Math.random() * nonSpecial.length)];
        }
    }
    const item = MENU_ITEMS[itemId];
    const emoji = CUSTOMER_EMOJIS[Math.floor(Math.random() * CUSTOMER_EMOJIS.length)];
    const patience = getOrderPatience(item);
    const customer = {
        id: Date.now() + Math.random(),
        emoji,
        itemId,
        item,
        patience,
        seatId,
        vip: isVip
    };
    stampWalkIn(customer);
    if (isVip) customer.vipExpireAt = customer.enteringUntil + VIP_QUEUE_WAIT_MS;
    state.queue.push(customer);
    renderQueue();
}

function processReadyToGoSales() {
    if (!hasToGoUpgrade()) return false;
    const readyItems = (state.unlockedItems || []).filter((id) => MENU_ITEMS[id]?.readyToGo);
    if (!readyItems.length) return false;

    const chance = state.activeOrder ? 0.15 : 0.24;
    if (Math.random() > chance) return false;

    const itemId = readyItems[Math.floor(Math.random() * readyItems.length)];
    const item = MENU_ITEMS[itemId];
    if (!item) return false;

    const difficulty = getDifficulty();
    const base = item.price * getMultiplier() * (difficulty.payoutMult || 1);
    const tip = Math.round((base * (0.05 + Math.random() * 0.08)) * 100) / 100;
    const earnings = Math.round((base + tip) * 100) / 100;

    state.money += earnings;
    state.totalEarnings += earnings;
    state.lifetimeEarnings += earnings;
    state.customersServed += 1;
    state.readyToGoSales = (state.readyToGoSales || 0) + 1;
    animateReadyToGoSale(item, earnings);
    showToast(`${item.emoji} ${item.name} to-go sold: +${formatMoneyPrecise(earnings)}`, 'positive');
    return true;
}

function animateReadyToGoSale(item, earnings) {
    const floor = customerQueue?.querySelector('.restaurant-floor');
    if (!floor) return;
    const rect = floor.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const counter = getToGoCounterLayout();
    const counterXPct = counter.x;
    const counterYPct = counter.y;
    const sideDistances = [
        { side: 'left', d: counterXPct },
        { side: 'right', d: 100 - counterXPct },
        { side: 'top', d: counterYPct },
        { side: 'bottom', d: 100 - counterYPct }
    ].sort((a, b) => a.d - b.d);
    const entrySide = sideDistances[0].side;
    const exitSide = sideDistances[1]?.side || sideDistances[0].side;

    const edgePoint = (side, outside = 0) => {
        const jitter = Math.random() * 8 - 4;
        if (side === 'left') return { x: -outside, y: Math.max(6, Math.min(94, counterYPct + jitter)) };
        if (side === 'right') return { x: 100 + outside, y: Math.max(6, Math.min(94, counterYPct + jitter)) };
        if (side === 'top') return { x: Math.max(6, Math.min(94, counterXPct + jitter)), y: -outside };
        return { x: Math.max(6, Math.min(94, counterXPct + jitter)), y: 100 + outside };
    };

    const startPct = edgePoint(entrySide, 6);
    const exitPct = edgePoint(exitSide, 8);

    const startX = rect.left + rect.width * (startPct.x / 100);
    const startY = rect.top + rect.height * (startPct.y / 100);
    const counterX = rect.left + rect.width * (counterXPct / 100);
    const counterY = rect.top + rect.height * (counterYPct / 100);
    const exitX = rect.left + rect.width * (exitPct.x / 100);
    const exitY = rect.top + rect.height * (exitPct.y / 100);

    const walker = document.createElement('div');
    walker.className = 'togo-walker-live';
    walker.style.left = `${startX}px`;
    walker.style.top = `${startY}px`;
    const walkerEmoji = CUSTOMER_EMOJIS[Math.floor(Math.random() * CUSTOMER_EMOJIS.length)] || '\u{1F642}';
    walker.innerHTML = `
        <span class="togo-walker-emoji">${walkerEmoji}</span>
        <span class="togo-walker-item">${item?.emoji || '\u{1F9C3}'}</span>
    `;
    document.body.appendChild(walker);

    const dxCounter = counterX - startX;
    const dyCounter = counterY - startY;
    const dxExit = exitX - startX;
    const dyExit = exitY - startY;

    const toCounter = walker.animate(
        [
            { transform: 'translate(-50%, -50%) scale(0.96)' },
            { transform: `translate(calc(-50% + ${dxCounter}px), calc(-50% + ${dyCounter}px)) scale(1)` }
        ],
        { duration: 900, easing: 'cubic-bezier(0.2, 0.8, 0.25, 1)', fill: 'forwards' }
    );

    toCounter.onfinish = () => {
        walker.classList.add('holding-item');

        const moneyPop = document.createElement('div');
        moneyPop.className = 'togo-money-pop';
        moneyPop.textContent = `+${formatMoneyPrecise(earnings)}`;
        moneyPop.style.left = `${counterX}px`;
        moneyPop.style.top = `${counterY - 8}px`;
        document.body.appendChild(moneyPop);
        moneyPop.animate(
            [
                { transform: 'translate(-50%, -50%) scale(0.86)', opacity: 0 },
                { transform: 'translate(-50%, -88%) scale(1.02)', opacity: 1, offset: 0.2 },
                { transform: 'translate(-50%, -160%) scale(1)', opacity: 0 }
            ],
            { duration: 950, easing: 'ease-out', fill: 'forwards' }
        ).onfinish = () => moneyPop.remove();

        walker.animate(
            [
                { transform: `translate(calc(-50% + ${dxCounter}px), calc(-50% + ${dyCounter}px)) scale(1)` },
                { transform: `translate(calc(-50% + ${dxExit}px), calc(-50% + ${dyExit}px)) scale(0.95)` }
            ],
            { duration: 980, easing: 'cubic-bezier(0.25, 0.78, 0.3, 1)', fill: 'forwards' }
        ).onfinish = () => walker.remove();
    };
}

function startCustomer(orderId = null) {
    if (state.activeOrder || state.queue.length === 0) return;
    let index = 0;
    if (orderId !== null && orderId !== undefined) {
        const wanted = String(orderId);
        const foundIndex = state.queue.findIndex((q) => String(q.id) === wanted);
        index = foundIndex >= 0 ? foundIndex : 0;
    }
    state.activeOrder = state.queue.splice(index, 1)[0];
    state.currentStepIndex = 0;
    state.customerPatience = state.activeOrder.patience;
    state.customerPatienceMax = Math.max(1, state.activeOrder.patience);
    renderQueue();
    renderOrder();
    renderActiveCustomer();
    startPatienceDecay();
}

function startPatienceDecay() {
    if (state.patienceInterval) clearInterval(state.patienceInterval);
    const difficulty = getDifficulty();
    if (isInfiniteTimeMode(difficulty)) {
        state.customerPatience = state.customerPatienceMax;
        renderActiveCustomer();
        return;
    }
    const decayPerTick = (PATIENCE_DECAY * (difficulty.decayMult || 1)) / 10;
    state.patienceInterval = setInterval(() => {
        state.customerPatience -= decayPerTick;
        if (state.customerPatience <= 0) {
            completeOrder(false, 'timeout');
        }
        renderActiveCustomer();
    }, 100);
}

function closeAllMinigameModals() {
    MINIGAME_MODAL_IDS.forEach((id) => {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('hidden');
    });
    tangoChar.classList.remove('working');
}

function completeOrder(success, reason = '') {
    if (state.patienceInterval) {
        clearInterval(state.patienceInterval);
        state.patienceInterval = null;
    }
    const order = state.activeOrder;
    if (!order) return;

    if (success) {
        const difficulty = getDifficulty();
        const vipPayoutMult = order.vip ? 2 : 1;
        const mult = getMultiplier() * (difficulty.payoutMult || 1) * vipPayoutMult;
        let earnings = order.item.price * mult;
        const tipBonus = state.upgrades.training ? 1.15 : 1;
        const patiencePct = (state.customerPatience / Math.max(1, state.customerPatienceMax)) * 100;
        const decorTipBonus = getDecorTipBonusForSeat(order.seatId);
        const tip = Math.floor(earnings * 0.15 * tipBonus * Math.max(0, Math.min(1, patiencePct / 100))) + decorTipBonus;
        earnings += tip;

        state.money += earnings;
        state.totalEarnings += earnings;
        state.lifetimeEarnings += earnings;
        state.customersServed++;
        state.ordersCompleted++;

        const speedBonus = patiencePct > 50;
        const perfect = state.currentStepIndex >= order.item.steps.length;
        if (perfect) state.perfectOrders++;

        const ratingChange = getRatingChange(speedBonus, perfect);
        state.rating = Math.max(1, Math.min(5, state.rating + ratingChange));

        const eatingFor = getEatingDurationMs(order.item);
        state.eatingGuests.push({
            id: `eat-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            seatId: order.seatId,
            emoji: order.emoji,
            itemEmoji: order.item?.emoji || '\u{1F37D}',
            eatingUntil: Date.now() + eatingFor
        });

        if (decorTipBonus > 0) {
            showToast(`+${formatMoney(earnings)} (${order.item.name}${order.vip ? ' VIP x2' : ''}, decor tip +${decorTipBonus.toFixed(2)})`, 'positive');
        } else {
            showToast(`+${formatMoney(earnings)} (${order.item.name}${order.vip ? ' VIP x2' : ''})`, 'positive');
        }
    } else {
        state.rating = Math.max(1, state.rating - 0.15);
        if (reason === 'timeout') {
            closeAllMinigameModals();
            spawnPoopThrowAtTango(order.seatId);
            showToast('Out of time!', 'negative');
        } else {
            showToast('Customer left unhappy!', 'negative');
        }
    }

    state.activeOrder = null;
    activeCustomer.classList.add('hidden');
    tangoChar.classList.remove('working');
    tangoStatus.textContent = 'Ready to serve!';
    renderOrder();
    renderActiveCustomer();
    updateUI();
    saveState();
}

function doStep(stepId) {
    if (!state.activeOrder) return;
    const order = state.activeOrder;
    const expectedStep = order.item.steps[state.currentStepIndex];
    if (stepId !== expectedStep) return;

    if (stepId === 'grind') {
        openGrinderModal();
        return;
    }
    if (stepId === 'mix') {
        openMixerModal();
        return;
    }
    if (stepId === 'fridge') {
        openFridgeModal();
        return;
    }
    if (stepId === 'slice') {
        openCuttingModal();
        return;
    }
    if (STEP_ACTIONS[stepId]) {
        openActionModal(stepId);
        return;
    }

    tangoChar.classList.add('working');
    tangoStatus.textContent = `Making ${STEP_LABELS[stepId]}...`;

    const baseTime = stepId === 'steep' ? 400 : 800;
    let time = baseTime;
    if (stepId === 'brew' && state.upgrades.machine) time /= 1.4;
    if (stepId === 'steam' && state.upgrades.steamer) time /= 1.5;
    if (state.upgrades['prep-tools'] && ['warm', 'toast', 'slice', 'spread', 'drizzle', 'dust', 'layer', 'fruit', 'stack', 'press', 'caramel', 'vanilla', 'scoop', 'sift', 'whisk', 'nitro'].includes(stepId)) {
        time /= 1.3;
    }

    setTimeout(() => {
        state.currentStepIndex++;
        tangoChar.classList.remove('working');
        tangoStatus.textContent = state.currentStepIndex >= order.item.steps.length
            ? 'Serve it!'
            : `Next: ${STEP_LABELS[order.item.steps[state.currentStepIndex]]}`;
        renderOrder();
    }, time);
}

// --- Grinder mini-game ---
const GRIND_CLICKS_NEEDED = 6;
const MIX_CLICKS_NEEDED = 5;
const ACTION_DEFAULT_CLICKS = 4;
const ACTION_DEFAULT_HOLD = 1000;

function openGrinderModal() {
    tangoChar.classList.add('working');
    const modal = document.getElementById('grinder-modal');
    const progress = document.getElementById('grind-progress');
    const countEl = document.getElementById('grind-count');
    const needed = state.upgrades.grinder ? 4 : GRIND_CLICKS_NEEDED;
    let clicks = 0;

    const complete = () => {
        modal.classList.add('hidden');
        state.currentStepIndex++;
        tangoChar.classList.remove('working');
        const order = state.activeOrder;
        tangoStatus.textContent = order && state.currentStepIndex < order.item.steps.length
            ? `Next: ${STEP_LABELS[order.item.steps[state.currentStepIndex]]}`
            : 'Serve it!';
        renderOrder();
        grinderHandle.onclick = null;
    };

    const grinderHandle = document.getElementById('grinder-handle');
    grinderHandle.onclick = () => {
        clicks++;
        const pct = (clicks / needed) * 100;
        progress.style.width = pct + '%';
        countEl.textContent = `${clicks} / ${needed}`;
        if (clicks >= needed) complete();
    };

    progress.style.width = '0%';
    countEl.textContent = '0 / ' + needed;
    modal.classList.remove('hidden');
}

// --- Mixer mini-game ---
function openMixerModal() {
    tangoChar.classList.add('working');
    const modal = document.getElementById('mixer-modal');
    const progress = document.getElementById('mix-progress');
    const countEl = document.getElementById('mix-count');
    let clicks = 0;

    const complete = () => {
        modal.classList.add('hidden');
        state.currentStepIndex++;
        tangoChar.classList.remove('working');
        const order = state.activeOrder;
        tangoStatus.textContent = order && state.currentStepIndex < order.item.steps.length
            ? `Next: ${STEP_LABELS[order.item.steps[state.currentStepIndex]]}`
            : 'Serve it!';
        renderOrder();
        mixingCup.onclick = null;
    };

    const mixingCup = document.getElementById('mixing-cup');
    mixingCup.onclick = () => {
        clicks++;
        const pct = (clicks / MIX_CLICKS_NEEDED) * 100;
        progress.style.width = pct + '%';
        countEl.textContent = `${clicks} / ${MIX_CLICKS_NEEDED}`;
        if (clicks >= MIX_CLICKS_NEEDED) complete();
    };

    progress.style.width = '0%';
    countEl.textContent = '0 / ' + MIX_CLICKS_NEEDED;
    modal.classList.remove('hidden');
}

// --- Fridge mini-game ---
function openFridgeModal() {
    tangoChar.classList.add('working');
    const modal = document.getElementById('fridge-modal');
    const shelves = document.getElementById('fridge-shelves');
    const neededItemId = state.activeOrder?.itemId;

    const foodItems = FOOD_ITEM_IDS.filter(id => state.unlockedItems.includes(id));

    shelves.innerHTML = foodItems.map(id => {
        const item = MENU_ITEMS[id];
        const isNeeded = id === neededItemId;
        return `
            <div class="fridge-item ${isNeeded ? 'needed' : ''}" data-item="${id}">
                <span class="fridge-emoji">${item.emoji}</span>
                <span class="fridge-name">${item.name}</span>
            </div>
        `;
    }).join('');

    shelves.querySelectorAll('.fridge-item').forEach(el => {
        el.onclick = () => {
            const id = el.dataset.item;
            if (id === neededItemId) {
                modal.classList.add('hidden');
                state.currentStepIndex++;
                tangoChar.classList.remove('working');
                const order = state.activeOrder;
                tangoStatus.textContent = order && state.currentStepIndex < order.item.steps.length
                    ? `Next: ${STEP_LABELS[order.item.steps[state.currentStepIndex]]}`
                    : 'Serve it!';
                renderOrder();
            } else {
                showToast("That's not what they ordered!", 'negative');
            }
        };
    });

    modal.classList.remove('hidden');
}

// --- Action mini-game ---
function openActionModal(stepId) {
    tangoChar.classList.add('working');
    const modal = document.getElementById('action-modal');
    const title = document.getElementById('action-title');
    const hint = document.getElementById('action-hint');
    const area = document.getElementById('action-area');
    const progress = document.getElementById('action-progress');
    const countEl = document.getElementById('action-count');
    const action = STEP_ACTIONS[stepId] || {};

    title.textContent = action.title || STEP_LABELS[stepId];
    hint.textContent = action.hint || 'Complete the task';
    area.innerHTML = '';
    progress.style.width = '0%';
    countEl.textContent = '0 / 0';

    const cleanupFns = [];
    let heatInterval = null;

    const complete = () => {
        if (heatInterval) clearInterval(heatInterval);
        cleanupFns.forEach(fn => fn());
        modal.classList.add('hidden');
        state.currentStepIndex++;
        tangoChar.classList.remove('working');
        const order = state.activeOrder;
        tangoStatus.textContent = order && state.currentStepIndex < order.item.steps.length
            ? `Next: ${STEP_LABELS[order.item.steps[state.currentStepIndex]]}`
            : 'Serve it!';
        renderOrder();
    };

    const mountLever = () => {
        const track = document.createElement('div');
        track.className = 'action-lever-track';
        const handle = document.createElement('div');
        handle.className = 'action-lever-handle';
        handle.textContent = action.emoji || '?';
        track.appendChild(handle);
        area.appendChild(track);

        const needed = action.pulls || 3;
        let pulls = 0;
        let dragging = false;
        let activePointerId = null;
        let lastPct = 0;
        let reachedThreshold = false;
        const pullThreshold = 0.85;

        countEl.textContent = `0 / ${needed}`;

        const updateProgress = () => {
            const pct = (pulls / needed) * 100;
            progress.style.width = pct + '%';
            countEl.textContent = `${pulls} / ${needed}`;
            if (pulls >= needed) complete();
        };

        const setPos = (y) => {
            const rect = track.getBoundingClientRect();
            const minY = rect.top + 10;
            const maxY = rect.bottom - 50;
            const clamped = Math.max(minY, Math.min(maxY, y));
            const pct = (clamped - minY) / (maxY - minY);
            handle.style.transform = `translateY(${pct * 80}px)`;
            lastPct = pct;
            if (pct >= pullThreshold) reachedThreshold = true;
        };

        const onDown = (e) => {
            dragging = true;
            activePointerId = e.pointerId;
            reachedThreshold = false;
            track.setPointerCapture(e.pointerId);
            setPos(e.clientY);
        };
        const onMove = (e) => {
            if (!dragging || e.pointerId !== activePointerId) return;
            setPos(e.clientY);
        };
        const onUp = (e) => {
            if (!dragging || (e && e.pointerId !== undefined && e.pointerId !== activePointerId)) return;
            if (e && typeof e.clientY === 'number') {
                setPos(e.clientY);
            }
            dragging = false;
            if (reachedThreshold || lastPct >= pullThreshold) {
                pulls++;
                updateProgress();
            }
            lastPct = 0;
            reachedThreshold = false;
            handle.style.transform = 'translateY(0px)';
            if (e && e.pointerId !== undefined) {
                track.releasePointerCapture(e.pointerId);
            }
            activePointerId = null;
        };

        track.onpointerdown = onDown;
        track.onpointermove = onMove;
        track.onpointerup = onUp;
        track.onpointerleave = onUp;
        track.onpointercancel = onUp;

        cleanupFns.push(() => {
            track.onpointerdown = null;
            track.onpointermove = null;
            track.onpointerup = null;
            track.onpointerleave = null;
            track.onpointercancel = null;
        });
    };

    const mountPour = () => {
        const wrap = document.createElement('div');
        wrap.className = 'action-pour';
        const jug = document.createElement('div');
        jug.className = 'pour-jug';
        jug.textContent = action.emoji || '?';
        const stream = document.createElement('div');
        stream.className = 'pour-stream';
        const cup = document.createElement('div');
        cup.className = 'pour-cup';
        const liquid = document.createElement('div');
        liquid.className = 'pour-liquid';
        liquid.style.background = action.pourColor || '#7b4a2b';
        cup.appendChild(liquid);
        wrap.appendChild(jug);
        wrap.appendChild(stream);
        wrap.appendChild(cup);
        area.appendChild(wrap);

        let fill = 0;
        const maxOver = action.maxOver || 10;
        let knob = 30;
        let pouring = false;

        const control = document.createElement('div');
        control.className = 'pour-control';
        const minus = document.createElement('button');
        minus.className = 'pour-btn';
        minus.textContent = '-';
        const plus = document.createElement('button');
        plus.className = 'pour-btn';
        plus.textContent = '+';
        const meter = document.createElement('div');
        meter.className = 'pour-meter';
        const needle = document.createElement('div');
        needle.className = 'pour-needle';
        meter.appendChild(needle);
        control.appendChild(minus);
        control.appendChild(meter);
        control.appendChild(plus);
        area.appendChild(control);

        const updateNeedle = () => {
            needle.style.left = `${Math.max(0, Math.min(100, knob))}%`;
        };
        updateNeedle();

        const tick = setInterval(() => {
            if (!state.activeOrder) {
                clearInterval(tick);
                return;
            }
            knob = Math.max(0, Math.min(100, knob - 2));
            updateNeedle();
            const flow = knob > 55;
            pouring = flow;
            stream.style.opacity = flow ? '1' : '0';
            if (flow) {
                fill += 1.2;
            } else {
                fill = Math.max(0, fill - 0.4);
            }
            liquid.style.height = `${Math.min(110, fill)}%`;
            const pct = Math.min(100, (fill / 100) * 100);
            progress.style.width = pct + '%';
            countEl.textContent = `${Math.floor(fill)} / 100`;
            if (fill >= 100 && fill <= 100 + maxOver) {
                clearInterval(tick);
                complete();
            }
            if (fill > 100 + maxOver) {
                showToast('Overflow! Try again.', 'negative');
                fill = 0;
                progress.style.width = '0%';
                countEl.textContent = '0 / 100';
            }
        }, 100);

        const adjust = (delta) => {
            knob = Math.max(0, Math.min(100, knob + delta));
            updateNeedle();
        };

        minus.onclick = () => adjust(-8);
        plus.onclick = () => adjust(8);

        cleanupFns.push(() => {
            clearInterval(tick);
            minus.onclick = null;
            plus.onclick = null;
        });
    };

    const mountDrop = () => {
        const tray = document.createElement('div');
        tray.className = 'drop-tray';
        const target = document.createElement('div');
        target.className = 'drop-target';
        target.textContent = '\u{2615}';
        tray.appendChild(target);
        area.appendChild(tray);

        const needed = action.drops || 3;
        let dropped = 0;
        countEl.textContent = `0 / ${needed}`;

        const createItem = () => {
            const item = document.createElement('div');
            item.className = 'drop-item';
            item.textContent = action.dropEmoji || action.emoji || '?';
            tray.appendChild(item);
            const resetPos = () => {
                item.style.left = '16px';
                item.style.top = '12px';
            };
            resetPos();
            let offsetX = 0;
            let offsetY = 0;
            item.onpointerdown = (e) => {
                item.setPointerCapture(e.pointerId);
                item.classList.add('dragging');
                const rect = item.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
            };
            item.onpointermove = (e) => {
                if (!item.classList.contains('dragging')) return;
                const rect = tray.getBoundingClientRect();
                const x = e.clientX - rect.left - offsetX;
                const y = e.clientY - rect.top - offsetY;
                item.style.left = `${x}px`;
                item.style.top = `${y}px`;
            };
            item.onpointerup = (e) => {
                item.classList.remove('dragging');
                item.releasePointerCapture(e.pointerId);
                const t = target.getBoundingClientRect();
                if (e.clientX >= t.left && e.clientX <= t.right && e.clientY >= t.top && e.clientY <= t.bottom) {
                    item.remove();
                    dropped++;
                    const pct = (dropped / needed) * 100;
                    progress.style.width = pct + '%';
                    countEl.textContent = `${dropped} / ${needed}`;
                    if (dropped >= needed) complete();
                    else createItem();
                } else {
                    resetPos();
                }
            };

            cleanupFns.push(() => {
                item.onpointerdown = null;
                item.onpointermove = null;
                item.onpointerup = null;
            });
        };

        createItem();
    };

    const mountDraw = () => {
        const stage = document.createElement('div');
        stage.className = 'action-draw-stage';
        const food = document.createElement('div');
        food.className = 'action-food action-food--draw';
        const emoji = document.createElement('div');
        emoji.className = 'action-food-emoji';
        emoji.textContent = action.foodEmoji || '\u{1F37D}';
        const canvas = document.createElement('canvas');
        canvas.width = 240;
        canvas.height = 160;
        canvas.className = 'action-canvas action-canvas-overlay';
        food.appendChild(emoji);
        food.appendChild(canvas);
        stage.appendChild(food);
        area.appendChild(stage);

        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.strokeStyle = action.drawColor || '#8b6914';
        let drawing = false;
        let lastX = 0;
        let lastY = 0;
        let drawLength = 0;
        const target = action.drawTarget || 600;

        const updateProgress = () => {
            const pct = Math.min(100, (drawLength / target) * 100);
            progress.style.width = pct + '%';
            countEl.textContent = `${Math.floor(drawLength)} / ${target}`;
            if (drawLength >= target) complete();
        };

        const pos = (e) => {
            const rect = canvas.getBoundingClientRect();
            return { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        const onDown = (e) => {
            drawing = true;
            const p = pos(e);
            lastX = p.x;
            lastY = p.y;
        };

        const onMove = (e) => {
            if (!drawing) return;
            const p = pos(e);
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            const dx = p.x - lastX;
            const dy = p.y - lastY;
            drawLength += Math.sqrt(dx * dx + dy * dy);
            lastX = p.x;
            lastY = p.y;
            updateProgress();
        };

        const onUp = () => {
            drawing = false;
        };

        canvas.onpointerdown = onDown;
        canvas.onpointermove = onMove;
        canvas.onpointerup = onUp;
        canvas.onpointerleave = onUp;
        canvas.onpointercancel = onUp;

        countEl.textContent = `0 / ${target}`;
        cleanupFns.push(() => {
            canvas.onpointerdown = null;
            canvas.onpointermove = null;
            canvas.onpointerup = null;
            canvas.onpointerleave = null;
            canvas.onpointercancel = null;
        });
    };

    const mountHeat = () => {
        const box = document.createElement('div');
        box.className = 'action-heat';
        const gauge = document.createElement('div');
        gauge.className = 'heat-gauge';
        const target = document.createElement('div');
        target.className = 'heat-target';
        const indicator = document.createElement('div');
        indicator.className = 'heat-indicator';
        const label = document.createElement('div');
        label.className = 'heat-label';
        gauge.appendChild(target);
        gauge.appendChild(indicator);
        gauge.appendChild(label);
        const controls = document.createElement('div');
        controls.className = 'heat-controls';
        const down = document.createElement('button');
        down.className = 'heat-btn';
        down.textContent = '-';
        const up = document.createElement('button');
        up.className = 'heat-btn';
        up.textContent = '+';
        controls.appendChild(down);
        controls.appendChild(up);
        const temp = document.createElement('div');
        temp.className = 'heat-temp';
        temp.textContent = '400 °F';
        box.appendChild(gauge);
        box.appendChild(controls);
        box.appendChild(temp);
        area.appendChild(box);

        const targetRange = action.target || [55, 75];
        const needSeconds = action.seconds || 3;
        const targetStart = targetRange[0];
        const targetEnd = targetRange[1];
        target.style.left = `${targetStart}%`;
        target.style.width = `${targetEnd - targetStart}%`;

        let secondsHeld = 0;
        let current = 50;
        let changeInterval = null;
        countEl.textContent = `0.0 / ${needSeconds.toFixed(1)}s`;

        const toF = (v) => Math.round(300 + v * 2);

        const updateIndicator = () => {
            const pct = Math.max(0, Math.min(100, current));
            indicator.style.left = `${pct}%`;
            label.style.left = `${pct}%`;
            const f = toF(current);
            label.textContent = `${f}°F`;
            temp.textContent = `${f}°F`;
        };

        const startAdjust = (delta) => {
            if (changeInterval) return;
            changeInterval = setInterval(() => {
                current = Math.max(0, Math.min(100, current + delta));
                updateIndicator();
            }, 60);
        };

        const stopAdjust = () => {
            if (changeInterval) clearInterval(changeInterval);
            changeInterval = null;
        };

        down.onpointerdown = () => startAdjust(-2.2);
        down.onpointerup = stopAdjust;
        down.onpointerleave = stopAdjust;
        down.onpointercancel = stopAdjust;

        up.onpointerdown = () => startAdjust(2.2);
        up.onpointerup = stopAdjust;
        up.onpointerleave = stopAdjust;
        up.onpointercancel = stopAdjust;

        heatInterval = setInterval(() => {
            if (!state.activeOrder) {
                clearInterval(heatInterval);
                heatInterval = null;
                stopAdjust();
                return;
            }
            current = Math.max(0, Math.min(100, current - 1.2));
            updateIndicator();
            if (current >= targetStart && current <= targetEnd) {
                secondsHeld += 0.1;
            } else {
                secondsHeld = Math.max(0, secondsHeld - 0.08);
            }
            const pct = Math.min(100, (secondsHeld / needSeconds) * 100);
            progress.style.width = pct + '%';
            countEl.textContent = `${secondsHeld.toFixed(1)} / ${needSeconds.toFixed(1)}s`;
            if (secondsHeld >= needSeconds) complete();
        }, 100);

        updateIndicator();

        cleanupFns.push(() => {
            stopAdjust();
            down.onpointerdown = null;
            down.onpointerup = null;
            down.onpointerleave = null;
            down.onpointercancel = null;
            up.onpointerdown = null;
            up.onpointerup = null;
            up.onpointerleave = null;
            up.onpointercancel = null;
        });
    };

    if (action.mode === 'lever') mountLever();
    else if (action.mode === 'pour') mountPour();
    else if (action.mode === 'drop') mountDrop();
    else if (action.mode === 'draw') mountDraw();
    else if (action.mode === 'heat') mountHeat();
    else mountDrop();

    modal.classList.remove('hidden');
}

// --- Cutting portions mini-game ---
function openCuttingModal() {
    tangoChar.classList.add('working');
    const modal = document.getElementById('cutting-modal');
    const board = document.getElementById('cut-board');
    const progress = document.getElementById('cut-progress');
    const countEl = document.getElementById('cut-count');
    const cuts = [];

    board.innerHTML = '';
    progress.style.width = '0%';
    countEl.textContent = '0 / 4';

    const finish = () => {
        modal.classList.add('hidden');
        state.currentStepIndex++;
        tangoChar.classList.remove('working');
        const order = state.activeOrder;
        tangoStatus.textContent = order && state.currentStepIndex < order.item.steps.length
            ? `Next: ${STEP_LABELS[order.item.steps[state.currentStepIndex]]}`
            : 'Serve it!';
        renderOrder();
        board.onclick = null;
    };

    const validateCuts = () => {
        const sorted = cuts.slice().sort((a, b) => a - b);
        const width = board.clientWidth;
        const points = [0, ...sorted, width];
        const portions = [];
        for (let i = 1; i < points.length; i++) {
            portions.push(points[i] - points[i - 1]);
        }
        const ideal = width / 5;
        const spread = Math.max(...portions) - Math.min(...portions);
        const ok = portions.every(p => Math.abs(p - ideal) <= ideal * 0.35) || spread <= ideal * 0.5;
        if (ok) {
            finish();
        } else {
            showToast('Uneven slices! Try again.', 'negative');
            cuts.length = 0;
            board.innerHTML = '';
            progress.style.width = '0%';
            countEl.textContent = '0 / 4';
        }
    };

    board.onclick = (e) => {
        if (cuts.length >= 4) return;
        const rect = board.getBoundingClientRect();
        const x = Math.max(6, Math.min(rect.width - 6, e.clientX - rect.left));
        cuts.push(x);
        const line = document.createElement('div');
        line.className = 'cut-line';
        line.style.left = `${x}px`;
        board.appendChild(line);
        const pct = (cuts.length / 4) * 100;
        progress.style.width = pct + '%';
        countEl.textContent = `${cuts.length} / 4`;
        if (cuts.length === 4) validateCuts();
    };

    modal.classList.remove('hidden');
}

function serveOrder() {
    if (!state.activeOrder) return;
    if (state.currentStepIndex < state.activeOrder.item.steps.length) return;
    completeOrder(true);
}

function renderQueue() {
    if (floorWalkTimer) {
        clearTimeout(floorWalkTimer);
        floorWalkTimer = null;
    }

    pruneEatingGuests();

    const now = Date.now();
    let minRemaining = null;
    const tables = getRestaurantTables();
    const counter = getToGoCounterLayout();
    const seatMap = getRestaurantSeatMap();
    const tablesHtml = tables.map((table) =>
        `<button class="restaurant-table ${state.layoutEditMode ? 'editable' : ''}" data-table-id="${table.id}" style="left:${table.x}%;top:${table.y}%;" aria-label="Table ${table.id}"></button>`
    ).join('');
    const decorHtml = (state.placedDecor || []).map((decor) => {
        const item = DECOR_ITEMS.find((d) => d.id === decor.itemId);
        if (!item) return '';
        return `
            <button class="floor-decor" data-decor-id="${decor.id}" style="left:${decor.x}%;top:${decor.y}%">
                ${item.emoji}
            </button>
        `;
    }).join('');

    const waitingHtml = state.queue.map((c) => {
        const seat = seatMap[c.seatId];
        if (!seat) return '';
        const walking = typeof c.enteringUntil === 'number' && now < c.enteringUntil;
        if (walking) {
            const remaining = c.enteringUntil - now;
            minRemaining = minRemaining === null ? remaining : Math.min(minRemaining, remaining);
        }
        const canTake = !state.activeOrder && !walking && !state.layoutEditMode;
        return `
            <button class="floor-customer ${walking ? 'walking-in' : 'seated'} ${canTake ? 'can-take' : ''}"
                data-order-id="${String(c.id)}"
                data-seat-id="${c.seatId || ''}"
                style="--seat-x:${seat.x}%;--seat-y:${seat.y}%"
                ${canTake ? '' : 'disabled'}>
                <span class="floor-customer-emoji">${c.emoji}</span>
                <span class="floor-order-badge">${c.vip ? 'VIP' : c.item.emoji}</span>
            </button>
        `;
    }).join('');

    let activeHtml = '';
    if (state.activeOrder?.seatId && seatMap[state.activeOrder.seatId]) {
        const seat = seatMap[state.activeOrder.seatId];
        activeHtml = `
            <button class="floor-customer seated serving" data-seat-id="${state.activeOrder.seatId}" style="--seat-x:${seat.x}%;--seat-y:${seat.y}%" disabled>
                <span class="floor-customer-emoji">${state.activeOrder.emoji}</span>
                <span class="floor-order-badge">?</span>
            </button>
        `;
    }

    const eatingHtml = (state.eatingGuests || []).map((g) => {
        const seat = seatMap[g.seatId];
        if (!seat) return '';
        const remaining = Math.max(0, g.eatingUntil - now);
        if (remaining > 0) {
            minRemaining = minRemaining === null ? remaining : Math.min(minRemaining, remaining);
        }
        return `
            <button class="floor-customer seated eating" data-seat-id="${g.seatId || ''}" style="--seat-x:${seat.x}%;--seat-y:${seat.y}%" disabled>
                <span class="floor-customer-emoji">${g.emoji}</span>
                <span class="floor-order-badge">${g.itemEmoji || '\u{1F37D}'}</span>
            </button>
        `;
    }).join('');

    customerQueue.innerHTML = `
        <div class="restaurant-floor">
            ${hasToGoUpgrade() ? `
            <button class="togo-counter ${state.layoutEditMode ? 'editable' : ''}" data-counter-id="main" style="left:${counter.x}%;top:${counter.y}%;" aria-label="To-go counter">
                <div class="togo-counter-sign">TO-GO</div>
                <div class="togo-counter-shelf">&#x1F9C3; &#x1F96A; &#x1F36A;</div>
            </button>` : ''}
            ${tablesHtml}
            ${decorHtml}
            ${waitingHtml}
            ${activeHtml}
            ${eatingHtml}
        </div>
        ${state.queue.length === 0 && !state.activeOrder && (!state.eatingGuests || state.eatingGuests.length === 0)
            ? '<p class="restaurant-empty">No guests at tables right now</p>'
            : ''}
    `;

    customerQueue.querySelectorAll('.floor-customer.can-take').forEach((btn) => {
        btn.onclick = () => startCustomer(btn.dataset.orderId);
    });
    if (state.layoutEditMode) {
        customerQueue.querySelectorAll('.restaurant-table.editable').forEach((tableEl) => {
            let offsetX = 0;
            let offsetY = 0;
            tableEl.onpointerdown = (e) => {
                e.preventDefault();
                const floor = customerQueue.querySelector('.restaurant-floor');
                if (!floor) return;
                const tr = tableEl.getBoundingClientRect();
                offsetX = e.clientX - tr.left;
                offsetY = e.clientY - tr.top;
                tableEl.setPointerCapture(e.pointerId);
                tableEl.classList.add('dragging');
            };
            tableEl.onpointermove = (e) => {
                if (!tableEl.classList.contains('dragging')) return;
                const floor = customerQueue.querySelector('.restaurant-floor');
                if (!floor) return;
                const fr = floor.getBoundingClientRect();
                const x = ((e.clientX - fr.left - offsetX + tableEl.offsetWidth / 2) / fr.width) * 100;
                const y = ((e.clientY - fr.top - offsetY + tableEl.offsetHeight / 2) / fr.height) * 100;
                const id = tableEl.dataset.tableId;
                if (!state.tableLayout[id]) state.tableLayout[id] = { ...TABLE_BASE_LAYOUT[id] };
                state.tableLayout[id].x = Math.max(10, Math.min(90, x));
                state.tableLayout[id].y = Math.max(14, Math.min(86, y));
                tableEl.style.left = `${state.tableLayout[id].x}%`;
                tableEl.style.top = `${state.tableLayout[id].y}%`;
            };
            tableEl.onpointerup = (e) => {
                if (!tableEl.classList.contains('dragging')) return;
                tableEl.classList.remove('dragging');
                tableEl.releasePointerCapture(e.pointerId);
                saveState();
                renderQueue();
            };
            tableEl.onpointercancel = tableEl.onpointerup;
        });
        const counterEl = hasToGoUpgrade() ? customerQueue.querySelector('.togo-counter.editable') : null;
        if (counterEl) {
            let offsetX = 0;
            let offsetY = 0;
            counterEl.onpointerdown = (e) => {
                e.preventDefault();
                const floor = customerQueue.querySelector('.restaurant-floor');
                if (!floor) return;
                const tr = counterEl.getBoundingClientRect();
                offsetX = e.clientX - tr.left;
                offsetY = e.clientY - tr.top;
                counterEl.setPointerCapture(e.pointerId);
                counterEl.classList.add('dragging');
            };
            counterEl.onpointermove = (e) => {
                if (!counterEl.classList.contains('dragging')) return;
                const floor = customerQueue.querySelector('.restaurant-floor');
                if (!floor) return;
                const fr = floor.getBoundingClientRect();
                const x = ((e.clientX - fr.left - offsetX + counterEl.offsetWidth / 2) / fr.width) * 100;
                const y = ((e.clientY - fr.top - offsetY + counterEl.offsetHeight / 2) / fr.height) * 100;
                state.toGoCounterLayout = {
                    x: Math.max(10, Math.min(94, x)),
                    y: Math.max(16, Math.min(92, y))
                };
                counterEl.style.left = `${state.toGoCounterLayout.x}%`;
                counterEl.style.top = `${state.toGoCounterLayout.y}%`;
            };
            counterEl.onpointerup = (e) => {
                if (!counterEl.classList.contains('dragging')) return;
                counterEl.classList.remove('dragging');
                counterEl.releasePointerCapture(e.pointerId);
                saveState();
            };
            counterEl.onpointercancel = counterEl.onpointerup;
        }
    }
    const floorEl = customerQueue.querySelector('.restaurant-floor');
    if (floorEl) {
        floorEl.onclick = (e) => {
            if (!pendingDecorItemId) return;
            const isDecor = e.target && e.target.closest && e.target.closest('.floor-decor');
            const isCustomer = e.target && e.target.closest && e.target.closest('.floor-customer');
            const isCounter = e.target && e.target.closest && e.target.closest('.togo-counter');
            if (isDecor || isCustomer || isCounter) return;
            if (getAvailableDecorCount(pendingDecorItemId) < 1) {
                pendingDecorItemId = null;
                renderDecorShop();
                return;
            }
            const rect = floorEl.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            state.placedDecor.push({
                id: `decor-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                itemId: pendingDecorItemId,
                x: Math.max(4, Math.min(96, x)),
                y: Math.max(6, Math.min(94, y))
            });
            pendingDecorItemId = null;
            renderDecorShop();
            saveState();
            renderQueue();
        };
    }
    customerQueue.querySelectorAll('.floor-decor').forEach((decorEl) => {
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let dragPointerId = null;
        let moveHandler = null;
        let endHandler = null;
        decorEl.onpointerdown = (e) => {
            e.preventDefault();
            const floor = customerQueue.querySelector('.restaurant-floor');
            if (!floor) return;
            const dr = decorEl.getBoundingClientRect();
            dragOffsetX = e.clientX - dr.left;
            dragOffsetY = e.clientY - dr.top;
            dragPointerId = e.pointerId;
            try { decorEl.setPointerCapture(e.pointerId); } catch (_) {}
            decorEl.classList.add('dragging');

            moveHandler = (ev) => {
                if (!decorEl.classList.contains('dragging')) return;
                if (dragPointerId !== null && ev.pointerId !== dragPointerId) return;
                const floorNow = customerQueue.querySelector('.restaurant-floor');
                if (!floorNow) return;
                const fr = floorNow.getBoundingClientRect();
                const x = ((ev.clientX - fr.left - dragOffsetX + decorEl.offsetWidth / 2) / fr.width) * 100;
                const y = ((ev.clientY - fr.top - dragOffsetY + decorEl.offsetHeight / 2) / fr.height) * 100;
                const decor = state.placedDecor.find((d) => d.id === decorEl.dataset.decorId);
                if (!decor) return;
                decor.x = Math.max(4, Math.min(96, x));
                decor.y = Math.max(6, Math.min(94, y));
                decorEl.style.left = `${decor.x}%`;
                decorEl.style.top = `${decor.y}%`;
            };

            endHandler = (ev) => {
                if (dragPointerId !== null && ev.pointerId !== dragPointerId) return;
                if (!decorEl.classList.contains('dragging')) return;
                decorEl.classList.remove('dragging');
                try { decorEl.releasePointerCapture(dragPointerId); } catch (_) {}
                dragPointerId = null;
                if (moveHandler) window.removeEventListener('pointermove', moveHandler);
                if (endHandler) {
                    window.removeEventListener('pointerup', endHandler);
                    window.removeEventListener('pointercancel', endHandler);
                }
                saveState();
            };

            window.addEventListener('pointermove', moveHandler);
            window.addEventListener('pointerup', endHandler);
            window.addEventListener('pointercancel', endHandler);
        };

        decorEl.onpointermove = null;
        decorEl.onpointerup = null;
        decorEl.onpointercancel = null;
    });

    if (minRemaining !== null) {
        floorWalkTimer = setTimeout(() => {
            floorWalkTimer = null;
            renderQueue();
        }, Math.max(30, minRemaining + 20));
    }
}

function renderOrder() {
    if (!state.activeOrder) {
        orderSteps.innerHTML = '<p style="color:#8b7355;">Take an order from the queue!</p>';
        if (state.queue.length > 0) {
            actionButtons.innerHTML = '<p style="color:#8b7355;font-size:0.95rem;">Choose a table in the restaurant below.</p>';
        } else if (state.eatingGuests && state.eatingGuests.length > 0) {
            actionButtons.innerHTML = '<p style="color:#8b7355;font-size:0.9rem;">Guests are still enjoying their drinks and food.</p>';
        } else {
            actionButtons.innerHTML = '<p style="color:#8b7355;font-size:0.9rem;">Customers will arrive soon...</p>';
        }
        return;
    }

    const order = state.activeOrder;
    const steps = order.item.steps;
    orderSteps.innerHTML = steps.map((s, i) => {
        let cls = 'pending';
        if (i < state.currentStepIndex) cls = 'done';
        else if (i === state.currentStepIndex) cls = 'current';
        return `<span class="step-badge ${cls}">${STEP_LABELS[s]}</span>`;
    }).join('');

    actionButtons.innerHTML = '';
    if (state.currentStepIndex >= steps.length) {
        const btn = document.createElement('button');
        btn.className = 'action-btn primary';
        btn.textContent = 'Serve Order';
        btn.onclick = serveOrder;
        actionButtons.appendChild(btn);
    } else {
        const step = steps[state.currentStepIndex];
        const btn = document.createElement('button');
        btn.className = 'action-btn primary';
        btn.textContent = STEP_LABELS[step];
        btn.onclick = () => doStep(step);
        actionButtons.appendChild(btn);
    }
}

function renderActiveCustomer() {
    if (!state.activeOrder) {
        activeCustomer.classList.add('hidden');
        activeCustomer.classList.remove('angry');
        activeCustomer.dataset.emoji = '';
        return;
    }
    if (state.activeOrder.calibration) {
        activeCustomer.classList.add('hidden');
        activeCustomer.classList.remove('angry');
        activeCustomer.dataset.emoji = '';
        return;
    }
    activeCustomer.classList.remove('hidden');
    const order = state.activeOrder;
    customerOrderText.textContent = order.vip
        ? `"VIP order: ${order.item.name} ${order.item.emoji} (super picky)"`
        : `"I'd like a ${order.item.name}, please! ${order.item.emoji}"`;
    const vipPayoutMult = order.vip ? 2 : 1;
    const baseTipEstimate = Math.floor(order.item.price * vipPayoutMult * 0.15);
    const decorTipEstimate = getDecorTipBonusForSeat(order.seatId);
    customerTip.textContent = decorTipEstimate > 0
        ? `Tip: ~${formatMoneyPrecise(baseTipEstimate + decorTipEstimate)} (includes +${formatMoneyPrecise(decorTipEstimate)} decor)`
        : `Tip: ~${formatMoney(baseTipEstimate)}`;
    const pct = Math.max(0, Math.min(100, (state.customerPatience / Math.max(1, state.customerPatienceMax)) * 100));
    patienceFill.style.width = pct + '%';
    patienceFill.classList.toggle('low', pct < 30);
    activeCustomer.dataset.emoji = order.emoji || '\u{1F642}';
    activeCustomer.classList.toggle('angry', pct <= 33);
}

function updateUI() {
    moneyEl.textContent = formatMoney(state.money);
    ratingEl.textContent = getDisplayRating();
    dayEl.textContent = `Day ${state.day}`;
    prestigeEl.textContent = state.prestige;
    prestigeBox.style.display = state.prestige > 0 ? 'flex' : 'none';

    document.getElementById('prestige-mult').textContent = getMultiplier().toFixed(1) + 'x';
    document.getElementById('prestige-threshold').textContent = formatMoney(PRESTIGE_THRESHOLD);
    const prestigeBtn = document.getElementById('prestige-btn');
    if (state.totalEarnings >= PRESTIGE_THRESHOLD) {
        prestigeBtn.disabled = false;
        prestigeBtn.textContent = 'Prestige! (+1 point)';
    } else {
        prestigeBtn.disabled = true;
        prestigeBtn.textContent = 'Prestige (Locked)';
    }
    renderDecorShop();
    renderDesignShop();
    renderCharityTab();
    renderMarketingPanel();
    renderMiloVisual();
}

function renderUpgrades() {
    const list = document.getElementById('upgrades-list');
    list.innerHTML = UPGRADES.map(u => {
        const owned = state.upgrades[u.id];
        return `
            <div class="upgrade-item ${owned ? 'owned' : ''}">
                <div class="upgrade-info">
                    <div class="upgrade-name">${u.name}</div>
                    <div class="upgrade-desc">${u.desc}</div>
                </div>
                ${owned
                    ? '<span style="color:var(--mint);font-weight:700;">Owned</span>'
                    : `<button class="upgrade-btn" data-id="${u.id}" ${state.money < u.cost ? 'disabled' : ''}>${formatMoney(u.cost)}</button>`
                }
            </div>
        `;
    }).join('');

    list.querySelectorAll('.upgrade-btn').forEach(btn => {
        btn.onclick = () => buyUpgrade(btn.dataset.id);
    });
}

function getPlacedDecorCount(itemId) {
    return (state.placedDecor || []).filter((d) => d.itemId === itemId).length;
}

function getDecorCost(itemId) {
    const item = DECOR_ITEMS.find((d) => d.id === itemId);
    if (!item) return 0;
    const owned = state.decorOwned?.[itemId] || 0;
    const growth = 1.38;
    return Math.ceil(item.cost * Math.pow(growth, owned));
}

function getAvailableDecorCount(itemId) {
    const owned = state.decorOwned?.[itemId] || 0;
    const placed = getPlacedDecorCount(itemId);
    return Math.max(0, owned - placed);
}

function isThemeUnlocked(theme) {
    const earned = Math.max(state.lifetimeEarnings || 0, state.totalEarnings || 0);
    return earned >= theme.unlockAt;
}

function applyDesignTheme() {
    if (!customerZone) return;
    customerZone.dataset.floorTheme = state.floorTheme || 'oak';
    customerZone.dataset.wallTheme = state.wallTheme || 'latte';
    customerZone.classList.toggle('layout-edit', !!state.layoutEditMode);
}

function createNewCharity() {
    const cause = CHARITY_CAUSES[Math.floor(Math.random() * CHARITY_CAUSES.length)];
    const scale = 120 + state.day * 18 + state.prestige * 55 + Math.floor((state.lifetimeEarnings || 0) * 0.003);
    const goal = Math.max(80, Math.round((scale + Math.random() * scale * 0.7) / 5) * 5);
    state.activeCharity = {
        id: `${cause.id}-${Date.now()}`,
        causeId: cause.id,
        emoji: cause.emoji,
        name: cause.name,
        goal,
        raised: 0,
        startedDay: state.day
    };
}

function ensureActiveCharity() {
    if (!state.activeCharity || typeof state.activeCharity !== 'object') {
        createNewCharity();
    }
}

function completeActiveCharityAndRollNext(ratingBoost = 0.05) {
    state.charityCompleted += 1;
    state.rating = Math.max(1, Math.min(5, state.rating + ratingBoost));
    state.activeCharity = null;
    createNewCharity();
}

function donateToCharity(rawAmount) {
    ensureActiveCharity();
    const amount = Math.floor(Number(rawAmount));
    if (!Number.isFinite(amount) || amount < 1) {
        showToast('Enter a valid donation amount.', 'negative');
        return;
    }
    if (state.money < amount) {
        showToast('Not enough money to donate that amount.', 'negative');
        return;
    }

    state.money -= amount;
    state.charityTotalDonated += amount;
    state.activeCharity.raised += amount;
    state.charityPendingPayouts.push({
        id: `charity-payout-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        donated: amount,
        reward: amount * 5,
        dueAt: Date.now() + CHARITY_PAYOUT_DELAY_MS
    });

    let completedNow = false;
    if (state.activeCharity.raised >= state.activeCharity.goal) {
        completedNow = true;
        completeActiveCharityAndRollNext(0.08);
    }

    updateUI();
    renderCharityTab();
    saveState();
    if (completedNow) {
        showToast(`Donation complete! 5x return arrives in about 5 minutes.`, 'positive');
    } else {
        showToast(`Donated ${formatMoney(amount)}. Return queued: ${formatMoney(amount * 5)} in about 5 minutes.`, 'positive');
    }
}

function processCharityEconomy() {
    ensureActiveCharity();
    const now = Date.now();
    if (!Number.isFinite(Number(state.charityLastTickAt)) || state.charityLastTickAt <= 0) {
        state.charityLastTickAt = now;
        return false;
    }

    const elapsedSeconds = Math.max(0, Math.min(60, (now - state.charityLastTickAt) / 1000));
    state.charityLastTickAt = now;
    let changed = false;

    if (state.activeCharity) {
        const crowdRatePerSecond = Math.max(0.35, state.activeCharity.goal * 0.0012) + state.day * 0.01 + (state.charityCompleted || 0) * 0.02;
        const crowdGain = Math.round((crowdRatePerSecond * elapsedSeconds * (0.82 + Math.random() * 0.38)) * 100) / 100;
        if (crowdGain > 0) {
            state.activeCharity.raised = Math.min(state.activeCharity.goal, Number((state.activeCharity.raised + crowdGain).toFixed(2)));
            changed = true;
        }
        if (state.activeCharity.raised >= state.activeCharity.goal) {
            completeActiveCharityAndRollNext(0.05);
            showToast('Community donations finished a charity goal.', 'positive');
            changed = true;
        }
    }

    if (!Array.isArray(state.charityPendingPayouts)) state.charityPendingPayouts = [];
    const due = state.charityPendingPayouts.filter((p) => Number(p.dueAt) <= now);
    if (due.length) {
        const payout = due.reduce((sum, p) => sum + Math.max(0, Number(p.reward) || 0), 0);
        state.charityPendingPayouts = state.charityPendingPayouts.filter((p) => Number(p.dueAt) > now);
        if (payout > 0) {
            state.money += payout;
            state.totalEarnings += payout;
            state.lifetimeEarnings += payout;
            showToast(`Charity returns paid out: +${formatMoneyPrecise(payout)}`, 'positive');
            changed = true;
        }
    }

    return changed;
}

function renderCharityTab() {
    ensureActiveCharity();
    if (!state.activeCharity) return;
    const c = state.activeCharity;
    const pct = Math.max(0, Math.min(100, (c.raised / Math.max(1, c.goal)) * 100));
    const pending = Array.isArray(state.charityPendingPayouts) ? state.charityPendingPayouts : [];
    const pendingTotal = pending.reduce((sum, p) => sum + Math.max(0, Number(p.reward) || 0), 0);
    const nextDueAt = pending.length ? Math.min(...pending.map((p) => Number(p.dueAt) || Number.POSITIVE_INFINITY)) : null;
    const nextDueText = Number.isFinite(nextDueAt) ? formatDurationShort(nextDueAt - Date.now()) : 'none';

    if (charityEmojiEl) charityEmojiEl.textContent = c.emoji || '\u{1F642}';
    if (charityNameEl) charityNameEl.textContent = c.name || 'Community Cause';
    if (charityMetaEl) charityMetaEl.textContent = `${formatMoney(c.raised)} / ${formatMoney(c.goal)} raised`;
    if (charityFillEl) charityFillEl.style.width = `${pct}%`;
    if (charityStatsEl) {
        charityStatsEl.textContent = `Total donated: ${formatMoney(state.charityTotalDonated || 0)} • Causes completed: ${state.charityCompleted || 0} • Pending returns: ${formatMoneyPrecise(pendingTotal)} (${pending.length}, next ${nextDueText})`;
    }

    document.querySelectorAll('.charity-btn[data-donate]').forEach((btn) => {
        btn.onclick = () => donateToCharity(btn.dataset.donate);
        const amt = Number(btn.dataset.donate || 0);
        btn.disabled = !Number.isFinite(amt) || state.money < amt;
    });
    if (charityCustomBtn) {
        charityCustomBtn.onclick = () => donateToCharity(charityCustomInput?.value);
    }
}

function renderDesignShop() {
    applyDesignTheme();
    if (toggleLayoutEditBtn) {
        toggleLayoutEditBtn.textContent = `Layout Edit: ${state.layoutEditMode ? 'On' : 'Off'}`;
        toggleLayoutEditBtn.classList.toggle('active', !!state.layoutEditMode);
        toggleLayoutEditBtn.onclick = () => {
            state.layoutEditMode = !state.layoutEditMode;
            applyDesignTheme();
            renderDesignShop();
            renderQueue();
            saveState();
        };
    }

    if (floorThemeList) {
        floorThemeList.innerHTML = FLOOR_THEMES.map((theme) => {
            const unlocked = isThemeUnlocked(theme);
            const active = state.floorTheme === theme.id;
            return `
                <button class="theme-btn ${active ? 'active' : ''}" data-theme-type="floor" data-theme-id="${theme.id}" ${unlocked ? '' : 'disabled'}>
                    <span>${theme.name}</span>
                    <small>${unlocked ? 'Unlocked' : `Unlock at ${formatMoney(theme.unlockAt)}`}</small>
                </button>
            `;
        }).join('');
        floorThemeList.querySelectorAll('.theme-btn').forEach((btn) => {
            btn.onclick = () => {
                state.floorTheme = btn.dataset.themeId;
                renderDesignShop();
                saveState();
            };
        });
    }

    if (wallThemeList) {
        wallThemeList.innerHTML = WALL_THEMES.map((theme) => {
            const unlocked = isThemeUnlocked(theme);
            const active = state.wallTheme === theme.id;
            return `
                <button class="theme-btn ${active ? 'active' : ''}" data-theme-type="wall" data-theme-id="${theme.id}" ${unlocked ? '' : 'disabled'}>
                    <span>${theme.name}</span>
                    <small>${unlocked ? 'Unlocked' : `Unlock at ${formatMoney(theme.unlockAt)}`}</small>
                </button>
            `;
        }).join('');
        wallThemeList.querySelectorAll('.theme-btn').forEach((btn) => {
            btn.onclick = () => {
                state.wallTheme = btn.dataset.themeId;
                renderDesignShop();
                saveState();
            };
        });
    }
}

function renderDecorShop() {
    if (!decorList) return;
    decorList.innerHTML = DECOR_ITEMS.map((item) => {
        const owned = state.decorOwned?.[item.id] || 0;
        const placed = getPlacedDecorCount(item.id);
        const available = Math.max(0, owned - placed);
        const nextCost = getDecorCost(item.id);
        const isPlacing = pendingDecorItemId === item.id;
        return `
            <div class="decor-item">
                <div class="decor-item-left">
                    <span class="decor-emoji">${item.emoji}</span>
                    <div class="decor-copy">
                        <div class="decor-name">${item.name}</div>
                        <div class="decor-meta">Owned: ${owned} • Placed: ${placed} • Free: ${available} • Next: ${formatMoney(nextCost)}</div>
                    </div>
                </div>
                <div class="decor-item-actions">
                    <button class="decor-buy-btn" data-buy-id="${item.id}" ${state.money < nextCost ? 'disabled' : ''}>${formatMoney(nextCost)}</button>
                    <button class="decor-place-btn" data-place-id="${item.id}" ${available < 1 ? 'disabled' : ''}>${isPlacing ? 'Placing...' : 'Place'}</button>
                </div>
            </div>
        `;
    }).join('');

    decorList.querySelectorAll('.decor-buy-btn').forEach((btn) => {
        btn.onclick = () => {
            const item = DECOR_ITEMS.find((d) => d.id === btn.dataset.buyId);
            if (!item) return;
            const cost = getDecorCost(item.id);
            if (state.money < cost) return;
            state.money -= cost;
            state.decorOwned[item.id] = (state.decorOwned[item.id] || 0) + 1;
            updateUI();
            renderDecorShop();
            saveState();
            showToast(`Bought ${item.name} for ${formatMoney(cost)}!`, 'positive');
        };
    });

    decorList.querySelectorAll('.decor-place-btn').forEach((btn) => {
        btn.onclick = () => {
            const itemId = btn.dataset.placeId;
            if (getAvailableDecorCount(itemId) < 1) return;
            pendingDecorItemId = itemId;
            renderDecorShop();
            showToast('Click on restaurant floor to place decor.', 'positive');
        };
    });
}

function buyUpgrade(id) {
    const u = UPGRADES.find(x => x.id === id);
    if (!u || state.upgrades[id] || state.money < u.cost) return;
    state.money -= u.cost;
    state.upgrades[id] = true;
    if (id === 'pastry') {
        ['sandwich', 'bagel', 'brownie'].forEach(i => {
            if (!state.unlockedItems.includes(i)) state.unlockedItems.push(i);
        });
    }
    if (id === 'coffee-menu') {
        ['latte', 'cappuccino', 'mocha', 'coldbrew'].forEach(i => {
            if (!state.unlockedItems.includes(i)) state.unlockedItems.push(i);
        });
    }
    if (id === 'kitchen-prep') {
        ['parfait', 'panini'].forEach(i => {
            if (!state.unlockedItems.includes(i)) state.unlockedItems.push(i);
        });
    }
    if (id === 'specialty') {
        ['macchiato', 'flatwhite', 'chai', 'matcha', 'affogato', 'nitro', 'tangoSpecialty'].forEach(i => {
            if (!state.unlockedItems.includes(i)) state.unlockedItems.push(i);
        });
    }
    if (id === 'to-go') {
        READY_TO_GO_ITEM_IDS.forEach((i) => {
            if (!state.unlockedItems.includes(i)) state.unlockedItems.push(i);
        });
    }
    showToast(`Purchased ${u.name}!`, 'positive');
    renderUpgrades();
    updateUI();
    saveState();
}

function doPrestige() {
    if (state.totalEarnings < PRESTIGE_THRESHOLD) return;
    state.prestige++;
    state.money = 0;
    state.rating = 5.0;
    state.day = 1;
    state.totalEarnings = 0;
    state.customersServed = 0;
    state.ordersCompleted = 0;
    state.perfectOrders = 0;
    state.readyToGoSales = 0;
    state.miloOfferUnlocked = false;
    state.miloHired = false;
    state.miloPromptNextAt = 0;
    state.miloNextWorkAt = 0;
    state.adActive = false;
    state.adType = '';
    state.adUntil = 0;
    state.adImageData = '';
    state.adText = '';
    state.adHistory = [];
    state.upgrades = {};
    state.unlockedItems = [...BASE_UNLOCKED_ITEMS];
    state.difficulty = 'normal';
    state.queue = [];
    state.activeOrder = null;
    state.eatingGuests = [];
    state.decorOwned = {};
    state.placedDecor = [];
    state.tableLayout = { ...TABLE_BASE_LAYOUT };
    state.toGoCounterLayout = { ...TOGO_COUNTER_BASE_LAYOUT };
    state.layoutEditMode = false;
    state.floorTheme = 'oak';
    state.wallTheme = 'latte';
    state.activeCharity = null;
    state.charityPendingPayouts = [];
    state.charityLastTickAt = Date.now();
    pendingDecorItemId = null;
    if (state.patienceInterval) clearInterval(state.patienceInterval);
    if (floorWalkTimer) {
        clearTimeout(floorWalkTimer);
        floorWalkTimer = null;
    }
    stopAdCamera();
    showToast('Prestige! +10% earnings forever!', 'positive');
    updateUI();
    renderUpgrades();
    renderOrder();
    renderQueue();
    activeCustomer.classList.add('hidden');
    saveState();
}

function renderStats() {
    const list = document.getElementById('stats-list');
    list.innerHTML = `
        <div class="stat-row"><span>Total Earned</span><span>${formatMoney(state.totalEarnings)}</span></div>
        <div class="stat-row"><span>Lifetime Earned</span><span>${formatMoney(state.lifetimeEarnings || 0)}</span></div>
        <div class="stat-row"><span>Total Donated</span><span>${formatMoney(state.charityTotalDonated || 0)}</span></div>
        <div class="stat-row"><span>Causes Completed</span><span>${state.charityCompleted || 0}</span></div>
        <div class="stat-row"><span>Customers Served</span><span>${state.customersServed}</span></div>
        <div class="stat-row"><span>Ready-To-Go Sales</span><span>${state.readyToGoSales || 0}</span></div>
        <div class="stat-row"><span>Orders Completed</span><span>${state.ordersCompleted}</span></div>
        <div class="stat-row"><span>Perfect Orders</span><span>${state.perfectOrders}</span></div>
        <div class="stat-row"><span>Prestige Level</span><span>${state.prestige}</span></div>
    `;
}

const DIFFICULTIES = [
    { id: 'casual', name: 'Casual', patienceMult: 1.8, decayMult: 0, payoutMult: 0.9, infiniteTime: true, desc: 'No timer. Relaxed practice mode.' },
    { id: 'easy', name: 'Easy', patienceMult: 1.25, decayMult: 0.9, payoutMult: 1.0, desc: 'More time and slower patience drain.' },
    { id: 'normal', name: 'Normal', patienceMult: 1.0, decayMult: 1.0, payoutMult: 1.15, desc: 'Standard timing with a pay bump.' },
    { id: 'hard', name: 'Hard', patienceMult: 0.75, decayMult: 1.15, payoutMult: 1.35, desc: 'Less time, faster drain, higher pay.' },
    { id: 'expert', name: 'Expert', patienceMult: 0.5, decayMult: 1.35, payoutMult: 1.65, desc: 'Shortest timer and fastest drain, best pay.' }
];

function getDifficulty() {
    return DIFFICULTIES.find(d => d.id === state.difficulty) || DIFFICULTIES[2];
}

function renderDifficulties() {
    const wrap = document.getElementById('difficulty-buttons');
    if (!wrap) return;
    wrap.innerHTML = DIFFICULTIES.map(d => {
        const active = d.id === state.difficulty;
        const timeLabel = d.infiniteTime
            ? 'Time: Infinite'
            : `Time: x${d.patienceMult.toFixed(2)} / Drain x${(d.decayMult || 1).toFixed(2)}`;
        const payLabel = `Pay: x${(d.payoutMult || 1).toFixed(2)}`;
        return `
            <button class="difficulty-btn ${active ? 'active' : ''}" data-id="${d.id}">
                <span class="difficulty-name">${d.name}</span>
                <span class="difficulty-meta">${timeLabel}</span>
                <span class="difficulty-meta">${payLabel}</span>
                <span class="difficulty-note">${d.desc || ''}</span>
            </button>
        `;
    }).join('');
    wrap.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.onclick = () => {
            state.difficulty = btn.dataset.id;
            renderDifficulties();
            showToast(`Difficulty: ${btn.textContent}`, 'positive');
            if (state.activeOrder) {
                const ratio = state.customerPatience / Math.max(1, state.customerPatienceMax);
                const newMax = getOrderPatience(state.activeOrder.item);
                state.customerPatienceMax = newMax;
                state.customerPatience = isInfiniteTimeMode() ? newMax : Math.max(1, Math.floor(newMax * ratio));
                startPatienceDecay();
            }
            renderActiveCustomer();
            saveState();
        };
    });
}

function ensurePrestigeTabPresent() {
    const tabsWrap = document.querySelector('.panel-tabs');
    const panesWrap = document.querySelector('.panel-content');
    if (!tabsWrap || !panesWrap) return;

    let prestigeTabBtn = tabsWrap.querySelector('.tab-btn[data-tab="prestige"]');
    if (!prestigeTabBtn) {
        prestigeTabBtn = document.createElement('button');
        prestigeTabBtn.className = 'tab-btn';
        prestigeTabBtn.dataset.tab = 'prestige';
        prestigeTabBtn.textContent = 'Prestige';
        tabsWrap.appendChild(prestigeTabBtn);
    }

    let prestigePane = document.getElementById('prestige-tab');
    if (!prestigePane) {
        prestigePane = document.createElement('div');
        prestigePane.id = 'prestige-tab';
        prestigePane.className = 'tab-pane';
        prestigePane.innerHTML = `
            <h4>✨ Prestige</h4>
            <p class="prestige-desc">Reset your progress to earn Prestige Points! Each point gives +10% to all earnings.</p>
            <div class="prestige-info">
                <p>Current multiplier: <strong id="prestige-mult">1.0x</strong></p>
                <p>Prestige at: <strong id="prestige-threshold">$10,000</strong></p>
            </div>
            <button id="prestige-btn" class="prestige-btn" disabled>Prestige (Locked)</button>
        `;
        panesWrap.appendChild(prestigePane);
    }
}

ensurePrestigeTabPresent();
const prestigeBtnEl = document.getElementById('prestige-btn');
if (prestigeBtnEl) prestigeBtnEl.onclick = doPrestige;

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
        if (btn.dataset.tab === 'stats') renderStats();
        if (btn.dataset.tab === 'design') renderDesignShop();
        if (btn.dataset.tab === 'decor') renderDecorShop();
        if (btn.dataset.tab === 'charity') renderCharityTab();
    };
});

// Day progression & customer spawning
function advanceDay() {
    state.day++;
    saveState();
}

setInterval(() => {
    if (calibrationRun?.running) return;
    pruneEatingGuests();
    pruneVipQueueTimeouts();
    processMiloSystems();
    const adOn = isAdActive();
    const soldReadyToGo = processReadyToGoSales();
    const charityChanged = processCharityEconomy();
    const adNow = isAdActive();
    if (soldReadyToGo || charityChanged || adOn !== adNow) {
        updateUI();
        saveState();
    }
    if (getOccupiedSeatCount() < getRestaurantSeatCapacity()) {
        const chance = (state.activeOrder ? 0.25 : 0.4) + (adNow ? AD_SPAWN_BOOST : 0);
        if (Math.random() < chance) spawnCustomer();
    }
}, 3000);

setInterval(advanceDay, 60000);

setInterval(() => {
    const wasActive = !!state.adActive;
    const active = isAdActive();
    if (active) {
        renderMarketingPanel();
    } else {
        renderAdBillboards();
        if (wasActive !== active) {
            updateUI();
            saveState();
        }
    }
}, 1000);

// Tango click
tangoChar.onclick = () => {
    if (state.activeOrder) {
        tangoChar.classList.add('working');
        setTimeout(() => tangoChar.classList.remove('working'), 200);
    } else if (state.queue.length > 0) {
        showToast('Pick a table below to take an order.');
    }
};

// Debug console (toggle with backslash: \)
function initDebugConsole() {
    const root = document.createElement('div');
    root.className = 'debug-console hidden';
    root.innerHTML = `
        <div class="debug-console-panel">
            <div class="debug-console-header">
                <span>Debug Console</span>
                <span class="debug-console-hint">Press \\ to toggle, Esc to close</span>
            </div>
            <div id="debug-output" class="debug-output"></div>
            <form id="debug-form" class="debug-form">
                <span class="debug-prompt">&gt;</span>
                <input id="debug-input" class="debug-input" type="text" autocomplete="off" spellcheck="false" />
            </form>
        </div>
    `;
    document.body.appendChild(root);

    const output = root.querySelector('#debug-output');
    const form = root.querySelector('#debug-form');
    const input = root.querySelector('#debug-input');
    const history = [];
    let historyIndex = -1;

    const print = (msg, type = '') => {
        const line = document.createElement('div');
        line.className = `debug-line ${type}`.trim();
        line.textContent = msg;
        output.appendChild(line);
        while (output.children.length > 80) output.removeChild(output.firstChild);
        output.scrollTop = output.scrollHeight;
    };

    const norm = (s) => String(s || '').trim().toLowerCase();
    const resolveMenuItemId = (raw) => {
        const target = norm(raw);
        return Object.keys(MENU_ITEMS).find((id) => id.toLowerCase() === target) || null;
    };
    const resolveUpgradeId = (raw) => {
        const target = norm(raw);
        const found = UPGRADES.find((u) => u.id.toLowerCase() === target);
        return found ? found.id : null;
    };
    const resolveDifficultyId = (raw) => {
        const target = norm(raw);
        const found = DIFFICULTIES.find((d) => d.id.toLowerCase() === target);
        return found ? found.id : null;
    };
    const resolveDecorId = (raw) => {
        const target = norm(raw);
        const found = DECOR_ITEMS.find((d) => d.id.toLowerCase() === target);
        return found ? found.id : null;
    };
    const resolveFloorThemeId = (raw) => {
        const target = norm(raw);
        const found = FLOOR_THEMES.find((t) => t.id.toLowerCase() === target);
        return found ? found.id : null;
    };
    const resolveWallThemeId = (raw) => {
        const target = norm(raw);
        const found = WALL_THEMES.find((t) => t.id.toLowerCase() === target);
        return found ? found.id : null;
    };
    const toNumber = (raw) => {
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
    };
    const queueOrder = (itemId, options = {}) => {
        const item = MENU_ITEMS[itemId];
        if (!item) return false;
        const seatId = pickRandomAvailableSeatId();
        if (!seatId) return false;
        const emoji = CUSTOMER_EMOJIS[Math.floor(Math.random() * CUSTOMER_EMOJIS.length)];
        const customer = {
            id: Date.now() + Math.random(),
            emoji,
            itemId,
            item,
            patience: getOrderPatience(item),
            seatId,
            vip: !!options.vip
        };
        stampWalkIn(customer);
        if (customer.vip) customer.vipExpireAt = customer.enteringUntil + VIP_QUEUE_WAIT_MS;
        state.queue.push(customer);
        renderQueue();
        return true;
    };
    const forceReadyToGoSale = (itemId = null) => {
        const readyItems = (state.unlockedItems || []).filter((id) => MENU_ITEMS[id]?.readyToGo);
        if (!readyItems.length) return false;
        const chosenId = itemId && MENU_ITEMS[itemId]?.readyToGo
            ? itemId
            : readyItems[Math.floor(Math.random() * readyItems.length)];
        const item = MENU_ITEMS[chosenId];
        if (!item) return false;
        const difficulty = getDifficulty();
        const base = item.price * getMultiplier() * (difficulty.payoutMult || 1);
        const tip = Math.round((base * (0.05 + Math.random() * 0.08)) * 100) / 100;
        const earnings = Math.round((base + tip) * 100) / 100;
        state.money += earnings;
        state.totalEarnings += earnings;
        state.lifetimeEarnings += earnings;
        state.customersServed += 1;
        state.readyToGoSales = (state.readyToGoSales || 0) + 1;
        animateReadyToGoSale(item, earnings);
        showToast(`${item.emoji} ${item.name} to-go sold: +${formatMoneyPrecise(earnings)}`, 'positive');
        return { item, earnings };
    };
    const calibrationStepIds = () => Array.from(new Set([
        'grind',
        'mix',
        'fridge',
        'slice',
        ...Object.keys(STEP_ACTIONS)
    ]));
    const clearCalibrationOrder = () => {
        if (state.activeOrder?.calibration) {
            state.activeOrder = null;
            state.currentStepIndex = 0;
            tangoChar.classList.remove('working');
            tangoStatus.textContent = 'Ready to serve!';
            closeAllMinigameModals();
            renderOrder();
            renderActiveCustomer();
        }
    };
    const buildCalibrationOrder = (stepId) => {
        let itemId = '__calibration__';
        let itemName = `Calibrate ${STEP_LABELS[stepId] || stepId}`;
        let itemEmoji = '\u{1F9EA}';
        if (stepId === 'fridge') {
            const unlockedFood = state.unlockedItems.find((id) => FOOD_ITEM_IDS.includes(id)) || FOOD_ITEM_IDS[0];
            itemId = unlockedFood;
            itemName = MENU_ITEMS[unlockedFood]?.name || 'Fridge Pick';
            itemEmoji = MENU_ITEMS[unlockedFood]?.emoji || '\u{1F642}';
        }
        return {
            id: `cal-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            emoji: '\u{1F9EA}',
            itemId,
            item: { name: itemName, emoji: itemEmoji, steps: [stepId], type: 'drink', price: 0 },
            patience: 1000,
            seatId: null,
            calibration: true
        };
    };
    const printCalibrationResultBlock = (stepAverages) => {
        const vals = Object.values(stepAverages);
        const fallback = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
        const stepSeconds = { ...DEFAULT_MODAL_SECONDS, ...stepAverages };
        const estimateSeconds = (item) => {
            const steps = Array.isArray(item?.steps) ? item.steps : [];
            if (!steps.length) return 10;
            const modalTime = steps.reduce((sum, s) => sum + (stepSeconds[s] || fallback), 0);
            return Number((modalTime + Math.max(0, steps.length - 1) * STEP_PADDING_SECONDS).toFixed(1));
        };

        print('Calibration complete. Modal times (seconds):', 'ok');
        Object.entries(stepAverages).forEach(([id, sec]) => {
            print(`  ${id}: ${sec.toFixed(2)}s`);
        });
        print(`Order formula in runtime: sum(stepSeconds) + ${STEP_PADDING_SECONDS}s * (steps - 1)`);
        print('Generated order seconds preview:');
        print('const CALIBRATED_ORDER_SECONDS = {');
        Object.entries(MENU_ITEMS).forEach(([id, item]) => {
            print(`  ${id}: ${estimateSeconds(item)}, // ${item.name}`);
        });
        print('};');
    };
    const startCalibration = (requestedRunsRaw) => {
        if (calibrationRun?.running) {
            print('Calibration already running. Use: calibrate status / calibrate cancel', 'error');
            return;
        }
        if (state.activeOrder) {
            print('Finish/cancel the current order first.', 'error');
            return;
        }
        const runsNum = toNumber(requestedRunsRaw);
        const runs = Math.max(1, Math.min(10, Math.floor(runsNum === null ? 3 : runsNum)));
        const steps = calibrationStepIds();
        calibrationRun = {
            running: true,
            runs,
            steps,
            stepIndex: 0,
            runIndex: 0,
            startedAt: 0,
            awaiting: false,
            samples: Object.fromEntries(steps.map((s) => [s, []])),
            watcher: null
        };

        const launchTrial = () => {
            if (!calibrationRun?.running) return;
            if (calibrationRun.stepIndex >= calibrationRun.steps.length) {
                const averages = {};
                Object.entries(calibrationRun.samples).forEach(([k, arr]) => {
                    averages[k] = arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
                });
                calibratedModalSeconds = { ...DEFAULT_MODAL_SECONDS, ...averages };
                calibrationResults = { averages, runs: calibrationRun.runs, at: Date.now() };
                saveCalibrationProfile(calibratedModalSeconds, calibrationRun.runs);
                printCalibrationResultBlock(averages);
                print('Applied calibration profile to live runtime timing.', 'ok');
                clearCalibrationOrder();
                if (calibrationRun.watcher) clearInterval(calibrationRun.watcher);
                calibrationRun = null;
                return;
            }

            const stepId = calibrationRun.steps[calibrationRun.stepIndex];
            const label = STEP_LABELS[stepId] || stepId;
            state.activeOrder = buildCalibrationOrder(stepId);
            state.currentStepIndex = 0;
            state.customerPatience = 100;
            state.customerPatienceMax = 100;
            if (state.patienceInterval) {
                clearInterval(state.patienceInterval);
                state.patienceInterval = null;
            }
            renderOrder();
            renderActiveCustomer();
            tangoStatus.textContent = `Calibration: ${label} (${calibrationRun.runIndex + 1}/${calibrationRun.runs})`;
            calibrationRun.startedAt = performance.now();
            calibrationRun.awaiting = true;
            doStep(stepId);
        };

        calibrationRun.watcher = setInterval(() => {
            if (!calibrationRun?.running) return;
            if (!calibrationRun.awaiting) return;
            if (!state.activeOrder || !state.activeOrder.calibration) return;
            const done = state.currentStepIndex >= state.activeOrder.item.steps.length;
            if (!done) return;

            const stepId = calibrationRun.steps[calibrationRun.stepIndex];
            const elapsed = (performance.now() - calibrationRun.startedAt) / 1000;
            calibrationRun.samples[stepId].push(elapsed);
            print(`? ${(STEP_LABELS[stepId] || stepId)} run ${calibrationRun.runIndex + 1}/${calibrationRun.runs}: ${elapsed.toFixed(2)}s`, 'ok');

            calibrationRun.awaiting = false;
            clearCalibrationOrder();
            calibrationRun.runIndex++;
            if (calibrationRun.runIndex >= calibrationRun.runs) {
                calibrationRun.runIndex = 0;
                calibrationRun.stepIndex++;
            }
            setTimeout(launchTrial, 250);
        }, 80);

        print(`Calibration started: ${steps.length} steps x ${runs} runs.`, 'ok');
        launchTrial();
    };
    const cancelCalibration = () => {
        if (!calibrationRun?.running) {
            print('No active calibration.', 'error');
            return;
        }
        if (calibrationRun.watcher) clearInterval(calibrationRun.watcher);
        calibrationRun = null;
        clearCalibrationOrder();
        print('Calibration cancelled.');
    };
    const commandMeta = {
        help: { usage: 'help', desc: 'Show all commands.' },
        setmoney: { usage: 'setmoney <amount>', desc: 'Set current money.' },
        addmoney: { usage: 'addmoney <amount>', desc: 'Add/subtract money.' },
        setrating: { usage: 'setrating <1-5>', desc: 'Set rating value.' },
        setday: { usage: 'setday <number>', desc: 'Set current day.' },
        addorder: { usage: 'addorder <itemId> [count]', desc: 'Queue one or more orders.' },
        clearqueue: { usage: 'clearqueue', desc: 'Remove all queued customers.' },
        startorder: { usage: 'startorder', desc: 'Start next queued order.' },
        finishorder: { usage: 'finishorder', desc: 'Instantly complete active order.' },
        failorder: { usage: 'failorder', desc: 'Instantly fail active order.' },
        nextstep: { usage: 'nextstep [count]', desc: 'Advance active order step.' },
        setstep: { usage: 'setstep <index>', desc: 'Set active order step index.' },
        unlock: { usage: 'unlock <itemId>', desc: 'Unlock one menu item.' },
        unlockall: { usage: 'unlockall', desc: 'Unlock every menu item.' },
        setupgrade: { usage: 'setupgrade <upgradeId>', desc: 'Grant one upgrade.' },
        setdifficulty: { usage: 'setdifficulty <id>', desc: 'Change difficulty mode.' },
        listitems: { usage: 'listitems', desc: 'List all menu item IDs.' },
        listdifficulties: { usage: 'listdifficulties', desc: 'List difficulty IDs and effects.' },
        ad: { usage: 'ad <status|starttext|startphoto|stop|historyclear> [text]', desc: 'Debug marketing ads and billboard carousel.' },
        vip: { usage: 'vip <status|unlock|lock|spawn> [itemId]', desc: 'Debug VIP upgrade/spawns.' },
        togo: { usage: 'togo <status|unlock|lock|sell> [count] [itemId]', desc: 'Debug to-go unlock and instant sales.' },
        milo: { usage: 'milo <status|unlock|hire|fire|prompt|work> [count]', desc: 'Debug Milo unlock/hiring/auto-work.' },
        charity: { usage: 'charity <status|donate|complete|payoutnow|new> [amount]', desc: 'Debug charity progression/payouts.' },
        decor: { usage: 'decor <status|buy|place|clear> ...', desc: 'Debug decor ownership/placement.' },
        theme: { usage: 'theme <list|floor|wall> [themeId]', desc: 'Debug floor/wall themes.' },
        layout: { usage: 'layout <status|on|off|toggle>', desc: 'Debug layout edit mode.' },
        setlifetime: { usage: 'setlifetime <amount>', desc: 'Set lifetime earnings for unlock testing.' },
        state: { usage: 'state', desc: 'Show key state values.' },
        calibrate: { usage: 'calibrate [start|status|cancel|results] [runs]', desc: 'Run modal timing calibration (default 3 runs each).' }
    };
    const printListForCommand = (name) => {
        const key = norm(name);
        const meta = commandMeta[key];
        if (meta) {
            print(`${key}: ${meta.usage}`);
            print(`- ${meta.desc}`);
        } else {
            print(`Unknown command: ${name}`, 'error');
            return;
        }
        if (key === 'addorder' || key === 'unlock' || key === 'listitems') {
            print('Available item IDs:');
            Object.entries(MENU_ITEMS).forEach(([id, item]) => print(`  ${id} -> ${item.name}`));
        }
        if (key === 'setupgrade') {
            print('Available upgrade IDs:');
            UPGRADES.forEach((u) => print(`  ${u.id} -> ${u.name}`));
        }
        if (key === 'setdifficulty' || key === 'listdifficulties') {
            print('Available difficulty IDs:');
            DIFFICULTIES.forEach((d) => print(`  ${d.id}`));
        }
        if (key === 'ad') {
            print('ad subcommands: status, starttext, startphoto, stop, historyclear');
            print('example: ad starttext Fresh espresso and pastries today!');
        }
        if (key === 'vip') {
            print('vip subcommands: status, unlock, lock, spawn [itemId]');
            print('vip spawn itemId is optional; defaults to VIP top-cost pool.');
        }
        if (key === 'togo') {
            print('togo subcommands: status, unlock, lock, sell [count] [itemId]');
            print('itemId is optional and must be a ready-to-go item.');
            print('Ready-to-go item IDs:');
            READY_TO_GO_ITEM_IDS.forEach((id) => print(`  ${id} -> ${MENU_ITEMS[id]?.name || id}`));
        }
        if (key === 'milo') {
            print('milo subcommands: status, unlock, hire, fire, prompt, work [count]');
        }
        if (key === 'charity') {
            print('charity subcommands: status, donate <amount>, complete, payoutnow, new');
        }
        if (key === 'decor') {
            print('decor subcommands: status, buy <decorId> [count], place <decorId> <x%> <y%>, clear');
            print('Available decor IDs:');
            DECOR_ITEMS.forEach((d) => print(`  ${d.id} -> ${d.name}`));
        }
        if (key === 'theme') {
            print('theme subcommands: list, floor <themeId>, wall <themeId>');
            print('Floor IDs:');
            FLOOR_THEMES.forEach((t) => print(`  ${t.id}`));
            print('Wall IDs:');
            WALL_THEMES.forEach((t) => print(`  ${t.id}`));
        }
        if (key === 'layout') {
            print('layout subcommands: status, on, off, toggle');
        }
        print(`Tip: run '${key}' without 'list' to execute it.`);
    };

    const commands = {
        help: () => [
            'Commands:',
            "Use '<command> list' for usage/details.",
            'help',
            'setmoney <amount>',
            'addmoney <amount>',
            'setrating <1-5>',
            'setday <number>',
            'addorder <itemId> [count]',
            'clearqueue',
            'startorder',
            'finishorder',
            'failorder',
            'nextstep [count]',
            'setstep <index>',
            'unlock <itemId>',
            'unlockall',
            'setupgrade <upgradeId>',
            'setdifficulty <id>',
            'listitems',
            'listdifficulties',
            'ad <status|starttext|startphoto|stop|historyclear> [text]',
            'vip <status|unlock|lock|spawn> [itemId]',
            'togo <status|unlock|lock|sell> [count] [itemId]',
            'milo <status|unlock|hire|fire|prompt|work> [count]',
            'charity <status|donate|complete|payoutnow|new> [amount]',
            'decor <status|buy|place|clear> ...',
            'theme <list|floor|wall> [themeId]',
            'layout <status|on|off|toggle>',
            'setlifetime <amount>',
            'state',
            'calibrate [start|status|cancel|results] [runs]'
        ].forEach(x => print(x)),

        setmoney: (args) => {
            const n = toNumber(args[0]);
            if (n === null) return print('Usage: setmoney <amount>', 'error');
            state.money = Math.max(0, Math.floor(n));
            updateUI();
            saveState();
            print(`Money set to ${formatMoney(state.money)}`, 'ok');
        },

        addmoney: (args) => {
            const n = toNumber(args[0]);
            if (n === null) return print('Usage: addmoney <amount>', 'error');
            state.money = Math.max(0, Math.floor(state.money + n));
            updateUI();
            saveState();
            print(`Money now ${formatMoney(state.money)}`, 'ok');
        },

        setrating: (args) => {
            const n = toNumber(args[0]);
            if (n === null) return print('Usage: setrating <1-5>', 'error');
            state.rating = Math.max(1, Math.min(5, n));
            updateUI();
            saveState();
            print(`Rating set to ${getDisplayRating()}`, 'ok');
        },

        setday: (args) => {
            const n = toNumber(args[0]);
            if (n === null) return print('Usage: setday <number>', 'error');
            state.day = Math.max(1, Math.floor(n));
            updateUI();
            saveState();
            print(`Day set to ${state.day}`, 'ok');
        },

        addorder: (args) => {
            const itemId = resolveMenuItemId(args[0]);
            const countRaw = toNumber(args[1]);
            const count = Math.max(1, Math.min(20, Math.floor(countRaw === null ? 1 : countRaw)));
            if (!itemId) return print(`Unknown item: ${args[0] || ''}`, 'error');
            let queued = 0;
            for (let i = 0; i < count; i++) {
                if (queueOrder(itemId)) queued++;
            }
            if (queued === 0) return print('No open seats available.', 'error');
            if (queued < count) {
                print(`Queued ${queued}/${count}x ${MENU_ITEMS[itemId].name} (restaurant full)`, 'ok');
                return;
            }
            print(`Queued ${queued}x ${MENU_ITEMS[itemId].name}`, 'ok');
        },

        clearqueue: () => {
            state.queue = [];
            renderQueue();
            saveState();
            print('Queue cleared', 'ok');
        },

        startorder: () => {
            if (state.activeOrder) return print('An order is already active', 'error');
            if (state.queue.length === 0) return print('Queue is empty', 'error');
            startCustomer();
            print('Started next queued order', 'ok');
        },

        finishorder: () => {
            if (!state.activeOrder) return print('No active order', 'error');
            state.currentStepIndex = state.activeOrder.item.steps.length;
            renderOrder();
            completeOrder(true);
            print('Active order completed', 'ok');
        },

        failorder: () => {
            if (!state.activeOrder) return print('No active order', 'error');
            completeOrder(false);
            print('Active order failed', 'ok');
        },

        nextstep: (args) => {
            if (!state.activeOrder) return print('No active order', 'error');
            const incRaw = toNumber(args[0]);
            const inc = Math.max(1, Math.floor(incRaw === null ? 1 : incRaw));
            state.currentStepIndex = Math.min(state.activeOrder.item.steps.length, state.currentStepIndex + inc);
            renderOrder();
            print(`Step advanced to ${state.currentStepIndex}/${state.activeOrder.item.steps.length}`, 'ok');
        },

        setstep: (args) => {
            if (!state.activeOrder) return print('No active order', 'error');
            const n = toNumber(args[0]);
            if (n === null) return print('Usage: setstep <index>', 'error');
            state.currentStepIndex = Math.max(0, Math.min(state.activeOrder.item.steps.length, Math.floor(n)));
            renderOrder();
            print(`Step set to ${state.currentStepIndex}/${state.activeOrder.item.steps.length}`, 'ok');
        },

        unlock: (args) => {
            const itemId = resolveMenuItemId(args[0]);
            if (!itemId) return print(`Unknown item: ${args[0] || ''}`, 'error');
            if (!state.unlockedItems.includes(itemId)) state.unlockedItems.push(itemId);
            saveState();
            print(`Unlocked ${MENU_ITEMS[itemId].name}`, 'ok');
        },

        unlockall: () => {
            state.unlockedItems = Object.keys(MENU_ITEMS);
            saveState();
            print(`Unlocked all ${state.unlockedItems.length} menu items`, 'ok');
        },

        setupgrade: (args) => {
            const id = resolveUpgradeId(args[0]);
            if (!id) return print(`Unknown upgrade: ${args[0] || ''}`, 'error');
            state.upgrades[id] = true;
            if (id === 'pastry') {
                ['sandwich', 'bagel', 'brownie'].forEach(i => {
                    if (!state.unlockedItems.includes(i)) state.unlockedItems.push(i);
                });
            }
            if (id === 'coffee-menu') {
                ['latte', 'cappuccino', 'mocha', 'coldbrew'].forEach(i => {
                    if (!state.unlockedItems.includes(i)) state.unlockedItems.push(i);
                });
            }
            if (id === 'kitchen-prep') {
                ['parfait', 'panini'].forEach(i => {
                    if (!state.unlockedItems.includes(i)) state.unlockedItems.push(i);
                });
            }
            if (id === 'specialty') {
                ['macchiato', 'flatwhite', 'chai', 'matcha', 'affogato', 'nitro', 'tangoSpecialty'].forEach(i => {
                    if (!state.unlockedItems.includes(i)) state.unlockedItems.push(i);
                });
            }
            if (id === 'to-go') {
                READY_TO_GO_ITEM_IDS.forEach((i) => {
                    if (!state.unlockedItems.includes(i)) state.unlockedItems.push(i);
                });
            }
            renderUpgrades();
            saveState();
            print(`Upgrade granted: ${id}`, 'ok');
        },

        setdifficulty: (args) => {
            const id = resolveDifficultyId(args[0]);
            if (!id) return print(`Unknown difficulty: ${args[0] || ''}`, 'error');
            state.difficulty = id;
            renderDifficulties();
            if (state.activeOrder) {
                const ratio = state.customerPatience / Math.max(1, state.customerPatienceMax);
                const newMax = getOrderPatience(state.activeOrder.item);
                state.customerPatienceMax = newMax;
                state.customerPatience = isInfiniteTimeMode() ? newMax : Math.max(1, Math.floor(newMax * ratio));
                startPatienceDecay();
            }
            renderActiveCustomer();
            saveState();
            print(`Difficulty set to ${id}`, 'ok');
        },

        listitems: () => {
            Object.entries(MENU_ITEMS).forEach(([id, item]) => {
                print(`${id} -> ${item.name}`);
            });
        },

        listdifficulties: () => {
            DIFFICULTIES.forEach(d => {
                print(`${d.id} -> pay x${d.payoutMult || 1}, patience x${d.patienceMult}, decay x${d.decayMult || 0}${d.infiniteTime ? ' (infinite)' : ''}`);
            });
        },

        ad: (args) => {
            const sub = norm(args[0] || 'status');
            if (sub === 'status') {
                const active = isAdActive();
                print(`Marketing upgrade: ${hasMarketingUpgrade() ? 'unlocked' : 'locked'}`);
                print(`Ad active: ${active ? 'yes' : 'no'}`);
                if (active) {
                    print(`Type=${state.adType} timeLeft=${formatDurationCompact(Math.max(0, state.adUntil - Date.now()))}`);
                    if (state.adType === 'text') print(`Text="${state.adText || ''}"`);
                    if (state.adType === 'photo') print(`Photo bytes=${(state.adImageData || '').length}`);
                }
                print(`Ad history entries=${(state.adHistory || []).length}`);
                return;
            }
            if (sub === 'starttext') {
                const copy = String(args.slice(1).join(' ') || '').trim();
                if (!copy) return print('Usage: ad starttext <text>', 'error');
                if (startAd('text', { text: copy })) {
                    print('Started text ad', 'ok');
                }
                return;
            }
            if (sub === 'startphoto') {
                if (!state.adImageData) return print('No captured photo found. Use camera in Marketing panel first.', 'error');
                if (startAd('photo')) print('Started photo ad', 'ok');
                return;
            }
            if (sub === 'stop') {
                state.adActive = false;
                state.adType = '';
                state.adUntil = 0;
                state.adImageData = '';
                state.adText = '';
                updateUI();
                saveState();
                print('Stopped active ad', 'ok');
                return;
            }
            if (sub === 'historyclear') {
                state.adHistory = [];
                renderAdBillboards();
                saveState();
                print('Cleared ad history', 'ok');
                return;
            }
            print('Usage: ad <status|starttext|startphoto|stop|historyclear> [text]', 'error');
        },

        vip: (args) => {
            const sub = norm(args[0] || 'status');
            if (sub === 'status') {
                print(`VIP upgrade: ${hasVipUpgrade() ? 'unlocked' : 'locked'}`);
                const vipQueued = (state.queue || []).filter((q) => q?.vip).length;
                const vipActive = state.activeOrder?.vip ? 1 : 0;
                print(`VIP queued=${vipQueued} active=${vipActive}`);
                return;
            }
            if (sub === 'unlock') {
                state.upgrades['vip-service'] = true;
                renderUpgrades();
                saveState();
                print('VIP upgrade unlocked', 'ok');
                return;
            }
            if (sub === 'lock') {
                delete state.upgrades['vip-service'];
                renderUpgrades();
                saveState();
                print('VIP upgrade locked', 'ok');
                return;
            }
            if (sub === 'spawn') {
                const requestedId = resolveMenuItemId(args[1]);
                const items = (state.unlockedItems || []).filter((id) => MENU_ITEMS[id] && !MENU_ITEMS[id].readyToGo);
                const vipPool = getVipTopItemPool(items);
                let itemId = requestedId;
                if (!itemId) {
                    if (!vipPool.length) return print('No valid VIP items available.', 'error');
                    itemId = vipPool[Math.floor(Math.random() * vipPool.length)];
                }
                if (!MENU_ITEMS[itemId] || MENU_ITEMS[itemId].readyToGo) return print('VIP item must be a non-ready-to-go menu item.', 'error');
                if (!queueOrder(itemId, { vip: true })) return print('No open seats available.', 'error');
                saveState();
                print(`Spawned VIP order for ${MENU_ITEMS[itemId].name}`, 'ok');
                return;
            }
            print('Usage: vip <status|unlock|lock|spawn> [itemId]', 'error');
        },

        togo: (args) => {
            const sub = norm(args[0] || 'status');
            if (sub === 'status') {
                print(`To-go upgrade: ${hasToGoUpgrade() ? 'unlocked' : 'locked'}`);
                print(`Ready-to-go sales=${state.readyToGoSales || 0}`);
                return;
            }
            if (sub === 'unlock') {
                state.upgrades['to-go'] = true;
                READY_TO_GO_ITEM_IDS.forEach((i) => {
                    if (!state.unlockedItems.includes(i)) state.unlockedItems.push(i);
                });
                renderUpgrades();
                updateUI();
                saveState();
                print('To-go upgrade unlocked', 'ok');
                return;
            }
            if (sub === 'lock') {
                delete state.upgrades['to-go'];
                renderUpgrades();
                updateUI();
                saveState();
                print('To-go upgrade locked', 'ok');
                return;
            }
            if (sub === 'sell') {
                const countRaw = toNumber(args[1]);
                const count = Math.max(1, Math.min(100, Math.floor(countRaw === null ? 1 : countRaw)));
                const itemId = resolveMenuItemId(args[2]);
                let sold = 0;
                let total = 0;
                for (let i = 0; i < count; i++) {
                    const res = forceReadyToGoSale(itemId || null);
                    if (!res) break;
                    sold += 1;
                    total += Number(res.earnings) || 0;
                }
                if (!sold) return print('No ready-to-go items available to sell.', 'error');
                updateUI();
                saveState();
                print(`Forced ${sold} to-go sale(s), total +${formatMoneyPrecise(total)}`, 'ok');
                return;
            }
            print('Usage: togo <status|unlock|lock|sell> [count] [itemId]', 'error');
        },

        milo: (args) => {
            const sub = norm(args[0] || 'status');
            if (sub === 'status') {
                print(`Milo unlocked=${state.miloOfferUnlocked ? 'yes' : 'no'} hired=${state.miloHired ? 'yes' : 'no'}`);
                print(`nextPromptAt=${state.miloPromptNextAt || 0} nextWorkAt=${state.miloNextWorkAt || 0}`);
                return;
            }
            if (sub === 'unlock') {
                state.miloOfferUnlocked = true;
                state.miloPromptNextAt = 0;
                processMiloSystems();
                saveState();
                print('Milo offer unlocked', 'ok');
                return;
            }
            if (sub === 'hire') {
                state.miloOfferUnlocked = true;
                state.miloHired = true;
                state.miloPromptNextAt = 0;
                state.miloNextWorkAt = Date.now() + MILO_WORK_INTERVAL_MS;
                renderMiloVisual();
                saveState();
                print('Milo hired', 'ok');
                return;
            }
            if (sub === 'fire') {
                state.miloHired = false;
                state.miloNextWorkAt = 0;
                renderMiloVisual();
                saveState();
                print('Milo dismissed', 'ok');
                return;
            }
            if (sub === 'prompt') {
                state.miloOfferUnlocked = true;
                state.miloPromptNextAt = 0;
                processMiloSystems();
                saveState();
                print('Milo prompt triggered (unless blocked by active order)', 'ok');
                return;
            }
            if (sub === 'work') {
                const countRaw = toNumber(args[1]);
                const count = Math.max(1, Math.min(100, Math.floor(countRaw === null ? 1 : countRaw)));
                if (!state.miloHired) return print('Milo is not hired.', 'error');
                let served = 0;
                for (let i = 0; i < count; i++) {
                    if (!miloServeOneOrder()) break;
                    served += 1;
                }
                updateUI();
                renderQueue();
                renderOrder();
                saveState();
                print(`Milo served ${served} order(s)`, served > 0 ? 'ok' : 'error');
                return;
            }
            print('Usage: milo <status|unlock|hire|fire|prompt|work> [count]', 'error');
        },

        charity: (args) => {
            const sub = norm(args[0] || 'status');
            if (sub === 'status') {
                ensureActiveCharity();
                const c = state.activeCharity;
                const pending = Array.isArray(state.charityPendingPayouts) ? state.charityPendingPayouts.length : 0;
                print(`Cause=${c?.name || 'none'} raised=${formatMoney(c?.raised || 0)}/${formatMoney(c?.goal || 0)}`);
                print(`TotalDonated=${formatMoney(state.charityTotalDonated || 0)} completed=${state.charityCompleted || 0} pendingPayouts=${pending}`);
                return;
            }
            if (sub === 'donate') {
                const n = toNumber(args[1]);
                if (n === null) return print('Usage: charity donate <amount>', 'error');
                donateToCharity(n);
                saveState();
                print(`Donated ${formatMoney(Math.floor(n))}`, 'ok');
                return;
            }
            if (sub === 'complete') {
                ensureActiveCharity();
                if (state.activeCharity) {
                    state.activeCharity.raised = state.activeCharity.goal;
                    completeActiveCharityAndRollNext(0.05);
                    renderCharityTab();
                    updateUI();
                    saveState();
                    print('Completed current charity and rolled to next.', 'ok');
                }
                return;
            }
            if (sub === 'payoutnow') {
                if (!Array.isArray(state.charityPendingPayouts)) state.charityPendingPayouts = [];
                state.charityPendingPayouts.forEach((p) => { p.dueAt = Date.now() - 1; });
                const changed = processCharityEconomy();
                renderCharityTab();
                updateUI();
                saveState();
                print(changed ? 'Processed pending charity payouts now.' : 'No payouts were pending.', changed ? 'ok' : '');
                return;
            }
            if (sub === 'new') {
                createNewCharity();
                renderCharityTab();
                saveState();
                print('Created a new charity cause', 'ok');
                return;
            }
            print('Usage: charity <status|donate|complete|payoutnow|new> [amount]', 'error');
        },

        decor: (args) => {
            const sub = norm(args[0] || 'status');
            if (sub === 'status') {
                const ownedTotal = Object.values(state.decorOwned || {}).reduce((a, b) => a + (Number(b) || 0), 0);
                print(`Owned decor=${ownedTotal} placed=${(state.placedDecor || []).length}`);
                return;
            }
            if (sub === 'buy') {
                const id = resolveDecorId(args[1]);
                if (!id) return print(`Unknown decor: ${args[1] || ''}`, 'error');
                const countRaw = toNumber(args[2]);
                const count = Math.max(1, Math.min(100, Math.floor(countRaw === null ? 1 : countRaw)));
                let bought = 0;
                let spent = 0;
                for (let i = 0; i < count; i++) {
                    const cost = getDecorCost(id);
                    if (state.money < cost) break;
                    state.money -= cost;
                    state.decorOwned[id] = (state.decorOwned[id] || 0) + 1;
                    bought += 1;
                    spent += cost;
                }
                renderDecorShop();
                updateUI();
                saveState();
                if (!bought) return print('Not enough money to buy decor.', 'error');
                print(`Bought ${bought}x ${id} for ${formatMoney(spent)}`, 'ok');
                return;
            }
            if (sub === 'place') {
                const id = resolveDecorId(args[1]);
                const x = toNumber(args[2]);
                const y = toNumber(args[3]);
                if (!id || x === null || y === null) return print('Usage: decor place <decorId> <x%> <y%>', 'error');
                if (getAvailableDecorCount(id) < 1) return print('No available owned decor of that type to place.', 'error');
                state.placedDecor.push({
                    id: `decor-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                    itemId: id,
                    x: Math.max(4, Math.min(96, x)),
                    y: Math.max(6, Math.min(94, y))
                });
                renderQueue();
                renderDecorShop();
                saveState();
                print(`Placed ${id}`, 'ok');
                return;
            }
            if (sub === 'clear') {
                state.placedDecor = [];
                renderQueue();
                renderDecorShop();
                saveState();
                print('Cleared all placed decor', 'ok');
                return;
            }
            print('Usage: decor <status|buy|place|clear> ...', 'error');
        },

        theme: (args) => {
            const sub = norm(args[0] || 'list');
            if (sub === 'list') {
                print('Floor themes:');
                FLOOR_THEMES.forEach((t) => print(`  ${t.id} unlockAt=${formatMoney(t.unlockAt)}`));
                print('Wall themes:');
                WALL_THEMES.forEach((t) => print(`  ${t.id} unlockAt=${formatMoney(t.unlockAt)}`));
                return;
            }
            if (sub === 'floor') {
                const id = resolveFloorThemeId(args[1]);
                if (!id) return print(`Unknown floor theme: ${args[1] || ''}`, 'error');
                state.floorTheme = id;
                applyDesignTheme();
                renderDesignShop();
                saveState();
                print(`Floor theme set to ${id}`, 'ok');
                return;
            }
            if (sub === 'wall') {
                const id = resolveWallThemeId(args[1]);
                if (!id) return print(`Unknown wall theme: ${args[1] || ''}`, 'error');
                state.wallTheme = id;
                applyDesignTheme();
                renderDesignShop();
                saveState();
                print(`Wall theme set to ${id}`, 'ok');
                return;
            }
            print('Usage: theme <list|floor|wall> [themeId]', 'error');
        },

        layout: (args) => {
            const sub = norm(args[0] || 'status');
            if (sub === 'status') {
                print(`Layout edit mode: ${state.layoutEditMode ? 'on' : 'off'}`);
                return;
            }
            if (sub === 'on' || sub === 'off' || sub === 'toggle') {
                state.layoutEditMode = sub === 'toggle' ? !state.layoutEditMode : sub === 'on';
                renderDesignShop();
                renderQueue();
                saveState();
                print(`Layout edit mode: ${state.layoutEditMode ? 'on' : 'off'}`, 'ok');
                return;
            }
            print('Usage: layout <status|on|off|toggle>', 'error');
        },

        setlifetime: (args) => {
            const n = toNumber(args[0]);
            if (n === null) return print('Usage: setlifetime <amount>', 'error');
            state.lifetimeEarnings = Math.max(0, Math.floor(n));
            renderDesignShop();
            renderUpgrades();
            updateUI();
            saveState();
            print(`Lifetime earnings set to ${formatMoney(state.lifetimeEarnings)}`, 'ok');
        },

        state: () => {
            print(`Money=${state.money} Rating=${getDisplayRating()} Day=${state.day} Diff=${state.difficulty}`);
            print(`Queue=${state.queue.length} Eating=${(state.eatingGuests || []).length} Active=${state.activeOrder ? state.activeOrder.itemId : 'none'} Step=${state.currentStepIndex}`);
        },

        calibrate: (args) => {
            const sub = norm(args[0] || 'start');
            if (sub === 'start') {
                startCalibration(args[1]);
                return;
            }
            if (sub === 'status') {
                if (!calibrationRun?.running) {
                    print('Calibration idle.');
                    return;
                }
                const stepId = calibrationRun.steps[calibrationRun.stepIndex];
                print(`Running: ${(STEP_LABELS[stepId] || stepId)} (${calibrationRun.runIndex + 1}/${calibrationRun.runs})`);
                return;
            }
            if (sub === 'cancel') {
                cancelCalibration();
                return;
            }
            if (sub === 'results') {
                if (!calibrationResults?.averages) {
                    print('No saved calibration results yet.', 'error');
                    return;
                }
                printCalibrationResultBlock(calibrationResults.averages);
                return;
            }
            print("Usage: calibrate [start|status|cancel|results] [runs]", 'error');
        }
    };

    const runCommand = (raw) => {
        const inputRaw = String(raw || '').trim();
        if (!inputRaw) return;
        print(`> ${inputRaw}`);
        const [name, ...args] = inputRaw.split(/\s+/g);
        const commandName = norm(name);
        const cmd = commands[commandName];
        if (!cmd) {
            print(`Unknown command: ${name}. Try 'help'`, 'error');
            return;
        }
        if (norm(args[0]) === 'list') {
            printListForCommand(commandName);
            return;
        }
        try {
            cmd(args);
        } catch (e) {
            print(`Command error: ${e?.message || e}`, 'error');
        }
    };

    const toggle = () => {
        const hidden = root.classList.toggle('hidden');
        if (!hidden) {
            input.focus();
            input.select();
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Backslash' && !e.repeat) {
            e.preventDefault();
            toggle();
            return;
        }
        if (root.classList.contains('hidden')) return;
        if (e.key === 'Escape') {
            e.preventDefault();
            root.classList.add('hidden');
            return;
        }
        if (e.key === 'ArrowUp') {
            if (!history.length) return;
            e.preventDefault();
            historyIndex = Math.min(history.length - 1, historyIndex + 1);
            input.value = history[history.length - 1 - historyIndex];
            return;
        }
        if (e.key === 'ArrowDown') {
            if (!history.length) return;
            e.preventDefault();
            historyIndex = Math.max(-1, historyIndex - 1);
            input.value = historyIndex === -1 ? '' : history[history.length - 1 - historyIndex];
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        history.push(text);
        if (history.length > 120) history.shift();
        historyIndex = -1;
        input.value = '';
        runCommand(text);
    });

    print('Debug console ready. Type help for commands.');
}

// Init
loadState();
loadCalibrationProfile();
ensureActiveCharity();
updateUI();
renderUpgrades();
renderDifficulties();
renderQueue();
renderOrder();
initDebugConsole();
processMiloSystems();
if (state.queue.length === 0) spawnCustomer();
window.addEventListener('beforeunload', stopAdCamera);



