// Tango's Coffee - Game Logic
// A coffee shop game owned by Tango the Siamese cat! 🐱☕

const MENU_ITEMS = {
    espresso: {
        name: 'Espresso',
        emoji: '☕',
        price: 3,
        steps: ['grind', 'tamp', 'brew'],
        type: 'drink'
    },
    americano: {
        name: 'Americano',
        emoji: '🫖',
        price: 4,
        steps: ['grind', 'tamp', 'brew', 'water'],
        type: 'drink'
    },
    latte: {
        name: 'Latte',
        emoji: '🥛',
        price: 5,
        steps: ['grind', 'tamp', 'brew', 'steam', 'mix', 'pour'],
        type: 'drink'
    },
    cappuccino: {
        name: 'Cappuccino',
        emoji: '☕',
        price: 5,
        steps: ['grind', 'tamp', 'brew', 'steam', 'mix', 'foam'],
        type: 'drink'
    },
    mocha: {
        name: 'Mocha',
        emoji: '🍫',
        price: 6,
        steps: ['grind', 'tamp', 'brew', 'chocolate', 'steam', 'mix', 'pour'],
        type: 'drink'
    },
    coldbrew: {
        name: 'Cold Brew',
        emoji: '🧊',
        price: 5,
        steps: ['grind', 'steep', 'ice'],
        type: 'drink'
    },
    macchiato: {
        name: 'Caramel Macchiato',
        emoji: 'ðŸ®',
        price: 6,
        steps: ['grind', 'tamp', 'brew', 'steam', 'mix', 'caramel', 'pour'],
        type: 'drink'
    },
    flatwhite: {
        name: 'Flat White',
        emoji: 'ðŸ¥›',
        price: 5,
        steps: ['grind', 'tamp', 'brew', 'steam', 'pour'],
        type: 'drink'
    },
    affogato: {
        name: 'Affogato',
        emoji: 'ðŸ¨',
        price: 7,
        steps: ['scoop', 'grind', 'tamp', 'brew', 'pour'],
        type: 'drink'
    },
    chai: {
        name: 'Chai Latte',
        emoji: 'ðŸ«š',
        price: 6,
        steps: ['steep', 'steam', 'vanilla', 'mix', 'pour'],
        type: 'drink'
    },
    matcha: {
        name: 'Matcha Latte',
        emoji: 'ðŸµ',
        price: 6,
        steps: ['sift', 'whisk', 'steam', 'mix', 'pour'],
        type: 'drink'
    },
    nitro: {
        name: 'Nitro Cold Brew',
        emoji: 'ðŸ«§',
        price: 7,
        steps: ['grind', 'steep', 'nitro', 'pour'],
        type: 'drink'
    },
    croissant: {
        name: 'Croissant',
        emoji: '🥐',
        price: 4,
        steps: ['fridge', 'warm', 'plate'],
        type: 'food'
    },
    muffin: {
        name: 'Muffin',
        emoji: '🧁',
        price: 3,
        steps: ['fridge', 'plate'],
        type: 'food'
    },
    sandwich: {
        name: 'Avocado Toast',
        emoji: '🥑',
        price: 7,
        steps: ['fridge', 'toast', 'slice', 'spread', 'plate'],
        type: 'food'
    },
    cookie: {
        name: 'Cookie',
        emoji: '🍪',
        price: 2,
        steps: ['fridge', 'warm', 'drizzle', 'plate'],
        type: 'food'
    },
    bagel: {
        name: 'Cream Cheese Bagel',
        emoji: '🥯',
        price: 6,
        steps: ['fridge', 'slice', 'toast', 'spread', 'plate'],
        type: 'food'
    },
    brownie: {
        name: 'Brownie Bite',
        emoji: '🟫',
        price: 4,
        steps: ['fridge', 'warm', 'dust', 'plate'],
        type: 'food'
    },
    parfait: {
        name: 'Berry Yogurt Parfait',
        emoji: '🥣',
        price: 7,
        steps: ['fridge', 'layer', 'fruit', 'drizzle', 'plate'],
        type: 'food'
    },
    panini: {
        name: 'Caprese Panini',
        emoji: '🥪',
        price: 8,
        steps: ['fridge', 'slice', 'stack', 'toast', 'press', 'plate'],
        type: 'food'
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

const CUSTOMER_EMOJIS = ['😊', '😄', '🤗', '😌', '🙂', '😺', '🐶', '🐰', '🦊', '🐻', '🐼'];
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
    { id: 'specialty', name: 'Specialty Drinks', desc: 'Unlock Macchiato, Flat White, Chai, Matcha, Affogato, Nitro', cost: 500, effect: 'menu', value: 1 }
];

// Game State
let state = {
    money: 0,
    rating: 5.0,
    day: 1,
    prestige: 0,
    totalEarnings: 0,
    customersServed: 0,
    ordersCompleted: 0,
    perfectOrders: 0,
    upgrades: {},
    queue: [],
    activeOrder: null,
    currentStepIndex: 0,
    customerPatience: 100,
    patienceInterval: null,
    unlockedItems: ['espresso', 'americano', 'croissant', 'muffin', 'cookie'],
    difficulty: 'normal'
};

const PRESTIGE_THRESHOLD = 10000;
const BASE_PATIENCE = 100;
const PATIENCE_DECAY = 8;

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

// Load saved state
function loadState() {
    try {
        const saved = localStorage.getItem('tangos-coffee');
        if (saved) {
            const parsed = JSON.parse(saved);
            state = { ...state, ...parsed };
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
            customersServed: state.customersServed,
            ordersCompleted: state.ordersCompleted,
            perfectOrders: state.perfectOrders,
            upgrades: state.upgrades,
            unlockedItems: state.unlockedItems,
            difficulty: state.difficulty
        }));
    } catch (e) {}
}

function formatMoney(n) {
    return '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function showToast(msg, type = '') {
    const toast = document.getElementById('notification-toast');
    toast.textContent = msg;
    toast.className = 'notification-toast show ' + type;
    setTimeout(() => toast.classList.remove('show'), 2000);
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

function getPatience() {
    const diffMult = getDifficulty().patienceMult;
    return Math.floor(BASE_PATIENCE * getPatienceMultiplier() * diffMult);
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

function spawnCustomer() {
    const items = state.unlockedItems;
    const itemId = items[Math.floor(Math.random() * items.length)];
    const item = MENU_ITEMS[itemId];
    const emoji = CUSTOMER_EMOJIS[Math.floor(Math.random() * CUSTOMER_EMOJIS.length)];
    state.queue.push({
        id: Date.now(),
        emoji,
        itemId,
        item,
        patience: getPatience()
    });
    renderQueue();
}

function startCustomer() {
    if (state.activeOrder || state.queue.length === 0) return;
    state.activeOrder = state.queue.shift();
    state.currentStepIndex = 0;
    state.customerPatience = state.activeOrder.patience;
    renderQueue();
    renderOrder();
    renderActiveCustomer();
    startPatienceDecay();
}

function startPatienceDecay() {
    if (state.patienceInterval) clearInterval(state.patienceInterval);
    state.patienceInterval = setInterval(() => {
        state.customerPatience -= PATIENCE_DECAY / 10;
        if (state.customerPatience <= 0) {
            completeOrder(false);
        }
        renderActiveCustomer();
    }, 100);
}

function completeOrder(success) {
    if (state.patienceInterval) {
        clearInterval(state.patienceInterval);
        state.patienceInterval = null;
    }
    const order = state.activeOrder;
    if (!order) return;

    if (success) {
        const mult = getMultiplier();
        let earnings = order.item.price * mult;
        const tipBonus = state.upgrades.training ? 1.15 : 1;
        const tip = Math.floor(earnings * 0.15 * tipBonus * (state.customerPatience / 100));
        earnings += tip;

        state.money += earnings;
        state.totalEarnings += earnings;
        state.customersServed++;
        state.ordersCompleted++;

        const speedBonus = state.customerPatience > 50;
        const perfect = state.currentStepIndex >= order.item.steps.length;
        if (perfect) state.perfectOrders++;

        const ratingChange = getRatingChange(speedBonus, perfect);
        state.rating = Math.max(1, Math.min(5, state.rating + ratingChange));

        showToast(`+${formatMoney(earnings)} (${order.item.name})`, 'positive');
    } else {
        state.rating = Math.max(1, state.rating - 0.15);
        showToast('Customer left unhappy!', 'negative');
    }

    state.activeOrder = null;
    activeCustomer.classList.add('hidden');
    tangoChar.classList.remove('working');
    tangoStatus.textContent = 'Ready to serve!';
    renderOrder();
    renderActiveCustomer();
    updateUI();
    saveState();

    if (state.queue.length > 0) {
        setTimeout(startCustomer, 800);
    }
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
        handle.textContent = action.emoji || '🔧';
        track.appendChild(handle);
        area.appendChild(track);

        const needed = action.pulls || 3;
        let pulls = 0;
        let dragging = false;
        let lastPct = 0;

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
        };

        const onDown = (e) => {
            dragging = true;
            track.setPointerCapture(e.pointerId);
            setPos(e.clientY);
        };
        const onMove = (e) => {
            if (!dragging) return;
            setPos(e.clientY);
        };
        const onUp = (e) => {
            dragging = false;
            if (lastPct > 0.85) {
                pulls++;
                updateProgress();
            }
            lastPct = 0;
            handle.style.transform = 'translateY(0px)';
            if (e && e.pointerId !== undefined) {
                track.releasePointerCapture(e.pointerId);
            }
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
        jug.textContent = action.emoji || '🫖';
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
        minus.textContent = '–';
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
        target.textContent = '⬇️';
        tray.appendChild(target);
        area.appendChild(tray);

        const needed = action.drops || 3;
        let dropped = 0;
        countEl.textContent = `0 / ${needed}`;

        const createItem = () => {
            const item = document.createElement('div');
            item.className = 'drop-item';
            item.textContent = action.dropEmoji || action.emoji || '✨';
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
        const food = document.createElement('div');
        food.className = 'action-food';
        food.textContent = action.foodEmoji || '🍰';
        area.appendChild(food);

        const tray = document.createElement('div');
        tray.className = 'action-draw-tray';
        const canvas = document.createElement('canvas');
        canvas.width = 260;
        canvas.height = 180;
        canvas.className = 'action-canvas';
        tray.appendChild(canvas);
        area.appendChild(tray);

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
        temp.textContent = '400°F';
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
        const ok = portions.every(p => Math.abs(p - ideal) <= ideal * 0.2);
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
    customerQueue.innerHTML = state.queue.slice(0, 5).map(c =>
        `<div class="queue-customer">
            <span class="customer-emoji">${c.emoji}</span>
            <span class="customer-order">${c.item.emoji} ${c.item.name}</span>
        </div>`
    ).join('') || '<p style="color:#8b7355;font-size:0.9rem;">No customers waiting</p>';
}

function renderOrder() {
    if (!state.activeOrder) {
        orderSteps.innerHTML = '<p style="color:#8b7355;">Take an order from the queue!</p>';
        if (state.queue.length > 0) {
            actionButtons.innerHTML = '<button class="action-btn primary" onclick="startCustomer()">Call Next Customer 🐱</button>';
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
        btn.textContent = 'Serve Order ✓';
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
        return;
    }
    activeCustomer.classList.remove('hidden');
    const order = state.activeOrder;
    customerOrderText.textContent = `"I'd like a ${order.item.name}, please! ${order.item.emoji}"`;
    customerTip.textContent = `Tip: ~${formatMoney(Math.floor(order.item.price * 0.15))}`;
    const pct = Math.max(0, state.customerPatience);
    patienceFill.style.width = pct + '%';
    patienceFill.classList.toggle('low', pct < 30);
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
                    ? '<span style="color:var(--mint);font-weight:700;">✓ Owned</span>'
                    : `<button class="upgrade-btn" data-id="${u.id}" ${state.money < u.cost ? 'disabled' : ''}>${formatMoney(u.cost)}</button>`
                }
            </div>
        `;
    }).join('');

    list.querySelectorAll('.upgrade-btn').forEach(btn => {
        btn.onclick = () => buyUpgrade(btn.dataset.id);
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
        ['macchiato', 'flatwhite', 'chai', 'matcha', 'affogato', 'nitro'].forEach(i => {
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
    state.upgrades = {};
    state.unlockedItems = ['espresso', 'americano', 'croissant', 'muffin', 'cookie'];
    state.difficulty = 'normal';
    state.queue = [];
    state.activeOrder = null;
    if (state.patienceInterval) clearInterval(state.patienceInterval);
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
        <div class="stat-row"><span>Customers Served</span><span>${state.customersServed}</span></div>
        <div class="stat-row"><span>Orders Completed</span><span>${state.ordersCompleted}</span></div>
        <div class="stat-row"><span>Perfect Orders</span><span>${state.perfectOrders}</span></div>
        <div class="stat-row"><span>Prestige Level</span><span>${state.prestige}</span></div>
    `;
}

const DIFFICULTIES = [
    { id: 'easy', name: 'Easy', patienceMult: 1.2 },
    { id: 'normal', name: 'Normal', patienceMult: 1.0 },
    { id: 'hard', name: 'Hard', patienceMult: 0.85 },
    { id: 'expert', name: 'Expert', patienceMult: 0.7 }
];

function getDifficulty() {
    return DIFFICULTIES.find(d => d.id === state.difficulty) || DIFFICULTIES[1];
}

function renderDifficulties() {
    const wrap = document.getElementById('difficulty-buttons');
    if (!wrap) return;
    wrap.innerHTML = DIFFICULTIES.map(d => {
        const active = d.id === state.difficulty;
        return `<button class="difficulty-btn ${active ? 'active' : ''}" data-id="${d.id}">${d.name}</button>`;
    }).join('');
    wrap.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.onclick = () => {
            state.difficulty = btn.dataset.id;
            renderDifficulties();
            showToast(`Difficulty: ${btn.textContent}`, 'positive');
            saveState();
        };
    });
}

// Prestige button
document.getElementById('prestige-btn').onclick = doPrestige;

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
        if (btn.dataset.tab === 'stats') renderStats();
    };
});

// Day progression & customer spawning
function advanceDay() {
    state.day++;
    saveState();
}

setInterval(() => {
    if (state.queue.length < 5 && !state.activeOrder) {
        if (Math.random() < 0.4) spawnCustomer();
    }
    if (state.activeOrder && state.queue.length === 0 && Math.random() < 0.3) {
        spawnCustomer();
    }
}, 3000);

setInterval(advanceDay, 60000);

// Tango click
tangoChar.onclick = () => {
    if (state.queue.length > 0 && !state.activeOrder) {
        startCustomer();
    } else if (state.activeOrder) {
        tangoChar.classList.add('working');
        setTimeout(() => tangoChar.classList.remove('working'), 200);
    }
};

// Init
loadState();
updateUI();
renderUpgrades();
renderDifficulties();
renderQueue();
renderOrder();
if (state.queue.length === 0) spawnCustomer();



