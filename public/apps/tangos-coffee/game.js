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
        steps: ['fridge', 'toast', 'spread', 'plate'],
        type: 'food'
    },
    cookie: {
        name: 'Cookie',
        emoji: '🍪',
        price: 2,
        steps: ['fridge', 'plate'],
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
    spread: 'Spread avocado'
};

const FOOD_ITEM_IDS = ['croissant', 'muffin', 'sandwich', 'cookie'];

const CUSTOMER_EMOJIS = ['😊', '😄', '🤗', '😌', '🙂', '😺', '🐶', '🐰', '🦊', '🐻', '🐼'];
const UPGRADES = [
    { id: 'grinder', name: 'Better Grinder', desc: 'Grind 50% faster', cost: 50, effect: 'grindSpeed', value: 1.5 },
    { id: 'machine', name: 'Pro Espresso Machine', desc: 'Brew 40% faster', cost: 150, effect: 'brewSpeed', value: 1.4 },
    { id: 'steamer', name: 'Dual Steam Wand', desc: 'Steam milk faster', cost: 100, effect: 'steamSpeed', value: 1.5 },
    { id: 'display', name: 'Menu Board', desc: '+1 customer patience', cost: 80, effect: 'patience', value: 1 },
    { id: 'decor', name: 'Cozy Decor', desc: '+0.1 base rating', cost: 200, effect: 'rating', value: 0.1 },
    { id: 'training', name: 'Barista Training', desc: '+15% tips', cost: 120, effect: 'tips', value: 1.15 },
    { id: 'music', name: 'Jazz Playlist', desc: 'Customers wait longer', cost: 75, effect: 'patience', value: 1 },
    { id: 'pastry', name: 'Pastry Case', desc: 'Unlock Avocado Toast', cost: 250, effect: 'menu', value: 1 },
    { id: 'coffee-menu', name: 'Full Coffee Menu', desc: 'Unlock Latte, Cappuccino, Mocha, Cold Brew', cost: 300, effect: 'menu', value: 1 }
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
    unlockedItems: ['espresso', 'americano', 'croissant', 'muffin', 'cookie']
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
            unlockedItems: state.unlockedItems
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
    return Math.floor(BASE_PATIENCE * getPatienceMultiplier());
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

    tangoChar.classList.add('working');
    tangoStatus.textContent = `Making ${STEP_LABELS[stepId]}...`;

    const baseTime = stepId === 'steep' ? 400 : 800;
    let time = baseTime;
    if (stepId === 'brew' && state.upgrades.machine) time /= 1.4;
    if (stepId === 'steam' && state.upgrades.steamer) time /= 1.5;

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
    if (id === 'pastry') state.unlockedItems.push('sandwich');
    if (id === 'coffee-menu') {
        ['latte', 'cappuccino', 'mocha', 'coldbrew'].forEach(i => {
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
renderQueue();
renderOrder();
if (state.queue.length === 0) spawnCustomer();
