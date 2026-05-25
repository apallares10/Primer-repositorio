// ══════════════════════
//  CONSTANTES TABLERO
// ══════════════════════
const BOARD=[
  {t:'casa',      icon:'🏠',label:'SALIDA\n+$2K',        band:'band-gold',  corner:true},   //0
  {t:'carrera',   icon:'🛣️',label:'CARRERA\nNOVENA',     band:'band-green', corner:false},  //1
  {t:'azar',      icon:'❓',label:'AZAR',                 band:'band-orange',corner:false},  //2
  {t:'mejora',    icon:'⭐',label:'MEJORA',               band:'band-purple',corner:false},  //3
  {t:'pinchazo',  icon:'🔧',label:'PINCHAZO',             band:'band-red',   corner:false},  //4
  {t:'carrera',   icon:'🛣️',label:'CARRERA\nCENTRO',     band:'band-green', corner:false},  //5
  {t:'azar',      icon:'❓',label:'AZAR',                 band:'band-orange',corner:false},  //6
  {t:'mejora',    icon:'⭐',label:'MEJORA',               band:'band-purple',corner:false},  //7
  {t:'trancon',   icon:'🚦',label:'TRANCÓN',              band:'band-blue',  corner:false},  //8
  {t:'plaza',     icon:'🌆',label:'PLAZA\nALFONSO\nLÓPEZ',band:'band-gold', corner:true},   //9

  {t:'carrera',   icon:'🛣️',label:'CARRERA\nGUATAPURÍ',  band:'band-green', corner:false},  //10
  {t:'azar',      icon:'❓',label:'AZAR',                 band:'band-orange',corner:false},  //11
  {t:'mejora',    icon:'⭐',label:'MEJORA',               band:'band-purple',corner:false},  //12
  {t:'hospital',  icon:'🏥',label:'HOSPITAL\nCARRERA',   band:'band-teal',  corner:false},  //13
  {t:'azar',      icon:'❓',label:'AZAR',                 band:'band-orange',corner:false},  //14
  {t:'pinchazo',  icon:'🔧',label:'PINCHAZO',             band:'band-red',   corner:false},  //15
  {t:'carrera',   icon:'🛣️',label:'CARRERA\nRÍO',        band:'band-green', corner:false},  //16
  {t:'azar',      icon:'❓',label:'AZAR',                 band:'band-orange',corner:false},  //17

  {t:'reten',     icon:'🚨',label:'RETÉN\nLA CEIBA',     band:'band-gold',  corner:true},   //18
  {t:'mejora',    icon:'⭐',label:'MEJORA',               band:'band-purple',corner:false},  //19
  {t:'balneario', icon:'🏖️',label:'BALNEARIO\nHURTADO', band:'band-teal',  corner:false},  //20
  {t:'azar',      icon:'❓',label:'AZAR',                 band:'band-orange',corner:false},  //21
  {t:'carrera',   icon:'🛣️',label:'CARRERA\nGUATAPURÍ', band:'band-green', corner:false},  //22
  {t:'mejora',    icon:'⭐',label:'MEJORA',               band:'band-purple',corner:false},  //23
  {t:'guatapuri', icon:'🛍️',label:'C.C.\nGUATAPURÍ',    band:'band-pink',  corner:false},  //24
  {t:'azar',      icon:'❓',label:'AZAR',                 band:'band-orange',corner:false},  //25
  {t:'trancon',   icon:'🚦',label:'TRANCÓN\nNOVENA',     band:'band-blue',  corner:false},  //26
  {t:'pilonera',  icon:'🥁',label:'PILONERA\nMAYOR',     band:'band-gold',  corner:true},   //27

  {t:'carrera',   icon:'🛣️',label:'VALLEDUPAR\nCARRERA', band:'band-lime',  corner:false},  //28
  {t:'azar',      icon:'❓',label:'AZAR',                 band:'band-orange',corner:false},  //29
  {t:'mejora',    icon:'⭐',label:'MEJORA',               band:'band-purple',corner:false},  //30
  {t:'pinchazo',  icon:'🔧',label:'PINCHAZO',             band:'band-red',   corner:false},  //31
  {t:'carrera',   icon:'🛣️',label:'CARRERA\nSIERRA',     band:'band-lime',  corner:false},  //32
  {t:'azar',      icon:'❓',label:'AZAR',                 band:'band-orange',corner:false},  //33
  {t:'mejora',    icon:'⭐',label:'MEJORA',               band:'band-purple',corner:false},  //34
  {t:'trancon',   icon:'🚦',label:'TRANCÓN\nRINGLETE',   band:'band-blue',  corner:false},  //35
];

const TOTAL=BOARD.length;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const masterGain = audioCtx.createGain();
masterGain.gain.value = 0.32;
masterGain.connect(audioCtx.destination);
let currentVolume = 0.65;
let ambientPlaying = false;
let ambientTimer = null;

function unlockAudio(){
  if(audioCtx.state === 'suspended') audioCtx.resume();
}

function createTone(freq, type='sine', duration=0.18, gainValue=0.16, pan=0){
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const panNode = audioCtx.createStereoPanner();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain).connect(panNode).connect(masterGain);
  panNode.pan.value = pan;
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function createNoise(duration=0.08, gainValue=0.12){
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
  const src = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();
  src.buffer = buffer;
  gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  src.connect(gain).connect(masterGain);
  src.start();
}

function createSweep(start, end, duration=0.35, gainValue=0.16, type='sawtooth'){
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(start, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(end, audioCtx.currentTime + duration);
  gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain).connect(masterGain);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function scheduleAmbient(){
  const now = audioCtx.currentTime + 0.05;
  const pattern = [262, 294, 330, 349, 330, 294, 262];
  pattern.forEach((freq, i) => {
    const start = now + i * 0.32;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = i % 2 === 0 ? 'triangle' : 'square';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.11, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
    osc.connect(gain).connect(masterGain);
    osc.start(start);
    osc.stop(start + 0.5);
  });

  const bass = [110, 110, 98, 98];
  bass.forEach((freq, i) => {
    const start = now + i * 0.75;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.065, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
    osc.connect(gain).connect(masterGain);
    osc.start(start);
    osc.stop(start + 0.5);
  });

  setTimeout(() => createNoise(0.08, 0.08), 180);
}

function playSound(name){
  unlockAudio();
  switch(name){
    case 'click':
      createTone(900, 'square', 0.08, 0.18, 0);
      createNoise(0.06, 0.08);
      break;
    case 'dice':
      createSweep(1800, 220, 0.28, 0.16, 'sawtooth');
      createNoise(0.28, 0.14);
      setTimeout(()=>createTone(950, 'triangle', 0.08, 0.1, 0), 160);
      break;
    case 'move':
      createTone(520, 'triangle', 0.09, 0.14, -0.15);
      break;
    case 'success':
      createTone(880, 'triangle', 0.14, 0.18, 0.2);
      setTimeout(()=>createTone(1040, 'sine', 0.12, 0.14, -0.2), 90);
      break;
    case 'error':
      createTone(220, 'sine', 0.22, 0.18, 0);
      createNoise(0.06, 0.1);
      break;
    case 'modal':
      createTone(720, 'triangle', 0.14, 0.16, 0);
      createNoise(0.05, 0.06);
      break;
    case 'win':
      createTone(700, 'triangle', 0.16, 0.16, -0.3);
      setTimeout(()=>createTone(920, 'triangle', 0.16, 0.16, 0.3), 120);
      setTimeout(()=>createTone(1160, 'triangle', 0.16, 0.16, 0), 240);
      break;
  }
}

function startAmbient(){
  if(ambientPlaying) return;
  unlockAudio();
  ambientPlaying = true;
  scheduleAmbient();
  ambientTimer = setInterval(scheduleAmbient, 2200);
  toast('🎶 Vallenato ambiente encendido');
  updateAudioButton();
}

function stopAmbient(){
  if(!ambientPlaying) return;
  ambientPlaying = false;
  if(ambientTimer){
    clearInterval(ambientTimer);
    ambientTimer = null;
  }
  toast('🔇 Música apagada');
  updateAudioButton();
}

function updateAudioButton(){
  const btn=document.getElementById('btn-audio-toggle');
  if(!btn) return;
  btn.textContent = ambientPlaying ? '🔊 Vallenato' : '🔇 Vallenato';
  btn.classList.toggle('active', ambientPlaying);
  document.body.classList.toggle('music-active', ambientPlaying);
}

function toggleMusic(){
  playSound('click');
  if(ambientPlaying){
    stopAmbient();
  } else {
    startAmbient();
  }
}

function rumbleScreen(){
  document.body.classList.add('screen-rumble');
  setTimeout(()=>document.body.classList.remove('screen-rumble'), 360);
}

function setMusicVolume(value){
  const slider=document.getElementById('volume-slider');
  if(slider){ slider.value = value; }
  currentVolume = Number(value);
  masterGain.gain.value = currentVolume * 0.42;
}

window.addEventListener('DOMContentLoaded', ()=>{
  const slider=document.getElementById('volume-slider');
  if(slider){
    slider.value = currentVolume;
    slider.addEventListener('input', ()=> setMusicVolume(slider.value));
  }
  updateAudioButton();
});

// Layout: 10 top (0-9), 8 right (10-17), 10 bottom (18-27), 8 left (28-35)
let TW=70,TH=70;
function tileXY(i){
  if(i<=9)  return {x:i*TW,       y:0};
  if(i<=17) return {x:9*TW,       y:(i-9)*TH};
  if(i<=27) return {x:(27-i)*TW,  y:9*TH};
  return          {x:0,           y:(9-(i-27))*TH};
}

function calcScale(){
  const ba=document.getElementById('board-area');
  const aw=ba.clientWidth-20, ah=ba.clientHeight-20;
  const bw=10*TW, bh=10*TH;
  const rendW = bw * Math.sqrt(2);
  const rendH = bw * Math.sqrt(2) * Math.sin(50*Math.PI/180);
  const s = Math.min(aw/rendW, ah/rendH, 1.0);
  return s;
}

// ══════════════════════
//  MOTO NAMES & COLORS
// ══════════════════════
const MOTO_NAMES_DEFAULT=['Bajaj Boxer','AKT NKD','TVS Sport','Bajaj Platina'];
const P_FILLS =['#e06820','#9b5fcf','#1e8fd0','#c02810'];
const P_SHADES=['#803010','#5a1f80','#0a4870','#700808'];
const P_CARD_BG=[
  'linear-gradient(145deg,#d05010,#e06820 50%,#b04010)',
  'linear-gradient(145deg,#6b22c0,#8b35e8 50%,#7020b0)',
  'linear-gradient(145deg,#1060c0,#2080e0 50%,#0848a0)',
  'linear-gradient(145deg,#b01010,#d03030 50%,#900808)',
];
const P_SHADOW=['#803010','#35108a','#042060','#600000'];
const P_HDR_BG=[
  'linear-gradient(135deg,#ff8030,#c05010)',
  'linear-gradient(135deg,#9b5fcf,#5a1f80)',
  'linear-gradient(135deg,#2090e0,#0848a0)',
  'linear-gradient(135deg,#d02020,#800808)',
];
const MOTO_ICONS=['🛵','🏍️','🛺','🚗'];
const DICE_FACES=['⚀','⚁','⚂','⚃','⚄','⚅'];
const MOTO_OFF=[{dx:2,dy:2},{dx:26,dy:2},{dx:2,dy:26},{dx:26,dy:26}];

const UPG_DEFS=[
  {id:'casco',  icon:'⛑️',label:'Casco',  cls:'ul-casco'},
  {id:'papeles',icon:'📄',label:'Papeles',cls:'ul-papeles'},
  {id:'manten', icon:'🔧',label:'Taller', cls:'ul-manten'},
  {id:'app',    icon:'📱',label:'App',    cls:'ul-app'},
];

// ══════════════════════
//  CARDS
// ══════════════════════
const AZAR=[
  {icon:'💰',t:'Cliente Generoso',   txt:'¡Qué buena propina!',              $:5000,g:0, skip:false,neg:false,reten:false},
  {icon:'📋',t:'Multa en la Novena', txt:'¡Me pillaron mal parqueado!',       $:-2000,g:0,skip:false,neg:true, reten:false},
  {icon:'👥',t:'Carrera Colectiva',  txt:'¡Dos conocidos pal mismo lado!',    $:3000,g:0, skip:false,neg:false,reten:false},
  {icon:'⛽',t:'Tanqueo Full',       txt:'¡Estación con buen precio!',        $:0,g:3,    skip:false,neg:false,reten:false},
  {icon:'🌧️',t:'Aguacero Vallenato',txt:'¡Se vino el agua! Mejor espero.',  $:0,g:0,    skip:true, neg:false,reten:false},
  {icon:'🚨',t:'Retén Sorpresa',    txt:'¡El retén! O pago o pierdo la moto.',$:0,g:0,   skip:false,neg:true, reten:true},
  {icon:'📅',t:'Día sin Moto',      txt:'Decretaron día sin moto.',           $:1000,g:0, skip:true, neg:false,reten:false},
  {icon:'💍',t:'Carrera Especial',  txt:'¡Novia apurada a su boda!',         $:4000,g:0, skip:false,neg:false,reten:false},
  {icon:'🤝',t:'Desvare de Colega', txt:'Empujé la moto de un compañero.',   $:1000,g:-1,skip:false,neg:false,reten:false},
  {icon:'⛓️',t:'Cadena Suelta',     txt:'¡Toca tensionar la cadena!',        $:0,g:-1,   skip:false,neg:false,reten:false},
  {icon:'🕵️',t:'Pasajero Culebrero',txt:'¡No pagó completo!',               $:-1000,g:0,skip:false,neg:true, reten:false},
  {icon:'👴',t:'Carrera por la Paz',txt:'Abuelito gratis al hospital.',      $:0,g:2,    skip:false,neg:false,reten:false},
];

const CARRERAS=[
  {icon:'🏥',dest:'Hospitalito',        tipo:'Imprudente', $:3000,g:-1,txt:'Me metí en contravía por el afán.'},
  {icon:'🏥',dest:'Hospitalito',        tipo:'Responsable',$:4000,g:-1,txt:'Manejé con cuidado y respeté las cebras.'},
  {icon:'🏙️',dest:'El Centro',         tipo:'Imprudente', $:4500,g:-3,txt:'Casi me llevo un espejo zigzagueando.'},
  {icon:'🏙️',dest:'El Centro',         tipo:'Responsable',$:5500,g:-3,txt:'¡Conductor ejemplar! El cliente me felicitó.'},
  {icon:'🌆',dest:'Plaza Alfonso López',tipo:'Imprudente', $:6000,g:-5,txt:'Me pasé el semáforo en amarillo.'},
  {icon:'🌆',dest:'Plaza Alfonso López',tipo:'Responsable',$:7500,g:-5,txt:'Frené en cada esquina; la seguridad es primero.'},
  {icon:'🛍️',dest:'C.C. Guatapurí',   tipo:'Imprudente', $:3000,g:-2,txt:'Llevé al cliente muy asustado.'},
  {icon:'🛍️',dest:'C.C. Guatapurí',   tipo:'Responsable',$:4000,g:-2,txt:'Servicio de lujo y manejo suave.'},
  {icon:'🏖️',dest:'Balneario Hurtado', tipo:'Imprudente', $:4000,g:-3,txt:'Me fui pitándole a todo el mundo.'},
  {icon:'🏖️',dest:'Balneario Hurtado', tipo:'Responsable',$:5000,g:-3,txt:'Manejé disfrutando la brisa.'},
  {icon:'🥁',dest:'La Pilonera Mayor',  tipo:'Imprudente', $:3000,g:-2,txt:'Me subí al andén para saltarme el trancón.'},
  {icon:'🥁',dest:'La Pilonera Mayor',  tipo:'Responsable',$:4000,g:-2,txt:'Dando el ejemplo de buen vallenato.'},
  {icon:'🎺',dest:'Valledupar',         tipo:'Imprudente', $:3000,g:-1,txt:'Corrí por el carreón.'},
  {icon:'🎺',dest:'Valledupar',         tipo:'Responsable',$:4500,g:-1,txt:'Disfruté el trayecto con vallenato de fondo.'},
];

const MEJORAS=[
  {id:'casco',  icon:'⛑️',name:'Casco Reglamentario',   desc:'-1G por carrera.',          cost:2000},
  {id:'papeles',icon:'📄',name:'Papeles al Día',         desc:'Inmune retenes. +$1K/carr.',cost:3000},
  {id:'manten', icon:'🔧',name:'Mantenimiento',          desc:'Inmune pinchazos. +2G.',    cost:2000},
  {id:'app',    icon:'📱',name:'App de Transporte',      desc:'Ignora cartas negativas.',  cost:2000},
];

const MOTO_3D_COLORS=['#e06820','#9b5fcf','#1e8fd0','#c02810'];
const MOTO_3D_LABELS=['🟠','🟣','🔵','🔴'];

const ICON_3D = {
  '🏠': 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3e0/emoji.svg',
  '🛣️': 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f6e3/emoji.svg',
  '❓': 'https://fonts.gstatic.com/s/e/notoemoji/latest/2753/emoji.svg',
  '⭐': 'https://fonts.gstatic.com/s/e/notoemoji/latest/2b50/emoji.svg',
  '🔧': 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f527/emoji.svg',
  '🚦': 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f6a6/emoji.svg',
  '🚨': 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f6a8/emoji.svg',
  '🌆': 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f306/emoji.svg',
  '🏥': 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3e5/emoji.svg',
  '🥁': 'https://fonts.gstatic.com/s/e/notoemoji/latest/1fa98/emoji.svg',
  '🏖️': 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3d6/emoji.svg',
  '🛍️': 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f6cd/emoji.svg',
  '🛵': 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f6f5/emoji.svg',
  '🏍️': 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3cd/emoji.svg',
  '🛺': 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f6fa/emoji.svg',
  '🏆': 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/emoji.svg',
};

function get3DIcon(emoji, size=20){
  const url=ICON_3D[emoji];
  if(url) return `<img src="${url}" width="${size}" height="${size}" style="image-rendering:crisp-edges;filter:drop-shadow(1px 2px 3px rgba(0,0,0,0.35))" onerror="this.style.display='none';this.nextSibling.style.display='inline'"/><span style="display:none;font-size:${size*0.7}px">${emoji}</span>`;
  return `<span style="font-size:${size*0.7}px">${emoji}</span>`;
}

function motoSVG(fill, shade, small=false){
  const w=small?40:54, h=small?38:52;
  const light=lightenColor(fill,40);
  const dark=darkenColor(fill,30);
  const uid=fill.replace('#','');
  return`<svg viewBox="0 0 56 54" xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <radialGradient id="wh${uid}" cx="40%" cy="35%">
      <stop offset="0%" stop-color="#777"/>
      <stop offset="100%" stop-color="#111"/>
    </radialGradient>
    <linearGradient id="bd${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${light}"/>
      <stop offset="55%" stop-color="${fill}"/>
      <stop offset="100%" stop-color="${dark}"/>
    </linearGradient>
    <linearGradient id="whl${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#888"/>
      <stop offset="100%" stop-color="#222"/>
    </linearGradient>
  </defs>
  <ellipse cx="28" cy="51" rx="22" ry="3.5" fill="${shade}" opacity="0.3"/>
  <circle cx="10" cy="39" r="9.5" fill="url(#whl${uid})" stroke="#333" stroke-width="1.5"/>
  <circle cx="10" cy="39" r="5.5" fill="#1a1a1a"/>
  <circle cx="10" cy="39" r="2.5" fill="#444"/>
  <circle cx="10" cy="39" r="1" fill="#bbb"/>
  <line x1="10" y1="29.5" x2="10" y2="48.5" stroke="#555" stroke-width="0.7"/>
  <line x1="0.5" y1="39" x2="19.5" y2="39" stroke="#555" stroke-width="0.7"/>
  <line x1="3" y1="32" x2="17" y2="46" stroke="#555" stroke-width="0.7"/>
  <line x1="3" y1="46" x2="17" y2="32" stroke="#555" stroke-width="0.7"/>
  <circle cx="46" cy="40" r="8.5" fill="url(#whl${uid})" stroke="#333" stroke-width="1.5"/>
  <circle cx="46" cy="40" r="5" fill="#1a1a1a"/>
  <circle cx="46" cy="40" r="2" fill="#444"/>
  <circle cx="46" cy="40" r="0.8" fill="#bbb"/>
  <line x1="46" y1="31.5" x2="46" y2="48.5" stroke="#555" stroke-width="0.7"/>
  <line x1="37.5" y1="40" x2="54.5" y2="40" stroke="#555" stroke-width="0.7"/>
  <line x1="40" y1="33.5" x2="52" y2="46.5" stroke="#555" stroke-width="0.7"/>
  <line x1="40" y1="46.5" x2="52" y2="33.5" stroke="#555" stroke-width="0.7"/>
  <path d="M12 37 Q26 32 40 38" stroke="${dark}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M11 37 Q7 43 4 40 Q2 39 3 37" stroke="#777" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="3.5" cy="38.5" rx="1.5" ry="1" fill="#555"/>
  <path d="M11 36 L21 19 L38 17 L50 31 L42 38 Z" fill="url(#bd${uid})" stroke="${dark}" stroke-width="1.2"/>
  <rect x="21" y="25" width="17" height="12" rx="3" fill="${dark}" opacity="0.7"/>
  <rect x="23" y="27" width="13" height="8" rx="2" fill="${shade}" opacity="0.45"/>
  <line x1="22" y1="29" x2="22" y2="36" stroke="rgba(0,0,0,.3)" stroke-width="1"/>
  <line x1="25" y1="27" x2="25" y2="36.5" stroke="rgba(0,0,0,.3)" stroke-width="1"/>
  <line x1="28" y1="26.5" x2="28" y2="36.5" stroke="rgba(0,0,0,.3)" stroke-width="1"/>
  <path d="M21 19 L23 13 L37 12 L38 17 Z" fill="url(#bd${uid})"/>
  <rect x="22" y="10" width="16" height="5" rx="2.5" fill="#111"/>
  <rect x="23" y="10.5" width="14" height="2" rx="1" fill="#2a2a2a"/>
  <path d="M22 20 L36 18" stroke="${light}" stroke-width="1.8" stroke-linecap="round" opacity="0.6"/>
  <line x1="46" y1="17" x2="46" y2="32" stroke="#777" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="39" y1="19" x2="50" y2="14" stroke="#888" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="47" y="11" width="8" height="3.5" rx="1.8" fill="#444"/>
  <ellipse cx="50" cy="30" rx="4.5" ry="3.5" fill="#fff8c0" stroke="#ccc" stroke-width="0.5"/>
  <ellipse cx="50" cy="30" rx="2.8" ry="2" fill="#fff" opacity="0.85"/>
  <ellipse cx="49" cy="29" rx="1" ry="0.7" fill="#fff" opacity="0.5"/>
  <path d="M22 21 L28 17 L33 17.5 L27 22 Z" fill="rgba(255,255,255,0.35)"/>
  <path d="M37 18.5 L34 17 L35.5 20 L38.5 20.5 Z" fill="rgba(255,255,255,0.25)"/>
  <ellipse cx="27" cy="13" rx="5.5" ry="6.5" fill="${fill}" stroke="${dark}" stroke-width="0.8"/>
  <path d="M30 13 Q40 11 48 13.5" stroke="${fill}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <circle cx="27" cy="8" r="6" fill="#111"/>
  <path d="M21.5 7.5 Q27 3 32.5 7.5 Q31.5 13 27 13 Q22.5 13 21.5 7.5Z" fill="#1a1a1a"/>
  <path d="M22.5 7.5 Q27 5 31.5 7.5 Q30.5 11 27 11 Q23.5 11 22.5 7.5Z" fill="#44aaff" opacity="0.8"/>
  <path d="M23.5 7.5 Q27 5.8 30.5 7.5" stroke="rgba(255,255,255,0.45)" stroke-width="1" fill="none"/>
  <ellipse cx="25" cy="5.5" rx="2" ry="1.2" fill="rgba(255,255,255,0.22)" transform="rotate(-15,25,5.5)"/>
</svg>`;
}

function lightenColor(hex, amt){
  const n=parseInt(hex.slice(1),16);
  const r=Math.min(255,((n>>16)&0xff)+amt);
  const g=Math.min(255,((n>>8)&0xff)+amt);
  const b=Math.min(255,(n&0xff)+amt);
  return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}
function darkenColor(hex, amt){
  const n=parseInt(hex.slice(1),16);
  const r=Math.max(0,((n>>16)&0xff)-amt);
  const g=Math.max(0,((n>>8)&0xff)-amt);
  const b=Math.max(0,(n&0xff)-amt);
  return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}

// ══════════════════════
//  GAME STATE
// ══════════════════════
let players=[],numPlayers=2,cur=0,rolling=false,pendCB=null,over=false,turnCount=0;
let tempN=2;

function askNames(n){
  playSound('click');
  tempN=n;
  document.getElementById('start-screen').style.display='none';
  const ns=document.getElementById('name-screen');
  ns.classList.add('show');
  const inp=document.getElementById('name-inputs');
  inp.innerHTML='';
  for(let i=0;i<n;i++){
    inp.innerHTML+=`<div class="name-input-row">
      <span class="moto-ico">${MOTO_ICONS[i]}</span>
      <input id="ni${i}" type="text" placeholder="${MOTO_NAMES_DEFAULT[i]}" maxlength="18" value="${MOTO_NAMES_DEFAULT[i]}"/>
    </div>`;
  }
}

function startWithNames(){
  playSound('success');
  const names=[];
  for(let i=0;i<tempN;i++){
    const v=document.getElementById('ni'+i)?.value.trim();
    names.push(v||MOTO_NAMES_DEFAULT[i]);
  }
  document.getElementById('name-screen').classList.remove('show');
  initGame(tempN,names);
}

function initGame(n,names){
  numPlayers=n; players=[]; over=false; turnCount=0;
  for(let i=0;i<n;i++)
    players.push({i,name:names[i],icon:MOTO_ICONS[i],pos:0,money:9000,gas:10,upg:[],skip:false,elim:false});
  cur=0;
  buildBoard(); buildPanels(); placeMotos(); updPanels(); setTurn();
  document.getElementById('btn-roll').disabled=false;
  updNavbar();
}

// ══════════════════════
//  BOARD SIZE + BUILD
// ══════════════════════
function buildBoard(){
  const sc=document.getElementById('board-scene');
  const iso=document.getElementById('board-iso');
  iso.querySelectorAll('.tile,.moto-wrap').forEach(e=>e.remove());

  const s=calcScale();
  const bw=10*TW*s, bh=10*TH*s;
  sc.style.width=bw+'px'; sc.style.height=bh+'px';
  iso.style.width=(10*TW)+'px'; iso.style.height=(10*TH)+'px';
  iso.style.transformOrigin='50% 50%';
  iso.style.transform=`scale(${s}) rotateX(50deg) rotateZ(-45deg)`;

  document.getElementById('board-base').style.width=(10*TW)+'px';
  document.getElementById('board-base').style.height=(10*TH)+'px';

  const bc=document.getElementById('board-center');
  bc.style.left=TW+'px'; bc.style.top=TH+'px';
  bc.style.width=(8*TW)+'px'; bc.style.height=(8*TH)+'px';

  const f=TW/70;
  document.querySelector('.cl-el').style.fontSize=(26*f)+'px';
  document.querySelector('.cl-el').textContent='El';
  document.querySelector('.cl-rey').style.fontSize=(42*f)+'px';
  document.querySelector('.cl-rey').textContent='Rey';
  document.querySelector('.cl-del').style.fontSize=(24*f)+'px';
  document.querySelector('.cl-del').textContent='del';
  document.querySelector('.cl-reb').style.fontSize=(36*f)+'px';
  document.querySelector('.cl-reb').textContent='Rebusque';

  BOARD.forEach((b,i)=>{
    const {x,y}=tileXY(i);
    const d=document.createElement('div');
    d.className='tile'+(b.corner?' tile-corner':'');
    d.id='t'+i;
    d.style.cssText=`left:${x}px;top:${y}px;width:${TW}px;height:${TH}px;`;

    let bStyle='position:absolute;top:0;left:0;right:0;height:18px;';
    if(i>=10&&i<=17) bStyle='position:absolute;top:0;bottom:0;right:0;width:18px;height:100%;';
    if(i>=18&&i<=27) bStyle='position:absolute;bottom:0;left:0;right:0;height:18px;width:100%;top:auto;';
    if(i>=28)        bStyle='position:absolute;top:0;bottom:0;left:0;width:18px;height:100%;';

    const lines=b.label.split('\n');
    let iStyle='margin-top:15px;';
    if(i>=10&&i<=17) iStyle='margin-top:4px;margin-right:16px;';
    if(i>=18&&i<=27) iStyle='margin-top:4px;';
    if(i>=28)        iStyle='margin-top:4px;margin-left:16px;';

    d.innerHTML=`<div class="tile-band ${b.band}" style="${bStyle}"></div>
      <div class="tile-icon-wrap" style="${iStyle}">${b.icon}</div>
      <div class="tile-label">${lines.join('<br>')}</div>`;
    iso.appendChild(d);
  });
}

// ══════════════════════
//  MOTOS
// ══════════════════════
function placeMotos(){
  const iso=document.getElementById('board-iso');
  iso.querySelectorAll('.moto-wrap').forEach(e=>e.remove());
  players.forEach((p,i)=>{
    if(p.elim)return;
    const wrap=document.createElement('div');
    wrap.className='moto-wrap'; wrap.id='mp'+i;
    wrap.style.cssText=`position:absolute;width:${TW}px;height:${TH}px;z-index:25;pointer-events:none;
      transition:left .4s cubic-bezier(.34,1.56,.64,1),top .4s cubic-bezier(.34,1.56,.64,1);`;
    const svg=document.createElement('div');
    svg.className='moto-svg'; svg.id='mps'+i;
    svg.innerHTML=motoSVG(P_FILLS[i],P_SHADES[i]);
    const badge=document.createElement('div');
    badge.className='moto-badge'; badge.id='mpb'+i;
    wrap.appendChild(svg); wrap.appendChild(badge);
    iso.appendChild(wrap);
    moveMoto(i,p.pos,false);
  });
}

function moveMoto(pi,pos,anim){
  const el=document.getElementById('mp'+pi); if(!el)return;
  playSound('move');
  const{x,y}=tileXY(pos);
  const o=MOTO_OFF[pi%4];
  el.style.left=(x+o.dx)+'px'; el.style.top=(y+o.dy)+'px';
  const sv=document.getElementById('mps'+pi);
  if(anim&&sv){sv.classList.remove('hop');void sv.offsetWidth;sv.classList.add('hop');}
  const p=players[pi];
  const badge=document.getElementById('mpb'+pi);
  if(badge){badge.style.display=p.upg.length?'flex':'none';badge.textContent=p.upg.length;}
}

// ══════════════════════
//  PANELS
// ══════════════════════
function buildPanels(){
  ['panel-left','panel-right'].forEach(id=>document.getElementById(id).innerHTML='');
  players.forEach((p,i)=>{
    const c=document.createElement('div');
    c.className='p-card'; c.id='pc'+i;
    c.style.background=P_CARD_BG[i];
    c.style.boxShadow=`0 6px 0 ${P_SHADOW[i]},0 8px 20px rgba(0,0,0,.4)`;
    const upgHtml=UPG_DEFS.map(u=>`<div class="upg-item locked" id="ui${i}_${u.id}">
      <span class="ui-ico">${u.icon}</span><span>${u.label}</span></div>`).join('');
    c.innerHTML=`<div class="p-card-hdr" style="background:${P_HDR_BG[i]}" id="phdr${i}">
        <svg class="p-avatar" viewBox="0 0 52 50">${motoSVG(P_FILLS[i],P_SHADES[i]).replace(/<svg[^>]*>/,'').replace('</svg>','')}</svg>
        <span class="p-name">${p.icon} ${p.name}</span>
      </div>
      <div class="p-card-body">
        <div class="stat"><span>💰 Plata</span><span class="stat-val" id="pm${i}">$9,000</span></div>
        <div class="stat"><span>⛽ Gas</span><span class="stat-val" id="pg${i}">10G</span></div>
        <div class="gas-bar"><div class="gas-fill" id="pgb${i}" style="width:100%"></div></div>
        <div class="upg-sec">
          <div class="upg-title">✦ Mejoras</div>
          <div class="upg-grid" id="pub${i}">${upgHtml}</div>
        </div>
      </div>`;
    document.getElementById(i<2?'panel-left':'panel-right').appendChild(c);
  });
}

function updPanels(){
  players.forEach((p,i)=>{
    const c=document.getElementById('pc'+i); if(!c)return;
    const active=i===cur&&!p.elim;
    c.className='p-card'+(active?' p-card-active':'')+(p.elim?' p-card-elim':'');
    c.style.background=P_CARD_BG[i];
    c.style.boxShadow=active
      ?`0 0 0 3px #ffe135,0 0 18px rgba(255,220,0,.5),0 6px 0 ${P_SHADOW[i]},0 8px 22px rgba(0,0,0,.4)`
      :`0 6px 0 ${P_SHADOW[i]},0 8px 20px rgba(0,0,0,.4)`;
    const hdr=document.getElementById('phdr'+i);
    if(hdr){
      let ta=hdr.querySelector('.turn-arr');
      if(!ta){ta=document.createElement('div');ta.className='turn-arr';hdr.appendChild(ta);}
      ta.textContent=active?'▶':'';
    }
    const mv=document.getElementById('pm'+i);
    if(mv){mv.textContent='$'+p.money.toLocaleString();mv.className='stat-val'+(p.money<=2000?' low':'');}
    const gv=document.getElementById('pg'+i);
    if(gv){
      gv.textContent=p.gas+'G';
      gv.className='stat-val'+(p.gas<=3?' low':'');
      if(p.gas<=0) gv.textContent='0G ⛽💨';
    }
    const gb=document.getElementById('pgb'+i);
    if(gb){gb.style.width=(Math.max(0,Math.min(10,p.gas))*10)+'%';gb.className='gas-fill'+(p.gas<=3?' low':'');}
    UPG_DEFS.forEach(u=>{
      const el=document.getElementById(`ui${i}_${u.id}`);
      if(!el)return;
      const has=p.upg.includes(u.id);
      el.className=`upg-item ${has?u.cls+' unlocked':'locked'}`;
    });
    const mb=document.getElementById('mpb'+i);
    if(mb){mb.style.display=p.upg.length?'flex':'none';mb.textContent=p.upg.length;}
  });
}

function setTurn(){
  if(over)return;
  const p=players[cur];
  const label=`${p.icon} ${p.name}`;
  document.getElementById('turn-badge-bot').textContent='Turno: '+label;
  document.querySelectorAll('.tile').forEach(t=>t.classList.remove('tile-active'));
  document.getElementById('t'+p.pos)?.classList.add('tile-active');
  updPanels();
  updNavbar();
}

function updNavbar(){
  document.getElementById('turn-counter').textContent=turnCount;
  const p=players[cur];
  document.getElementById('nav-turn-name').textContent=p?`${p.icon} ${p.name}`:'—';
  const pot=players.reduce((s,pp)=>s+pp.money,0);
  document.getElementById('nav-pot').textContent=pot.toLocaleString();
}

// ══════════════════════
//  DADO
// ══════════════════════
async function rollDice(){
  playSound('dice');
  if(rolling||over)return;
  const p=players[cur];
  if(p.elim){nextTurn();return;}
  if(p.skip){p.skip=false;toast(`⏭️ ${p.icon} ${p.name} pierde su turno.`);await sleep(1400);nextTurn();return;}
  rolling=true;
  document.getElementById('btn-roll').disabled=true;
  const db=document.getElementById('dice-box');
  db.classList.add('dice-rolling');
  rumbleScreen();
  let roll=1;
  await new Promise(res=>{
    let c=0;const iv=setInterval(()=>{roll=~~(Math.random()*6)+1;db.textContent=DICE_FACES[roll-1];if(++c>=14){clearInterval(iv);res();}},70);
  });
  db.classList.remove('dice-rolling');
  spawnFloat(db,'✨');
  turnCount++;
  for(let s=0;s<roll;s++){
    await sleep(340);
    p.pos=(p.pos+1)%TOTAL;
    if(p.pos===0){p.money+=2000;p.gas=Math.max(0,p.gas-1);toast(`🏠 ${p.name} pasó por SALIDA +$2.000`);updPanels();}
    moveMoto(cur,p.pos,true);
    document.querySelectorAll('.tile').forEach(t=>t.classList.remove('tile-active'));
    document.getElementById('t'+p.pos)?.classList.add('tile-active');
  }
  await sleep(250);
  rolling=false;
  doTile(p.pos);
}

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

// ══════════════════════
//  TILE ACTIONS
// ══════════════════════
function doTile(pos){
  switch(BOARD[pos].t){
    case'casa':      doCasa();break;
    case'azar':      doAzar();break;
    case'carrera':   doCarrera(null);break;
    case'mejora':    doMejora();break;
    case'pinchazo':  doPinchazo();break;
    case'trancon':   doTrancon();break;
    case'reten':     doReten();break;
    case'plaza':     doCarrera('Plaza Alfonso López');break;
    case'hospital':  doCarrera('Hospitalito');break;
    case'pilonera':  doCarrera('La Pilonera Mayor');break;
    case'balneario': doCarrera('Balneario Hurtado');break;
    case'guatapuri': doGuatapuri();break;
    default:         nextTurn();break;
  }
}
function doCasa(){
  const p=players[cur];p.money+=2000;p.gas=Math.min(10,p.gas+1);
  modal('casa','🏠','¡SALIDA!',null,'Cobraste el arranque del día y descansaste.','+$2.000 💰  |  +1G ⛽',()=>{updPanels();chkElim()||nextTurn();});
}
function doAzar(){
  const p=players[cur];
  const c=AZAR[~~(Math.random()*AZAR.length)];
  if(c.reten){doReten();return;}
  if(c.neg&&p.upg.includes('app')){modal('azar','📱','AZAR – '+c.t,null,c.txt,'App de Transporte: carta negativa ignorada.',()=>nextTurn());return;}
  p.money+=c.$;p.gas=Math.min(10,p.gas+c.g);
  if(c.skip)p.skip=true;
  let ef='';
  if(c.$>0)ef+=`+$${c.$.toLocaleString()} `;
  if(c.$<0)ef+=`-$${Math.abs(c.$).toLocaleString()} `;
  if(c.g>0)ef+=`+${c.g}G `;
  if(c.g<0)ef+=`${c.g}G `;
  if(c.skip)ef+='— Pierdes un turno';
  if(!ef.trim())ef='Sin cambios';
  modal('azar',c.icon,'AZAR – '+c.t,null,c.txt,ef,()=>{updPanels();chkElim()||nextTurn();});
}
function doReten(){
  const p=players[cur];
  if(p.upg.includes('papeles')){
    modal('reten','🚨','RETÉN LA CEIBA',null,'El retén. Papeles en mano.','📄 Papeles al Día: ¡pasaste sin problema!',()=>nextTurn());
  } else {
    const lost=Math.floor(p.money*0.5);p.money=Math.max(0,p.money-lost);
    modal('reten','🚨','¡RETÉN!',null,'O pagas el 50% o te quitan la moto.',`💸 Pagaste: -$${lost.toLocaleString()}`,()=>{updPanels();chkElim()||nextTurn();});
  }
}
function doCarrera(dest){
  let pool=dest?CARRERAS.filter(c=>c.dest===dest):CARRERAS;
  if(!pool.length)pool=CARRERAS;
  const c=pool[~~(Math.random()*pool.length)];
  const p=players[cur];
  let g=c.g;if(p.upg.includes('casco'))g=Math.min(0,g+1);
  const ex=p.upg.includes('papeles')?1000:0;
  p.money+=c.$+ex;p.gas=Math.min(10,p.gas+g);
  const ef=`+$${(c.$+ex).toLocaleString()}  |  ${g}G gas`+(c.tipo==='Responsable'?' 👏':'');
  const mtype=c.tipo==='Responsable'?'carrera-bien':'carrera-mal';
  modal(mtype,c.icon,'CARRERA: '+c.dest,c.tipo,'"'+c.txt+'"',ef,()=>{updPanels();chkElim()||nextTurn();});
}
function doMejora(){
  const p=players[cur];
  const avail=MEJORAS.filter(m=>!p.upg.includes(m.id));
  let html='';
  if(!avail.length){html='<p style="font-family:Jaro,sans-serif;color:rgba(255,255,255,.85);margin-bottom:12px">¡Todas las mejoras compradas! 🏆</p>';}
  else{
    html='<div class="shop-grid">';
    avail.forEach(m=>{
      const ok=p.money>=m.cost;
      html+=`<div class="shop-item"><div class="si-icon">${m.icon}</div>
        <div class="si-name">${m.name}</div><div class="si-desc">${m.desc}</div>
        <button class="btn-buy" ${ok?'':'disabled'} onclick="buyUpg('${m.id}')">Comprar $${m.cost.toLocaleString()}</button></div>`;
    });
    html+='</div>';
  }
  modal('mejora','⭐','¡MEJORA TU MOTO!',null,'Invierte en tu equipo.',null,()=>nextTurn(),html);
}
function doPinchazo(){
  const p=players[cur];
  if(p.upg.includes('manten')){
    p.gas=Math.min(10,p.gas+2);
    modal('carrera-bien','🔧','PINCHAZO',null,'Se fue la llanta… pero la moto está mantenida.','🔧 Inmune. +2G bonus.',()=>{updPanels();nextTurn();});
  } else {
    p.money=Math.max(0,p.money-2000);p.gas=Math.max(0,p.gas-1);
    modal('pinchazo','🔧','¡PINCHAZO!',null,'Se fue la llanta. Toca el vulcanizador.','-$2.000  |  -1G',()=>{updPanels();chkElim()||nextTurn();});
  }
}
function doTrancon(){players[cur].skip=true;modal('trancon','🚦','¡TRANCÓN!',null,'La calle está represada.','Pierdes el próximo turno 😤',()=>nextTurn());}
function buyUpg(id){
  const p=players[cur],m=MEJORAS.find(x=>x.id===id);
  if(!m||p.money<m.cost){playSound('error');return;}
  playSound('success');
  p.money-=m.cost;p.upg.push(id);
  toast(`${m.icon} ¡Compraste ${m.name}!`);updPanels();doMejora();
}
function doGuatapuri(){
  const p=players[cur];p.money=Math.max(0,p.money-1000);
  modal('azar','🛍️','C.C. GUATAPURÍ',null,'Tocó pagar el parqueadero.','-$1.000 de parqueo 😅',()=>{updPanels();chkElim()||nextTurn();});
}

// ══════════════════════
//  ELIMINACIÓN
// ══════════════════════
function chkElim(){
  const p=players[cur];
  if(p.gas<=0){
    p.gas=0;
    p.elim=true;
    toast(`⛽ ${p.icon} ${p.name} se quedó sin gasolina — ¡eliminado!`);
    document.getElementById('mp'+p.i)?.remove();
    updPanels();
    const alive=players.filter(x=>!x.elim);
    if(alive.length<=1){setTimeout(showWinner,1400);return true;}
    setTimeout(nextTurn,1800);
    return true;
  }
  if(p.money<=0){
    p.money=0;
    p.elim=true;
    toast(`💀 ${p.icon} ${p.name} quedó sin dinero y sale de la vía.`);
    document.getElementById('mp'+p.i)?.remove();
    updPanels();
    const alive=players.filter(x=>!x.elim);
    if(alive.length<=1){setTimeout(showWinner,1400);return true;}
    setTimeout(nextTurn,1800);
    return true;
  }
  return false;
}

function nextTurn(){
  document.getElementById('btn-roll').disabled=false;
  if(over)return;
  let t=0;do{cur=(cur+1)%numPlayers;t++;}while(players[cur].elim&&t<numPlayers);
  if(players.filter(x=>!x.elim).length<=1){showWinner();return;}
  setTurn();
}

function endGameNow(){
  playSound('click');
  if(over)return;
  const alive=players.filter(x=>!x.elim);
  if(alive.length===0){location.reload();return;}
  showWinner();
}

function showWinner(){
  playSound('win');
  over=true;rolling=false;
  document.getElementById('btn-roll').disabled=true;
  const sorted=[...players].sort((a,b)=>b.money-a.money);
  const w=sorted[0];
  document.getElementById('winner-name').textContent=`${w.icon} ${w.name}`;
  document.getElementById('winner-sub').textContent=`¡El Rey del Rebusque con $${w.money.toLocaleString()}!`;
  document.getElementById('score-table').innerHTML=
    sorted.map((p,i)=>{
      const reason=p.elim?(p.gas<=0?' ⛽ Sin gasolina':' ☠️ Sin plata'):'';
      return `<div class="score-row">
        <span>${['🥇','🥈','🥉','4️⃣'][i]} ${p.icon} ${p.name}${reason}</span>
        <span>$${p.money.toLocaleString()}</span>
      </div>`;
    }).join('');
  document.getElementById('winner-overlay').classList.add('show');
  launchConfetti();
}

// ══════════════════════
//  MODAL
// ══════════════════════
function modal(modalType,icon,title,tipo,text,effect,cb,extra=''){
  playSound('modal');
  pendCB=cb;
  const m=document.getElementById('modal');
  m.className='modal'+(modalType?' m-'+modalType:'');
  document.getElementById('modal-icon').textContent=icon;
  document.getElementById('modal-title').textContent=title;
  const te=document.getElementById('modal-tipo');
  te.textContent=tipo||'';te.style.display=tipo?'inline-block':'none';
  document.getElementById('modal-text').textContent=text||'';
  const ee=document.getElementById('modal-effect');
  ee.textContent=effect||'';ee.style.display=effect?'block':'none';
  document.getElementById('shop-area').innerHTML=extra;
  document.getElementById('overlay').classList.add('show');
}
function closeModal(){
  playSound('click');
  document.getElementById('overlay').classList.remove('show');
  if(pendCB)pendCB();pendCB=null;
}
function showRules(){playSound('click');document.getElementById('rules-overlay').classList.add('show');}
function closeRules(){document.getElementById('rules-overlay').classList.remove('show');}

// ══════════════════════
//  TOAST & PARTICLES
// ══════════════════════
let toastT=null;
function toast(msg){
  const el=document.getElementById('toast');
  el.textContent=msg;el.classList.add('show');
  clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('show'),2700);
}
function spawnFloat(ref,emoji){
  const r=ref.getBoundingClientRect();
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  ['💰','✨','💫','⭐','🎉'].forEach((e,i)=>{
    const el=document.createElement('div');el.className='float-e';
    const a=((i/5)*Math.PI*2);
    el.style.left=(cx+Math.cos(a)*36)+'px';el.style.top=(cy+Math.sin(a)*26)+'px';
    el.textContent=e;document.body.appendChild(el);setTimeout(()=>el.remove(),950);
  });
}
function launchConfetti(){
  const cs=['#ff6b35','#ffe135','#4ecdc4','#ff6bbd','#4caf50','#e06820'];
  for(let i=0;i<55;i++){
    const el=document.createElement('div');el.className='confetti';
    el.style.cssText=`left:${Math.random()*100}vw;top:-20px;background:${cs[~~(Math.random()*cs.length)]};
      --dur:${1.2+Math.random()*1.5}s;--dx:${(Math.random()-.5)*200}px;
      --dy:${400+Math.random()*400}px;--rot:${Math.random()*720}deg;
      animation-delay:${Math.random()*.8}s;width:${6+Math.random()*9}px;
      height:${6+Math.random()*9}px;border-radius:${Math.random()>.5?'50%':'2px'};`;
    document.body.appendChild(el);setTimeout(()=>el.remove(),3000);
  }
}

window.addEventListener('resize',()=>{
  if(players.length>0&&!over){
    buildBoard();placeMotos();
    players.forEach((p,i)=>moveMoto(i,p.pos,false));
    document.querySelectorAll('.tile').forEach(t=>t.classList.remove('tile-active'));
    document.getElementById('t'+players[cur].pos)?.classList.add('tile-active');
  }
});

document.addEventListener('keydown',e=>{
  if(e.code==='Space'&&!document.getElementById('overlay').classList.contains('show'))
    {e.preventDefault();rollDice();}
  if(e.code==='Enter'&&document.getElementById('overlay').classList.contains('show'))
    closeModal();
});
