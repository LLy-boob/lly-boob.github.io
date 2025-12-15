
let gameSpeed = 1;



const CASH = { r: 0x00, g: 0xff, b: 0x88 }; 
const GOLD = { r: 0xff, g: 0xd7, b: 0x00 }; 
const PURE_GOLD = { r: 0xff, g: 0xf7, b: 0x99 }; 
const SILVER = { r: 0xe0, g: 0xe0, b: 0xe0 }; 
const ROSE = { r: 0xff, g: 0x6e, b: 0x79 }; 
const ICE = { r: 0x00, g: 0xff, b: 0xff }; 
const MAGMA = { r: 0xff, g: 0x45, b: 0x00 };
const GHOST = { r: 0xee, g: 0x82, b: 0xee };
const CYBER_GREEN = { r: 0x39, g: 0xff, b: 0x14 }; 
const ELECTRIC = { r: 0xff, g: 0xff, b: 0x00 };
const QUANTUM = { r: 100, g: 0, b: 255 }; 
const allColors = [CASH, GOLD, SILVER, ROSE, ICE, MAGMA, GHOST, CYBER_GREEN, ELECTRIC, QUANTUM];


let lightningBolts = [];

const getSpawnDelay = () => {
    const score = state.game.score;
    const baseDelay = 1400;
    const minDelay = 380; 
    
    
    let reduction;
    if (score < 500) reduction = score * 0.5;
    else if (score < 1500) reduction = 250 + (score - 500) * 0.7;
    else if (score < 3000) reduction = 950 + (score - 1500) * 0.9;
    else if (score < 7500) reduction = 2300 + (score - 3000) * 0.25; 
    else reduction = 3425 + (score - 7500) * 0.2; 
    return Math.max(baseDelay - reduction, minDelay);
}


const BiomeManager = {
    currentTheme: 0,
    transitionProgress: 0,
    
    themes: [
        {   
            name: "Midnight City",
            shadow: '#262e36',
            spark: 'rgba(170,221,255,.9)',
            bg: '#050510', 
            gradientStart: 'rgba(20, 30, 40, 0.4)',
            gradientEnd: 'rgba(0, 0, 0, 1)',
            fogStart: 0.45, fogEnd: 0.65
        },
        {  
            name: "Neon Sunset",
            shadow: '#3a1c31',
            spark: 'rgba(255,100,200,.9)',
            bg: '#1a0510',
            gradientStart: 'rgba(80, 20, 60, 0.4)',
            gradientEnd: 'rgba(40, 5, 20, 1)', 
            fogStart: 0.40, fogEnd: 0.60
        },
        { 
            name: "Cyber Grid",
            shadow: '#002b1b',
            spark: 'rgba(0,255,100,.9)',
            bg: '#00110a',
            gradientStart: 'rgba(0, 50, 20, 0.4)',
            gradientEnd: 'rgba(0, 20, 5, 1)',
            fogStart: 0.50, fogEnd: 0.75
        },
        {  
            name: "Glacial Summit",
            shadow: '#1c3a3a', 
            spark: 'rgba(200, 255, 255, 0.9)',
            bg: '#001a1a',
            gradientStart: 'rgba(0, 60, 80, 0.4)',
            gradientEnd: 'rgba(0, 20, 30, 1)',
            fogStart: 0.45, fogEnd: 0.70
        },
        {   
            name: "Volcanic Forge",
            shadow: '#3a0000',
            spark: 'rgb(255, 120, 0)',
            bg: '#000',
            gradientStart: 'rgba(100, 20, 0, 0.6)', 
            gradientEnd: '#000000', 
            fogStart: 0.40, fogEnd: 0.60
        },
        {   
            name: "Cyber Core",
            shadow: '#003000',
            spark: 'rgb(0, 255, 100)',
            bg: '#000',
            gradientStart: 'rgba(0, 80, 0, 0.5)',
            gradientEnd: '#000000', 
            fogStart: 0.50, fogEnd: 0.85
        },
        {  
            name: "Solar Flare",
            shadow: '#5a2a00',
            spark: 'rgb(255, 200, 50)',
            bg: '#1a0500', 
            gradientStart: 'rgba(255, 100, 0, 0.5)',
            gradientEnd: 'rgba(50, 10, 0, 1)',
            fogStart: 0.30, fogEnd: 0.60
        },
        {  
            name: "The Zenith",
            shadow: '#404040',
            spark: 'rgb(255, 255, 220)',
            bg: '#f0f0f0', 
            gradientStart: 'rgba(255, 255, 255, 0.8)',
            gradientEnd: 'rgba(220, 220, 220, 1)',
            fogStart: 0.20, fogEnd: 0.50
        }
    ],

    getCurrentColors() {
        return this.themes[this.currentTheme];
    },

    reset() {
        this.currentTheme = -1;
        this.transitionProgress = 0;
        this.update(0);
    },

    update(score) {
        let targetTheme = 0;
        
       
        if (isCasualGame()) {
            targetTheme = 0; 
        } else {
           
            if (score >= 10000) targetTheme = 7;     
            else if (score >= 7500) targetTheme = 6; 
            else if (score >= 5000) targetTheme = 5; 
            else if (score >= 3500) targetTheme = 4;
            else if (score >= 2000) targetTheme = 3; 
            else if (score >= 1500) targetTheme = 2; 
            else if (score >= 500) targetTheme = 1;  
            else targetTheme = 0;                    
        }
        
        if (this.currentTheme !== targetTheme) {
            this.currentTheme = targetTheme;
            this.transitionProgress = 0;
            const theme = this.themes[targetTheme];
            
           
            document.body.classList.remove('biome-midnight', 'biome-neon', 'biome-grid', 'biome-ice', 'biome-magma', 'biome-cyber', 'biome-solar', 'biome-zenith');

            if (targetTheme === 0) document.body.classList.add('biome-midnight');
            else if (targetTheme === 1) document.body.classList.add('biome-neon');
            else if (targetTheme === 2) document.body.classList.add('biome-grid');
            else if (targetTheme === 3) document.body.classList.add('biome-ice');
            else if (targetTheme === 4) document.body.classList.add('biome-magma');
            else if (targetTheme === 5) document.body.classList.add('biome-cyber');
            else if (targetTheme === 6) document.body.classList.add('biome-solar');
            else if (targetTheme === 7) document.body.classList.add('biome-zenith');

            if (theme) showBiomeNotification(theme.name);
        }
    }
};

const DifficultyManager = {
    baseSpeed: 0.8,
    currentSpeed: 0.8,
    maxSpeed: 2.5, 
    
    update(score) {
       
        const speedBoost = Math.floor(score / 500) * 0.05;
        let target = this.baseSpeed + speedBoost;
        
       
        if (state.game.cubeCount > 20) target += 0.1;

       
        this.currentSpeed += (target - this.currentSpeed) * 0.01;
        
       
        if (this.currentSpeed > this.maxSpeed) this.currentSpeed = this.maxSpeed;
        
        return this.currentSpeed;
    },
    
    reset() {
        this.currentSpeed = this.baseSpeed;
    }
};

const doubleStrongEnableScore = 2000;
const slowmoThreshold = 10;
const strongThreshold = 25;
const spinnerThreshold = 25;
let pointerIsDown = false;
let pointerScreen = { x: 0, y: 0 };
let pointerScene = { x: 0, y: 0 };
const hitDampening = 0.1;
const backboardZ = -400;
const shadowColor = '#262e36';
const airDrag = 0.022;
const gravity = 0.5;
const sparkColor = 'rgba(170,221,255,.9)';
const sparkThickness = 2.2;
const airDragSpark = 0.1;
const touchTrailColor = 'rgba(170,221,255,.62)';
const touchTrailThickness = 7;
const touchPointLife = 120;
const touchPoints = [];
const targetRadius = 40;
const targetHitRadius = 90; 
const makeTargetGlueColor = target => {
    
    return 'rgb(170,221,255)';
};
const fragRadius = targetRadius / 3;
const canvas = document.querySelector('#c');
const cameraDistance = 900;
const sceneScale = 1;
const cameraFadeStartZ = 0.45 * cameraDistance;
const cameraFadeEndZ = 0.65 * cameraDistance;
const cameraFadeRange = cameraFadeEndZ - cameraFadeStartZ;
const allVertices = [];
const allPolys = [];
const allShadowVertices = [];
const allShadowPolys = [];
const menuMusicFile = "./music1.m4a"; 
const BackgroundMusic = {
    audio: new Audio(menuMusicFile),
    isPlaying: false,

    init() {
        this.audio.loop = true;
        this.audio.volume = 0.5;
        this.audio.preload = "auto";
    },

    play() {
        if (!this.isPlaying) {
            this.audio.play().then(() => {
                this.isPlaying = true;
            }).catch(() => {
                
            });
        }
    },

    pause() {
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        }
    },

    update(activeMenu) {
       
        if (activeMenu) {
            this.play();
        } else {
            this.pause();
        }
    }
};


BackgroundMusic.init();




const lightningSound = new Audio('./lightning-spell-386163.mp3');
lightningSound.volume = 0.6;


const lightningPool = [];
const POOL_SIZE = 10;
for (let i = 0; i < POOL_SIZE; i++) {
    const sfx = lightningSound.cloneNode();
    sfx.volume = 0.6;
    lightningPool.push(sfx);
}
let poolIndex = 0;

function playLightningSound() {
    const sfx = lightningPool[poolIndex % POOL_SIZE];
    sfx.currentTime = 0;
   
    sfx.volume = 0.4 + Math.random() * 0.3;
    sfx.play().catch(() => {});
    poolIndex++;
}







function showBiomeNotification(text) {
    const existing = document.querySelector('.biome-notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = 'biome-notification';
    notif.innerHTML = `${text.toUpperCase()} <span class="biome-sub">SECTOR ENTERED</span>`;
    
    
    if (text.includes('Midnight')) notif.style.color = '#fff';
    else if (text.includes('Neon')) notif.style.color = '#ff00ff';
    else if (text.includes('Grid')) notif.style.color = '#00ccff';
    else if (text.includes('Ice') || text.includes('Glacial')) notif.style.color = '#00ffff';
    else if (text.includes('Volcanic') || text.includes('Magma')) notif.style.color = '#ff4500';
    else if (text.includes('Core')) notif.style.color = '#00ff00';
    else if (text.includes('Solar')) notif.style.color = '#ffaa00';
    else if (text.includes('Zenith')) notif.style.color = '#ffd700';

    document.body.appendChild(notif);

    
    requestAnimationFrame(() => notif.classList.add('active'));

    
    setTimeout(() => {
        notif.classList.remove('active');
        setTimeout(() => notif.remove(), 1000);
    }, 2500);
}
const settings = {
    sfxVolume: 0.5,
    musicVolume: 0.5 
};

function setupStealthSettings() {
    const trigger = document.getElementById('settingsTrigger');
    const panel = document.getElementById('settingsPanel');
    const musicSlider = document.getElementById('stealthMusicVol');
    const sfxSlider = document.getElementById('stealthSfxVol');
    const musicLabel = document.getElementById('musicValLabel');
    const sfxLabel = document.getElementById('sfxValLabel');

    if (!trigger || !panel) return;

    
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('active');
       
        trigger.style.transform = panel.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)';
    });

   
    document.addEventListener('click', (e) => {
        if (panel.classList.contains('active') && 
            !panel.contains(e.target) && 
            e.target !== trigger && 
            !trigger.contains(e.target)) {
            panel.classList.remove('active');
            trigger.style.transform = 'rotate(0deg)';
        }
    });

   
    if (musicSlider) {
       
        musicSlider.value = settings.musicVolume;
        musicLabel.textContent = Math.round(settings.musicVolume * 100) + '%';
        if (typeof BackgroundMusic !== 'undefined') {
            BackgroundMusic.audio.volume = settings.musicVolume;
        }

        
        musicSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            settings.musicVolume = val;
            musicLabel.textContent = Math.round(val * 100) + '%';
            
            if (typeof BackgroundMusic !== 'undefined') {
                BackgroundMusic.audio.volume = val;
               
                if (val > 0 && !BackgroundMusic.isPlaying && isMenuVisible()) {
                    BackgroundMusic.play();
                } else if (val === 0) {
                    BackgroundMusic.pause();
                }
            }
        });
    }

    
    if (sfxSlider) {
        
        sfxSlider.value = settings.sfxVolume;
        sfxLabel.textContent = Math.round(settings.sfxVolume * 100) + '%';

        
        sfxSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            settings.sfxVolume = val;
            sfxLabel.textContent = Math.round(val * 100) + '%';
        });
        
        
        let sfxTimeout;
        sfxSlider.addEventListener('change', () => {
            
             if (sfx.playTone) sfx.playTone(800, 'sine', 0.1);
        });
    }
}




const audioBuffers = {
    burst: null,
    slowmo: null
};


window.addEventListener('load', () => {
    setupStealthSettings();
    loadCustomSFX();
    
    
    const guideBtn = document.querySelector('.guide-btn');
    if (guideBtn) guideBtn.addEventListener('click', () => setActiveMenu(MENU_GUIDE));

    const guideBackBtn = document.querySelector('.menu--guide .back-btn');
    if (guideBackBtn) guideBackBtn.addEventListener('click', () => setActiveMenu(MENU_MAIN));

    const closeGuideX = document.querySelector('.close-guide-x');
    if (closeGuideX) closeGuideX.addEventListener('click', () => setActiveMenu(MENU_MAIN));
});

function loadCustomSFX() {
    
    fetch('small-rock-break-194553.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            audioBuffers.burst = audioBuffer;
        })
        .catch(e => console.error("Error loading Burst SFX:", e));

   
    fetch('magical-rock-spell-190273.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            audioBuffers.slowmo = audioBuffer;
        })
        .catch(e => console.error("Error loading SlowMo SFX:", e));
}

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const sfx = {
    playTone: (freq, type, duration) => {
        if (settings.sfxVolume <= 0) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(settings.sfxVolume * 0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    },
    playNoise: (duration) => {
        if (settings.sfxVolume <= 0) return;
        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const gain = audioCtx.createGain();
        
        gain.gain.setValueAtTime(settings.sfxVolume * 0.6, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        noise.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start();
    },
    playCrunch: () => {
        if (settings.sfxVolume <= 0) return;

        
        if (audioBuffers.burst) {
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffers.burst;
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(settings.sfxVolume * 1.5, audioCtx.currentTime); 
            source.connect(gain);
            gain.connect(audioCtx.destination);
            source.start();
            return;
        }

        
        sfx.playTone(100, 'square', 0.1);
        
        sfx.playNoise(0.25);
        
        sfx.playTone(800, 'sawtooth', 0.05);
    }
};

const playHitSound = () => sfx.playTone(600, 'square', 0.05);

const playBurstSound = () => sfx.playCrunch();
const playSwipeSound = () => sfx.playTone(200, 'triangle', 0.08);

const playSlowMoSound = () => {
    if (settings.sfxVolume <= 0) return;
    if (audioBuffers.slowmo) {
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffers.slowmo;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(settings.sfxVolume * 1.5, audioCtx.currentTime);
        source.connect(gain);
        gain.connect(audioCtx.destination);
        source.start();
    }
    
};


function resumeAudioContext() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    
    if (isMenuVisible() && typeof BackgroundMusic !== 'undefined') {
        BackgroundMusic.play();
    }
}

document.addEventListener("touchstart", resumeAudioContext, { once: true });
document.addEventListener("click", resumeAudioContext, { once: true });

const GAME_MODE_RANKED = Symbol('GAME_MODE_RANKED');
const GAME_MODE_CASUAL = Symbol('GAME_MODE_CASUAL');

const MENU_MAIN = Symbol('MENU_MAIN');
const MENU_PAUSE = Symbol('MENU_PAUSE');
const MENU_SCORE = Symbol('MENU_SCORE');
const MENU_SETTINGS = Symbol('MENU_SETTINGS');
const MENU_GUIDE = Symbol('MENU_GUIDE');

const state = {
    game: {
        mode: GAME_MODE_RANKED,
        
        time: 0,
        
        score: 0,
        
        cubeCount: 0
    },
    menus: {
        
        active: MENU_MAIN
    }
};

const isInGame = () => !state.menus.active;
const isMenuVisible = () => !!state.menus.active;
const isCasualGame = () => state.game.mode === GAME_MODE_CASUAL;
const isPaused = () => state.menus.active === MENU_PAUSE;

const highScoreKey = '__swipefury__highScore';
const getHighScore = () => {
    const raw = localStorage.getItem(highScoreKey);
    return raw ? parseInt(raw, 10) : 0;
};

let _lastHighscore = getHighScore();
const setHighScore = score => {
    _lastHighscore = getHighScore();
    localStorage.setItem(highScoreKey, String(score));
};

const isNewHighScore = () => state.game.score > _lastHighscore;

const invariant = (condition, message) => {
    if (!condition) throw new Error(message);
};

const $ = selector => document.querySelector(selector);
const handleClick = (element, handler) => element.addEventListener('click', handler);
const handlePointerDown = (element, handler) => {
    element.addEventListener('touchstart', handler);
    element.addEventListener('mousedown', handler);
};

const formatNumber = num => num.toLocaleString();

const PI = Math.PI;
const TAU = Math.PI * 2;
const ETA = Math.PI * 0.5;

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const lerp = (a, b, mix) => (b - a) * mix + a;

const random = (min, max) => Math.random() * (max - min) + min;

const randomInt = (min, max) => ((Math.random() * (max - min + 1)) | 0) + min;

const pickOne = arr => arr[Math.random() * arr.length | 0];

const colorToHex = color => {
    return '#' +
        (color.r | 0).toString(16).padStart(2, '0') +
        (color.g | 0).toString(16).padStart(2, '0') +
        (color.b | 0).toString(16).padStart(2, '0');
};

const shadeColor = (color, lightness) => {
    let other, mix;
    if (lightness < 0.5) {
        other = 0;
        mix = 1 - (lightness * 2);
    } else {
        other = 255;
        mix = lightness * 2 - 1;
    }
    return '#' +
        (lerp(color.r, other, mix) | 0).toString(16).padStart(2, '0') +
        (lerp(color.g, other, mix) | 0).toString(16).padStart(2, '0') +
        (lerp(color.b, other, mix) | 0).toString(16).padStart(2, '0');
};

const _allCooldowns = [];

const makeCooldown = (rechargeTime, units = 1) => {
    let timeRemaining = 0;
    let lastTime = 0;

    const initialOptions = { rechargeTime, units };

    const updateTime = () => {
        const now = state.game.time;
        
        if (now < lastTime) {
            timeRemaining = 0;
        } else {
            
            timeRemaining -= now - lastTime;
            if (timeRemaining < 0) timeRemaining = 0;
        }
        lastTime = now;
    };

    const canUse = () => {
        updateTime();
        return timeRemaining <= (rechargeTime * (units - 1));
    };

    const cooldown = {
        canUse,
        useIfAble() {
            const usable = canUse();
            if (usable) timeRemaining += rechargeTime;
            return usable;
        },
        mutate(options) {
            if (options.rechargeTime) {
                
                timeRemaining -= rechargeTime - options.rechargeTime;
                if (timeRemaining < 0) timeRemaining = 0;
                rechargeTime = options.rechargeTime;
            }
            if (options.units) units = options.units;
        },
        reset() {
            timeRemaining = 0;
            lastTime = 0;
            this.mutate(initialOptions);
        }
    };

    _allCooldowns.push(cooldown);

    return cooldown;
};

const resetAllCooldowns = () => _allCooldowns.forEach(cooldown => cooldown.reset());

const makeSpawner = ({ chance, cooldownPerSpawn, maxSpawns }) => {
    const cooldown = makeCooldown(cooldownPerSpawn, maxSpawns);
    return {
        shouldSpawn() {
            return Math.random() <= chance && cooldown.useIfAble();
        },
        mutate(options) {
            if (options.chance) chance = options.chance;
            cooldown.mutate({
                rechargeTime: options.cooldownPerSpawn,
                units: options.maxSpawns
            });
        }
    };
};

const normalize = v => {
    const mag = Math.hypot(v.x, v.y, v.z);
    return {
        x: v.x / mag,
        y: v.y / mag,
        z: v.z / mag
    };
}

const add = a => b => a + b;

const scaleVector = scale => vector => {
    vector.x *= scale;
    vector.y *= scale;
    vector.z *= scale;
};

function cloneVertices(vertices) {
    return vertices.map(v => ({ x: v.x, y: v.y, z: v.z }));
}

function copyVerticesTo(arr1, arr2) {
    const len = arr1.length;
    for (let i = 0; i < len; i++) {
        const v1 = arr1[i];
        const v2 = arr2[i];
        v2.x = v1.x;
        v2.y = v1.y;
        v2.z = v1.z;
    }
}

function computeTriMiddle(poly) {
    const v = poly.vertices;
    poly.middle.x = (v[0].x + v[1].x + v[2].x) / 3;
    poly.middle.y = (v[0].y + v[1].y + v[2].y) / 3;
    poly.middle.z = (v[0].z + v[1].z + v[2].z) / 3;
}

function computeQuadMiddle(poly) {
    const v = poly.vertices;
    poly.middle.x = (v[0].x + v[1].x + v[2].x + v[3].x) / 4;
    poly.middle.y = (v[0].y + v[1].y + v[2].y + v[3].y) / 4;
    poly.middle.z = (v[0].z + v[1].z + v[2].z + v[3].z) / 4;
}

function computePolyMiddle(poly) {
    if (poly.vertices.length === 3) {
        computeTriMiddle(poly);
    } else {
        computeQuadMiddle(poly);
    }
}


function computePolyDepth(poly) {
    computePolyMiddle(poly);
    const dX = poly.middle.x;
    const dY = poly.middle.y;
    const dZ = poly.middle.z - cameraDistance;
    poly.depth = Math.hypot(dX, dY, dZ);
}


function computePolyNormal(poly, normalName) {
    
    const v1 = poly.vertices[0];
    const v2 = poly.vertices[1];
    const v3 = poly.vertices[2];
    
    const ax = v1.x - v2.x;
    const ay = v1.y - v2.y;
    const az = v1.z - v2.z;
    const bx = v1.x - v3.x;
    const by = v1.y - v3.y;
    const bz = v1.z - v3.z;
   
    const nx = ay * bz - az * by;
    const ny = az * bx - ax * bz;
    const nz = ax * by - ay * bx;
    
    const mag = Math.hypot(nx, ny, nz);
    const polyNormal = poly[normalName];
    polyNormal.x = nx / mag;
    polyNormal.y = ny / mag;
    polyNormal.z = nz / mag;
}

function transformVertices(vertices, target, tX, tY, tZ, rX, rY, rZ, sX, sY, sZ) {
    
    const sinX = Math.sin(rX);
    const cosX = Math.cos(rX);
    const sinY = Math.sin(rY);
    const cosY = Math.cos(rY);
    const sinZ = Math.sin(rZ);
    const cosZ = Math.cos(rZ);

    
    vertices.forEach((v, i) => {
        const targetVertex = target[i];
       
        const x1 = v.x;
        const y1 = v.z * sinX + v.y * cosX;
        const z1 = v.z * cosX - v.y * sinX;
        
        const x2 = x1 * cosY - z1 * sinY;
        const y2 = y1;
        const z2 = x1 * sinY + z1 * cosY;
        
        const x3 = x2 * cosZ - y2 * sinZ;
        const y3 = x2 * sinZ + y2 * cosZ;
        const z3 = z2;

        
        targetVertex.x = x3 * sX + tX;
        targetVertex.y = y3 * sY + tY;
        targetVertex.z = z3 * sZ + tZ;
    });
}


const projectVertex = v => {
    const focalLength = cameraDistance * sceneScale;
    const depth = focalLength / (cameraDistance - v.z);
    v.x = v.x * depth;
    v.y = v.y * depth;
};


const projectVertexTo = (v, target) => {
    const focalLength = cameraDistance * sceneScale;
    const depth = focalLength / (cameraDistance - v.z);
    target.x = v.x * depth;
    target.y = v.y * depth;
};

const PERF_START = () => { };
const PERF_END = () => { };
const PERF_UPDATE = () => { };

function makeCubeModel({ scale = 1 }) {
    return {
        vertices: [
           
            { x: -scale, y: -scale, z: scale },
            { x: scale, y: -scale, z: scale },
            { x: scale, y: scale, z: scale },
            { x: -scale, y: scale, z: scale },
           
            { x: -scale, y: -scale, z: -scale },
            { x: scale, y: -scale, z: -scale },
            { x: scale, y: scale, z: -scale },
            { x: -scale, y: scale, z: -scale }
        ],
        polys: [
            
            { vIndexes: [0, 1, 2, 3] },
           
            { vIndexes: [7, 6, 5, 4] },
            
            { vIndexes: [3, 2, 6, 7] },
           
            { vIndexes: [4, 5, 1, 0] },
            
            { vIndexes: [5, 6, 2, 1] },
            
            { vIndexes: [0, 3, 7, 4] }
        ]
    };
}

function makeRecursiveCubeModel({ recursionLevel, splitFn, color, scale = 1 }) {
    const getScaleAtLevel = level => 1 / (3 ** level);

   
    let cubeOrigins = [{ x: 0, y: 0, z: 0 }];

   
    for (let i = 1; i <= recursionLevel; i++) {
        const scale = getScaleAtLevel(i) * 2;
        const cubeOrigins2 = [];
        cubeOrigins.forEach(origin => {
            cubeOrigins2.push(...splitFn(origin, scale));
        });
        cubeOrigins = cubeOrigins2;
    }

    const finalModel = { vertices: [], polys: [] };

    
    const cubeModel = makeCubeModel({ scale: 1 });
    cubeModel.vertices.forEach(scaleVector(getScaleAtLevel(recursionLevel)));

    
    const maxComponent = getScaleAtLevel(recursionLevel) * (3 ** recursionLevel - 1);

    
    cubeOrigins.forEach((origin, cubeIndex) => {
        
        const occlusion = Math.max(
            Math.abs(origin.x),
            Math.abs(origin.y),
            Math.abs(origin.z)
        ) / maxComponent;
       
        const occlusionLighter = recursionLevel > 2
            ? occlusion
            : (occlusion + 0.8) / 1.8;
       
        finalModel.vertices.push(
            ...cubeModel.vertices.map(v => ({
                x: (v.x + origin.x) * scale,
                y: (v.y + origin.y) * scale,
                z: (v.z + origin.z) * scale
            }))
        );
       
        finalModel.polys.push(
            ...cubeModel.polys.map(poly => ({
                vIndexes: poly.vIndexes.map(add(cubeIndex * 8))
            }))
        );
    });

    return finalModel;
}

function mengerSpongeSplit(o, s) {
    return [
       
        { x: o.x + s, y: o.y - s, z: o.z + s },
        { x: o.x + s, y: o.y - s, z: o.z + 0 },
        { x: o.x + s, y: o.y - s, z: o.z - s },
        { x: o.x + 0, y: o.y - s, z: o.z + s },
        { x: o.x + 0, y: o.y - s, z: o.z - s },
        { x: o.x - s, y: o.y - s, z: o.z + s },
        { x: o.x - s, y: o.y - s, z: o.z + 0 },
        { x: o.x - s, y: o.y - s, z: o.z - s },
        
        { x: o.x + s, y: o.y + s, z: o.z + s },
        { x: o.x + s, y: o.y + s, z: o.z + 0 },
        { x: o.x + s, y: o.y + s, z: o.z - s },
        { x: o.x + 0, y: o.y + s, z: o.z + s },
        { x: o.x + 0, y: o.y + s, z: o.z - s },
        { x: o.x - s, y: o.y + s, z: o.z + s },
        { x: o.x - s, y: o.y + s, z: o.z + 0 },
        { x: o.x - s, y: o.y + s, z: o.z - s },
       
        { x: o.x + s, y: o.y + 0, z: o.z + s },
        { x: o.x + s, y: o.y + 0, z: o.z - s },
        { x: o.x - s, y: o.y + 0, z: o.z + s },
        { x: o.x - s, y: o.y + 0, z: o.z - s }
    ];
}

function optimizeModel(model, threshold = 0.0001) {
    const { vertices, polys } = model;

    const compareVertices = (v1, v2) => (
        Math.abs(v1.x - v2.x) < threshold &&
        Math.abs(v1.y - v2.y) < threshold &&
        Math.abs(v1.z - v2.z) < threshold
    );

    const comparePolys = (p1, p2) => {
        const v1 = p1.vIndexes;
        const v2 = p2.vIndexes;
        return (
            (
                v1[0] === v2[0] ||
                v1[0] === v2[1] ||
                v1[0] === v2[2] ||
                v1[0] === v2[3]
            ) && (
                v1[1] === v2[0] ||
                v1[1] === v2[1] ||
                v1[1] === v2[2] ||
                v1[1] === v2[3]
            ) && (
                v1[2] === v2[0] ||
                v1[2] === v2[1] ||
                v1[2] === v2[2] ||
                v1[2] === v2[3]
            ) && (
                v1[3] === v2[0] ||
                v1[3] === v2[1] ||
                v1[3] === v2[2] ||
                v1[3] === v2[3]
            )
        );
    };


    vertices.forEach((v, i) => {
        v.originalIndexes = [i];
    });

    for (let i = vertices.length - 1; i >= 0; i--) {
        for (let ii = i - 1; ii >= 0; ii--) {
            const v1 = vertices[i];
            const v2 = vertices[ii];
            if (compareVertices(v1, v2)) {
                vertices.splice(i, 1);
                v2.originalIndexes.push(...v1.originalIndexes);
                break;
            }
        }
    }

    vertices.forEach((v, i) => {
        polys.forEach(p => {
            p.vIndexes.forEach((vi, ii, arr) => {
                const vo = v.originalIndexes;
                if (vo.includes(vi)) {
                    arr[ii] = i;
                }
            });
        });
    });

    polys.forEach(p => {
        const vi = p.vIndexes;
        p.sum = vi[0] + vi[1] + vi[2] + vi[3];
    });
    polys.sort((a, b) => b.sum - a.sum);

    
    for (let i = polys.length - 1; i >= 0; i--) {
        for (let ii = i - 1; ii >= 0; ii--) {
            const p1 = polys[i];
            const p2 = polys[ii];
            if (p1.sum !== p2.sum) break;
            if (comparePolys(p1, p2)) {
                polys.splice(i, 1);
                polys.splice(ii, 1);
                i--;
                break;
            }
        }
    }

    return model;
}

class Entity {
    constructor({ model, color, wireframe = false }) {
        const vertices = cloneVertices(model.vertices);
        const shadowVertices = cloneVertices(model.vertices);
        const colorHex = colorToHex(color);
        const darkColorHex = shadeColor(color, 0.4);

        const polys = model.polys.map(p => ({
            vertices: p.vIndexes.map(vIndex => vertices[vIndex]),
            color: color, 
            wireframe: wireframe,
            strokeWidth: wireframe ? 2 : 0,
            strokeColor: colorHex, 
            strokeColorDark: darkColorHex, 
            depth: 0,
            middle: { x: 0, y: 0, z: 0 },
            normalWorld: { x: 0, y: 0, z: 0 },
            normalCamera: { x: 0, y: 0, z: 0 }
        }));

        const shadowPolys = model.polys.map(p => ({
            vertices: p.vIndexes.map(vIndex => shadowVertices[vIndex]),
            wireframe: wireframe,
            normalWorld: { x: 0, y: 0, z: 0 }
        }));

        this.projected = {};
        this.model = model;
        this.vertices = vertices;
        this.polys = polys;
        this.shadowVertices = shadowVertices;
        this.shadowPolys = shadowPolys;
        this.reset();
    }

  
    reset() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.xD = 0;
        this.yD = 0;
        this.zD = 0;

        this.rotateX = 0;
        this.rotateY = 0;
        this.rotateZ = 0;
        this.rotateXD = 0;
        this.rotateYD = 0;
        this.rotateZD = 0;

        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;

        this.projected.x = 0;
        this.projected.y = 0;

       
        this.health = 0;
        this.maxHealth = 0;
        this.hit = false;
        this.isRainbow = false;
        this.styleType = undefined;
        
       
        this.dragMultiplier = 1;
        this.gravMultiplier = 1;
        this.spawnTime = 0;
    }

    transform() {
        transformVertices(
            this.model.vertices,
            this.vertices,
            this.x,
            this.y,
            this.z,
            this.rotateX,
            this.rotateY,
            this.rotateZ,
            this.scaleX,
            this.scaleY,
            this.scaleZ
        );

        copyVerticesTo(this.vertices, this.shadowVertices);
    }

   
    project() {
        projectVertexTo(this, this.projected);
    }
}

const targets = [];

const targetPool = new Map();
const targetWireframePool = new Map(); 

const getTarget = (() => {

    const slowmoSpawner = makeSpawner({
        chance: 0.5,
        cooldownPerSpawn: 10000,
        maxSpawns: 1
    });

    let doubleStrong = false;
    const strongSpawner = makeSpawner({
        chance: 0.3,
        cooldownPerSpawn: 12000,
        maxSpawns: 1
    });

    const spinnerSpawner = makeSpawner({
        chance: 0.1,
        cooldownPerSpawn: 10000,
        maxSpawns: 1
    });

   
    const axisOptions = [
        ['x', 'y'],
        ['y', 'z'],
        ['z', 'x']
    ];

    function getTargetOfStyle(color, wireframe, shape = 'cube') {
        const poolKey = colorToHex(color) + '-' + wireframe + '-' + shape;
        if (!targetPool.has(poolKey)) targetPool.set(poolKey, []);

        let target = targetPool.get(poolKey).pop();

        if (!target) {
            let model;
            switch (shape) {
                case 'pyramid':
                    model = makePyramidModel({ scale: targetRadius });
                    break;
                case 'diamond':
                    model = makeDiamondModel({ scale: targetRadius });
                    break;
                case 'cube':
                default:
                    model = optimizeModel(makeRecursiveCubeModel({
                        recursionLevel: 1,
                        splitFn: mengerSpongeSplit,
                        scale: targetRadius
                    }));
                    break;
            }

            target = new Entity({
                model: model,
                color: color,
                wireframe: wireframe
            });

           
            target.color = color;
            target.wireframe = wireframe;
            target.shape = shape;
            target.poolKey = poolKey;
            target.hit = false;
            target.maxHealth = 0;
            target.health = 0;
        }
        return target;
    }

    return function getTarget() {
        const score = state.game.score;

        if (doubleStrong && score <= doubleStrongEnableScore) {
            doubleStrong = false;
            
        } else if (!doubleStrong && score > doubleStrongEnableScore) {
            doubleStrong = true;
            strongSpawner.mutate({ maxSpawns: 2 });
        }

        
        let availableColors = [CASH, SILVER]; 
        
        if (score >= 500) availableColors.push(GOLD);
        if (score >= 1500) availableColors.push(ROSE);
        
       
        if (!isCasualGame()) {
            if (score >= 2000) availableColors.push(ICE); 
            if (score >= 3500) availableColors.push(MAGMA); 
            if (score >= 5000) availableColors.push(GHOST); 
        } 
        
        let color = pickOne(availableColors);
        
       
        if (score >= 2000 && Math.random() < 0.25) color = ICE;
        if (score >= 3500 && Math.random() < 0.25) color = MAGMA;
        if (score >= 5000 && Math.random() < 0.3) color = GHOST;

        let wireframe = false;
        let health = 1;
        let maxHealth = 1;
        let height = 1;
        let shape = 'cube';
        let targetSpeed = 1;
        let specialStyle = undefined;

        const spinner = state.game.cubeCount >= spinnerThreshold && isInGame() && spinnerSpawner.shouldSpawn();

       
        const canSpawnSpecials = score >= 250; 

        if (canSpawnSpecials && state.game.cubeCount >= slowmoThreshold && slowmoSpawner.shouldSpawn()) {
            
           
            let spawnChance = 1.0; 
            
           
            if (score >= 5000) spawnChance = 0.33;

            if (Math.random() < spawnChance) {
                color = CASH; 
                wireframe = true;
                shape = 'cube';
            }
        }
        if (score >= 12000 && state.game.cubeCount >= spinnerThreshold && Math.random() < 0.2) {
            color = CYBER_GREEN;
            wireframe = true;
            shape = 'cube';
            targetSpeed = 1.5;
        }
        else if (score >= 7500 && Math.random() < 0.1) { 
             color = QUANTUM;
             wireframe = true;
             shape = 'cube';
             specialStyle = 'QUANTUM';
        }
        else if (score >= 1500 && Math.random() < 0.04) {
             color = ELECTRIC;
             wireframe = true;
             shape = 'cube';
             specialStyle = 'LIGHTNING';
        }
        else if (score >= 1000 && state.game.cubeCount >= strongThreshold && strongSpawner.shouldSpawn()) {
            color = PURE_GOLD; 
            health = 3;
            maxHealth = 3; 
            shape = 'cube';
        }

        const target = getTargetOfStyle(color, wireframe, shape);
        
        target.hit = false;
        target.health = 1;  
        target.maxHealth = 1; 
        target.isRainbow = false;
        target.styleType = undefined;
        
        if (targetSpeed > 1) {
             target.zD *= targetSpeed;
             target.styleType = 'QUANTUM';
        }
        if (specialStyle) {
            target.styleType = specialStyle;
        }

        if (score >= 5000 && score < 7500 && Math.random() < 0.15) {
             target.styleType = 'MATRIX';
             target.color = CYBER_GREEN;
             target.wireframe = true;
        }

        target.maxHealth = maxHealth === 3 ? 3 : 1; 
        target.health = target.maxHealth;

        if (!isCasualGame() && canSpawnSpecials && state.game.cubeCount >= slowmoThreshold && color === CASH && wireframe) {
            target.isRainbow = true;
        }

       
        if (color === CASH) target.styleType = 'CASH';
        else if (color === GOLD) target.styleType = 'GOLD';
        else if (color === PURE_GOLD) target.styleType = 'PURE_GOLD';
        else if (color === SILVER) target.styleType = 'SILVER';
        else if (color === ROSE) target.styleType = 'ROSE';
        else if (color === ICE) target.styleType = 'ICE';
        else if (color === MAGMA) target.styleType = 'MAGMA';
        else if (color === GHOST) target.styleType = 'GHOST';
        else if (color === QUANTUM) target.styleType = 'QUANTUM';

       
        if (target.styleType === 'ROSE') target.gravMultiplier = 1.2;
        if (target.styleType === 'PURE_GOLD') {
            target.maxHealth = 3;
            target.health = 3;
            target.gravMultiplier = 1.5;
        }
        if (target.styleType === 'GHOST') {
            target.wireframe = true; 
        }
        
        updateTargetHealth(target, 0);

        const spinSpeeds = [
            Math.random() * 0.1 - 0.05,
            Math.random() * 0.1 - 0.05
        ];

        if (spinner) {
            
            spinSpeeds[0] = -0.25;
            spinSpeeds[1] = 0;
            target.rotateZ = random(0, TAU);
        }

        const axes = pickOne(axisOptions);

        spinSpeeds.forEach((spinSpeed, i) => {
            switch (axes[i]) {
                case 'x':
                    target.rotateXD = spinSpeed;
                    break;
                case 'y':
                    target.rotateYD = spinSpeed;
                    break;
                case 'z':
                    target.rotateZD = spinSpeed;
                    break;
            }
        });



        
 
        

        
        
        const spawnRadius = 200;
        target.x = Math.random() * spawnRadius * 2 - spawnRadius;
        target.y = 550; 
        target.z = Math.random() * targetRadius * 2 - targetRadius;
        
        
        target.xD = Math.random() * (target.x * -2 / 120);
        target.yD = -25;
        target.zD = 0;
        
        target.yD += Math.random() * 4 - 2;
        
        return target;
    }
})();


const updateTargetHealth = (target, healthDelta) => {
    target.health += healthDelta;
    
    if (!target.wireframe) {
        const strokeWidth = target.health - 1;
        const strokeColor = makeTargetGlueColor(target);
        for (let p of target.polys) {
            p.strokeWidth = strokeWidth;
            p.strokeColor = strokeColor;
        }
    }
};

const returnTarget = target => {
    target.reset();
    const poolKey = target.poolKey;
    if (targetPool.has(poolKey)) {
        targetPool.get(poolKey).push(target);
    }
};

function resetAllTargets() {
    while (targets.length) {
        returnTarget(targets.pop());
    }
}

const frags = [];

const fragPool = new Map(allColors.map(c => ([colorToHex(c), []])));
const fragWireframePool = new Map(allColors.map(c => ([colorToHex(c), []])));

const createBurst = (() => {
    
    const basePositions = mengerSpongeSplit({ x: 0, y: 0, z: 0 }, fragRadius * 2);
    const positions = cloneVertices(basePositions);
    const prevPositions = cloneVertices(basePositions);
    const velocities = cloneVertices(basePositions);

    const basePositionNormals = basePositions.map(normalize);
    const positionNormals = cloneVertices(basePositionNormals);


    const fragCount = basePositions.length;

    function getFragForTarget(target) {
        const pool = target.wireframe ? fragWireframePool : fragPool;
        const colorKey = colorToHex(target.color); 
        if (!pool.has(colorKey)) {
            pool.set(colorKey, []); 
        }

        let frag = pool.get(colorKey).pop();
        if (!frag) {
            frag = new Entity({
                model: makeCubeModel({ scale: fragRadius }),
                color: target.color,
                wireframe: target.wireframe
            });
            frag.color = target.color;
            frag.wireframe = target.wireframe;
        }
        return frag;
    }

    return (target, force = 1) => {
        
        transformVertices(
            basePositions, positions,
            target.x, target.y, target.z,
            target.rotateX, target.rotateY, target.rotateZ,
            1, 1, 1
        );
        transformVertices(
            basePositions, prevPositions,
            target.x - target.xD, target.y - target.yD, target.z - target.zD,
            target.rotateX - target.rotateXD, target.rotateY - target.rotateYD, target.rotateZ - target.rotateZD,
            1, 1, 1
        );

       
        for (let i = 0; i < fragCount; i++) {
            const position = positions[i];
            const prevPosition = prevPositions[i];
            const velocity = velocities[i];

            velocity.x = position.x - prevPosition.x;
            velocity.y = position.y - prevPosition.y;
            velocity.z = position.z - prevPosition.z;
        }



       
        transformVertices(
            basePositionNormals, positionNormals,
            0, 0, 0,
            target.rotateX, target.rotateY, target.rotateZ,
            1, 1, 1
        );


        for (let i = 0; i < fragCount; i++) {
            const position = positions[i];
            const velocity = velocities[i];
            const normal = positionNormals[i];

            const frag = getFragForTarget(target);

            frag.x = position.x;
            frag.y = position.y;
            frag.z = position.z;
            frag.rotateX = target.rotateX;
            frag.rotateY = target.rotateY;
            frag.rotateZ = target.rotateZ;

           
            let burstSpeed = 4 * force; 
            let drag = 1; 
            let grav = 1; 
           
            if (target.styleType === 'CASH') {
                drag = 3; 
                grav = 0.6;
                burstSpeed *= 2;
            }
           
            else if (target.styleType === 'GOLD' || target.styleType === 'PURE_GOLD') {
                drag = 0.5; 
                grav = 1.2; 
                if (target.styleType === 'PURE_GOLD') burstSpeed *= 2;
            }
           
            else {
                drag = 1;
                grav = 1;
            }

            
            if (target.isRainbow) {
                
                frag.color = {
                    r: randomInt(100, 255),
                    g: randomInt(100, 255),
                    b: randomInt(100, 255)
                };
                frag.wireframe = true;
            } else {
                frag.color = target.color;
                frag.wireframe = target.wireframe;
            }


            const randSpeed = 4 * force; 
            const rotateScale = 0.015;

            frag.xD = velocity.x + (normal.x * burstSpeed) + (Math.random() * randSpeed);
            frag.yD = velocity.y + (normal.y * burstSpeed) + (Math.random() * randSpeed);
            frag.zD = velocity.z + (normal.z * burstSpeed) + (Math.random() * randSpeed);

            
            frag.dragMultiplier = drag;
            frag.gravMultiplier = grav;

            frag.rotateXD = frag.xD * rotateScale;
            frag.rotateYD = frag.yD * rotateScale;
            frag.rotateZD = frag.zD * rotateScale;

           
            if (frags.length < MAX_FRAGS) {
                frags.push(frag);
            } else {
                returnFrag(frag);
            }
        };
    }
})();

const returnFrag = frag => {
    frag.reset();
    const pool = frag.wireframe ? fragWireframePool : fragPool;
    const colorKey = colorToHex(frag.color); 
    if (!pool.has(colorKey)) {
        pool.set(colorKey, []);
    }

    pool.get(colorKey).push(frag);
};

const sparks = [];
const sparkPool = [];

function addSpark(x, y, xD, yD) {
    const spark = sparkPool.pop() || {};

    spark.x = x + xD * 0.5;
    spark.y = y + yD * 0.5;
    spark.xD = xD;
    spark.yD = yD;
    spark.life = random(200, 300);
    spark.maxLife = spark.life;

    
    if (sparks.length < MAX_SPARKS) {
        sparks.push(spark);
    } else {
        returnSpark(spark);
    }

    return spark;
}

function sparkBurst(x, y, count, maxSpeed) {
    const angleInc = TAU / count;
    for (let i = 0; i < count; i++) {
        const angle = i * angleInc + angleInc * Math.random();
        const speed = (1 - Math.random() ** 3) * maxSpeed;
        addSpark(
            x,
            y,
            Math.sin(angle) * speed,
            Math.cos(angle) * speed
        );
    }
}

let glueShedVertices;
function glueShedSparks(target) {
    if (!glueShedVertices) {
        glueShedVertices = cloneVertices(target.vertices);
    } else {
        copyVerticesTo(target.vertices, glueShedVertices);
    }

    glueShedVertices.forEach(v => {
        if (Math.random() < 0.4) {
            projectVertex(v);
            addSpark(
                v.x,
                v.y,
                random(-12, 12),
                random(-12, 12)
            );
        }
    });
}

function returnSpark(spark) {
    sparkPool.push(spark);
}

const hudContainerNode = $('.hud');

function setHudVisibility(visible) {
    if (visible) {
        hudContainerNode.style.display = 'block';
    } else {
        hudContainerNode.style.display = 'none';
    }
}

const scoreNode = $('.score-lbl');
const cubeCountNode = $('.cube-count-lbl');

function renderScoreHud() {
    if (isCasualGame()) {
        scoreNode.style.display = 'none';
        cubeCountNode.style.opacity = 1;
    } else {
        scoreNode.innerText = `SCORE: ${state.game.score}`;
        scoreNode.style.display = 'block';
        cubeCountNode.style.opacity = 0.65;
    }
    cubeCountNode.innerText = `CUBES SMASHED: ${state.game.cubeCount}`;
}

renderScoreHud();

handlePointerDown($('.pause-btn'), () => pauseGame());

const slowmoNode = $('.slowmo');
const slowmoBarNode = $('.slowmo__bar');

function renderSlowmoStatus(percentRemaining) {
    slowmoNode.style.opacity = percentRemaining === 0 ? 0 : 1;
    slowmoBarNode.style.transform = `scaleX(${percentRemaining.toFixed(3)})`;
}

const menuContainerNode = $('.menus');
const menuMainNode = $('.menu--main');
const menuPauseNode = $('.menu--pause');
const menuScoreNode = $('.menu--score');

const menuGuideNode = $('.menu--guide');
const finalScoreLblNode = $('.final-score-lbl');
const highScoreLblNode = $('.high-score-lbl');

function showMenu(node) {
    node.classList.add('active');
}

function hideMenu(node) {
    node.classList.remove('active');
}

function renderMenus() {
    hideMenu(menuMainNode);
    hideMenu(menuPauseNode);
    hideMenu(menuScoreNode);
    hideMenu(menuGuideNode);

    switch (state.menus.active) {
        case MENU_MAIN:
            showMenu(menuMainNode);
            break;
        case MENU_GUIDE:
            showMenu(menuGuideNode);
            break;
        case MENU_PAUSE:
            showMenu(menuPauseNode);
            break;
        case MENU_SCORE:
           
            const deathTitles = [
                "LOST IN SHADOWS",      
                "SYSTEM CRASH",         
                "DELETED",             
                "FROZEN SOLID",        
                "INCINERATED",          
                "SOURCE CORRUPTED",     
                "VAPORIZED",            
                "ASCENSION FAILED"     
            ];
            const titleNode = document.querySelector('.game-over-title');
            if (titleNode) {
                
                const idx = Math.max(0, BiomeManager.currentTheme);
                const titleText = deathTitles[idx] || "GAME OVER";
                
               
                titleNode.innerHTML = '';
                titleText.split('').forEach((char, i) => {
                    const span = document.createElement('span');
                    span.className = 'game-over-letter';
                    span.textContent = char === ' ' ? '\u00A0' : char; 
                    span.style.animation = `letterPop 0.5s forwards`;
                    span.style.animationDelay = `${i * 0.05}s`;
                    titleNode.appendChild(span);
                });
                
               
                titleNode.className = 'game-over-title'; 
                if (idx === 3) titleNode.classList.add('text-ice');
                else if (idx === 4) titleNode.classList.add('text-magma');
                else if (idx === 5) titleNode.classList.add('text-glitch');
            }

            
            const targetScore = state.game.score;
            let currentDisplayScore = 0;
            const duration = 1500;
            const startTime = performance.now();
            
            function animateScore(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
               
                const ease = 1 - Math.pow(1 - progress, 3);
                
                currentDisplayScore = Math.floor(targetScore * ease);
                finalScoreLblNode.textContent = formatNumber(currentDisplayScore);
                
                if (progress < 1 && state.menus.active === MENU_SCORE) {
                   
                    if (currentDisplayScore % 50 === 0 && sfx.playTone) {
                      
                    }
                    requestAnimationFrame(animateScore);
                } else {
                     finalScoreLblNode.textContent = formatNumber(targetScore);
                }
            }
            requestAnimationFrame(animateScore);

            if (isNewHighScore()) {
                highScoreLblNode.textContent = 'New High Score!';
               
                 titleNode.style.color = "#FFD700";
            } else {
                highScoreLblNode.textContent = `High Score: ${formatNumber(getHighScore())}`;
                titleNode.style.color = ""; 
            }
            showMenu(menuScoreNode);
            break;
    }

    setHudVisibility(!isMenuVisible());
    menuContainerNode.classList.toggle('has-active', isMenuVisible());
    menuContainerNode.classList.toggle('interactive-mode', isMenuVisible() && pointerIsDown);
}

renderMenus();


handleClick($('.play-normal-btn'), () => {
    setGameMode(GAME_MODE_RANKED);
    setActiveMenu(null);
    resetGame();
});

handleClick($('.play-casual-btn'), () => {
    setGameMode(GAME_MODE_CASUAL);
    setActiveMenu(null);
    resetGame();
});

handleClick($('.resume-btn'), () => resumeGame());
handleClick($('.menu-btn--pause'), () => setActiveMenu(MENU_MAIN));

handleClick($('.play-again-btn'), () => {
    setActiveMenu(null);
    resetGame();
});

handleClick($('.menu-btn--score'), () => setActiveMenu(MENU_MAIN));




function setActiveMenu(menu) {
    state.menus.active = menu;
    renderMenus();
    
   
    if (typeof BackgroundMusic !== 'undefined') {
        BackgroundMusic.update(menu);
    }
}

function setScore(score) {
    state.game.score = score;
    renderScoreHud();
}

function incrementScore(inc) {
    if (isInGame()) {
        state.game.score += inc;
        if (state.game.score < 0) {
            state.game.score = 0;
        }
        renderScoreHud();
    }
}

function setCubeCount(count) {
    state.game.cubeCount = count;
    renderScoreHud();
}

function incrementCubeCount(inc) {
    if (isInGame()) {
        state.game.cubeCount += inc;
        renderScoreHud();
    }
}

function setGameMode(mode) {
    state.game.mode = mode;
}

function resetGame() {
    resetAllTargets();
    
    
    frags.length = 0;
    sparks.length = 0;
    lightningBolts.length = 0;
    
    state.game.time = 0;
    resetAllCooldowns();
    setScore(0);
    setCubeCount(0);
    spawnTime = getSpawnDelay();
    DifficultyManager.reset();
    
   
    BiomeManager.reset();
}

function pauseGame() {
    if (isInGame()) {
        setActiveMenu(MENU_PAUSE);
        
        // Show interstitial when pausing (revenue opportunity)
        if (typeof window.showInterstitialAtGameOver === 'function') {
            window.showInterstitialAtGameOver();
        }
    }
}

function resumeGame() {
    isPaused() && setActiveMenu(null);
}

function endGame() {
    console.log("🔄 Game Over - Showing animated score...");

    
    if (state.game.score >= 2000) {
        showLegendaryCelebration();
    }

    setActiveMenu(MENU_SCORE);

    const finalScoreNode = $('.final-score-lbl');
    const highScoreNode = $('.high-score-lbl');
    const celebrationContainer = $('.celebration-container');
    const finalScore = state.game.score;
    const isNewHigh = isNewHighScore();

    
    if (finalScoreNode) {
        let currentCount = 0;
        const duration = 1500;
        const increment = finalScore / (duration / 16);
        
        const counter = setInterval(() => {
            currentCount += increment;
            if (currentCount >= finalScore) {
                currentCount = finalScore;
                clearInterval(counter);
                
                
                if (isNewHigh && celebrationContainer) {
                    celebrationContainer.style.display = 'block';
                    createConfetti();
                    playHighScoreSound();
                    setHighScore(finalScore);
                }
            }
            finalScoreNode.textContent = formatNumber(Math.floor(currentCount));
        }, 16);
    }

   
    if (highScoreNode) {
        setTimeout(() => {
            if (isNewHigh) {
                highScoreNode.textContent = '🏆 NEW HIGH SCORE! 🏆';
                highScoreNode.style.color = '#ffd700';
            } else {
                highScoreNode.textContent = `High Score: ${formatNumber(getHighScore())}`;
                highScoreNode.style.color = '#a78bfa';
            }
        }, 1600);
    }

    if (typeof window.showInterstitialAtGameOver === 'function') {
        window.showInterstitialAtGameOver();
    }
}

function createConfetti() {
    const colors = ['#60d4fa', '#a78bfa', '#f472b6', '#ffd700', '#ff6b6b'];
    const container = $('.celebration-container');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

function playHighScoreSound() {
    if (settings.sfxVolume <= 0) return;
    
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
   
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
        setTimeout(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(settings.sfxVolume * 0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
        }, i * 150);
    });
}

function showLegendaryCelebration() {
    const overlay = document.createElement('div');
    overlay.id = 'legendary-overlay';
    
    overlay.innerHTML = `
        <div class="god-rays"></div>
        <div class="supernova-burst"></div>
        <div class="legendary-content">
            <h1 class="legend-text">LEGENDARY</h1>
            <div class="legend-score">${formatNumber(state.game.score)}</div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    
    setTimeout(() => sfx.playTone(100, 'sawtooth', 2.0), 0);
    setTimeout(() => sfx.playTone(200, 'square', 1.0), 500);
    setTimeout(() => sfx.playTone(400, 'sine', 0.5), 1000);
    
   
    requestAnimationFrame(() => overlay.style.opacity = '1');
    
    
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 1000);
    }, 5000);
}

window.addEventListener('keydown', event => {
    if (event.key === 'p') {
        isPaused() ? resumeGame() : pauseGame();
    }
});

let spawnTime = 0;
const maxSpawnX = 450;
const pointerDelta = { x: 0, y: 0 };
const pointerDeltaScaled = { x: 0, y: 0 };

const slowmoDuration = 1500;



const minPointerSpeed = 5;
let slowmoRemaining = 0;
let spawnExtra = 0;
const spawnExtraDelay = 300;
let targetSpeed = 1;



function triggerChainReaction(sourceTerm) {
    const range = 2000;
    let hitCount = 0;

   
    targets.forEach(t => {
        if (t === sourceTerm || t.hit) return; 
        
        const dist = Math.hypot(t.x - sourceTerm.x, t.y - sourceTerm.y); 
        if (dist < range) {
             
             t.health = 0;
             t.hit = true; 
             hitCount++;
             
            
             lightningBolts.push({
                 x1: sourceTerm.x, y1: sourceTerm.y,
                 x2: t.x, y2: t.y,
                 life: 20, 
                 width: 6 
             });

            
             createBurst(t, 2); 
             incrementScore(20);

            
             setTimeout(() => {
                 playLightningSound();
             }, Math.random() * 100); 
        }
    });

   
    if (hitCount === 0 || hitCount > 0) {
       playLightningSound();
    }
}

function tick(width, height, simTime, simSpeed, lag) {
    PERF_START('frame');
    PERF_START('tick');

    DifficultyManager.update(state.game.score);
    BiomeManager.update(state.game.score);

   
    spawnTime -= simTime;
    if (spawnTime <= 0) {
        if (spawnExtra > 0) {
            spawnExtra--;
            spawnTime = spawnExtraDelay;
        } else {
            spawnTime = getSpawnDelay();
        }
        const target = getTarget();
        targets.push(target);
    }

    state.game.time += simTime;

    
    const time = state.game.time;
    targets.forEach(t => {
        
        if (t.styleType === 'CASH') {
            const pulse = (Math.sin(time * 0.005) + 1) * 0.5;
            const r = lerp(0, 100, pulse);
            t.color = { r: r, g: 255, b: 136 };
        }
        
        else if (t.styleType === 'GOLD') {
            const shimmer = Math.sin(time * 0.003 + t.x * 0.01);
           
            t.color = {
                r: 255,
                g: 215 + shimmer * 20,
                b: 0 + Math.max(0, shimmer * 50)
            };
        }
        
        else if (t.styleType === 'ROSE') {
            const hot = (Math.sin(time * 0.008) + 1) * 0.5;
            t.color = {
                r: 255,
                g: 110 + hot * 40,
                b: 121 + hot * 20
            };
        }
        else if (t.styleType === 'PURE_GOLD') {
            const shimmer = Math.sin(time * 0.015 + t.x * 0.05);
            t.color = {
                r: 255,
                g: 245 + shimmer * 10,
                b: 150 + shimmer * 100
            };
        }
        else if (t.styleType === 'ICE') {
           
            const shiver = Math.sin(time * 0.1) * 2;
            t.rotateYD += shiver * 0.001;
            t.color = { r: 180 + shiver * 10, g: 255, b: 255 }; 
        }
        else if (t.styleType === 'MAGMA') {
            
            const pulse = (Math.sin(time * 0.02) + 1) * 0.5; 
            t.scaleX = t.scaleY = t.scaleZ = 1 + pulse * 0.15;
            t.color = { r: 255, g: 50 + pulse * 50, b: 0 };
        }
        else if (t.styleType === 'QUANTUM') {
           
            if (Math.random() < 0.06) { 
                 t.x += (Math.random() - 0.5) * 60;
                 t.y += (Math.random() - 0.5) * 60;
            }
           
            t.color = { r: 100, g: 0, b: Math.random() > 0.5 ? 255 : 150 };
        }
        else if (t.styleType === 'MATRIX') {
            
            t.polys.forEach(p => {
                if (Math.random() < 0.05) {
                    p.wireframe = false; 
                    p.color = { r: 200, g: 255, b: 200 };
                } else {
                    p.wireframe = true;
                    p.color = t.color;
                }
            });
            
            const pulse = (Math.sin(time * 0.2) + 1) * 0.5;
            t.color = { 
                r: 0, 
                g: 150 + pulse * 105, 
                b: 20 
            };
        }

       
        if (t.isRainbow) {
            const hue = (time * 0.15) % 360;
            t.color = {
                r: Math.sin(hue * Math.PI / 180) * 127 + 128,
                g: Math.sin((hue + 120) * Math.PI / 180) * 127 + 128,
                b: Math.sin((hue + 240) * Math.PI / 180) * 127 + 128
            };
            
            t.polys.forEach(p => {
                p.strokeWidth = 4 + Math.sin(time * 0.02) * 2;
            });
        }

        
        if (!t.hit) {
            t.polys.forEach(p => {
                p.color = t.color;
                p.styleType = t.styleType; 
                
                
                if (t.wireframe) { 
                    p.wireframe = true;
                    p.strokeColor = colorToHex(t.color);
                    p.strokeWidth = 2;
                }
            });
        }
    });

    if (slowmoRemaining > 0) {
        slowmoRemaining -= simTime;
        if (slowmoRemaining < 0) {
            slowmoRemaining = 0;
        }
        targetSpeed = pointerIsDown ? 0.075 : 0.3;
    } else {
        const menuPointerDown = isMenuVisible() && pointerIsDown;
        targetSpeed = menuPointerDown ? 0.025 : 1;
    }

   
    if (slowmoRemaining > 0 || targets.some(t => t.isRainbow)) {
        const hue = (state.game.time / 8) % 360;
        const rainbowColor = {
            r: Math.sin(hue * Math.PI / 180) * 127 + 128,
            g: Math.sin((hue + 120) * Math.PI / 180) * 127 + 128,
            b: Math.sin((hue + 240) * Math.PI / 180) * 127 + 128
        };

        targets.forEach(t => {
            if (t.isRainbow) {
                t.color = rainbowColor;
                
                t.polys.forEach(p => {
                    p.color = rainbowColor;
                    p.strokeColor = colorToHex(rainbowColor);
                    
                    p.strokeWidth = 3 + Math.sin(state.game.time * 0.02) * 1.5;
                });
            }
        });
    }

    renderSlowmoStatus(slowmoRemaining / slowmoDuration);

    gameSpeed += (targetSpeed - gameSpeed) / 22 * lag;
    gameSpeed = clamp(gameSpeed, 0, 1);

    const centerX = width / 2;
    const centerY = height / 2;

    const simAirDrag = 1 - (airDrag * simSpeed);
    const simAirDragSpark = 1 - (airDragSpark * simSpeed);

    
    const forceMultiplier = 1 / (simSpeed * 0.75 + 0.25);
    pointerDelta.x = 0;
    pointerDelta.y = 0;
    pointerDeltaScaled.x = 0;
    pointerDeltaScaled.y = 0;
    const lastPointer = touchPoints[touchPoints.length - 1];

    if (pointerIsDown && lastPointer && !lastPointer.touchBreak) {
        pointerDelta.x = (pointerScene.x - lastPointer.x);
        pointerDelta.y = (pointerScene.y - lastPointer.y);
        pointerDeltaScaled.x = pointerDelta.x * forceMultiplier;
        pointerDeltaScaled.y = pointerDelta.y * forceMultiplier;
    }
    const pointerSpeed = Math.hypot(pointerDelta.x, pointerDelta.y);
    const pointerSpeedScaled = pointerSpeed * forceMultiplier;

    
    touchPoints.forEach(p => p.life -= simTime);

    if (pointerIsDown) {
        touchPoints.push({
            x: pointerScene.x,
            y: pointerScene.y,
            life: touchPointLife
        });
    }

    while (touchPoints[0] && touchPoints[0].life <= 0) {
        touchPoints.shift();
    }


    
    PERF_START('entities');

    
    const leftBound = -centerX + targetRadius;
    const rightBound = centerX - targetRadius;
    const ceiling = -centerY - 120;
    const boundDamping = 0.4;

    targetLoop:
    for (let i = targets.length - 1; i >= 0; i--) {
        const target = targets[i];

       
        if (target.hit && target.health <= 0) {
            targets.splice(i, 1);
            returnTarget(target);
            continue;
        }

        
        for (let j = i - 1; j >= 0; j--) {
            const other = targets[j];
            const dx = target.x - other.x;
            const dy = target.y - other.y;
            const distSq = dx*dx + dy*dy;
            const minDist = targetRadius * 2.2;
            
            if (distSq < minDist * minDist && distSq > 0) {
                const dist = Math.sqrt(distSq);
                const force = (minDist - dist) / dist; 
                const repulsionX = dx * force * 0.05;
                const repulsionY = dy * force * 0.05;
                
                target.xD += repulsionX;
                target.yD += repulsionY;
                other.xD -= repulsionX;
                other.yD -= repulsionY;
            }
        }

        target.x += target.xD * simSpeed;
        target.y += target.yD * simSpeed;
        target.z += target.zD * simSpeed; 

       
        const maxVel = 25; 
        if (target.xD > maxVel) target.xD = maxVel;
        if (target.xD < -maxVel) target.xD = -maxVel;
        if (target.yD > maxVel) target.yD = maxVel;
       

        if (target.y < ceiling) {
            target.y = ceiling;
            target.yD = 0;
        }

        if (target.x < leftBound) {
            target.x = leftBound;
            target.xD *= -boundDamping;
            
            target.x += 1;
        } else if (target.x > rightBound) {
            target.x = rightBound;
            target.xD *= -boundDamping;
            target.x -= 1;
        }

        if (target.z < backboardZ) {
            target.z = backboardZ;
            target.zD *= -boundDamping;
        }

        target.yD += gravity * simSpeed;
        target.rotateX += target.rotateXD * simSpeed;
        target.rotateY += target.rotateYD * simSpeed;
        target.rotateZ += target.rotateZD * simSpeed;
        target.transform();
        target.project();

        
        
        if (target.y > centerY + targetHitRadius * 4) { 
            returnTarget(target);
            targets.splice(i, 1);
            i--;
            if (isInGame()) {
                if (isCasualGame()) {
                    incrementScore(-25);
                } else {
                    endGame();
                }
            }
            continue;
        }
       
        const hitTestCount = Math.ceil(pointerSpeed / targetRadius * 2);
        
        for (let ii = 1; ii <= hitTestCount; ii++) {
            const percent = 1 - (ii / hitTestCount);
            const hitX = pointerScene.x - pointerDelta.x * percent;
            const hitY = pointerScene.y - pointerDelta.y * percent;
            const distance = Math.hypot(
                hitX - target.projected.x,
                hitY - target.projected.y
            );

            if (distance <= targetHitRadius) {
               
                if (!target.hit) {
                    target.hit = true;

                    target.xD += pointerDeltaScaled.x * hitDampening;
                    target.yD += pointerDeltaScaled.y * hitDampening;
                    target.rotateXD += pointerDeltaScaled.y * 0.001;
                    target.rotateYD += pointerDeltaScaled.x * 0.001;

                    const sparkSpeed = 7 + pointerSpeedScaled * 0.125;

                    if (pointerSpeedScaled > minPointerSpeed) {
                        target.health--;
                        incrementScore(10);

                        if (target.health <= 0) {
                            incrementCubeCount(1);
                            createBurst(target, forceMultiplier);
                            sparkBurst(hitX, hitY, 8, sparkSpeed);

                            
                            if (target.styleType === 'ICE') {
                                slowmoRemaining = 600;
                                playSlowMoSound();
                                
                                
                                const flash = document.createElement('div');
                                flash.style.position = 'fixed';
                                flash.style.top = '0';
                                flash.style.left = '0';
                                flash.style.width = '100%';
                                flash.style.height = '100%';
                                flash.style.backgroundColor = 'rgba(0, 255, 255, 0.3)';
                                flash.style.pointerEvents = 'none';
                                flash.style.zIndex = '9999';
                                document.body.appendChild(flash);
                                setTimeout(() => flash.remove(), 150);
                            }

                           
                            if (target.styleType === 'LIGHTNING') {
                                triggerChainReaction(target);
                              
                                const flash = document.createElement('div');
                                flash.style.position = 'fixed';
                                flash.style.top = '0';
                                flash.style.left = '0';
                                flash.style.width = '100%';
                                flash.style.height = '100%';
                                flash.style.backgroundColor = 'rgba(255, 255, 0, 0.5)'; // Yellow
                                flash.style.pointerEvents = 'none';
                                flash.style.zIndex = '9999';
                                document.body.appendChild(flash);
                                setTimeout(() => flash.remove(), 150);
                            }

                           
                            if (target.wireframe || target.isRainbow) {
                                if (target.styleType !== 'ICE' && target.styleType !== 'LIGHTNING') {
                                     playSlowMoSound(); 
                                }
                                slowmoRemaining = slowmoDuration;
                                spawnTime = 0;
                                spawnExtra = 2;
                            } else {
                                playBurstSound();
                            }

                            targets.splice(i, 1);
                            returnTarget(target);
                        } else {
                            sparkBurst(hitX, hitY, 8, sparkSpeed);
                            glueShedSparks(target);
                            updateTargetHealth(target, 0);
                            playHitSound(); 
                        }
                    } else {
                        incrementScore(5);
                        sparkBurst(hitX, hitY, 3, sparkSpeed);
                    }
                    
                    
                }
                
                continue targetLoop;
            }
        }

        
        target.hit = false;
    }

   
    const fragBackboardZ = backboardZ + fragRadius;


    
    const fragLeftBound = -width;
    const fragRightBound = width;

    for (let i = frags.length - 1; i >= 0; i--) {
        const frag = frags[i];
        frag.x += frag.xD * simSpeed;
        frag.y += frag.yD * simSpeed;
        frag.z += frag.zD * simSpeed;

       
        const currentDrag = 1 - ((airDrag * (frag.dragMultiplier || 1)) * simSpeed);
        frag.xD *= currentDrag;
        frag.yD *= currentDrag;
        frag.zD *= currentDrag;

        if (frag.y < ceiling) {
            frag.y = ceiling;
            frag.yD = 0;
        }

        if (frag.z < fragBackboardZ) {
            frag.z = fragBackboardZ;
            frag.zD *= -boundDamping;
        }

        frag.yD += gravity * (frag.gravMultiplier || 1) * simSpeed;
        frag.rotateX += frag.rotateXD * simSpeed;
        frag.rotateY += frag.rotateYD * simSpeed;
        frag.rotateZ += frag.rotateZD * simSpeed;
        frag.transform();
        frag.project();
        
        
        if (!frag.spawnTime) frag.spawnTime = state.game.time;
        const fragAge = state.game.time - frag.spawnTime;

       
        if (
            
            frag.projected.y > centerY + targetHitRadius ||
            
            frag.projected.x < -centerX ||
            frag.projected.x > centerX ||
           
            frag.z > cameraFadeEndZ ||
            
            fragAge > 5000
        ) {
            frags.splice(i, 1);
            returnFrag(frag);
            continue;
        }
    }

   
    for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.life -= simTime;
        if (spark.life <= 0) {
            sparks.splice(i, 1);
            returnSpark(spark);
            continue;
        }
        spark.x += spark.xD * simSpeed;
        spark.y += spark.yD * simSpeed;
        spark.xD *= simAirDragSpark;
        spark.yD *= simAirDragSpark;
        spark.yD += gravity * simSpeed;
    }

    PERF_END('entities');
    
    PERF_START('3D');
   
    allVertices.length = 0;
    allPolys.length = 0;
    allShadowVertices.length = 0;
    allShadowPolys.length = 0;
    targets.forEach(entity => {
        allVertices.push(...entity.vertices);
        allPolys.push(...entity.polys);
        allShadowVertices.push(...entity.shadowVertices);
        allShadowPolys.push(...entity.shadowPolys);
    });

    frags.forEach(entity => {
        allVertices.push(...entity.vertices);
        allPolys.push(...entity.polys);
        allShadowVertices.push(...entity.shadowVertices);
        allShadowPolys.push(...entity.shadowPolys);
    });

    
    allPolys.forEach(p => computePolyNormal(p, 'normalWorld'));
    allPolys.forEach(computePolyDepth);
    allPolys.sort((a, b) => b.depth - a.depth);

   
    allVertices.forEach(projectVertex);

    allPolys.forEach(p => computePolyNormal(p, 'normalCamera'));

    PERF_END('3D');

    PERF_START('shadows');

   
    transformVertices(
        allShadowVertices,
        allShadowVertices,
        0, 0, 0,
        TAU / 8, 0, 0,
        1, 1, 1
    );

    allShadowPolys.forEach(p => computePolyNormal(p, 'normalWorld'));

    const shadowDistanceMult = Math.hypot(1, 1);
    const shadowVerticesLength = allShadowVertices.length;
    for (let i = 0; i < shadowVerticesLength; i++) {
        const distance = allVertices[i].z - backboardZ;
        allShadowVertices[i].z -= shadowDistanceMult * distance;
    }
    transformVertices(
        allShadowVertices,
        allShadowVertices,
        0, 0, 0,
        -TAU / 8, 0, 0,
        1, 1, 1
    );
    allShadowVertices.forEach(projectVertex);

    PERF_END('shadows');

    PERF_END('tick');
}

function draw(ctx, width, height, viewScale) {
    PERF_START('draw');

    const halfW = width / 2;
    const halfH = height / 2;
    
   
    const theme = BiomeManager.getCurrentColors();
    const currentShadow = theme.shadow;
    const currentSpark = theme.spark;
    
    
    ctx.lineJoin = 'bevel';

    PERF_START('drawShadows');
    ctx.fillStyle = currentShadow;
    ctx.strokeStyle = currentShadow;
    allShadowPolys.forEach(p => {
        if (p.wireframe) {
            ctx.lineWidth = 2;
            ctx.beginPath();
            const { vertices } = p;
            const vCount = vertices.length;
            const firstV = vertices[0];
            ctx.moveTo(firstV.x, firstV.y);
            for (let i = 1; i < vCount; i++) {
                const v = vertices[i];
                ctx.lineTo(v.x, v.y);
            }
            ctx.closePath();
            ctx.stroke();
        } else {
            ctx.beginPath();
            const { vertices } = p;
            const vCount = vertices.length;
            const firstV = vertices[0];
            ctx.moveTo(firstV.x, firstV.y);
            for (let i = 1; i < vCount; i++) {
                const v = vertices[i];
                ctx.lineTo(v.x, v.y);
            }
            ctx.closePath();
            ctx.fill();
        }
    });
    PERF_END('drawShadows');

    PERF_START('drawPolys');

    allPolys.forEach(p => {
        if (!p.wireframe && p.normalCamera.z < 0) return;

        if (p.strokeWidth !== 0) {
            ctx.lineWidth = p.normalCamera.z < 0 ? p.strokeWidth * 0.5 : p.strokeWidth;
            ctx.strokeStyle = p.normalCamera.z < 0 ? p.strokeColorDark : p.strokeColor;
        }

        const { vertices } = p;
        const lastV = vertices[vertices.length - 1];
        const fadeOut = p.middle.z > cameraFadeStartZ;

        if (!p.wireframe) {
            
            ctx.globalAlpha = 1;
            const normalLight = p.normalWorld.y * 0.5 + p.normalWorld.z * -0.5;

            
            let lightness = normalLight > 0
                ? 0.1
                : ((normalLight ** 32 - normalLight) / 2) * 0.9 + 0.1;

            
            if (lightness > 0.45) {
               
                lightness += (lightness - 0.45) * 1.5;
            }

           
            const rim = (1 - Math.abs(p.normalCamera.z)) ** 3;
            lightness += rim * 0.6; 

           
        
            if (p.styleType === undefined && p.color.g > 200 && p.color.b < 150) {
                
            }

            const isCash = (p.color.g > 240 && p.color.r < 150);
            const isGold = (p.color.r > 240 && p.color.g > 180 && p.color.b < 100);
            const isSilver = (p.color.r > 200 && p.color.g > 200 && p.color.b > 200);

            
            let sheenNormal = p.middle.y;
            if (isCash) {
                
                sheenNormal = (p.middle.y * 0.2) + (performance.now() * 0.08);
            } else if (isGold) {
                
                sheenNormal = (p.middle.x * p.middle.y) * 0.1 + performance.now() * 0.005;
            }

            const sheenWave = Math.sin(sheenNormal * 0.1);

            if (isCash && Math.abs(sheenWave) > 0.8) {
                lightness += 0.4;
            }
            if (isGold && Math.random() > 0.95) {
                lightness += 0.8; 
            }
            if (isSilver) {
                
                const reflection = Math.sin(p.normalWorld.y * 10 + 2);
                if (reflection > 0.9) lightness += 0.5;
            }

            if (p.styleType === 'GHOST') {
                ctx.globalAlpha = 0.3 + Math.random() * 0.3;
               
                ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${ctx.globalAlpha})`;
            } 
            else if (p.styleType === 'MATRIX') {
                
                 const grad = ctx.createLinearGradient(0, p.middle.y - 40, 0, p.middle.y + 40);
                 const offset = (performance.now() * 0.003) % 1;
                 
                
                 grad.addColorStop(Math.max(0, offset - 0.2), `rgba(0, 50, 0, 0.9)`);
                 grad.addColorStop(offset, `rgba(180, 255, 180, 1)`);
                 grad.addColorStop(Math.min(1, offset + 0.2), `rgba(0, 50, 0, 0.9)`);
                 
                 ctx.shadowBlur = 10;
                 ctx.shadowColor = '#0f0';
                 ctx.fillStyle = grad;
                 ctx.globalAlpha = 0.9;
            } 
            else if (p.styleType === 'LIGHTNING') {
                
                lightness = 0.8 + Math.sin(performance.now() * 0.02) * 0.2;
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#ffff00';
                ctx.fillStyle = shadeColor(p.color, lightness);
            }
            else {
                ctx.shadowBlur = 0;
                ctx.fillStyle = shadeColor(p.color, lightness);
            }
        }

       
        if (fadeOut) {
            
            ctx.globalAlpha = Math.max(0, 1 - (p.middle.z - cameraFadeStartZ) / cameraFadeRange);
        }

        ctx.beginPath();
        if (p.styleType === 'LIGHTNING') {
            
             ctx.moveTo(
                 lastV.x + (Math.random() - 0.5) * 4, 
                 lastV.y + (Math.random() - 0.5) * 4
             );
             for (let v of vertices) {
                 ctx.lineTo(
                     v.x + (Math.random() - 0.5) * 4,
                     v.y + (Math.random() - 0.5) * 4
                 );
             }
        } else {
             ctx.moveTo(lastV.x, lastV.y);
             for (let v of vertices) {
                 ctx.lineTo(v.x, v.y);
             }
        }

        if (!p.wireframe) {
            ctx.fill();
        }
        if (p.strokeWidth !== 0) {
            ctx.stroke();
        }

        if (fadeOut) {
            ctx.globalAlpha = 1;
        }
    });
    PERF_END('drawPolys');

    PERF_START('draw2D');
   
    sparks.forEach(spark => {
        ctx.beginPath();
        const scale = (spark.life / spark.maxLife) ** 0.5 * 1.5;

      
        ctx.lineWidth = sparkThickness * scale;
        ctx.strokeStyle = currentSpark;
        ctx.moveTo(spark.x, spark.y);
        ctx.lineTo(spark.x - spark.xD * scale, spark.y - spark.yD * scale);
        ctx.stroke();

        ctx.lineWidth = sparkThickness * scale * 0.5;
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(spark.x, spark.y);
        ctx.lineTo(spark.x - spark.xD * scale, spark.y - spark.yD * scale);
        ctx.stroke();
    });
    
    ctx.strokeStyle = touchTrailColor;
    const touchPointCount = touchPoints.length;
    for (let i = 1; i < touchPointCount; i++) {
        const current = touchPoints[i];
        const prev = touchPoints[i - 1];
        if (current.touchBreak || prev.touchBreak) {
            continue;
        }
        const scale = current.life / touchPointLife;
        ctx.lineWidth = scale * touchTrailThickness;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(current.x, current.y);
        ctx.stroke();
    }

    PERF_END('draw2D');

   
    if (lightningBolts.length > 0) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        for (let i = lightningBolts.length - 1; i >= 0; i--) {
            const bolt = lightningBolts[i];
            bolt.life--;
            
            if (bolt.life <= 0) {
                lightningBolts.splice(i, 1);
                continue;
            }

            const alpha = bolt.life / 25;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = bolt.width * (1 + Math.random()) * 2;
            ctx.strokeStyle = '#ffff00';
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#ffff00';

            const segments = 8; 
            const dx = (bolt.x2 - bolt.x1) / segments;
            const dy = (bolt.y2 - bolt.y1) / segments;

            
            ctx.beginPath();
            ctx.moveTo(bolt.x1, bolt.y1);
            let cx = bolt.x1;
            let cy = bolt.y1;
            let points = [{x: cx, y: cy}];

            for (let j = 0; j < segments; j++) {
                cx += dx;
                cy += dy;
                const jitter = (Math.random() - 0.5) * 60 * alpha;
                points.push({x: cx + jitter, y: cy + jitter});
            }
            points[points.length-1] = {x: bolt.x2, y: bolt.y2};

            for (let pt of points) {
                 ctx.lineTo(pt.x, pt.y);
            }
            ctx.stroke();

           
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let pt of points) {
                 ctx.lineTo(pt.x, pt.y);
            }
            ctx.stroke();
            
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }
    }

    PERF_END('draw');
    PERF_END('frame');

   
    PERF_UPDATE();
}

function setupCanvases() {
    const ctx = canvas.getContext('2d');
    
    const dpr = window.devicePixelRatio || 1;
   
    let viewScale;
   
    let width, height;

    function handleResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        viewScale = h / 1000;
        width = w / viewScale;
        height = h / viewScale;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
    }

    
    handleResize();
    
    window.addEventListener('resize', handleResize);


    
    let lastTimestamp = 0;
    function frameHandler(timestamp) {
        let frameTime = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

       
        raf();

        
        if (isPaused()) return;

        
        if (frameTime < 0) {
            frameTime = 17;
        }
        
        if (frameTime < 0) {
            frameTime = 17;
        }
        else if (frameTime > 68) {
            frameTime = 68;
        }

        const halfW = width / 2;
        const halfH = height / 2;

        
        pointerScene.x = pointerScreen.x / viewScale - halfW;
        pointerScene.y = pointerScreen.y / viewScale - halfH;

        const lag = frameTime / 16.6667;
       
        const simTime = gameSpeed * frameTime * DifficultyManager.currentSpeed;
        const simSpeed = gameSpeed * lag * DifficultyManager.currentSpeed;
        tick(width, height, simTime, simSpeed, lag);

       
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const drawScale = dpr * viewScale;
        ctx.scale(drawScale, drawScale);
        ctx.translate(halfW, halfH);
        
        draw(ctx, width, height, viewScale);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    const raf = () => requestAnimationFrame(frameHandler);
    
    raf();
}


// Idle Detection for Interstitial Ads
let idleTimer = null;
const IDLE_TIMEOUT = 30000; // 30 seconds

function resetIdleTimer() {
    clearTimeout(idleTimer);
    
    if (isInGame() && !isPaused()) {
        idleTimer = setTimeout(() => {
            console.log('⏱️ Player idle - showing interstitial');
            pauseGame();
        }, IDLE_TIMEOUT);
    }
}

function clearIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = null;
}


function enterFocusMode() {
    document.body.classList.add("focus-mode");
    clearTimeout(window._focusTimeout);
    window._focusTimeout = setTimeout(() => {
        document.body.classList.remove("focus-mode");
    }, 300);
}

function handleCanvasPointerDown(x, y) {
    if (!pointerIsDown) {
        pointerIsDown = true;
        pointerScreen.x = x;
        pointerScreen.y = y;
        if (isMenuVisible()) renderMenus();
        
        if (isInGame()) {
            enterFocusMode();
            resetIdleTimer();
        }
    }
}

function handleCanvasPointerUp() {
    if (pointerIsDown) {
        pointerIsDown = false;
        touchPoints.push({
            touchBreak: true,
            life: touchPointLife
        });
        
        if (isMenuVisible()) renderMenus();
    }
}

function handleCanvasPointerMove(x, y) {
    if (pointerIsDown) {
        pointerScreen.x = x;
        pointerScreen.y = y;
       
        if (isInGame()) enterFocusMode();
    }
}

if ('PointerEvent' in window) {
    canvas.addEventListener('pointerdown', event => {
        event.isPrimary && handleCanvasPointerDown(event.clientX, event.clientY);
    });

    canvas.addEventListener('pointerup', event => {
        event.isPrimary && handleCanvasPointerUp();
    });

    canvas.addEventListener('pointermove', event => {
        event.isPrimary && handleCanvasPointerMove(event.clientX, event.clientY);
    });

   
    document.body.addEventListener('mouseleave', handleCanvasPointerUp);
} else {
    let activeTouchId = null;
    canvas.addEventListener('touchstart', event => {
        if (!pointerIsDown) {
            const touch = event.changedTouches[0];
            activeTouchId = touch.identifier;
            handleCanvasPointerDown(touch.clientX, touch.clientY);
        }
    });
    canvas.addEventListener('touchend', event => {
        for (let touch of event.changedTouches) {
            if (touch.identifier === activeTouchId) {
                handleCanvasPointerUp();
                break;
            }
        }
    });
    canvas.addEventListener('touchmove', event => {
        for (let touch of event.changedTouches) {
            if (touch.identifier === activeTouchId) {
                handleCanvasPointerMove(touch.clientX, touch.clientY);
                event.preventDefault();
                break;
            }
        }
    }, { passive: false });
}

window.shareGame = async function () {
    const texts = [
        "I just went berserk on SwipeFury! 🔥 Can you survive longer?",
        "SwipeFury is INSANE! Think you can top my score?",
        "Warning: SwipeFury is highly addictive ⚡ Beat me if you dare!",
        "Just hit a crazy combo in SwipeFury! Try and beat this!",
        "SwipeFury = pure rage and glory 😈 Come get wrecked!",
        "My fingers are on fire from SwipeFury! Your turn!",
    ];
    const msg = texts[Math.floor(Math.random() * texts.length)];

    try {
        if (navigator.share) {
            await navigator.share({
                title: "SwipeFury",
                text: msg,
                url: window.location.href
            });
        } else {
            await navigator.clipboard.writeText(window.location.href);
            alert("Score copied! Share it with friends 🔥");
        }
    } catch (err) {
        console.log("Share failed:", err);
    }
};


const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isLowEndDevice = isMobile && (navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4);


const qualitySettings = {
    particleLimit: isLowEndDevice ? 30 : 100,
    shadowQuality: isLowEndDevice ? 'low' : 'high',
    effectsEnabled: !isLowEndDevice
};


const MAX_FRAGS = qualitySettings.particleLimit;
const MAX_SPARKS = qualitySettings.particleLimit;

function initGame() {
    setupCanvases();
    resetGame();
    setActiveMenu(MENU_MAIN);
    
    
    if (isLowEndDevice) {
        console.log('🔧 Performance Mode: ON (Low-end device detected)');
        console.log(`📊 Particle Limit: ${MAX_FRAGS}`);
    } else {
        console.log('⚡ Full Quality Mode: ON');
    }
}


initGame();


window.addEventListener('load', () => {
    setTimeout(loadAdsSafe, 2500);
    setTimeout(loadPWA, 4000);
});


let adsInitialized = false;
let interstitialReady = false;
let interstitialAttempts = 0;
const MAX_ATTEMPTS = 3;


function initializeAds() {
    if (adsInitialized) return;
    adsInitialized = true;
    console.log("🎯 Ads system initialized after user interaction");
    
    loadBannerAd();
    
    // PERFORMANCE: Delay interstitial preload on slow networks/devices
    const delay = isLowEndDevice ? 5000 : 2000; // 5s for low-end, 2s for normal
    setTimeout(preloadInterstitialAd, delay);
}


function preloadInterstitialAd() {
    if (interstitialReady) return;
    
    // PERFORMANCE: Check network speed before loading
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const slowNetwork = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    
    if (slowNetwork) {
        console.log("🐌 Slow network detected - delaying ad preload");
        setTimeout(preloadInterstitialAd, 10000); // Retry in 10s
        return;
    }
    
    console.log("🔄 Preloading interstitial...");
    const script = document.createElement("script");
    script.dataset.zone = "10203402";
    script.src = "https://nap5k.com/tag.min.js";
    script.async = true;
    
    // PERFORMANCE: Set timeout to prevent hanging
    let loadTimeout = setTimeout(() => {
        console.warn("⏱️ Interstitial preload timeout - will retry");
        script.remove();
        interstitialReady = false;
        // Retry after 15 seconds
        setTimeout(preloadInterstitialAd, 15000);
    }, 10000); // 10 second timeout

    script.onload = () => {
        clearTimeout(loadTimeout);
        interstitialReady = true;
        interstitialAttempts = 0;
        console.log("✅ Interstitial PRELOADED and READY for game over");
    };

    script.onerror = () => {
        clearTimeout(loadTimeout);
        console.warn("❌ Interstitial preload failed");
        // PERFORMANCE: Exponential backoff retry
        const retryDelay = Math.min(30000, 5000 * Math.pow(2, interstitialAttempts));
        setTimeout(preloadInterstitialAd, retryDelay);
    };

    document.body.appendChild(script);
}


function showInterstitialWithRetry() {
    interstitialAttempts++;
    console.log(`🎯 Attempt ${interstitialAttempts} to show interstitial`);
    
    if (interstitialReady && window.mntag && typeof window.mntag.show === "function") {
        try {
            window.mntag.show();
            console.log("💰 INTERSTITIAL SHOWN - REVENUE EARNED!");
            
            
            interstitialReady = false;
            setTimeout(preloadInterstitialAd, 1000);
            return true;
            
        } catch (error) {
            console.error("Error showing ad:", error);
        }
    }
    
    
    if (interstitialAttempts < MAX_ATTEMPTS) {
        console.log(`🔄 Retrying in 500ms... (${interstitialAttempts}/${MAX_ATTEMPTS})`);
        setTimeout(showInterstitialWithRetry, 500);
    } else {
        console.warn("❌ All attempts failed - will try next game");
        preloadInterstitialAd();
    }
    
    return false;
}


let lastAdTime = 0;
const AD_COOLDOWN = 90000;

window.showInterstitialAtGameOver = function() {
    const now = Date.now();
    
   
    if (now - lastAdTime < AD_COOLDOWN) {
        console.log(`⏱️ Ad cooldown active (${Math.round((AD_COOLDOWN - (now - lastAdTime)) / 1000)}s remaining)`);
        return;
    }
    
    console.log("🎮 Game Over - Starting interstitial display");
    lastAdTime = now;
    interstitialAttempts = 0;
    setTimeout(showInterstitialWithRetry, 800);
};


function loadBannerAd() {
    try {
        // PERFORMANCE: Use requestIdleCallback for non-blocking load
        const loadAd = () => {
            const adContainer = document.createElement('div');
            adContainer.id = 'monetag-ads';
            adContainer.className = 'monetag-container';
            adContainer.dataset.zone = '10203415';
            
            adContainer.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                z-index: 1000;
                pointer-events: auto;
            `;
            
            document.body.appendChild(adContainer);
            
            const script = document.createElement("script");
            script.dataset.zone = "10203415";
            script.src = "https://groleegni.net/vignette.min.js";
            script.async = true;
            
            // PERFORMANCE: Low priority loading
            if ('loading' in HTMLScriptElement.prototype) {
                script.loading = 'lazy';
            }
            
            script.onerror = () => {
                console.log('📊 Banner ad blocked or failed');
            };
            
            document.body.appendChild(script);
            console.log("✅ Banner ad loaded");
        };
        
        // PERFORMANCE: Load banner when browser is idle
        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadAd, { timeout: 2000 });
        } else {
            setTimeout(loadAd, 1000);
        }
        
    } catch (error) {
        console.log('📊 Banner loading skipped:', error.message);
    }
}


document.addEventListener("click", initializeAds, { once: true });
document.addEventListener("touchstart", initializeAds, { once: true });


setTimeout(() => {
    if (!adsInitialized) initializeAds();
}, 5000);

function loadAdsSafe() {
   
    initializeAds();
}

function loadPWA() {
   
}

function loadShareButton() {
   
}

console.log("🎯 Reliable Ad System Loaded!");



 