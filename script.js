/**
 * CYBERPUNK TERMINAL ENGINE & MATRIX BACKGROUND ANIMATION
 */

// --- 1. Matrix Rain Background Canvas ---
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let width, height, columns, drops;
const characters = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
const fontSize = 16;

function initMatrix() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  columns = Math.floor(width / fontSize);
  drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
  }
}

function drawMatrix() {
  ctx.fillStyle = 'rgba(5, 6, 10, 0.08)';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#00ff66';
  ctx.font = `${fontSize}px 'Fira Code', monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = characters.charAt(Math.floor(Math.random() * characters.length));
    const x = i * fontSize;
    const y = drops[i] * fontSize;

    // Occasionally highlight a leading glyph in bright white/cyan
    if (Math.random() > 0.95) {
      ctx.fillStyle = '#ffffff';
    } else {
      ctx.fillStyle = '#ff0044'; // Cyber red rain to match alert theme
    }

    ctx.fillText(text, x, y);

    if (y > height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
  requestAnimationFrame(drawMatrix);
}

window.addEventListener('resize', initMatrix);
initMatrix();
requestAnimationFrame(drawMatrix);


// --- 2. Live System Clock & Telemetry ---
const clockDisplay = document.getElementById('clock-display');
const nodeIdDisplay = document.getElementById('node-id');

function updateClock() {
  const now = new Date();
  const timeString = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
  clockDisplay.textContent = `${timeString} LOC`;
}
setInterval(updateClock, 50);
updateClock();

// Random hex node ID
const randomNode = '0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase();
nodeIdDisplay.textContent = `NODE: ${randomNode}`;


// --- 3. Live Terminal Feed Simulation ---
const terminalFeed = document.getElementById('terminal-feed');
const terminalLogs = [
  { prefix: '[CRYPT_INJECT]', text: 'Injecting poly-cipher into shadow partition 0x90...', type: 't-prompt' },
  { prefix: '[PORT_SCAN]', text: 'Ports 22, 80, 443, 8080 compromised. Tunnel open.', type: 't-warn' },
  { prefix: '[ROOT_HOOK]', text: 'Kernel syscall table rewritten successfully.', type: 't-success' },
  { prefix: '[EXFIL_BURST]', text: 'Uploading encrypted packet payload (14.2 MB/s)...', type: 't-prompt' },
  { prefix: '[NET_BYPASS]', text: 'DNS sinkhole redirected to spoofed gateway.', type: 't-warn' },
  { prefix: '[INTEG_CHECK]', text: 'Hardware watchdogs suppressed by ring-0 driver.', type: 't-success' },
  { prefix: '[AGENT_SYNC]', text: 'Peer nodes 192.168.4.11 / 10.0.8.4 aligned.', type: 't-prompt' }
];

let logIndex = 0;
function appendLog() {
  if (!terminalFeed) return;
  const log = terminalLogs[logIndex % terminalLogs.length];
  logIndex++;

  const line = document.createElement('div');
  line.className = 'terminal-line';
  line.innerHTML = `<span class="${log.type}">${log.prefix}</span> ${log.text}`;
  terminalFeed.appendChild(line);

  // Keep terminal feed clean
  if (terminalFeed.children.length > 20) {
    terminalFeed.removeChild(terminalFeed.firstElementChild);
  }
  terminalFeed.scrollTop = terminalFeed.scrollHeight;

  playBeep(880, 0.03, 'sine');
}

// Stagger log injection intervals
setInterval(appendLog, 3200);


// --- 4. Synthesized Audio Engine (Web Audio API) ---
let audioCtx = null;
let soundEnabled = false;
const soundBtn = document.getElementById('sound-btn');
const soundLabel = document.getElementById('sound-label');

function toggleSound() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  soundEnabled = !soundEnabled;
  soundLabel.textContent = soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';
  soundBtn.style.borderColor = soundEnabled ? 'var(--color-neon-cyan)' : 'rgba(255, 255, 255, 0.25)';

  if (soundEnabled) {
    playBeep(1200, 0.1, 'triangle');
  }
}
soundBtn.addEventListener('click', toggleSound);

function playBeep(frequency, duration, type = 'sine') {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Graceful fallback if audio is restricted
  }
}


// --- 5. Interactive "Force Purge" Sequence ---
const rebootBtn = document.getElementById('reboot-btn');
let isPurging = false;

rebootBtn.addEventListener('click', () => {
  if (isPurging) return;
  isPurging = true;

  playBeep(440, 0.25, 'sawtooth');

  // Trigger screen glitch burst
  document.body.style.filter = 'invert(0.9) hue-rotate(180deg)';
  setTimeout(() => {
    document.body.style.filter = 'none';
  }, 120);

  const purgeLine = document.createElement('div');
  purgeLine.className = 'terminal-line';
  purgeLine.innerHTML = `<span class="t-prompt">[PURGE_INIT]</span> Initiating emergency cache flush & watchdog reset...`;
  terminalFeed.appendChild(purgeLine);

  rebootBtn.querySelector('.btn-text').textContent = 'PURGING CORE...';

  setTimeout(() => {
    const successLine = document.createElement('div');
    successLine.className = 'terminal-line';
    successLine.innerHTML = `<span class="t-success">[SUCCESS]</span> Buffer purged. Breach contained temporarily.`;
    terminalFeed.appendChild(successLine);
    terminalFeed.scrollTop = terminalFeed.scrollHeight;

    rebootBtn.querySelector('.btn-text').textContent = 'PURGE COMPLETED';
    playBeep(1760, 0.15, 'triangle');

    setTimeout(() => {
      rebootBtn.querySelector('.btn-text').textContent = 'FORCE PURGE CORE';
      isPurging = false;
    }, 3000);
  }, 1500);
});
