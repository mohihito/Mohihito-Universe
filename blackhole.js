// Nowoczesna, pełnoekranowa czarna dziura w stylu x.ai – minimalistyczny efekt 3D

const canvas = document.getElementById('blackhole-canvas');
const ctx = canvas.getContext('2d');
let width, height, centerX, centerY, scale;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  centerX = width / 2;
  centerY = height / 2;
  scale = Math.min(width, height) / 900;
  canvas.width = width;
  canvas.height = height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Gwiazdy - efekt subtelny, nowoczesny
const stars = [];
for (let i = 0; i < 210; i++) {
  stars.push({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.12 + 0.15,
    opacity: Math.random() * 0.38 + 0.18,
  });
}

function drawStars() {
  for (const s of stars) {
    ctx.beginPath();
    ctx.arc(s.x * width, s.y * height, s.r * scale * 1.1, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
    ctx.fill();
  }
}

// Dynamiczny, pełnoekranowy akrecyjny dysk i czarna dziura
function drawBlackHole(t) {
  // Parametry
  const rEvent = 180 * scale;
  const rDiskIn = 210 * scale;
  const rDiskOut = 340 * scale;

  // Efekt grawitacyjnego soczewkowania (górny dysk)
  for(let i=0;i<120;i++) {
    const angle = -Math.PI + (i * (Math.PI * 2 / 120));
    for(let side=0;side<2;side++) {
      const updown = side===0 ? 1 : -1;
      const yDisk = centerY + Math.sin(angle) * rDiskOut * 0.22 * updown;
      const xDisk = centerX + Math.cos(angle) * rDiskOut;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(angle) * rDiskIn, centerY + Math.sin(angle) * rDiskIn * 0.17 * updown);
      ctx.lineTo(xDisk, yDisk);
      ctx.lineWidth = 12.5 * scale + Math.sin(angle*3 + t/690) * 2.5 * scale;
      // Kolor: jasny żółto-biały do pomarańczowego
      const grad = ctx.createLinearGradient(centerX, centerY, xDisk, yDisk);
      grad.addColorStop(0, "#fff8e7");
      grad.addColorStop(0.7, "#f7b36b");
      grad.addColorStop(1, "#ff6d2f");
      ctx.strokeStyle = grad;
      ctx.shadowColor = "#fbbd4c";
      ctx.shadowBlur = 28 * scale + Math.abs(Math.cos(angle*2 + t/1100)) * 9 * scale;
      ctx.globalAlpha = 0.70 + 0.23 * Math.sin(angle + t/1800);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Jaśniejsza poświata wokół dysku
  for(let j=0;j<2;j++) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, rDiskOut * (1.03 + j*0.04), 77 * scale * (1.1 - j*0.11), 0, 0, 2 * Math.PI);
    ctx.strokeStyle = `rgba(255,230,120,${0.09 - j*0.028})`;
    ctx.lineWidth = 30 * scale * (0.75 - j*0.13);
    ctx.shadowColor = "#fff7bd";
    ctx.shadowBlur = 45 * scale * (0.95 - j*0.13);
    ctx.globalAlpha = 0.38 - j*0.1;
    ctx.stroke();
    ctx.restore();
  }

  // Centralny cień czarnej dziury
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, rEvent*1.03, 0, Math.PI*2);
  ctx.globalAlpha = 0.99;
  ctx.fillStyle = "#000";
  ctx.shadowColor = "#19130a";
  ctx.shadowBlur = 65 * scale;
  ctx.fill();
  ctx.restore();

  // Poświata wokół event horizon
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, rEvent*1.13, 0, Math.PI*2);
  let glow = ctx.createRadialGradient(centerX, centerY, rEvent*0.85, centerX, centerY, rEvent*1.13);
  glow.addColorStop(0, "rgba(255,220,120,0.02)");
  glow.addColorStop(0.82, "rgba(255,190,100,0.12)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = 0.72;
  ctx.fillStyle = glow;
  ctx.shadowColor = "#ffad29";
  ctx.shadowBlur = 17 * scale;
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  drawStars();
  drawBlackHole(performance.now());
  requestAnimationFrame(animate);
}
animate();
