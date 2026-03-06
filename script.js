const S = Number(getComputedStyle(document.documentElement).getPropertyValue('--scale')) || 4;
const model = document.getElementById('model');
const inbetween = document.getElementById('inbetween');
let dragging=false, lastX=0, lastY=0, yaw=22, pitch=-12, scale=1;
const canvas = document.getElementById('skinCanvas');
const gridContainer = document.querySelector(".grid-container");
const ctx = canvas.getContext('2d', {willReadFrequently:true});
ctx.imageSmoothingEnabled = false;
const whiteSkin = document.getElementById("whiteSkin");
const block = document.getElementById("block");
whiteSkin.onclick = () => {
  block.classList.toggle("fill");
};
function subscribe() {
  //window.location.href = "https://www.youtube.com/@Sculksidian?sub_confirmation=1";
  window.open("https://www.youtube.com/@Sculksidian?sub_confirmation=1", "_blank");
}
const easeobserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.visibility = "visible";
      entry.target.style.animation = "none";
      void entry.target.offsetWidth;
      entry.target.style.animation = "easedownabout 1s ease";
    } else {
      entry.target.style.visibility = "hidden";
    }
  });
});
easeobserver.observe(document.querySelector("#About h1"));
document.querySelectorAll("p, .secTextCon h2, h3, h2").forEach(p => {
    easeobserver.observe(p);
});
const easeconobserverobserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.visibility = "visible";
      entry.target.style.animation = "none";
      void entry.target.offsetWidth;
      entry.target.style.animation = "conease 1s ease";
    } else {
      entry.target.style.visibility = "hidden";
    }
  });
});
document.querySelectorAll("#imgSec, footer, .chart, #About, #ShadedSkin, #UnshadedSkin").forEach(p => {
  easeconobserverobserver.observe(p);
});

// minotar/skin-spec coordinates (authoritative). Values are [x,y,w,h] rectangles in pixels (skin-space).

function startDropSystem(parent, options = {}) {
  if (!(parent instanceof HTMLElement)) {
    throw new Error("Valid parent element required");
  }
  
  const {
      spawnRate = 2000, // ms between spawns
      maxDrops = 400, // safety cap
      minDuration = 1500, // ms
      maxDuration = 3000
  } = options;
  
  let running = false;
  let intervalId = null;
  let activeCount = 0;
  const inbetween = document.getElementById("inbetween");
  function createDrop() {
    if (!running || activeCount >= maxDrops) return;
    
    const drop = document.createElement("div");
    drop.className = "drop";
    
    const duration =
      Math.random() * (maxDuration - minDuration) + minDuration;
    
    drop.style.left = Math.random() * 100 + "%";
    drop.style.bottom = Math.random() * 100 + "%";
    drop.style.animationDuration = duration / 5 + "ms";
    
    activeCount++;
    
    drop.addEventListener("animationend", () => {
      drop.remove();
      activeCount--;
    });
    
    parent.appendChild(drop);
  }
  
  function start() {
    if (intervalId) return;
    running = true;
    intervalId = setInterval(createDrop, spawnRate);
  }
  
  function stop() {
    running = false;
    clearInterval(intervalId);
    intervalId = null;
  }
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        start();
      } else {
        stop();
      }
    });
  });
  
  observer.observe(inbetween);
  return {
    stop,
    start,
    destroy() {
      stop();
      observer.disconnect();
    }
  };
}
const container = document.querySelector("header");
startDropSystem(container, {
  spawnRate: 30,
  maxDrops: 500
});
const UV = {
  // base (inner)
  head: {
    top:    {x:8,  y:0,  w:8, h:8},
    bottom: {x:16, y:0,  w:8, h:8},
    right:  {x:16, y:8,  w:8, h:8},
    front:  {x:8,  y:8,  w:8, h:8},
    left:   {x:0,  y:8,  w:8, h:8},
    back:   {x:24, y:8,  w:8, h:8}
  },
  helm: {
    top:    {x:40, y:0,  w:8, h:8},
    bottom: {x:48, y:0,  w:8, h:8},
    right:  {x:48, y:8,  w:8, h:8},
    front:  {x:40, y:8,  w:8, h:8},
    left:   {x:32, y:8,  w:8, h:8},
    back:   {x:56, y:8,  w:8, h:8}
  },

  torso: {
    top:    {x:20, y:16, w:8, h:4},
    bottom: {x:28, y:16, w:8, h:4},
    right:  {x:28, y:20, w:4, h:12},
    front:  {x:20, y:20, w:8, h:12},
    left:   {x:16, y:20, w:4, h:12},
    back:   {x:32, y:20, w:8, h:12}
  },
  torso2: { // overlay jacket (layer 2)
    top:    {x:20, y:32, w:8, h:4},
    bottom: {x:28, y:32, w:8, h:4},
    right:  {x:28, y:36, w:4, h:12},
    front:  {x:20, y:36, w:8, h:12},
    left:   {x:16, y:36, w:4, h:12},
    back:   {x:32, y:36, w:8, h:12}
  },

  rightArm: {
    top:    {x:44, y:16, w:4, h:4},
    bottom: {x:48, y:16, w:4, h:4},
    right:  {x:48, y:20, w:4, h:12},
    front:  {x:44, y:20, w:4, h:12},
    left:   {x:40, y:20, w:4, h:12},
    back:   {x:52, y:20, w:4, h:12}
  },
  rightArm2: { // overlay layer 2 (sleeve)
    top:    {x:44, y:32, w:4, h:4},
    bottom: {x:48, y:32, w:4, h:4},
    right:  {x:48, y:36, w:4, h:12},
    front:  {x:44, y:36, w:4, h:12},
    left:   {x:40, y:36, w:4, h:12},
    back:   {x:52, y:36, w:4, h:12}
  },

  leftArm: {
    top:    {x:36, y:48, w:4, h:4},
    bottom: {x:40, y:48, w:4, h:4},
    right:  {x:40, y:52, w:4, h:12},
    front:  {x:36, y:52, w:4, h:12},
    left:   {x:32, y:52, w:4, h:12},
    back:   {x:44, y:52, w:4, h:12}
  },
  leftArm2: {
    top:    {x:52, y:48, w:4, h:4},
    bottom: {x:56, y:48, w:4, h:4},
    right:  {x:56, y:52, w:4, h:12},
    front:  {x:52, y:52, w:4, h:12},
    left:   {x:48, y:52, w:4, h:12},
    back:   {x:60, y:52, w:4, h:12}
  },

  rightLeg: {
    top:    {x:4,  y:16, w:4, h:4},
    bottom: {x:8,  y:16, w:4, h:4},
    right:  {x:8,  y:20, w:4, h:12},
    front:  {x:4,  y:20, w:4, h:12},
    left:   {x:0,  y:20, w:4, h:12},
    back:   {x:12, y:20, w:4, h:12}
  },
  rightLeg2: {
    top:    {x:4,  y:32, w:4, h:4},
    bottom: {x:8,  y:32, w:4, h:4},
    right:  {x:8,  y:36, w:4, h:12},
    front:  {x:4,  y:36, w:4, h:12},
    left:   {x:0,  y:36, w:4, h:12},
    back:   {x:12, y:36, w:4, h:12}
  },
  leftLeg: {
    top:    {x:20, y:48, w:4, h:4},
    bottom: {x:24, y:48, w:4, h:4},
    right:  {x:24, y:52, w:4, h:12},
    front:  {x:20, y:52, w:4, h:12},
    left:   {x:16, y:52, w:4, h:12},
    back:   {x:28, y:52, w:4, h:12}
  },
  leftLeg2: {
    top:    {x:4,  y:48, w:4, h:4},
    bottom: {x:8,  y:48, w:4, h:4},
    right:  {x:8,  y:52, w:4, h:12},
    front:  {x:4,  y:52, w:4, h:12},
    left:   {x:0,  y:52, w:4, h:12},
    back:   {x:12, y:52, w:4, h:12}
  }
};

function convert64x32To64x64(img) {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(img, 0, 0);

  function copyFlip(sx, sy, w, h, dx, dy, flipH=false) {
    const t = document.createElement('canvas');
    t.width = w; t.height = h;
    const tg = t.getContext('2d');
    tg.imageSmoothingEnabled = false;
    tg.drawImage(img, sx, sy, w, h, 0, 0, w, h);
    g.save();
    if (flipH) {
      g.translate(dx + w, dy);
      g.scale(-1, 1);
      g.drawImage(t, 0, 0, w, h, 0, 0, w, h);
    } else {
      g.drawImage(t, dx, dy);
    }
    g.restore();
  }

  const ops = [
    {s:[4,16,4,4], d:[20,48,4,4]},
    {s:[8,16,4,4], d:[24,48,4,4]},
    {s:[8,20,4,12], d:[16,52,4,12]},
    {s:[4,20,4,12], d:[20,52,4,12]},
    {s:[0,20,4,12], d:[24,52,4,12]},
    {s:[12,20,4,12], d:[28,52,4,12]},
    {s:[44,16,4,4], d:[36,48,4,4]},
    {s:[48,16,4,4], d:[40,48,4,4]},
    {s:[48,20,4,12], d:[32,52,4,12]},
    {s:[44,20,4,12], d:[36,52,4,12]},
    {s:[40,20,4,12], d:[40,52,4,12]},
    {s:[52,20,4,12], d:[44,52,4,12]}
  ];
  for (const op of ops) {
    const [sx,sy,w,h] = op.s;
    const [dx,dy] = op.d;
    copyFlip(sx,sy,w,h,dx,dy,true);
  }
  return c;
}

function extractRegionToDataURL(fullImage, x, y, w, h) {
  const t = document.createElement('canvas');
  t.width = w; t.height = h;
  const tg = t.getContext('2d');
  tg.imageSmoothingEnabled = false;
  tg.drawImage(fullImage, x, y, w, h, 0, 0, w, h);
  return t.toDataURL();
}

function createCubeDOM(center, size, facesUV, fullImage, partName = "part") {
  const W = size.w, H = size.h, D = size.d;
  const cube = document.createElement('div');
  cube.className = 'cube';
  cube.classList.add(partName);
  cube.style.width = W + 'px';
  cube.style.height = H + 'px';
  cube.style.left = '50%';
  cube.style.top = '50%';
  const tx = center.x - W/2;
  const ty = center.y - H/2;
  const tz = center.z || 0;
  cube.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px)`;
  
  /*if (partName == "head" || partName == "head2") {
    cube.style.transform = `translate3d(${tx}px, ${ty + 2}px, ${tz - 5}px) rotateX(20deg)`;
  } else if (partName == "lefta" || partName == "lefta2") {
    cube.style.transform = `translate3d(${tx + 1}px, ${ty - 18}px, ${tz + 15}px) rotateZ(-5deg) rotateX(90deg)`;
  } else if (partName == "righta" || partName == "righta2") {
    cube.style.transform = `translate3d(${tx - 2}px, ${ty + 2}px, ${tz}px) rotateZ(5deg)`;
  }*/
  
  if (partName == "head" || partName == "head2") {
  cube.style.transform = `translate3d(${tx}px, ${ty + 2}px, ${tz - 5}px) rotateX(20deg)`;
} else if (partName == "lefta" || partName == "lefta2") {
  cube.style.transform = `translate3d(${tx + 16}px, ${ty - 19}px, ${tz}px) rotateZ(-95deg)`;
} else if (partName == "righta" || partName == "righta2") {
  cube.style.transform = `translate3d(${tx - 16}px, ${ty - 19}px, ${tz}px) rotateZ(95deg)`;
} else if (partName == "leftl" || partName == "leftl2") {
  cube.style.transform = `translate3d(${tx + 1}px, ${ty - 1}px, ${tz}px) rotateZ(-2deg)`;
} else if (partName == "rightl" || partName == "rightl2") {
  cube.style.transform = `translate3d(${tx - 1}px, ${ty - 1}px, ${tz}px) rotateZ(2deg)`;
}
  
  cube.style.transformStyle = 'preserve-3d';
  cube.style.pointerEvents = 'none';

  const order = ['front','back','left','right','top','bottom'];
  order.forEach(faceName => {
    const uv = facesUV[faceName];
    if (!uv) return;
    const faceDiv = document.createElement('div');
    faceDiv.className = 'face face-' + faceName;
    
    if (faceName === 'front' || faceName === 'back') {
      faceDiv.style.width = W + 'px';
      faceDiv.style.height = H + 'px';
      faceDiv.style.left = '0px';
      faceDiv.style.top = '0px';
    } else if (faceName === 'left' || faceName === 'right') {
      faceDiv.style.width = D + 'px';
      faceDiv.style.height = H + 'px';
      faceDiv.style.left = ((W - D) / 2) + 'px';
      faceDiv.style.top = '0px';
    } else if (faceName === 'top' || faceName === 'bottom') {
      faceDiv.style.width = W + 'px';
      faceDiv.style.height = D + 'px';
      faceDiv.style.left = '0px';
      faceDiv.style.top = ((H - D) / 2) + 'px';
    }
    
    const dataURL = extractRegionToDataURL(fullImage, uv.x, uv.y, uv.w, uv.h);
    faceDiv.style.backgroundImage = `url(${dataURL})`;
    faceDiv.style.backgroundSize = (uv.w * S) + 'px ' + (uv.h * S) + 'px';
    faceDiv.style.backgroundPosition = '0px 0px';
    faceDiv.style.backgroundRepeat = 'no-repeat';

    if (faceName === 'front') {
      faceDiv.style.transform = `rotateY(0deg) translateZ(${D/2}px)`;
    } else if (faceName === 'back') {
      faceDiv.style.transform = `rotateY(180deg) translateZ(${D/2}px)`;
    } else if (faceName === 'left') {
      faceDiv.style.transform = `rotateY(-90deg) translateZ(${W/2}px)`;
    } else if (faceName === 'right') {
      faceDiv.style.transform = `rotateY(90deg) translateZ(${W/2}px)`;
    } else if (faceName === 'top') {
      faceDiv.style.transform = `rotateX(90deg) translateZ(${H/2}px)`;
    } else if (faceName === 'bottom') {
      faceDiv.style.transform = `rotateX(-90deg) translateZ(${H/2}px)`;
    }
    cube.appendChild(faceDiv);
  });

  return cube;
}

function buildModelFromSkin(fullImage) {
  model.innerHTML = '';

  const headW = 8*S, headH = 8*S, headD = 8*S;
  const bodyW = 8*S, bodyH = 12*S, bodyD = 4*S;
  const armW = 4*S, armH = 12*S, armD = 4*S; // Fixed to not slim
  const legW = 4*S, legH = 12*S, legD = 4*S;

  const bodyCenter = {x:0, y:0, z:0};
  const headCenter = {x:0, y: -(bodyH/2) - (headH/2), z:0};
  const rightArmCenter = {x: -(bodyW/2) - (armW/2), y: 0, z:0};
  const leftArmCenter  = {x:  (bodyW/2) + (armW/2), y: 0, z:0};
  const rightLegCenter = {x: -(legW/2), y: (bodyH/2) + (legH/2), z:0};
  const leftLegCenter  = {x:  (legW/2), y: (bodyH/2) + (legH/2), z:0};

  const headCube = createCubeDOM(headCenter, {w:headW,h:headH,d:headD}, UV.head, fullImage, "head");
  const bodyCube = createCubeDOM(bodyCenter, {w:bodyW,h:bodyH,d:bodyD}, UV.torso, fullImage, "body");
  const armRCube = createCubeDOM(rightArmCenter, {w:armW,h:armH,d:armD}, UV.rightArm, fullImage, "righta");
  const armLCube = createCubeDOM(leftArmCenter,  {w:armW,h:armH,d:armD}, UV.leftArm, fullImage, "lefta");
  const legRCube = createCubeDOM(rightLegCenter, {w:legW,h:legH,d:legD}, UV.rightLeg, fullImage, "rightl");
  const legLCube = createCubeDOM(leftLegCenter,  {w:legW,h:legH,d:legD}, UV.leftLeg, fullImage, "leftl");

  const headOuterCube = createCubeDOM(headCenter, {w:headW,h:headH,d:headD}, UV.helm, fullImage, "head2");
  const bodyOuterCube = createCubeDOM(bodyCenter, {w:bodyW,h:bodyH,d:bodyD}, UV.torso2, fullImage, "body2");
  const armROuterCube = createCubeDOM(rightArmCenter, {w:armW,h:armH,d:armD}, UV.rightArm2, fullImage, "righta2");
  const armLOuterCube = createCubeDOM(leftArmCenter,  {w:armW,h:armH,d:armD}, UV.leftArm2, fullImage, "lefta2");
  const legROuterCube = createCubeDOM(rightLegCenter, {w:legW,h:legH,d:legD}, UV.rightLeg2, fullImage, "rightl2");
  const legLOuterCube = createCubeDOM(leftLegCenter,  {w:legW,h:legH,d:legD}, UV.leftLeg2, fullImage, "leftl2");

  viewerAppendAll([legRCube, legLCube, armRCube, armLCube, bodyCube, headCube]);
  viewerAppendAll([legROuterCube, legLOuterCube, armROuterCube, armLOuterCube, bodyOuterCube, headOuterCube]);

  // Always show outer layer
  setOverlayVisible(true);
}

function viewerAppendAll(arr) {
  for (const el of arr) model.appendChild(el);
}

function setOverlayVisible(on) {
  const total = model.children.length;
  for (let i = 0; i < total; i++) {
    const child = model.children[i];
    // Overlays are the last 6 cubes
    if (i >= total - 6) child.style.display = on ? 'block' : 'none';
  }
}

function resetView(){
  model.style.transform = `translate3d(-50%,-50%,0) rotateX(-22deg) rotateY(0) scale(1)`;
}

const scene = document.getElementById('scene');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  
  yaw = scrollTop * 0.2;
  let gridConYaw = scrollTop * 0.02;
  pitch = -scrollTop * 0.1;
  let gridConPitch = pitch * 0.5;
  pitch = Math.max(-80, Math.min(80, pitch));
  gridConPitch = Math.max(-80, Math.min(80, gridConPitch));
  gridContainer.style.transform =
    `rotateX(${-gridConPitch}deg) rotateZ(${gridConYaw}deg)`;
  model.style.transform =
    `translate3d(-50%,-50%,0) translateY(${-pitch}px) rotateX(${-yaw}deg) scale(${scale})`;
    /*document.querySelectorAll(".drop").forEach(drop => {
      drop.style.transform = `rotateX(${pitch}deg)`;
    });*/
    document.body.style.setProperty("--rx", `${pitch}deg`);
    document.body.style.setProperty("--rxnum", `${pitch / 360 * 100}`);
    document.body.style.setProperty("--rxpx", `${pitch}px`);
  //inbetween.style.transform =
  //  `rotateX(${pitch}deg)`;
});
function scrollIntoView(secId) {
  const el = document.getElementById(secId);
  if (el) {
    el.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
  }
}
const barConLinks = {
  "barConAboutNavLink": "AboutTransition",
  "barConHomeNavLink": "header",
  "barConMeNavLink": "Me",
  "barConChartNavLink": "viewStats"
}
Object.keys(barConLinks).forEach(key => {
  const el = document.getElementById(key);
  if (el) {
    el.onclick = () => scrollIntoView(barConLinks[key]);
  }
});
/*scene.addEventListener('pointerdown', e=>{
  dragging = true; lastX=e.clientX; lastY=e.clientY;
  scene.setPointerCapture && scene.setPointerCapture(e.pointerId);
});
window.addEventListener('pointermove', e=>{
  if(!dragging) return;
  const dx = e.clientX - lastX, dy = e.clientY - lastY;
  lastX = e.clientX; lastY = e.clientY;
  yaw += dx * 0.3;
  pitch += dy * 0.25;
  pitch = Math.max(-80, Math.min(80, pitch));
  model.style.transform = `translate3d(-50%,-50%,0) rotateX(${pitch}deg) rotateY(${yaw}deg) scale(${scale})`;
});
window.addEventListener('pointerup', ()=>{ dragging=false; });

scene.addEventListener('wheel', e=>{
  e.preventDefault();
  scale *= e.deltaY > 0 ? 0.96 : 1.04;
  scale = Math.max(0.4, Math.min(2.5, scale));
  model.style.transform = `translate3d(-50%,-50%,0) rotateX(${pitch}deg) rotateY(${yaw}deg) scale(${scale})`;
}, {passive:false});*/

function loadSculksidianSkin() {
  const img = new Image();
  img.onload = () => {
    let fullCanvas;
    if (img.width === 64 && img.height === 32) {
      fullCanvas = convert64x32To64x64(img);
    } else {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const g = c.getContext('2d');
      g.imageSmoothingEnabled = false;
      g.drawImage(img, 0, 0, 64, 64);
      fullCanvas = c;
    }
    buildModelFromSkin(fullCanvas);
  };
  img.onerror = () => {
    console.log("error")
  };
  img.src = "SculksidianSkinWithShadows.png";
}

loadSculksidianSkin();
resetView();
