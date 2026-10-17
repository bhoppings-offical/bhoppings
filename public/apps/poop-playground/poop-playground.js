// Poop Playground Physics Simulation
// Easily add your own behavior in the update loop or by extending PoopBody

const { Engine, Render, Runner, World, Bodies, Body, Events, Mouse, MouseConstraint, Composite, Vertices } = Matter;

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Offscreen layer for disco lighting (beams/spots), to blur then composite
let discoLightCanvas = document.createElement('canvas');
let discoLightCtx = discoLightCanvas.getContext('2d');
function syncDiscoLightCanvasSize() {
  discoLightCanvas.width = canvas.width;
  discoLightCanvas.height = canvas.height;
}
syncDiscoLightCanvasSize();

const engine = Engine.create();
const world = engine.world;

// Coin counter logic
let coins = 0;
function formatCoins(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return Math.round(n).toString();
}

function drawSmoothPath(ctx, points, color) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].position.x, points[0].position.y);
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    // Catmull-Rom to Bezier conversion
    const cp1x = p1.position.x + (p2.position.x - p0.position.x) / 6;
    const cp1y = p1.position.y + (p2.position.y - p0.position.y) / 6;
    const cp2x = p2.position.x - (p3.position.x - p1.position.x) / 6;
    const cp2y = p2.position.y - (p3.position.y - p1.position.y) / 6;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.position.x, p2.position.y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

function updateCoinDisplay() {
  const display = formatCoins(coins);
  document.getElementById('coin-counter').textContent = display;
  localStorage.setItem('coins', coins);
}
// Initialize coins from localStorage
const storedCoins = localStorage.getItem('coins');
if (storedCoins !== null) {
  coins = parseFloat(storedCoins) || 0;
  updateCoinDisplay();
}

// Experience system
let xp = 0;
function xpForLevel(lvl) {
  return 100 * Math.pow(2, lvl - 1); // 100, 200, 400, 800, ...
}
function getLevelFromXP(xp) {
  let lvl = 1;
  let xpLeft = xp;
  while (xpLeft >= xpForLevel(lvl)) {
    xpLeft -= xpForLevel(lvl);
    lvl++;
  }
  return lvl;
}
function getCurrentLevelXP(xp) {
  let lvl = 1;
  let xpLeft = xp;
  while (xpLeft >= xpForLevel(lvl)) {
    xpLeft -= xpForLevel(lvl);
    lvl++;
  }
  return xpLeft;
}
function getXPToNextLevel(xp) {
  let lvl = getLevelFromXP(xp);
  return xpForLevel(lvl) - getCurrentLevelXP(xp);
}
function updateLevelDisplay() {
  const level = getLevelFromXP(xp);
  document.getElementById('level-counter').textContent = level;
  localStorage.setItem('xp', xp);
}
// Initialize XP from localStorage
const storedXP = localStorage.getItem('xp');
if (storedXP !== null) xp = parseFloat(storedXP) || 0;
updateLevelDisplay();

function addXP(amount) {
  xp += amount;
  updateLevelDisplay();
}

// Audio context for sound effects
let audioContext = null;
let screamOscillator = null;

function playScreamSound() {
  try {
    // Create audio context if it doesn't exist
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Stop any existing scream
    if (screamOscillator) {
      screamOscillator.stop();
    }
    
    // Create a screaming sound effect
    screamOscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    screamOscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure the scream sound
    screamOscillator.type = 'sawtooth';
    screamOscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    screamOscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
    
    // Configure volume
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    // Start and stop the sound
    screamOscillator.start(audioContext.currentTime);
    screamOscillator.stop(audioContext.currentTime + 0.3);
    
    // Reset oscillator reference
    setTimeout(() => {
      screamOscillator = null;
    }, 300);
    
  } catch (error) {
    console.log('Audio not supported or blocked:', error);
  }
}

// Custom rendering for emoji triangles
const poopEmoji = '💩';
const TRIANGLE = Vertices.create([
  { x: 0, y: -40 },
  { x: 35, y: 30 },
  { x: -35, y: 30 }
]);

// Per-skin hitbox polygons (replace with exported data from editor)
// Each entry is an array of {x, y} points in [0,320] space (editor canvas size)
const POOP_HITBOXES = [
  [
    {
      "x": 155,
      "y": 43.5
    },
    {
      "x": 238,
      "y": 113.5
    },
    {
      "x": 294,
      "y": 276.5
    },
    {
      "x": 40,
      "y": 272.5
    },
    {
      "x": 78,
      "y": 128.5
    }
  ],
  [
    {
      "x": 194,
      "y": 57.5
    },
    {
      "x": 98,
      "y": 124.5
    },
    {
      "x": 44,
      "y": 222.5
    },
    {
      "x": 89,
      "y": 281.5
    },
    {
      "x": 258,
      "y": 282.5
    },
    {
      "x": 291,
      "y": 233.5
    },
    {
      "x": 247,
      "y": 122.5
    }
  ],
  [
    {
      "x": 141,
      "y": 65.5
    },
    {
      "x": 283,
      "y": 261.5
    },
    {
      "x": 52,
      "y": 273.5
    }
  ],
  [
    {
      "x": 136,
      "y": 49.5
    },
    {
      "x": 207,
      "y": 82.5
    },
    {
      "x": 286,
      "y": 260.5
    },
    {
      "x": 175,
      "y": 278.5
    },
    {
      "x": 36,
      "y": 262.5
    },
    {
      "x": 69,
      "y": 139.5
    }
  ],
  [
    {
      "x": 131,
      "y": 47.5
    },
    {
      "x": 215,
      "y": 94.5
    },
    {
      "x": 274,
      "y": 233.5
    },
    {
      "x": 160,
      "y": 277.5
    },
    {
      "x": 53,
      "y": 243.5
    },
    {
      "x": 79,
      "y": 140.5
    }
  ],
  [
    {
      "x": 165,
      "y": 56.5
    },
    {
      "x": 215,
      "y": 62.5
    },
    {
      "x": 283,
      "y": 254.5
    },
    {
      "x": 49,
      "y": 266.5
    },
    {
      "x": 74,
      "y": 140.5
    }
  ],
  [
    {
      "x": 137,
      "y": 50.5
    },
    {
      "x": 218,
      "y": 91.5
    },
    {
      "x": 287,
      "y": 257.5
    },
    {
      "x": 59,
      "y": 268.5
    },
    {
      "x": 61,
      "y": 142.5
    }
  ],
  [
    {
      "x": 125,
      "y": 43.5
    },
    {
      "x": 195,
      "y": 44.5
    },
    {
      "x": 271,
      "y": 110.5
    },
    {
      "x": 273,
      "y": 284.5
    },
    {
      "x": 80,
      "y": 284.5
    },
    {
      "x": 56,
      "y": 259.5
    },
    {
      "x": 56,
      "y": 116.5
    }
  ],
  [
    {
      "x": 164,
      "y": 65.5
    },
    {
      "x": 71,
      "y": 97.5
    },
    {
      "x": 41,
      "y": 240.5
    },
    {
      "x": 77,
      "y": 269.5
    },
    {
      "x": 233,
      "y": 272.5
    },
    {
      "x": 282,
      "y": 235.5
    },
    {
      "x": 245,
      "y": 125.5
    }
  ],
  [
    {
      "x": 157,
      "y": 49.5
    },
    {
      "x": 272,
      "y": 180.5
    },
    {
      "x": 259,
      "y": 266.5
    },
    {
      "x": 119,
      "y": 285.5
    },
    {
      "x": 62,
      "y": 218.5
    },
    {
      "x": 92,
      "y": 133.5
    }
  ],
  [
    {
      "x": 169,
      "y": 46.5
    },
    {
      "x": 278,
      "y": 195.5
    },
    {
      "x": 242,
      "y": 266.5
    },
    {
      "x": 74,
      "y": 266.5
    },
    {
      "x": 52,
      "y": 195.5
    },
    {
      "x": 100,
      "y": 106.5
    }
  ],
  [
    {
      "x": 147,
      "y": 58.5
    },
    {
      "x": 220,
      "y": 85.5
    },
    {
      "x": 276,
      "y": 206.5
    },
    {
      "x": 217,
      "y": 271.5
    },
    {
      "x": 70,
      "y": 250.5
    },
    {
      "x": 52,
      "y": 179.5
    }
  ],
  [
    {
      "x": 146,
      "y": 48.5
    },
    {
      "x": 214,
      "y": 93.5
    },
    {
      "x": 281,
      "y": 219.5
    },
    {
      "x": 194,
      "y": 280.5
    },
    {
      "x": 68,
      "y": 262.5
    },
    {
      "x": 74,
      "y": 133.5
    }
  ],
  [
    {
      "x": 181,
      "y": 79.5
    },
    {
      "x": 292,
      "y": 239.5
    },
    {
      "x": 60,
      "y": 259.5
    },
    {
      "x": 58,
      "y": 154.5
    }
  ],
  [
    {
      "x": 188,
      "y": 72.5
    },
    {
      "x": 73,
      "y": 146.5
    },
    {
      "x": 43,
      "y": 272.5
    },
    {
      "x": 253,
      "y": 280.5
    },
    {
      "x": 274,
      "y": 217.5
    }
  ],
  [
    {
      "x": 180,
      "y": 34.5
    },
    {
      "x": 288,
      "y": 276.5
    },
    {
      "x": 40,
      "y": 270.5
    },
    {
      "x": 73,
      "y": 140.5
    }
  ],
  [
    {
      "x": 162,
      "y": 93.5
    },
    {
      "x": 291,
      "y": 255.5
    },
    {
      "x": 40,
      "y": 266.5
    },
    {
      "x": 74,
      "y": 162.5
    }
  ],
  [
    {
      "x": 248,
      "y": 115.5
    },
    {
      "x": 281,
      "y": 255.5
    },
    {
      "x": 40,
      "y": 268.5
    },
    {
      "x": 67,
      "y": 146.5
    },
    {
      "x": 158,
      "y": 47.5
    }
  ],
  [
    {
      "x": 160,
      "y": 29.5
    },
    {
      "x": 281,
      "y": 203.5
    },
    {
      "x": 273,
      "y": 279.5
    },
    {
      "x": 58,
      "y": 278.5
    },
    {
      "x": 33,
      "y": 210.5
    },
    {
      "x": 96,
      "y": 96.5
    }
  ],
  [
    {
      "x": 190,
      "y": 49.5
    },
    {
      "x": 284,
      "y": 267.5
    },
    {
      "x": 42,
      "y": 271.5
    },
    {
      "x": 87,
      "y": 113.5
    }
  ]
];

// Utility to scale/center polygon from editor space to game space
function scaleHitboxPolygon(poly) {
  // Editor is 320x320, image drawn at 40,40 to 280,280 (so 80x80 in game)
  // Map [40,280] -> [-40,40] in both x and y
  return poly.map(pt => ({
    x: ((pt.x - 160) / 120) * 40, // 160 is center, 120 is half of 240
    y: ((pt.y - 160) / 120) * 40
  }));
}

// Helper function to get the correct mouse button based on swap-clicks setting
function getItemButton() {
  const swapClicks = localStorage.getItem('poop-swap-clicks') === 'true';
  return swapClicks ? 0 : 2; // 0 = left click, 2 = right click
}

function getDragButton() {
  const swapClicks = localStorage.getItem('poop-swap-clicks') === 'true';
  return swapClicks ? 2 : 0; // 2 = right click, 0 = left click
}

// Helper function to check if developer mode is enabled
function isDeveloperMode() {
  return localStorage.getItem('poop-difficulty') === 'Developer';
}

// Preload SVG images for skins 0-19 and invalid
const SKIN_COUNT = 20;
const skinImages = {};
for (let i = 0; i < SKIN_COUNT; ++i) {
  const img = new window.Image();
  img.src = `images/skins/${i}.svg`;
  skinImages[i] = img;
}
const invalidImg = new window.Image();
invalidImg.src = 'images/skins/invalid.svg';
// Preload background images (0-11)
const BACKGROUND_COUNT = 12;
const backgroundImages = [];
for (let i = 0; i < BACKGROUND_COUNT; ++i) {
  const img = new window.Image();
  img.loading = 'eager';
  img.decoding = 'sync';
  img.src = `images/bg/${i}.svg`;
  backgroundImages[i] = img;
}
// Cache toilet image (SVG with transparent background)
const toiletImg = new window.Image();
toiletImg.src = 'images/icons/toilet.svg';
// Cache sandal image
const sandalImg = new window.Image();
sandalImg.src = 'images/icons/sandal.svg';
// Cache volcano image
const volcanoImg = new window.Image();
volcanoImg.src = 'images/icons/volcano.svg';

function getPoopSkinIndex() {
  const val = localStorage.getItem('poop-skin') || '0';
  if (val === 'random') return 'random';
  const idx = parseInt(val, 10);
  if (!isNaN(idx) && idx >= 0 && idx < SKIN_COUNT) return idx;
  return 'invalid';
}

// Store custom poop bodies
let poopBodies = [];
let selectedBody = null;
// Chain tool state
let chainToolActive = false;
let chainFirstPoop = null;
let chains = []; // {a, b, links, constraints}
// Store drawn wall/floor bodies for pencil tool
let drawnWalls = []; // Array of arrays, each is a path of wall bodies
let currentPencilPath = null;
// Eraser tool state
let eraserActive = false;
let eraserMousePos = null;
const ERASER_RADIUS = 24;

// Toilet Paper wipe animation state
let wipeActive = false;
let wipeProgress = 0; // 0 to 1
let wipeDirection = 1; // 1 = left to right, -1 = right to left
const WIPE_DURATION = 900; // ms
let wipeStartTime = 0;

// Disco Ball party state
let discoActive = false;
let discoStartTime = 0;
let discoDuration = 10000; // ms
let discoCountdown = 0;

// Wind tool state
let windActive = false;
let windMouse = { x: 0, y: 0 };
const windParticles = [];

// For interpolation and fixed timestep
let lastFrameTime = performance.now();
let accumulator = 0;
const PHYSICS_TIMESTEP = 1000 / 30; // 30Hz fixed physics
const MAX_ACCUMULATE = 250; // ms, cap to avoid spiral of death

// Add arbitrarily long boundaries
const BIG = 100000;
const boundaries = [
  Bodies.rectangle(window.innerWidth/2, window.innerHeight+25, BIG, 50, { isStatic: true }), // bottom
  Bodies.rectangle(window.innerWidth/2, -25, BIG, 50, { isStatic: true }), // top
  Bodies.rectangle(-25, window.innerHeight/2, 50, BIG, { isStatic: true }), // left
  Bodies.rectangle(window.innerWidth+25, window.innerHeight/2, 50, BIG, { isStatic: true }) // right
];
World.add(world, boundaries);

// PoopBody factory
function createPoop(x, y) {
  let skin = getPoopSkinIndex();
  if (skin === 'random') {
    skin = Math.floor(Math.random() * SKIN_COUNT);
  }
  // Use per-skin hitbox if available, else fallback to triangle
  let verts = TRIANGLE;
  if (POOP_HITBOXES[skin] && POOP_HITBOXES[skin].length >= 3) {
    verts = scaleHitboxPolygon(POOP_HITBOXES[skin]);
  }
  const body = Bodies.fromVertices(x, y, [verts], {
    restitution: 0.6,
    friction: 0.3,
    label: 'poop',
    render: { visible: false },
    sleepThreshold: 60, // enable sleeping after 60 frames at rest
    collisionFilter: { group: 0, category: 0x0001, mask: 0x0001 } // default, but explicit
  });
  body.poopSkin = skin;
  // For interpolation
  body.prevPosition = { x: body.position.x, y: body.position.y };
  body.prevAngle = body.angle;
  poopBodies.push(body);
  World.add(world, body);
  return body;
}

// Mouse control
const mouse = Mouse.create(canvas);
let mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false }
  },
  collisionFilter: { mask: 0x0001 }
});
// Update mouse constraint to use drag button setting
function updateMouseConstraint() {
  const dragButton = getDragButton();
  const itemButton = getItemButton();
  
  // Remove old constraint
  World.remove(world, mouseConstraint);
  
  // Only create mouse constraint if drag and item buttons are different
  if (dragButton !== itemButton) {
    // Create new constraint with correct button
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      },
      collisionFilter: { mask: 0x0001 }
    });
    mouseConstraint.mouse.button = dragButton;
    // Add new constraint
    World.add(world, mouseConstraint);
  } else {
    // Create a dummy constraint that doesn't respond to any button
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      },
      collisionFilter: { mask: 0x0001 }
    });
    mouseConstraint.mouse.button = -1; // No button responds
    World.add(world, mouseConstraint);
  }
}
updateMouseConstraint();

// Handle selection, deletion, and item use
let diarrheaInterval = null;
let diarrheaActive = false;
let diarrheaMousePos = {x: 0, y: 0};
let magnetActive = false;
let magnetMousePos = {x: 0, y: 0};

// Saw item state
let sawActive = false;
let sawLastPos = null;
let sawCutPoops = new Set();

// Sandal item state
let sandalActive = false;
let sandalLastPos = null;
let sandalSlappedPoops = new Set();
let sandalSlapEffects = []; // Array to track slap flash effects

// Massive sandal state
let massiveSandalActive = false;
let massiveSandalX = 0;
let massiveSandalY = 0;
let massiveSandalAnim = 0; // 0: idle, 1: dropping, 2: squishing, 3: lifting
let massiveSandalTimer = 0;

// Moyai item state
let moyaiActive = false;
let moyaiX = 0;
let moyaiY = 0;
let moyaiAnim = 0; // 0: idle, 1: hopping, 2: squishing, 3: disappearing
let moyaiTimer = 0;
let moyaiHopsLeft = 0;
let moyaiTargetX = 0;
let moyaiTargetY = 0;
const MOYAI_SIZE = 180;
const MOYAI_RADIUS = MOYAI_SIZE / 2;
const MOYAI_EMOJI = '🗿';

// Saw half triangles (smaller)
const LEFT_HALF = [
  { x: 0, y: -24 },
  { x: 0, y: 18 },
  { x: -21, y: 18 }
];
const RIGHT_HALF = [
  { x: 0, y: -24 },
  { x: 21, y: 18 },
  { x: 0, y: 18 }
];

// Blood particle system
const BLOOD_LIFETIME = 600; // 10 seconds at 60fps
const bloodParticles = [];
function spawnBlood(x, y, count = 16, angle = 0) {
  for (let i = 0; i < count; ++i) {
    const a = angle + (Math.random() - 0.5) * Math.PI * 0.9; // wider spread
    const speed = 10 + Math.random() * 14; // further
    bloodParticles.push({
      x, y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      life: BLOOD_LIFETIME,
      maxLife: BLOOD_LIFETIME,
      size: 2 + Math.random() * 3 // smaller
    });
  }
}

// Medicine particles
const medicineParticles = [];
function spawnMedicineParticles(count = 30) {
  console.log('spawnMedicineParticles called with count:', count);
  for (let i = 0; i < count; ++i) {
    setTimeout(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.8 + canvas.height * 0.1;
      const size = 24 + Math.random() * 32;
      const life = 40 + Math.random() * 30;
      medicineParticles.push({ x, y, size, life, maxLife: life });
      console.log('Medicine particle added, total count:', medicineParticles.length);
    }, Math.random() * 600);
  }
}

// Medicine item logic
function useMedicine() {
  console.log('useMedicine called, poopBodies length:', poopBodies.length);
  spawnMedicineParticles(36);
  console.log('Medicine particles spawned, count:', medicineParticles.length);
  let infectedCount = 0;
  for (const body of poopBodies) {
    if (body._infected) {
      delete body._infected;
      infectedCount++;
    }
  }
  console.log('Cured', infectedCount, 'infected poops');
}

// Syringe infection system
const INFECTION_TIME = 1000; // ms to infect on contact
// Add infection state to each poop
function markInfected(body) {
  body._infected = true;
  body._infectionTime = performance.now();
}
// Track infection contact times
const infectionContacts = new Map(); // key: 'idA-idB', value: {start, a, b}

// Pencil tool state
let pencilActive = false;
let pencilLastPos = null;
// New: track mouse down and position for pencil tool
globalThis.pencilMouseDown = false;
globalThis.pencilMousePos = null;

// JSFB (car crash) state
let jsfbCars = [];
let jsfbExplosions = [];
// JSFB beginner symbol particles
const jsfbParticles = [];
const jsfbImg = (() => { const i = new window.Image(); i.src = 'images/jsfb.png'; return i; })();

// Toilet item state
let toiletActive = false;
let toiletX = 0;
let toiletY = 0;
let toiletAnim = 0; // 0: idle, 1: flushing, 2: going down
// let toiletPoops = [];
let toiletTimer = 0;
const TOILET_WIDTH = () => window.innerWidth * 0.5;
const TOILET_HEIGHT = () => window.innerHeight * 0.32;

// Toilet splash particles
const toiletSplashParticles = [];

// Volcano smoke particles
const volcanoSmokeParticles = [];

// Volcano item state
let volcanoes = []; // { body, x, y, angle, phase, emitted, timeAlive }

const VOLCANO_SINK_SPEED = 1.5; // px/frame when sinking
const VOLCANO_WIDTH = 400; // Increased from 260
const VOLCANO_HEIGHT = 300; // Increased from 200
const VOLCANO_Y_OFFSET = 0.15; // Variable for y positioning
function spawnVolcano(x, y) {
  // Matter body: static-like but collidable; we keep upright and position synced manually
  const w = VOLCANO_WIDTH, h = VOLCANO_HEIGHT;
  // Instantly position at bottom of screen using y offset variable
  const bottomY = window.innerHeight - VOLCANO_HEIGHT * VOLCANO_Y_OFFSET;
  const body = Bodies.rectangle(x, bottomY, w * 0.8, h * 0.6, {
    label: 'volcano',
    isStatic: true, // No physics - completely immovable
    collisionFilter: { group: 0, category: 0x0001, mask: 0x0001 }
  });
  body.prevPosition = { x: x, y: bottomY };
  body.prevAngle = 0;
  World.add(world, body);
  volcanoes.push({ body, x, y: bottomY, angle: 0, phase: 'active', emitted: 0, timeAlive: 0 });
}

canvas.addEventListener('mousedown', (e) => {
  const mousePos = { x: e.clientX, y: e.clientY };
  const selected = window.selectedHotbarItem;
  if (e.button !== getItemButton()) return; // Only handle right-click for all items
  // Wind: hold right click to blow wind
  if (selected === 'Wind') {
    windActive = true;
    windMouse = { x: e.clientX, y: e.clientY };
    e.preventDefault();
    return;
  }
  // Disco Ball: right click to start party
  if (selected === 'Disco Ball' && !discoActive) {
    discoActive = true;
    discoStartTime = performance.now();
    discoCountdown = discoDuration;
    e.preventDefault();
    return;
  }
  if (selected === 'Chain') {
    const found = poopBodies.find(b => Matter.Vertices.contains(b.vertices, mousePos));
    if (found) {
      if (!chainFirstPoop) {
        chainFirstPoop = found;
      } else if (chainFirstPoop !== found) {
        // Create a multi-link chain between the two poops
        const NUM_LINKS = 8;
        const chainLinks = [];
        const chainConstraints = [];
        // Place links evenly between the two poops
        for (let i = 1; i <= NUM_LINKS; ++i) {
          const t = i / (NUM_LINKS + 1);
          const x = chainFirstPoop.position.x + (found.position.x - chainFirstPoop.position.x) * t;
          const y = chainFirstPoop.position.y + (found.position.y - chainFirstPoop.position.y) * t;
          const link = Matter.Bodies.circle(x, y, 7, { isStatic: false, collisionFilter: { group: -1 }, label: 'chainLink' });
          link.prevPosition = { x: link.position.x, y: link.position.y };
          link.prevAngle = link.angle;
          chainLinks.push(link);
          World.add(world, link);
        }
        // Connect: poopA - link0 - ... - linkN - poopB
        let prev = chainFirstPoop;
        for (let i = 0; i < chainLinks.length; ++i) {
          const constraint = Matter.Constraint.create({
            bodyA: prev,
            bodyB: chainLinks[i],
            length: 15,
            stiffness: 0.6,
            render: { visible: false }
          });
          chainConstraints.push(constraint);
          World.add(world, constraint);
          prev = chainLinks[i];
        }
        // Last link to poopB
        const lastConstraint = Matter.Constraint.create({
          bodyA: prev,
          bodyB: found,
          length: 15,
          stiffness: 0.6,
          render: { visible: false }
        });
        chainConstraints.push(lastConstraint);
        World.add(world, lastConstraint);
        chains.push({ a: chainFirstPoop, b: found, links: chainLinks, constraints: chainConstraints });
        chainFirstPoop = null;
      }
    }
    selectedBody = null;
    e.preventDefault();
    return;
  }
  if (selected === 'Toilet Paper' && !wipeActive) {
    // Start wipe animation
    wipeActive = true;
    wipeProgress = 0;
    wipeDirection = Math.random() < 0.5 ? 1 : -1;
    wipeStartTime = performance.now();
    e.preventDefault();
    return;
  }
  if (selected === 'Poop') {
    createPoop(mousePos.x, mousePos.y);
    e.preventDefault();
    return;
  } else if (selected === 'Diarrhea') {
    diarrheaActive = true;
    diarrheaMousePos = mousePos;
    if (!diarrheaInterval) {
      diarrheaInterval = setInterval(() => {
        if (diarrheaActive) {
          createPoop(diarrheaMousePos.x, diarrheaMousePos.y);
        }
      }, 60);
    }
    e.preventDefault();
    return;
  } else if (selected === 'Magnet') {
    magnetActive = true;
    magnetMousePos = mousePos;
    e.preventDefault();
    return;
  } else if (selected === 'Syringe') {
    // Infect poop under cursor
    const found = poopBodies.find(b => Matter.Vertices.contains(b.vertices, mousePos));
    if (found && !found._infected) {
      markInfected(found);
    }
    e.preventDefault();
    return;
  } else if (selected === 'Saw') {
    sawActive = true;
    sawLastPos = mousePos;
    sawCutPoops.clear();
    e.preventDefault();
    return;
  } else if (selected === 'Sandal') {
    // Spawn massive sandal at click position
    massiveSandalActive = true;
    massiveSandalX = mousePos.x;
    massiveSandalY = mousePos.y;
    massiveSandalAnim = 1; // Start dropping
    massiveSandalTimer = 0;
    e.preventDefault();
    return;
  } else if (selected === 'Medkit') {
    useMedicine();
    e.preventDefault();
    return;
  } else if (selected === 'Pencil') {
    pencilActive = true;
    globalThis.pencilMouseDown = true;
    globalThis.pencilMousePos = mousePos;
    pencilLastPos = mousePos;
    currentPencilPath = [];
    e.preventDefault();
    return;
  } else if (selected === 'Eraser') {
    eraserActive = true;
    eraserMousePos = mousePos;
    e.preventDefault();
    return;
  } else if (selected === 'Volcano') {
    // Spawn volcano at click position
    spawnVolcano(mousePos.x, mousePos.y);
    e.preventDefault();
    return;
  } else if (selected === 'JSFB') {
    // JSFB: right click to select a poop and launch car
    const found = poopBodies.find(b => Matter.Vertices.contains(b.vertices, mousePos));
    if (found) {
      // Remove poop from world and list
      World.remove(world, found);
      poopBodies = poopBodies.filter(b => b !== found);
      // Create car body (rectangle)
      const carWidth = 120, carHeight = 48;
      const carX = found.position.x, carY = found.position.y;
      const car = Matter.Bodies.rectangle(carX, carY, carWidth, carHeight, {
        label: 'jsfbCar',
        friction: 0.8,
        restitution: 0.2,
        collisionFilter: { group: 0, category: 0x0001, mask: 0x0001 },
      });
      car.prevPosition = { x: car.position.x, y: car.position.y };
      car.prevAngle = car.angle;
      // Attach poop to car (fixed constraint)
      const poopConstraint = Matter.Constraint.create({
        bodyA: car,
        pointA: { x: 0, y: -10 },
        bodyB: found,
        pointB: { x: 0, y: 0 },
        length: 0,
        stiffness: 1,
        render: { visible: false }
      });
      // Wheels (circles)
      const wheelA = Matter.Bodies.circle(carX - 40, carY + 22, 18, { label: 'jsfbWheel', friction: 1, collisionFilter: { group: 0, category: 0x0001, mask: 0x0001 } });
      const wheelB = Matter.Bodies.circle(carX + 40, carY + 22, 18, { label: 'jsfbWheel', friction: 1, collisionFilter: { group: 0, category: 0x0001, mask: 0x0001 } });
      wheelA.prevPosition = { x: wheelA.position.x, y: wheelA.position.y };
      wheelA.prevAngle = wheelA.angle;
      wheelB.prevPosition = { x: wheelB.position.x, y: wheelB.position.y };
      wheelB.prevAngle = wheelB.angle;
      // Wheel constraints
      const wheelConstraintA = Matter.Constraint.create({ bodyA: car, pointA: { x: -40, y: 22 }, bodyB: wheelA, length: 0, stiffness: 1, render: { visible: false } });
      const wheelConstraintB = Matter.Constraint.create({ bodyA: car, pointA: { x: 40, y: 22 }, bodyB: wheelB, length: 0, stiffness: 1, render: { visible: false } });
      // Add all to world
      World.add(world, [car, found, wheelA, wheelB, poopConstraint, wheelConstraintA, wheelConstraintB]);
      jsfbCars.push({ car, poop: found, wheels: [wheelA, wheelB], constraints: [poopConstraint, wheelConstraintA, wheelConstraintB], exploded: false });
      // Give car a rightward velocity
      Matter.Body.setVelocity(car, { x: 32, y: 0 });
      Matter.Body.setAngularVelocity(car, 0.1);
    e.preventDefault();
    return;
    }
  } else if (selected === 'Toilet' && !toiletActive) {
    toiletActive = true;
    toiletX = e.clientX;
    toiletY = e.clientY;
    toiletAnim = 0;
    toiletTimer = 0;
    e.preventDefault();
    return;
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (e.button !== getItemButton()) return; // Only handle right-click for all items
  if (window.selectedHotbarItem === 'Wind') {
    windActive = false;
  }
  if (window.selectedHotbarItem === 'Diarrhea') {
    diarrheaActive = false;
    if (diarrheaInterval) {
      clearInterval(diarrheaInterval);
      diarrheaInterval = null;
    }
  }
  if (window.selectedHotbarItem === 'Magnet') {
    magnetActive = false;
  }
  if (window.selectedHotbarItem === 'Saw') {
    sawActive = false;
    sawLastPos = null;
    sawCutPoops.clear();
  }
  if (window.selectedHotbarItem === 'Sandal') {
    sandalActive = false;
    sandalLastPos = null;
    sandalSlappedPoops.clear();
    // Note: massive sandal doesn't need mouseup handling as it's a one-click action
  }
  if (window.selectedHotbarItem === 'Pencil') {
    globalThis.pencilMouseDown = false;
    if (currentPencilPath && currentPencilPath.length > 0) {
      drawnWalls.push(currentPencilPath);
    }
    currentPencilPath = null;
    pencilActive = false;
    pencilLastPos = null;
  } else if (window.selectedHotbarItem === 'Eraser') {
    eraserActive = false;
    eraserMousePos = null;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (window.selectedHotbarItem === 'Wind' && windActive) {
    windMouse = { x: e.clientX, y: e.clientY };
  }
  if (window.selectedHotbarItem === 'Diarrhea' && diarrheaActive) {
    diarrheaMousePos = { x: e.clientX, y: e.clientY };
  }
  if (window.selectedHotbarItem === 'Magnet' && magnetActive) {
    magnetMousePos = { x: e.clientX, y: e.clientY };
  }
  if (window.selectedHotbarItem === 'Saw' && sawActive && sawLastPos) {
    const mousePos = { x: e.clientX, y: e.clientY };
    // Check for poops intersected by the saw line
    for (const body of poopBodies) {
      if (sawCutPoops.has(body)) continue;
      if (body._sawed) continue;
      // Simple check: is poop near the line segment
      const bx = body.position.x, by = body.position.y;
      const ax = sawLastPos.x, ay = sawLastPos.y;
      const cx = mousePos.x, cy = mousePos.y;
      const dist = Math.abs((cy-ay)*(bx-ax)-(cx-ax)*(by-ay)) / (Math.hypot(cx-ax, cy-ay)+1e-6);
      if (dist < 40 && Math.min(ax, cx)-60 < bx && bx < Math.max(ax, cx)+60 && Math.min(ay, cy)-60 < by && by < Math.max(ay, cy)+60) {
        // Cut this poop
        sawCutPoops.add(body);
        body._sawed = true;
        // Cut into 3-6 jagged pieces
        const cutAngle = Math.atan2(cy-ay, cx-ax);
        const numPieces = 3 + Math.floor(Math.random() * 4); // 3-6
        // Get triangle verts in world space
        const verts = TRIANGLE.map(v => {
          const x = v.x * Math.cos(body.angle) - v.y * Math.sin(body.angle) + bx;
          const y = v.x * Math.sin(body.angle) + v.y * Math.cos(body.angle) + by;
          return { x, y };
        });
        // Pick a random point inside the triangle as the cut center
        function randomBarycentric() {
          let r1 = Math.random(), r2 = Math.random();
          if (r1 + r2 > 1) { r1 = 1 - r1; r2 = 1 - r2; }
          const a = verts[0], b = verts[1], c = verts[2];
          return {
            x: a.x + r1 * (b.x - a.x) + r2 * (c.x - a.x) + (Math.random()-0.5)*10,
            y: a.y + r1 * (b.y - a.y) + r2 * (c.y - a.y) + (Math.random()-0.5)*10
          };
        }
        const center = randomBarycentric();
        // Make jagged rays from center to triangle edges
        let rays = [];
        for (let i = 0; i < numPieces; ++i) {
          const t = i / numPieces;
          // Interpolate along triangle perimeter
          const edgeIdx = Math.floor(t * 3);
          const edgeT = (t * 3) - edgeIdx;
          const vA = verts[edgeIdx];
          const vB = verts[(edgeIdx+1)%3];
          // Jagged edge
          const edgeX = vA.x + (vB.x - vA.x) * edgeT + (Math.random()-0.5)*8;
          const edgeY = vA.y + (vB.y - vA.y) * edgeT + (Math.random()-0.5)*8;
          rays.push({ x: edgeX, y: edgeY });
        }
        // For each piece, make a polygon from center to two consecutive rays
        for (let i = 0; i < numPieces; ++i) {
          const p1 = rays[i];
          const p2 = rays[(i+1)%numPieces];
          // Jagged edge between p1 and p2
          function jaggedEdge(start, end, segments, jag) {
            const pts = [start];
            for (let j = 1; j < segments; ++j) {
              const tt = j / segments;
              const x = start.x + (end.x - start.x) * tt + (Math.random() - 0.5) * jag;
              const y = start.y + (end.y - start.y) * tt + (Math.random() - 0.5) * jag;
              pts.push({x, y});
            }
            pts.push(end);
            return pts;
          }
          const jagged = jaggedEdge(p1, p2, 4, 7);
          const poly = [center, ...jagged];
          // Center of mass for spawn
          const avg = poly.reduce((acc, v) => ({x: acc.x+v.x, y: acc.y+v.y}), {x:0,y:0});
          avg.x /= poly.length; avg.y /= poly.length;
          // Move poly to local coords for Matter.js
          const localPoly = poly.map(v => ({x: v.x-avg.x, y: v.y-avg.y}));
          const piece = Bodies.fromVertices(avg.x, avg.y, [localPoly], {
            restitution: 0.6,
            friction: 0.3,
            label: 'poop',
            render: { visible: false },
            sleepThreshold: 60,
            collisionFilter: { group: 0, category: 0x0001, mask: 0x0001 }
          });
          piece.poopSkin = body.poopSkin;
          piece._infected = body._infected;
          piece._sawed = true;
          piece._bloody = true;
          piece.prevPosition = { x: piece.position.x, y: piece.position.y };
          piece.prevAngle = piece.angle;
          poopBodies.push(piece);
          World.add(world, piece);
          // Give each piece a little velocity away from the center
          const angle = Math.atan2(avg.y - center.y, avg.x - center.x);
          Body.setVelocity(piece, {
            x: body.velocity.x + Math.cos(angle) * 4,
            y: body.velocity.y + Math.sin(angle) * 4
          });
        }
        // Remove original
        World.remove(world, body);
        removeChainsForPoop(body);
        poopBodies = poopBodies.filter(b => b !== body);
        // Blood spray
        spawnBlood(bx, by, 80, cutAngle);
      }
    }
    sawLastPos = mousePos;
  }

  if (window.selectedHotbarItem === 'Pencil' && pencilActive && globalThis.pencilMouseDown) {
    globalThis.pencilMousePos = { x: e.clientX, y: e.clientY };
  }
  if (window.selectedHotbarItem === 'Eraser' && eraserActive) {
    eraserMousePos = { x: e.clientX, y: e.clientY };
    // Check each path for any wall body within eraser radius
    let erased = false;
    for (let i = drawnWalls.length - 1; i >= 0; --i) {
      const path = drawnWalls[i];
      // Find indices of walls to erase
      const eraseIndices = [];
      for (let j = 0; j < path.length; ++j) {
        if (Math.hypot(path[j].position.x - eraserMousePos.x, path[j].position.y - eraserMousePos.y) < ERASER_RADIUS) {
          eraseIndices.push(j);
        }
      }
      if (eraseIndices.length > 0) {
        // Remove erased walls from world
        for (const idx of eraseIndices) {
          World.remove(world, path[idx]);
        }
        // Split path into subpaths of contiguous non-erased walls
        const subpaths = [];
        let current = [];
        for (let j = 0; j < path.length; ++j) {
          if (eraseIndices.includes(j)) {
            if (current.length > 0) subpaths.push(current);
            current = [];
          } else {
            current.push(path[j]);
          }
        }
        if (current.length > 0) subpaths.push(current);
        // Remove the original path and insert new subpaths (if any)
        drawnWalls.splice(i, 1, ...subpaths.filter(sub => sub.length > 0));
        erased = true;
      }
    }
  }
});

// Prevent context menu on right click
canvas.addEventListener('contextmenu', (e) => e.preventDefault());



// Responsive canvas
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  syncDiscoLightCanvasSize();
  Body.setPosition(boundaries[0], { x: window.innerWidth/2, y: window.innerHeight+25 });
  Body.setPosition(boundaries[1], { x: window.innerWidth/2, y: -25 });
  Body.setPosition(boundaries[2], { x: -25, y: window.innerHeight/2 });
  Body.setPosition(boundaries[3], { x: window.innerWidth+25, y: window.innerHeight/2 });
});

// Option to show/hide hitbox wireframe
let showWireframe = false;

// Collision event handler stub
function onPoopCollision(bodyA, bodyB, event) {
  // Called when two poop bodies collide
  coins += 0.05;
  updateCoinDisplay();
  addXP(0.05);
}

// Listen for collisions between poops
Events.on(engine, 'collisionStart', function(event) {
  for (const pair of event.pairs) {
    const a = pair.bodyA;
    const b = pair.bodyB;
    if (a.label === 'poop' && b.label === 'poop') {
      onPoopCollision(a, b, event);
    }
  }
});

// Custom rendering loop
const ctx = canvas.getContext('2d');
// Offset for poop image to align with triangle hitbox
let poopOffset = -14; // negative moves image up, adjust as needed

function render(alpha = 1) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Remove JS background fill; use CSS background for canvas
  // Blood particles
  for (const p of bloodParticles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / BLOOD_LIFETIME));
    ctx.fillStyle = '#c00';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size || 2, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
  
  // Sandal slap flash effects
  for (const effect of sandalSlapEffects) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, effect.life / effect.maxLife));
    ctx.translate(effect.x, effect.y);
    ctx.rotate(effect.angle);
    
    // Draw a bright flash effect
    ctx.fillStyle = '#ffff00';
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, 0, 40 * (1 - effect.life / effect.maxLife), 0, Math.PI * 2);
    ctx.fill();
    
    // Draw radiating lines
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const length = 60 * (1 - effect.life / effect.maxLife);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  // Medicine particles
  for (const p of medicineParticles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.maxLife));
    ctx.translate(p.x, p.y);
    ctx.fillStyle = '#2ecc40';
    // Draw plus
    ctx.fillRect(-p.size*0.15, -p.size*0.5, p.size*0.3, p.size);
    ctx.fillRect(-p.size*0.5, -p.size*0.15, p.size, p.size*0.3);
    ctx.restore();
  }
  // Draw all poop bodies
  for (const body of poopBodies) {
    // Interpolated position/angle
    const interpX = body.prevPosition.x + (body.position.x - body.prevPosition.x) * alpha;
    const interpY = body.prevPosition.y + (body.position.y - body.prevPosition.y) * alpha;
    const interpAngle = body.prevAngle + (body.angle - body.prevAngle) * alpha;
    ctx.save();
    ctx.translate(interpX, interpY);
    ctx.rotate(interpAngle);
    ctx.globalAlpha = (body === selectedBody) ? 0.7 : 1.0;
    if (body._magicHighlight) {
      ctx.shadowColor = '#ffb300';
      ctx.shadowBlur = 24;
    }
    if (body._infected) {
      ctx.filter = 'hue-rotate(90deg) saturate(2)';
    }
    if (body._slapped) {
      // Add a red glow effect for slapped poops
      ctx.shadowColor = '#ff4444';
      ctx.shadowBlur = 20;
      // Add some rotation animation for slapped poops
      ctx.rotate(Math.sin(performance.now() * 0.01) * 0.1);
    }
    // Draw triangle outline (wireframe)
    if (showWireframe) {
      ctx.beginPath();
      if (body._sawed) {
        // Draw half triangle
        const verts = body.vertices.map(v => ({x: v.x - body.position.x, y: v.y - body.position.y}));
        ctx.moveTo(verts[0].x, verts[0].y);
        for (let i = 1; i < verts.length; ++i) ctx.lineTo(verts[i].x, verts[i].y);
        ctx.closePath();
      } else {
        ctx.moveTo(TRIANGLE[0].x, TRIANGLE[0].y);
        ctx.lineTo(TRIANGLE[1].x, TRIANGLE[1].y);
        ctx.lineTo(TRIANGLE[2].x, TRIANGLE[2].y);
        ctx.closePath();
      }
      ctx.strokeStyle = (body === selectedBody) ? '#ff9800' : '#333';
      ctx.lineWidth = (body === selectedBody) ? 4 : 2;
      ctx.stroke();
    }
    // Draw SVG skin
    let img = invalidImg;
    if (typeof body.poopSkin === 'number' && skinImages[body.poopSkin] && skinImages[body.poopSkin].complete) {
      img = skinImages[body.poopSkin];
    }
    // Draw SVG centered in triangle, offset by poopOffset
    ctx.save();
    ctx.translate(0, poopOffset * (body._sawed ? 0.6 : 1)); // less offset for small
    if (body._sawed) {
      // Clip to half triangle
      ctx.beginPath();
      const verts = body.vertices.map(v => ({x: v.x - body.position.x, y: v.y - body.position.y}));
      ctx.moveTo(verts[0].x, verts[0].y);
      for (let i = 1; i < verts.length; ++i) ctx.lineTo(verts[i].x, verts[i].y);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, -24, -24, 48, 48);
      // Permanent blood overlay
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = '#a00';
      ctx.beginPath();
      ctx.arc(0, 10, 16, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    } else {
      ctx.drawImage(img, -40, -40, 80, 80);
    }
    ctx.restore();
    ctx.restore();
  }
  // Draw all pencil wall paths as lines (smoothed)
  ctx.save();
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  for (const path of drawnWalls) {
    if (path.length > 1) {
      drawSmoothPath(ctx, path, path[0].pencilColor || '#888');
    }
  }
  if (currentPencilPath && currentPencilPath.length > 1) {
    drawSmoothPath(ctx, currentPencilPath, (currentPencilPath[0] && currentPencilPath[0].pencilColor) || (window.pencilColor || '#888'));
  }
  // Draw eraser circle if active
  if (eraserActive && eraserMousePos) {
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(eraserMousePos.x, eraserMousePos.y, ERASER_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#ffb300';
    ctx.fill();
    ctx.restore();
  }
  // Toilet Paper wipe animation overlay
  if (wipeActive) {
    const now = performance.now();
    wipeProgress = Math.min(1, (now - wipeStartTime) / WIPE_DURATION);
    // Wipe position: always draw left-to-right, mirror for right-to-left
    let wipeX = -canvas.width + (canvas.width * 2) * wipeProgress;
    ctx.save();
    if (wipeDirection === -1) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.translate(wipeX, 0);
    // --- Enhanced Toilet Paper Look ---
    // Wavy leading edge
    const amplitude = 24;
    const freq = 2.5; // waves across height
    const edgeX = canvas.width - 8;
    // Draw main paper body
    ctx.save();
    ctx.shadowColor = '#bbb';
    ctx.shadowBlur = 32;
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(edgeX, 0);
    // Wavy edge
    for (let y = 0; y <= canvas.height; y += 4) {
      const wave = Math.sin((y / canvas.height) * Math.PI * freq) * amplitude;
      const x = edgeX + wave;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(40, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height-40);
    ctx.lineTo(0, 40);
    ctx.quadraticCurveTo(0, 0, 40, 0);
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.restore();
    // Dot pattern (embossed look)
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.fillStyle = '#bbb';
    const dotSpacing = 36;
    for (let y = dotSpacing/2; y < canvas.height; y += dotSpacing) {
      for (let x = 40 + dotSpacing/2; x < edgeX - 20; x += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI*2);
        ctx.fill();
      }
    }
    ctx.restore();
    // Perforation lines every 120px
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = '#bbb';
    ctx.setLineDash([8, 10]);
    for (let y = 120; y < canvas.height; y += 120) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(edgeX - 10, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();
    // Draw toilet paper emoji at the leading edge
    ctx.save();
    const tpImg = new window.Image();
    tpImg.src = 'images/icons/toilet-paper.png';
    ctx.drawImage(tpImg, edgeX + 8, canvas.height/2 - 32, 64, 64);
    ctx.restore();
    ctx.restore();
    // When wipe is halfway, remove all poops
    if (wipeProgress > 0.5 && poopBodies.length > 0) {
      for (const body of poopBodies) World.remove(world, body);
      for (const body of poopBodies) removeChainsForPoop(body);
      poopBodies = [];
      selectedBody = null;
    }
    // End animation
    if (wipeProgress >= 1) {
      wipeActive = false;
    }
  }
  // Disco Ball party visuals (enhanced)
  if (discoActive) {
    const now = performance.now();
    const t = now / 1000;
    const discoX = canvas.width / 2;
    const discoY = 110;
    const ballR = 52;

    // Darken the scene so lights pop
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Prepare offscreen light layer
    discoLightCtx.clearRect(0, 0, discoLightCanvas.width, discoLightCanvas.height);
    discoLightCtx.save();
    discoLightCtx.globalCompositeOperation = 'lighter';
    const numBeams = 12;
    for (let i = 0; i < numBeams; i++) {
      const base = t * 0.8 + i * (Math.PI * 2 / numBeams);
      const angle = base + Math.sin(t * 1.7 + i) * 0.25; // subtle wobble
      const len = Math.max(canvas.width, canvas.height) * 1.2;
      const near = 10; // near width
      const far = 240 + 60 * Math.sin(t * 0.9 + i);
      const x0 = discoX + Math.cos(angle) * (ballR + 2);
      const y0 = discoY + Math.sin(angle) * (ballR + 2);
      const x1 = x0 + Math.cos(angle) * len;
      const y1 = y0 + Math.sin(angle) * len;
      const nx = Math.cos(angle + Math.PI / 2);
      const ny = Math.sin(angle + Math.PI / 2);

      const grad = discoLightCtx.createLinearGradient(x0, y0, x1, y1);
      const hue = (t * 120 + i * (360 / numBeams)) % 360;
      grad.addColorStop(0.0, `hsla(${hue},100%,70%,0.55)`);
      grad.addColorStop(0.25, `hsla(${hue},100%,60%,0.28)`);
      grad.addColorStop(0.6, `hsla(${hue},100%,50%,0.12)`);
      grad.addColorStop(1.0, `hsla(${hue},100%,50%,0.0)`);

      discoLightCtx.beginPath();
      discoLightCtx.moveTo(x0 + nx * near, y0 + ny * near);
      discoLightCtx.lineTo(x1 + nx * far, y1 + ny * far);
      discoLightCtx.lineTo(x1 - nx * far, y1 - ny * far);
      discoLightCtx.lineTo(x0 - nx * near, y0 - ny * near);
      discoLightCtx.closePath();
      discoLightCtx.fillStyle = grad;
      discoLightCtx.fill();
    }
    discoLightCtx.restore();

    // Realistic disco ball
    ctx.save();
    ctx.translate(discoX, discoY);
    ctx.rotate(t * 1.2);

    // Hanger
    ctx.save();
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -ballR - 18);
    ctx.lineTo(0, -ballR - 60);
    ctx.stroke();
    ctx.restore();

    // Spherical shading
    const shade = ctx.createRadialGradient(-ballR * 0.35, -ballR * 0.45, ballR * 0.3, 0, 0, ballR);
    shade.addColorStop(0.0, '#ffffff');
    shade.addColorStop(0.35, '#e8e8e8');
    shade.addColorStop(1.0, '#9aa');
    ctx.beginPath();
    ctx.arc(0, 0, ballR, 0, Math.PI * 2);
    ctx.fillStyle = shade;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#789';
    ctx.stroke();

    // Mirror tiles (sparkly)
    const cols = 16;
    const rows = 12;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const u = (c + 0.5) / cols - 0.5;
        const v = (r + 0.5) / rows - 0.5;
        const theta = u * Math.PI * 2;
        const phi = v * Math.PI; // simple projection
        const x = Math.cos(theta) * Math.cos(phi) * ballR * 0.9;
        const y = Math.sin(phi) * ballR * 0.9;
        const size = 5 + 1.5 * Math.sin(t * 5 + r * 7 + c * 11);
        ctx.save();
        ctx.translate(x, y * 0.85); // squish toward poles
        const sparkle = 0.65 + 0.35 * Math.sin(t * 8 + c * 2 + r * 3);
        const hue = (t * 180 + c * 22 + r * 11) % 360;
        ctx.fillStyle = `hsla(${hue},90%,${60 + sparkle * 20}%,${0.65 + 0.2 * sparkle})`;
        ctx.fillRect(-size / 2, -size / 2, size, size);
        ctx.restore();
      }
    }

    // Specular highlight
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(-ballR * 0.3, -ballR * 0.4, 8 + 4 * Math.sin(t * 6), 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    // Moving spotlights on the floor (offscreen light layer)
    discoLightCtx.save();
    discoLightCtx.globalCompositeOperation = 'lighter';
    const numSpots = 6;
    for (let i = 0; i < numSpots; i++) {
      const ang = t * 0.7 + (i * Math.PI * 2) / numSpots;
      const radius = Math.min(canvas.width, canvas.height) * 0.35;
      const sx = discoX + Math.cos(ang) * radius;
      const sy = canvas.height * 0.68 + Math.sin(ang * 1.7) * 60;
      const spotR = 110 + 30 * Math.sin(t * 2 + i);
      const grad2 = discoLightCtx.createRadialGradient(sx, sy, 0, sx, sy, spotR);
      const hue2 = (t * 140 + i * 60) % 360;
      grad2.addColorStop(0.0, `hsla(${hue2},100%,65%,0.45)`);
      grad2.addColorStop(0.4, `hsla(${hue2},100%,55%,0.20)`);
      grad2.addColorStop(1.0, `hsla(${hue2},100%,50%,0.0)`);
      discoLightCtx.fillStyle = grad2;
      discoLightCtx.beginPath();
      discoLightCtx.arc(sx, sy, spotR, 0, Math.PI * 2);
      discoLightCtx.fill();
    }
    discoLightCtx.restore();

    // Composite blurred light layer on top
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.filter = 'blur(32px)';
    ctx.globalAlpha = 0.9;
    ctx.drawImage(discoLightCanvas, 0, 0);
    ctx.restore();

    // Countdown in vibrant color
    const seconds = Math.ceil(discoCountdown / 1000);
    ctx.save();
    ctx.font = '900 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 18;
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = `hsl(${(now / 2) % 360},100%,60%)`;
    ctx.fillText(seconds > 0 ? seconds : '🎉', discoX, discoY + 140);
    ctx.restore();
  }
  // Draw chains
  ctx.save();
  for (const chain of chains) {
    // Get all points: a, ...links..., b
    const points = [chain.a, ...chain.links, chain.b].map(body => {
      return {
        x: body.prevPosition.x + (body.position.x - body.prevPosition.x) * alpha,
        y: body.prevPosition.y + (body.position.y - body.prevPosition.y) * alpha
      };
    });
    // Draw smooth curve through points (quadratic for each segment)
    ctx.save();
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; ++i) {
      const midX = (points[i].x + points[i+1].x) / 2;
      const midY = (points[i].y + points[i+1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }
    ctx.lineTo(points[points.length-1].x, points[points.length-1].y);
    ctx.stroke();
    // Draw chain links as circles
    for (let i = 1; i < points.length-1; ++i) {
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 7, 0, Math.PI*2);
      ctx.fillStyle = (i%2===0) ? '#bbb' : '#888';
      ctx.fill();
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
  // Draw chain selection indicator
  if (window.selectedHotbarItem === 'Chain' && chainFirstPoop) {
    ctx.save();
    ctx.strokeStyle = '#ffb300';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(chainFirstPoop.position.x, chainFirstPoop.position.y, 48, 0, Math.PI*2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  // Draw JSFB cars
  for (const jsfbCar of jsfbCars) {
    const car = jsfbCar.car;
    const wheels = jsfbCar.wheels;
    // Interpolated positions
    const carX = car.prevPosition.x + (car.position.x - car.prevPosition.x) * alpha;
    const carY = car.prevPosition.y + (car.position.y - car.prevPosition.y) * alpha;
    const carAngle = car.prevAngle + (car.angle - car.prevAngle) * alpha;
    ctx.save();
    ctx.translate(carX, carY);
    ctx.rotate(carAngle);
    // Car body
    ctx.save();
    ctx.fillStyle = '#444';
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(-60, -24, 120, 48, 16);
    ctx.fill();
    ctx.stroke();
    // Windows
    ctx.fillStyle = '#bde0fe';
    ctx.beginPath();
    ctx.moveTo(-30, -20); ctx.lineTo(30, -20); ctx.lineTo(20, 0); ctx.lineTo(-20, 0); ctx.closePath();
    ctx.fill();
    ctx.restore();
    // Draw poop inside car
    if (jsfbCar.poop) {
      ctx.save();
      ctx.translate(0, -10);
      ctx.scale(0.6, 0.6);
      let img = invalidImg;
      if (typeof jsfbCar.poop.poopSkin === 'number' && skinImages[jsfbCar.poop.poopSkin] && skinImages[jsfbCar.poop.poopSkin].complete) {
        img = skinImages[jsfbCar.poop.poopSkin];
      }
      ctx.drawImage(img, -40, -40, 80, 80);
      ctx.restore();
    }
    ctx.restore();
    // Wheels
    for (const wheel of wheels) {
      const wx = wheel.prevPosition.x + (wheel.position.x - wheel.prevPosition.x) * alpha;
      const wy = wheel.prevPosition.y + (wheel.position.y - wheel.prevPosition.y) * alpha;
      ctx.save();
      ctx.translate(wx, wy);
      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI*2);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#888';
      ctx.stroke();
      ctx.restore();
    }
  }
  // Draw JSFB explosions
  for (const jsfbExplosion of jsfbExplosions) {
    ctx.save();
    ctx.globalAlpha = 0.7 * (1 - jsfbExplosion.t / 60);
    for (let i = 0; i < 24; ++i) {
      const angle = (i / 24) * Math.PI * 2;
      const r = 40 + Math.random() * 60;
      ctx.beginPath();
      ctx.arc(jsfbExplosion.x + Math.cos(angle) * r, jsfbExplosion.y + Math.sin(angle) * r, 12 + Math.random() * 8, 0, Math.PI*2);
      ctx.fillStyle = '#c00';
      ctx.fill();
    }
    ctx.restore();
  }
  // JSFB beginner symbol particles
  for (const p of jsfbParticles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.maxLife));
    ctx.translate(p.x, p.y);
    ctx.rotate((p.maxLife - p.life) * 0.08);
    ctx.drawImage(jsfbImg, -p.size/2, -p.size/2, p.size, p.size);
    ctx.restore();
  }
  // Wind tool visual effect
  if (windActive && window.selectedHotbarItem === 'Wind') {
    const cx = canvas.width/2, cy = canvas.height/2;
    const dx = windMouse.x - cx;
    const dy = windMouse.y - cy;
    const dist = Math.hypot(dx, dy);
    // Draw wind direction arrow
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#7df';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + dx*0.7, cy + dy*0.7);
    ctx.stroke();
    // Arrow head
    ctx.save();
    ctx.translate(cx + dx*0.7, cy + dy*0.7);
    ctx.rotate(Math.atan2(dy, dx));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-32, 12);
    ctx.lineTo(-32, -12);
    ctx.closePath();
    ctx.fillStyle = '#7df';
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.restore();
    ctx.restore();
  }
  // Wind particles
  for (const p of windParticles) {
    ctx.save();
    ctx.globalAlpha = p.alpha * (p.life/p.maxLife);
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.size*1.2, p.size*0.7, Math.atan2(p.vy, p.vx), 0, Math.PI*2);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.restore();
  }
  // Volcano smoke rendering
  for (const s of volcanoSmokeParticles) {
    ctx.save();
    const lifeT = s.life / s.maxLife; // 1..0
    const alpha = Math.pow(lifeT, 1.5) * 0.9; // fade out smoothly
    const size = s.size * (1 + (1 - lifeT) * 0.8); // expand as it fades
    ctx.globalAlpha = alpha;
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);
    // Soft radial gradient for volumetric puff
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    const g = Math.max(160, Math.min(235, s.gray));
    grad.addColorStop(0.0, `rgba(${g},${g},${g},0.8)`);
    grad.addColorStop(0.4, `rgba(${g},${g},${g},0.5)`);
    grad.addColorStop(1.0, `rgba(${g},${g},${g},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // Volcano rendering
  for (let i = volcanoes.length - 1; i >= 0; --i) {
    const v = volcanoes[i];
    // Interpolated position
    const vx = v.body.prevPosition.x + (v.body.position.x - v.body.prevPosition.x) * alpha;
    const vy = v.body.prevPosition.y + (v.body.position.y - v.body.prevPosition.y) * alpha;
    const va = v.body.prevAngle + (v.body.angle - v.body.prevAngle) * alpha;
    ctx.save();
    ctx.translate(vx, vy);
    ctx.rotate(va);
    // Draw volcano image
    if (volcanoImg.complete && volcanoImg.naturalWidth > 0) {
      ctx.drawImage(volcanoImg, -VOLCANO_WIDTH/2, -VOLCANO_HEIGHT/2, VOLCANO_WIDTH, VOLCANO_HEIGHT);
    } else {
      // Fallback simple volcano shape
      ctx.fillStyle = '#533';
      ctx.beginPath();
      ctx.moveTo(-VOLCANO_WIDTH*0.45, VOLCANO_HEIGHT*0.5);
      ctx.lineTo(0, -VOLCANO_HEIGHT*0.4);
      ctx.lineTo(VOLCANO_WIDTH*0.45, VOLCANO_HEIGHT*0.5);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
  // Toilet rendering
  if (toiletActive) {
    const bowlX = toiletX;
    const bowlY = toiletY;
    const bowlW = TOILET_WIDTH();
    const bowlH = TOILET_HEIGHT();
    // Shadow
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.ellipse(bowlX, bowlY+bowlH*0.38, bowlW*0.38, bowlH*0.18, 0, 0, Math.PI*2);
    ctx.fillStyle = '#222';
    ctx.fill();
    ctx.restore();
    // Toilet image
    ctx.save();
    if (toiletImg.complete && toiletImg.naturalWidth > 0) {
      ctx.drawImage(toiletImg, bowlX - bowlW/2, bowlY - bowlH/2, bowlW, bowlH);
    } else {
      // Optional: fallback (draw a placeholder)
      ctx.fillStyle = '#ccc';
      ctx.fillRect(bowlX - bowlW/2, bowlY - bowlH/2, bowlW, bowlH);
      ctx.font = `${Math.floor(bowlH/2)}px sans-serif`;
      ctx.fillStyle = '#888';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🚽', bowlX, bowlY);
    }
    ctx.shadowBlur = 0;
    ctx.restore();
    // Swirling poops
    for (const p of toiletSplashParticles) {
      const t = p.t;
      const swirlR = bowlW*0.13 * (1-t);
      const swirlA = Math.PI*2 * t * 2 + (p.poop ? p.poop.id : 0);
      const px = bowlX + Math.cos(swirlA) * swirlR;
      const py = bowlY+20 + Math.sin(swirlA) * swirlR * 0.7 + t*40;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(swirlA + t*2);
      ctx.scale(0.5*(1-t), 0.5*(1-t));
      let img = invalidImg;
      if (p.poop && typeof p.poop.poopSkin === 'number' && skinImages[p.poop.poopSkin] && skinImages[p.poop.poopSkin].complete) {
        img = skinImages[p.poop.poopSkin];
      }
      ctx.drawImage(img, -40, -40, 80, 80);
      ctx.restore();
    }
  }
  // Toilet splash particles
  for (const p of toiletSplashParticles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.maxLife)) * 0.7;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
  }
  
  // Sandal slap visual effect
  if (sandalActive && sandalLastPos) {
    const mousePos = { x: mouse.x, y: mouse.y };
    if (mousePos.x && mousePos.y) {
      ctx.save();
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#ff6b35';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.moveTo(sandalLastPos.x, sandalLastPos.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      
      // Draw sandal icon at the end of the line
      ctx.save();
      ctx.translate(mousePos.x, mousePos.y);
      ctx.rotate(Math.atan2(mousePos.y - sandalLastPos.y, mousePos.x - sandalLastPos.x) - Math.PI/4);
      ctx.scale(0.8, 0.8);
      if (sandalImg.complete && sandalImg.naturalWidth > 0) {
        ctx.drawImage(sandalImg, -24, -24, 48, 48);
      } else {
        // Fallback simple shape
        ctx.fillStyle = '#ff6b35';
        ctx.strokeStyle = '#d45a2b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, 20, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
      
      ctx.restore();
    }
  }
  
  // Massive sandal rendering
  if (massiveSandalActive) {
    const sandalSize = 200;
    const sandalRadius = sandalSize / 2;
    
    ctx.save();
    
    // Add shadow for depth
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 10;
    
    // Draw the massive sandal
    ctx.translate(massiveSandalX, massiveSandalY);
    
    // Rotate the sandal -45 degrees
    ctx.rotate(-Math.PI / 4);
    
    // Draw the sandal image
    if (sandalImg.complete && sandalImg.naturalWidth > 0) {
      ctx.drawImage(sandalImg, -sandalSize/2, -sandalSize/2, sandalSize, sandalSize);
    } else {
      // Fallback: simple shape if image not ready
      ctx.fillStyle = '#ff6b35';
      ctx.strokeStyle = '#d45a2b';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.ellipse(0, 0, sandalRadius, sandalRadius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    
    ctx.restore();
  }

  // Moyai rendering
  if (moyaiActive) {
    ctx.save();
    ctx.globalAlpha = 0.98;
    ctx.font = `${MOYAI_SIZE}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#222';
    ctx.shadowBlur = 24;
    ctx.fillText(MOYAI_EMOJI, moyaiX, moyaiY);
    ctx.restore();
  }
}

// Easy place to add custom per-frame behavior
function customUpdate() {
  // Moderate angular velocity damping: allow rotation, but prevent endless rolling
  for (const body of poopBodies) {
    Body.setAngularVelocity(body, body.angularVelocity * 0.95); // gentle damping
  }
  // Magnet effect - gravity force + gradual velocity adjustment toward cursor
  if (magnetActive) {
    for (const body of poopBodies) {
      const dx = magnetMousePos.x - body.position.x;
      const dy = magnetMousePos.y - body.position.y;
      const distSq = dx*dx + dy*dy;
      const dist = Math.sqrt(distSq) + 1e-6;
      
      // Apply gravity-style force
      const strength = 2000 / (distSq + 20000);
      const fx = dx / dist * strength;
      const fy = dy / dist * strength;
      Body.applyForce(body, body.position, { x: fx, y: fy });
      
      // Gradually adjust velocity to favor moving toward cursor
      const velocityAdjustment = 0.02; // Small adjustment per frame
      const currentSpeed = Math.sqrt(body.velocity.x * body.velocity.x + body.velocity.y * body.velocity.y);
      const targetSpeed = Math.max(currentSpeed, 3); // Maintain some speed
      const desiredVx = (dx / dist) * targetSpeed;
      const desiredVy = (dy / dist) * targetSpeed;
      
      // Blend current velocity toward desired direction
      const newVx = body.velocity.x * (1 - velocityAdjustment) + desiredVx * velocityAdjustment;
      const newVy = body.velocity.y * (1 - velocityAdjustment) + desiredVy * velocityAdjustment;
      
      Body.setVelocity(body, { x: newVx, y: newVy });
    }
  }
  // Infection spread
  const now = performance.now();
  // Remove old contacts
  for (const [key, val] of infectionContacts.entries()) {
    if (now - val.start > INFECTION_TIME + 500) infectionContacts.delete(key);
  }
  // Check for infected/non-infected pairs in contact
  for (let i = 0; i < poopBodies.length; ++i) {
    for (let j = i + 1; j < poopBodies.length; ++j) {
      const a = poopBodies[i], b = poopBodies[j];
      if (a._infected && !b._infected || !a._infected && b._infected) {
        // Check overlap (simple AABB for performance)
        const dx = a.position.x - b.position.x;
        const dy = a.position.y - b.position.y;
        if (Math.abs(dx) < 60 && Math.abs(dy) < 60) {
          // touching
          const key = a.id + '-' + b.id;
          if (!infectionContacts.has(key)) {
            infectionContacts.set(key, {start: now, a, b});
          } else {
            const contact = infectionContacts.get(key);
            if (now - contact.start > INFECTION_TIME) {
              markInfected(a);
              markInfected(b);
            }
          }
        } else {
          infectionContacts.delete(a.id + '-' + b.id);
        }
      }
    }
  }
  // Blood particles
  for (let i = bloodParticles.length - 1; i >= 0; --i) {
    const p = bloodParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.92;
    p.vy *= 0.92;
    p.vy += 0.5; // gravity
    p.life--;
    if (p.life <= 0) bloodParticles.splice(i, 1);
  }
  // Medicine particles
  for (let i = medicineParticles.length - 1; i >= 0; --i) {
    const p = medicineParticles[i];
    p.life--;
    if (p.life <= 0) medicineParticles.splice(i, 1);
  }
  // Volcano smoke particles
  for (let i = volcanoSmokeParticles.length - 1; i >= 0; --i) {
    const s = volcanoSmokeParticles[i];
    s.x += s.vx;
    s.y += s.vy;
    // Air resistance and buoyancy
    s.vx *= 0.985;
    s.vy = s.vy * 0.985 - 0.02; // slowly rise
    s.angle += s.spin;
    s.life--;
    if (s.life <= 0) volcanoSmokeParticles.splice(i, 1);
  }
  
  // Sandal slap effects
  for (let i = sandalSlapEffects.length - 1; i >= 0; --i) {
    const effect = sandalSlapEffects[i];
    effect.life--;
    if (effect.life <= 0) sandalSlapEffects.splice(i, 1);
  }
  // Add your own behaviors here!
  // JSFB car logic
  for (let i = jsfbCars.length - 1; i >= 0; --i) {
    const jsfbCar = jsfbCars[i];
    if (!jsfbCar.exploded) {
      // Keep car moving right
      Matter.Body.applyForce(jsfbCar.car, jsfbCar.car.position, { x: 0.08, y: 0 });
      // Check for collision with right wall
      if (jsfbCar.car.position.x > window.innerWidth - 80) {
        // Explode!
        jsfbCar.exploded = true;
        // Remove car, wheels, constraints, and poop
        World.remove(world, jsfbCar.car);
        World.remove(world, jsfbCar.poop);
        removeChainsForPoop(jsfbCar.poop);
        for (const w of jsfbCar.wheels) World.remove(world, w);
        for (const c of jsfbCar.constraints) World.remove(world, c);
        // Spawn explosion (blood + debris)
        spawnBlood(jsfbCar.car.position.x, jsfbCar.car.position.y, 120, Math.PI);
        jsfbExplosions.push({ x: jsfbCar.car.position.x, y: jsfbCar.car.position.y, t: 0 });
        // JSFB beginner symbol particles
        for (let i = 0; i < 36; ++i) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 8 + Math.random() * 10;
          jsfbParticles.push({
            x: jsfbCar.car.position.x,
            y: jsfbCar.car.position.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 32 + Math.random() * 32,
            life: 48 + Math.random() * 24,
            maxLife: 48 + Math.random() * 24
          });
        }
        jsfbCars.splice(i, 1);
      }
    }
  }
  // Animate JSFB explosion debris
  for (let i = jsfbExplosions.length - 1; i >= 0; --i) {
    jsfbExplosions[i].t += 1;
    if (jsfbExplosions[i].t > 60) jsfbExplosions.splice(i, 1);
  }
  // JSFB beginner symbol particles
  for (let i = jsfbParticles.length - 1; i >= 0; --i) {
    const p = jsfbParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.93;
    p.vy *= 0.93;
    p.vy += 0.3; // gravity
    p.life--;
    if (p.life <= 0) jsfbParticles.splice(i, 1);
  }
  // Wind tool logic
  if (windActive && window.selectedHotbarItem === 'Wind') {
    const cx = window.innerWidth/2, cy = window.innerHeight/2;
    const dx = windMouse.x - cx;
    const dy = windMouse.y - cy;
    const dist = Math.hypot(dx, dy) + 1e-6;
    const dirX = dx / dist, dirY = dy / dist;
    // Wind force
    for (const body of poopBodies) {
      Matter.Body.applyForce(body, body.position, { x: dirX * 0.025, y: dirY * 0.025 });
    }
    // Wind particles
    for (let i = 0; i < 4; ++i) {
      const angle = Math.atan2(dy, dx) + (Math.random()-0.5)*0.3;
      const r = 80 + Math.random()*40;
      windParticles.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        vx: dirX * (8+Math.random()*4) + (Math.random()-0.5)*2,
        vy: dirY * (8+Math.random()*4) + (Math.random()-0.5)*2,
        life: 32 + Math.random()*12,
        maxLife: 32 + Math.random()*12,
        size: 18 + Math.random()*10,
        color: `hsl(${200+Math.random()*60},100%,${60+Math.random()*20}%)`,
        alpha: 0.18 + Math.random()*0.18
      });
    }
  }
  // Animate wind particles
  for (let i = windParticles.length - 1; i >= 0; --i) {
    const p = windParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.97;
    p.vy *= 0.97;
    p.life--;
    if (p.life <= 0) windParticles.splice(i, 1);
  }
  // Disco Ball party logic
  if (discoActive) {
    const now = performance.now();
    discoCountdown = Math.max(0, discoDuration - (now - discoStartTime));
    // Make all poops dance (wiggle/rotate)
    for (const body of poopBodies) {
      const t = (now / 200) + body.id * 0.2;
      Body.setAngle(body, Math.sin(t) * 0.5);
      Body.setAngularVelocity(body, 0);
      Body.setVelocity(body, {
        x: Math.sin(t * 2 + body.id) * 2,
        y: body.velocity.y
      });
    }
    if (discoCountdown <= 0) {
      discoActive = false;
    }
  }
  // Toilet logic
  if (toiletActive) {
    const bowlX = toiletX;
    const bowlY = toiletY;
    const bowlR = TOILET_WIDTH()/2 * 0.7;
    // Detect poops in bowl
    for (let i = poopBodies.length-1; i >= 0; --i) {
      const b = poopBodies[i];
      const dx = b.position.x - bowlX;
      const dy = b.position.y - (bowlY+20);
      if (Math.abs(dx) < bowlR*0.8 && dy > -bowlR*0.5 && dy < bowlR*0.5) {
        // Splash and remove
        for (let j = 0; j < 18; ++j) {
          // Only allow angles that result in vy < 0 (upwards)
          // vy = Math.sin(angle) * speed - 2 < 0
          // => Math.sin(angle) * speed < 2
          // For simplicity, restrict angle to upward half-circle
          const angle = Math.PI * (Math.random() - 0.5); // -90deg to +90deg (upwards)
          const speed = 7 + Math.random() * 7;
          const vy = Math.sin(angle) * speed - 2;
          // Ensure vy is negative (upwards)
          if (vy < 0) {
            toiletSplashParticles.push({
              x: b.position.x,
              y: b.position.y,
              vx: Math.cos(angle) * speed,
              vy: vy,
              size: 10 + Math.random()*8,
              color: `hsl(${200+Math.random()*40},100%,${60+Math.random()*20}%)`,
              life: 32 + Math.random()*12,
              maxLife: 32 + Math.random()*12
            });
          } else {
            j--; // retry this particle
          }
        }
        World.remove(world, b);
        removeChainsForPoop(b);
        poopBodies.splice(i, 1);
      }
    }
    // If any poops splashed, start flush timer
    if (toiletAnim === 0) {
      toiletAnim = 1;
      toiletTimer = 60;
    }
    if (toiletAnim === 1) {
      toiletTimer--;
      if (toiletTimer <= 0) {
        toiletAnim = 2;
      }
    }
    if (toiletAnim === 2) {
      toiletY += 18;
      if (toiletY > window.innerHeight + TOILET_HEIGHT()) {
        toiletActive = false;
      }
    }
  }
  // Animate toilet splash particles
  for (let i = toiletSplashParticles.length - 1; i >= 0; --i) {
    const p = toiletSplashParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.93;
    p.vy *= 0.93;
    p.vy += 0.3;
    p.life--;
    if (p.life <= 0) toiletSplashParticles.splice(i, 1);
  }
  // Pencil tool drawing logic (moved from mousemove)
  if (pencilActive && globalThis.pencilMouseDown && globalThis.pencilMousePos) {
    const mousePos = globalThis.pencilMousePos;
    if (pencilLastPos) {
      const dx = mousePos.x - pencilLastPos.x;
      const dy = mousePos.y - pencilLastPos.y;
      const dist = Math.hypot(dx, dy);
      // Increase sampling density for smoother curves
      const stepSpacing = 4; // was 8
      const steps = Math.max(1, Math.floor(dist / stepSpacing));
      for (let i = 1; i <= steps; ++i) {
        const t = i / steps;
        const x = pencilLastPos.x + dx * t;
        const y = pencilLastPos.y + dy * t;
        // Create a small static circle body
        const wall = Bodies.circle(x, y, 5, { isStatic: true, label: 'drawnWall', render: { visible: false } });
        wall.pencilColor = window.pencilColor || '#888';
        if (currentPencilPath) currentPencilPath.push(wall);
        World.add(world, wall);
      }
    }
    pencilLastPos = { ...mousePos };
  }
  
  // Massive sandal logic
  if (massiveSandalActive) {
    const sandalSize = 200; // Massive sandal size
    const sandalRadius = sandalSize / 2;
    
    if (massiveSandalAnim === 1) {
      // Dropping phase
      massiveSandalY += 15; // Drop speed
      if (massiveSandalY >= window.innerHeight - sandalRadius) {
        massiveSandalAnim = 2; // Start squishing
        massiveSandalTimer = 30; // Squish duration
      }
    } else if (massiveSandalAnim === 2) {
      // Squishing phase
      massiveSandalTimer--;
      
      // Check for poops under the sandal
      for (let i = poopBodies.length - 1; i >= 0; --i) {
        const poop = poopBodies[i];
        const dx = poop.position.x - massiveSandalX;
        const dy = poop.position.y - massiveSandalY;
        const dist = Math.hypot(dx, dy);
        
        if (dist < sandalRadius) {
          // Squish this poop!
          spawnBlood(poop.position.x, poop.position.y, 20, Math.atan2(dy, dx));
          playScreamSound();
          
          // Add coins and XP
          coins += 5;
          updateCoinDisplay();
          addXP(10);
          
          // Remove the squished poop
          World.remove(world, poop);
          removeChainsForPoop(poop);
          poopBodies.splice(i, 1);
        }
      }
      
      if (massiveSandalTimer <= 0) {
        massiveSandalAnim = 3; // Start lifting
        massiveSandalTimer = 20; // Lift duration
      }
    } else if (massiveSandalAnim === 3) {
      // Lifting phase
      massiveSandalY -= 10; // Lift speed
      massiveSandalTimer--;
      
      if (massiveSandalY < -sandalRadius || massiveSandalTimer <= 0) {
        massiveSandalActive = false; // Done
      }
    }
  }
  // Volcano logic
  for (let i = volcanoes.length - 1; i >= 0; --i) {
    const v = volcanoes[i];
    // Keep upright and prevent spin/slide
    Body.setAngle(v.body, 0);
    Body.setAngularVelocity(v.body, 0);

    if (v.phase === 'active') {
      v.timeAlive++;
      // Emit bursts until total of 10 poops are spawned
      if (v.emitted < 10 && v.timeAlive % 12 === 0) {
        const toSpawn = Math.min(2, 10 - v.emitted); // 2 per burst
        for (let k = 0; k < toSpawn; k++) {
          const topX = v.body.position.x + (Math.random() - 0.5) * (VOLCANO_WIDTH * 0.25);
          const topY = v.body.position.y - VOLCANO_HEIGHT * 0.58;
          const poop = createPoop(topX, topY);
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5;
          const speed = 12 + Math.random() * 6;
          Body.setVelocity(poop, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed });
          v.emitted++;
          
          // Check if this was the last poop (10th poop)
          if (v.emitted >= 10) {
            // Immediately trigger explosion phase
            v.phase = 'explode';
            v.explodeStartTime = performance.now(); // Track when explosion started
            // Instantly snap volcano to bottom of screen using y offset variable
            const bottomY = window.innerHeight - VOLCANO_HEIGHT * VOLCANO_Y_OFFSET;
            Body.setPosition(v.body, { x: v.body.position.x, y: bottomY });
            // Spawn smoke particles
            const originX = v.body.position.x;
            const originY = v.body.position.y - VOLCANO_HEIGHT * 0.45;
            const puffs = 80;
            for (let p = 0; p < puffs; p++) {
              const a = -Math.PI / 2 + (Math.random() - 0.5) * 0.9;
              const speed = 2 + Math.random() * 3;
              const size = 16 + Math.random() * 22;
              const life = 70 + Math.random() * 40;
              const hueShift = Math.random() * 6 - 3; // subtle hue variance
              const gray = 200 + Math.random() * 40; // gray/white
              volcanoSmokeParticles.push({
                x: originX,
                y: originY,
                vx: Math.cos(a) * speed,
                vy: Math.sin(a) * speed - 0.3,
                size,
                life,
                maxLife: life,
                gray,
                hueShift,
                spin: (Math.random() - 0.5) * 0.04,
                angle: Math.random() * Math.PI * 2
              });
            }
            break; // Exit the loop since we've spawned the last poop
          }
        }
      }
      // Keep volcano immovable at bottom of screen using y offset variable
      const bottomY = window.innerHeight - VOLCANO_HEIGHT * VOLCANO_Y_OFFSET;
      Body.setPosition(v.body, { x: v.body.position.x, y: bottomY });
    } else if (v.phase === 'explode') {
      // Check if 5 seconds have passed since explosion started
      if (performance.now() - v.explodeStartTime >= 5000) {
        // Remove volcano after 5 seconds
        World.remove(world, v.body);
        volcanoes.splice(i, 1);
        continue;
      }
    }

    // Store prev for interpolation
    v.body.prevPosition = { x: v.body.position.x, y: v.body.position.y };
    v.body.prevAngle = v.body.angle;
  }

  // Moyai logic
  if (moyaiActive) {
    if (moyaiAnim === 1) { // Hopping
      // Move towards target
      const dx = moyaiTargetX - moyaiX;
      const dy = moyaiTargetY - moyaiY;
      const dist = Math.hypot(dx, dy);
      const hopSpeed = 32;
      if (dist > hopSpeed) {
        moyaiX += (dx / dist) * hopSpeed;
        moyaiY += (dy / dist) * hopSpeed;
      } else {
        // Landed
        moyaiX = moyaiTargetX;
        moyaiY = moyaiTargetY;
        moyaiAnim = 2;
        moyaiTimer = 18; // Squish duration
      }
    } else if (moyaiAnim === 2) { // Squishing
      moyaiTimer--;
      // Squish poops under the moyai
      for (let i = poopBodies.length - 1; i >= 0; --i) {
        const poop = poopBodies[i];
        const dx = poop.position.x - moyaiX;
        const dy = poop.position.y - moyaiY;
        const dist = Math.hypot(dx, dy);
        if (dist < MOYAI_RADIUS * 0.85) {
          spawnBlood(poop.position.x, poop.position.y, 32, Math.atan2(dy, dx));
          playScreamSound();
          coins += 10;
          updateCoinDisplay();
          addXP(20);
          World.remove(world, poop);
          removeChainsForPoop(poop);
          poopBodies.splice(i, 1);
        }
      }
      if (moyaiTimer <= 0) {
        if (moyaiHopsLeft > 0) {
          // Pick a new target and hop again
          moyaiTargetX = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
          moyaiTargetY = window.innerHeight * 0.5 + (Math.random() - 0.5) * 120;
          moyaiAnim = 1;
          moyaiHopsLeft--;
        } else {
          moyaiAnim = 3; // Disappear
          moyaiTimer = 30;
        }
      }
    } else if (moyaiAnim === 3) { // Disappearing
      moyaiTimer--;
      moyaiY -= 18; // Move up
      if (moyaiTimer <= 0 || moyaiY < -MOYAI_RADIUS) {
        moyaiActive = false;
      }
    }
  }
}

// Background control (gradient or developer backgrounds 0-11)
let backgroundColor = '#e0e0e0';
function setBackground(color) {
  backgroundColor = color;
}

function applyBackgroundSelection() {
  const selection = (localStorage.getItem('poop-bg-source') || 'Gradient');
  const isGradient = String(selection).toLowerCase() === 'gradient';
  if (isGradient) {
    // Match CSS gradient
    canvas.style.background = 'linear-gradient(to bottom, #303438 0%, #2b2f33 25%, #262a2e 50%, #22262a 75%, #20262A 100%)';
    // Reset image-specific styles
    canvas.style.backgroundSize = '';
    canvas.style.backgroundRepeat = '';
    canvas.style.backgroundPosition = '';
  } else {
    const idx = String(selection).trim();
    canvas.style.background = `url('images/bg/${idx}.svg') center center / cover no-repeat`;
  }
}

// Remove poops that are far off-screen (e.g., >2x window size)
function cleanupPoops() {
  const margin = 2 * Math.max(window.innerWidth, window.innerHeight);
  poopBodies = poopBodies.filter(body => {
    const { x, y } = body.position;
    const onScreen = x > -margin && x < window.innerWidth + margin && y > -margin && y < window.innerHeight + margin;
    if (!onScreen) {
      World.remove(world, body);
      return false;
    }
    return true;
  });
}

// Utility to remove all chains connected to a given poop body
function removeChainsForPoop(pooped) {
  for (let i = chains.length - 1; i >= 0; --i) {
    const chain = chains[i];
    if (chain.a === pooped || chain.b === pooped) {
      // Remove all constraints and link bodies from the world
      for (const constraint of chain.constraints) {
        World.remove(world, constraint);
      }
      for (const link of chain.links) {
        World.remove(world, link);
      }
      chains.splice(i, 1);
    }
  }
}

// Main loop with fixed timestep and interpolation
(function animate(now) {
  let frameTime = now - lastFrameTime;
  if (frameTime > MAX_ACCUMULATE) frameTime = MAX_ACCUMULATE; // avoid spiral of death
  accumulator += frameTime;
  lastFrameTime = now;

  // Step physics in fixed increments (30Hz)
  while (accumulator >= PHYSICS_TIMESTEP) {
    // Store previous positions for interpolation
    for (const body of poopBodies) {
      body.prevPosition = { x: body.position.x, y: body.position.y };
      body.prevAngle = body.angle;
    }
    // Also update for all chain links
    for (const chain of chains) {
      for (const link of chain.links) {
        link.prevPosition = { x: link.position.x, y: link.position.y };
        link.prevAngle = link.angle;
      }
    }
    // JSFB cars
    for (const jsfbCar of jsfbCars) {
      jsfbCar.car.prevPosition = { x: jsfbCar.car.position.x, y: jsfbCar.car.position.y };
      jsfbCar.car.prevAngle = jsfbCar.car.angle;
      for (const wheel of jsfbCar.wheels) {
        wheel.prevPosition = { x: wheel.position.x, y: wheel.position.y };
        wheel.prevAngle = wheel.angle;
      }
      if (jsfbCar.poop) {
        jsfbCar.poop.prevPosition = { x: jsfbCar.poop.position.x, y: jsfbCar.poop.position.y };
        jsfbCar.poop.prevAngle = jsfbCar.poop.angle;
      }
    }
    Engine.update(engine, PHYSICS_TIMESTEP);
    customUpdate();
    cleanupPoops();
    accumulator -= PHYSICS_TIMESTEP;
  }
  // Interpolation factor
  const alpha = Math.max(0, Math.min(1, accumulator / PHYSICS_TIMESTEP));
  render(alpha);
  requestAnimationFrame(animate);
})(performance.now());

// Expose setBackground for HTML
window.setBackground = setBackground;
// Apply developer-selected background on load
applyBackgroundSelection();
// Expose for debug
window.setWireframe = (v) => { showWireframe = !!v; };
window.onPoopCollision = onPoopCollision;
window.poopBodies = poopBodies; 

// Listen for swap-clicks setting changes
window.addEventListener('storage', (e) => {
  if (e.key === 'poop-swap-clicks') {
    updateMouseConstraint();
  }
});

// SETTINGS MENU LOGIC
(function() {
  const settingsBtn = document.getElementById('settings-btn');
  const settingsMenu = document.getElementById('settings-menu');

  // Settings schema: modular, easy to add new settings
  const SETTINGS_SCHEMA = [
    {
      section: 'gameplay',
      label: 'Gameplay',
      settings: [
        { key: 'difficulty', label: 'Difficulty', type: 'difficulty', default: 'Normal' },
        { key: 'show-tutorial', label: 'Show Tutorial', type: 'checkbox', default: true },
        { key: 'auto-save', label: 'Auto Save', type: 'checkbox', default: true },
        { key: 'skin', label: 'Poop Skin', type: 'select', options: Array.from({length: 20}, (_, i) => i.toString()).concat(['random']), default: localStorage.getItem('poop-skin') || '0', devOnly: true },
        { key: 'swap-clicks', label: 'Swap Right/Left Click', type: 'checkbox', default: false },
      ]
    },
    {
      section: 'video',
      label: 'Video',
      settings: [
        { key: 'resolution', label: 'Resolution', type: 'select', options: ['Auto','1920x1080','1280x720','800x600'], default: 'Auto' },
        { key: 'fullscreen', label: 'Fullscreen', type: 'checkbox', default: false },
        { key: 'vfx', label: 'Visual Effects', type: 'checkbox', default: true },
        { key: 'bg-source', label: 'Background', type: 'select', options: ['Gradient'].concat(Array.from({length: 12}, (_, i) => i.toString())), default: 'Gradient', devOnly: true },
      ]
    },
    {
      section: 'audio',
      label: 'Audio',
      settings: [
        { key: 'music-volume', label: 'Music Volume', type: 'range', min: 0, max: 100, step: 1, default: 70 },
        { key: 'sfx-volume', label: 'SFX Volume', type: 'range', min: 0, max: 100, step: 1, default: 80 },
        { key: 'mute', label: 'Mute All', type: 'checkbox', default: false },
      ]
    },
    {
      section: 'keybinds',
      label: 'Keybinds',
      settings: [
        { key: 'move-up', label: 'Move Up', type: 'key', default: 'W' },
        { key: 'move-down', label: 'Move Down', type: 'key', default: 'S' },
        { key: 'move-left', label: 'Move Left', type: 'key', default: 'A' },
        { key: 'move-right', label: 'Move Right', type: 'key', default: 'D' },
      ]
    }
  ];

  // Utility: get/set settings from localStorage with poop- prefix
  function getSetting(key, def) {
    const v = localStorage.getItem('poop-' + key);
    if (v === null) return def;
    if (typeof def === 'boolean') return v === 'true';
    if (typeof def === 'number') return Number(v);
    return v;
  }
  function setSetting(key, value) {
    localStorage.setItem('poop-' + key, value);
  }

  // State
  let currentSection = SETTINGS_SCHEMA[0].section;
  let keybindCapture = null;

  // Render
  function showMenu() {
    settingsMenu.innerHTML = '';
    settingsMenu.style.display = 'flex';
    setTimeout(() => settingsMenu.classList.add('visible'), 10);
    // Modal
    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    // Sections (left)
    const sections = document.createElement('div');
    sections.className = 'settings-sections';
    SETTINGS_SCHEMA.forEach(sec => {
      const btn = document.createElement('button');
      btn.className = 'settings-section' + (sec.section === currentSection ? ' active' : '');
      btn.textContent = sec.label;
      btn.onclick = () => {
        currentSection = sec.section;
        showMenu();
      };
      sections.appendChild(btn);
    });
    modal.appendChild(sections);
    // Content (right)
    const content = document.createElement('div');
    content.className = 'settings-content';
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    content.appendChild(table);
    
    const sec = SETTINGS_SCHEMA.find(s => s.section === currentSection);
    // Filter settings based on developer mode
    const filteredSettings = sec.settings.filter(setting => {
      if (setting.devOnly && !isDeveloperMode()) return false;
      return true;
    });
    filteredSettings.forEach(setting => {
      const row = document.createElement('tr');
      row.className = 'settings-row';
      
      // Label cell
      const labelCell = document.createElement('td');
      labelCell.className = 'settings-label-cell';
      const labelContainer = document.createElement('div');
      labelContainer.className = 'settings-label-container';
      const label = document.createElement('div');
      label.className = 'settings-label';
      label.textContent = setting.label;
      labelContainer.appendChild(label);
      labelCell.appendChild(labelContainer);
      row.appendChild(labelCell);
      
      // Spacer cell
      const spacerCell = document.createElement('td');
      spacerCell.style.width = '36px';
      spacerCell.style.padding = '0';
      spacerCell.style.border = 'none';
      spacerCell.style.background = 'transparent';
      spacerCell.style.backgroundColor = 'transparent';
      spacerCell.style.boxShadow = 'none';
      spacerCell.style.outline = 'none';
      spacerCell.className = 'settings-spacer-cell';
      row.appendChild(spacerCell);
      
      // Input cell
      const inputCell = document.createElement('td');
      inputCell.className = 'settings-input-cell';
      const inputContainer = document.createElement('div');
      inputContainer.className = 'settings-input-container';
      
      let input;
      const value = getSetting(setting.key, setting.default);
      if (setting.type === 'checkbox') {
        input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'settings-input';
        input.checked = !!value;
        input.onchange = () => {
          setSetting(setting.key, input.checked);
          if (setting.key === 'swap-clicks') {
            updateMouseConstraint();
          }
        };
        inputContainer.appendChild(input);
      } else if (setting.type === 'select') {
        input = document.createElement('select');
        input.className = 'settings-input';
        setting.options.forEach(opt => {
          const optEl = document.createElement('option');
          optEl.value = opt;
          optEl.textContent = opt;
          input.appendChild(optEl);
        });
        input.value = value;
        input.onchange = () => {
          setSetting(setting.key, input.value);
          if (setting.key === 'skin') {
            localStorage.setItem('poop-skin', input.value);
            location.reload();
          }
          if (setting.key === 'bg-source') {
            localStorage.setItem('poop-bg-source', input.value);
            applyBackgroundSelection();
          }
        };
        inputContainer.appendChild(input);
      } else if (setting.type === 'difficulty') {
        // Special handling for difficulty buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '12px';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.flexWrap = 'nowrap';
        
        const difficulties = ['Easy', 'Normal', 'Hard', 'Developer'];
        const colors = ['#4CAF50', '#FFC107', '#F44336', '#2196F3']; // green, yellow, red, blue
        
        difficulties.forEach((diff, index) => {
          const btn = document.createElement('button');
          btn.textContent = diff;
          btn.style.padding = '12px 24px';
          btn.style.borderRadius = '9px';
          btn.style.border = '1.5px solid #444';
          btn.style.background = value === diff ? colors[index] : 'rgba(0, 0, 0, 0.7)';
          btn.style.color = value === diff ? '#000' : '#fff';
          btn.style.fontSize = '27px';
          btn.style.fontWeight = '900';
          btn.style.textTransform = 'uppercase';
          btn.style.cursor = 'pointer';
          btn.style.transition = 'all 0.225s';
          btn.style.outline = 'none';
          btn.style.whiteSpace = 'nowrap';
          btn.style.flexShrink = '0';
          
          btn.onclick = () => {
            setSetting(setting.key, diff);
            // Update all buttons
            buttonContainer.querySelectorAll('button').forEach((b, i) => {
              b.style.background = b.textContent === diff ? colors[i] : 'rgba(0, 0, 0, 0.7)';
              b.style.color = b.textContent === diff ? '#000' : '#fff';
            });
          };
          
          buttonContainer.appendChild(btn);
        });
        
        inputContainer.appendChild(buttonContainer);
      } else if (setting.type === 'range') {
        input = document.createElement('input');
        input.type = 'range';
        input.className = 'settings-input';
        input.min = setting.min;
        input.max = setting.max;
        input.step = setting.step;
        input.value = value;
        const valLabel = document.createElement('span');
        valLabel.style.marginLeft = '12px';
        valLabel.textContent = value;
        input.oninput = () => {
          valLabel.textContent = input.value;
          setSetting(setting.key, input.value);
        };
        inputContainer.appendChild(input);
        inputContainer.appendChild(valLabel);
      } else if (setting.type === 'key') {
        input = document.createElement('button');
        input.className = 'settings-input';
        input.textContent = value;
        input.onclick = () => {
          keybindCapture = setting.key;
          input.textContent = 'Press a key...';
        };
        inputContainer.appendChild(input);
      } else if (setting.type === 'text') {
        input = document.createElement('input');
        input.type = 'text';
        input.className = 'settings-input';
        input.value = value;
        input.placeholder = "0-19 or 'random'";
        input.onchange = () => {
          setSetting(setting.key, input.value);
          localStorage.setItem('poop-skin', input.value);
          location.reload();
        };
        inputCell.appendChild(input);
      } else {
        input = document.createElement('input');
        input.className = 'settings-input';
        input.value = value;
        input.onchange = () => {
          setSetting(setting.key, input.value);
        };
        inputContainer.appendChild(input);
      }
      
      inputCell.appendChild(inputContainer);
      row.appendChild(inputCell);
      tbody.appendChild(row);
      
      // Add spacer row (except for the last setting)
      if (setting !== filteredSettings[filteredSettings.length - 1]) {
        const spacerRow = document.createElement('tr');
        spacerRow.style.height = '36px';
        tbody.appendChild(spacerRow);
      }
    });
    modal.appendChild(content);
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'settings-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = hideMenu;
    modal.appendChild(closeBtn);
    settingsMenu.appendChild(modal);
  }
  function hideMenu() {
    settingsMenu.classList.remove('visible');
    settingsMenu.addEventListener('transitionend', function handler(e) {
      if (e.target === settingsMenu) {
        settingsMenu.style.display = 'none';
        settingsMenu.removeEventListener('transitionend', handler);
      }
    });
  }
  // Keybind capture logic
  window.addEventListener('keydown', e => {
    if (keybindCapture) {
      setSetting(keybindCapture, e.key.toUpperCase());
      keybindCapture = null;
      showMenu();
      e.preventDefault();
    }
  });
  // Open menu
  settingsBtn.addEventListener('click', () => {
    showMenu();
  });
  // Close on background click
  settingsMenu.addEventListener('mousedown', e => {
    if (e.target === settingsMenu) hideMenu();
  });
})();

// Add this function to trigger the moyai item (e.g., from hotbar or dev console)
function useMoyai() {
  if (moyaiActive) return;
  moyaiActive = true;
  moyaiAnim = 1; // Start hopping
  moyaiHopsLeft = 4 + Math.floor(Math.random() * 2); // 4-5 hops
  // Start at random X, off the top of the screen
  moyaiX = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
  moyaiY = -MOYAI_RADIUS;
  moyaiTargetX = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
  moyaiTargetY = window.innerHeight * 0.5 + (Math.random() - 0.5) * 120;
  moyaiTimer = 0;
}
window.useMoyai = useMoyai;