// Animowany efekt czarnej dziury w stylu "Interstellar" z dynamicznym dyskiem na ukos

const canvas = document.getElementById('blackhole-canvas');
const ctx = canvas.getContext('2d');
let width, height, centerX, centerY, scale;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  centerX = width / 2;
  centerY = height / 2;
  scale = Math.min(width, height) / 1200;
  canvas.width = width;
  canvas.height = height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Subtelne gwiazdy
const stars = [];
for (let i = 0; i < 150; i++) {
  stars.push({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.1 + 0.2,
    opacity: Math.random() * 0.8 + 0.1,
  });
}

function drawStars() {
  for (const s of stars) {
    ctx.beginPath();
    ctx.arc(s.x * width, s.y * height, s.r * scale, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
    ctx.fill();
  }
}

// Parametry czarnej dziury
const tilt = -22 * Math.PI / 180; // ukos w lewo, jak na grafice
const rEvent = 180;
const rDiskIn = 200;
const rDiskOut = 410;

// Funkcja do rysowania dysku akrecyjnego z efektem grawitacyjnego soczewkowania
function drawAccretionDisk(t) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(tilt);

  for (let i = 0; i < 230; i++) {
    let a = -Math.PI + (i * (2 * Math.PI / 230));
    // Góra i dół dysku, z efektem relatywistycznego rozciągnięcia
    for (let side = 0; side < 2; side++) {
      const sign = side === 0 ? 1 : -1;
      ctx.save();
      ctx.beginPath();
      // Soczewkowanie światła (wypukła deformacja)
      let y1 = Math.sin(a) * rDiskIn * 0.18 * sign;
      let y2 = Math.sin(a) * rDiskOut * (0.27 + 0.18 * Math.cos(a + t/3600)) * sign;
      let x1 = Math.cos(a) * rDiskIn;
      let x2 = Math.cos(a) * rDiskOut;

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);

      // Kolorystyka – jasny, filmowy dysk (biel, żółć, pomarańcz)
      let grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, "rgba(255,255,240,0.90)");
      grad.addColorStop(0.45, "rgba(255,195,120,0.87)");
      grad.addColorStop(0.75, "rgba(182,90,48,0.40)");
      grad.addColorStop(1, "rgba(50,20,10,0.10)");
      ctx.strokeStyle = grad;

      ctx.lineWidth = 16 * scale + 5 * Math.abs(Math.sin(a + t/1600)) * scale;
      ctx.shadowColor = "rgba(255, 230, 180, 0.38)";
      ctx.shadowBlur = 30 * scale;
      ctx.globalAlpha = 0.7 + 0.15 * Math.sin(a + t/2100);

      ctx.stroke();
      ctx.restore();
    }
  }

  // Poświata wokół dysku
  for (let j = 0; j < 2; j++) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 0, rDiskOut * (1.03 + j*0.04), 100 * scale * (1.1-j*0.17), 0, 0, 2 * Math.PI);
    ctx.strokeStyle = `rgba(255,220,130,${0.12-j*0.04})`;
    ctx.lineWidth = 39 * scale * (0.7-j*0.22);
    ctx.shadowColor = "#fff7c7";
    ctx.shadowBlur = 55 * scale * (0.95-j*0.17);
    ctx.globalAlpha = 0.22 - j*0.08;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// Rysowanie horyzontu zdarzeń z poświatą i zakrzywieniem światła
function drawBlackHoleShadow(t) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(tilt);

  // Poświata
  ctx.beginPath();
  ctx.arc(0, 0, rEvent * scale * 1.11, 0, Math.PI * 2);
  let grad = ctx.createRadialGradient(0, 0, rEvent * scale * 0.8, 0, 0, rEvent * scale * 1.13);
  grad.addColorStop(0, "rgba(255,220,120,0.05)");
  grad.addColorStop(0.8, "rgba(255,200,120,0.13)");
  grad.addColorStop(1, "rgba(12,0,15,0.01)");
  ctx.globalAlpha = 0.82;
  ctx.fillStyle = grad;
  ctx.shadowColor = "rgba(255,220,120,0.2)";
  ctx.shadowBlur = 23 * scale;
  ctx.fill();

  // Cień czarnej dziury (horyzont zdarzeń)
  ctx.beginPath();
  ctx.arc(0, 0, rEvent * scale, 0, Math.PI * 2);
  ctx.globalAlpha = 0.99;
  ctx.fillStyle = "#000";
  ctx.shadowColor = "#2a1a0a";
  ctx.shadowBlur = 70 * scale;
  ctx.fill();
  ctx.restore();
}

// Efekt planetarnej poświaty na dole (ziemia)
function drawPlanetaryGlow(t) {
  ctx.save();
  // Przesunięcie i obrót, aby przypominać planetę z obrazu
  ctx.translate(centerX, height * 1.08);
  ctx.rotate(-0.13 + tilt * 0.45);
  let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.95);
  grad.addColorStop(0, "rgba(210,240,255,0.18)");
  grad.addColorStop(0.5, "rgba(180,190,220,0.09)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.ellipse(0, 0, width * 1.03, height * 0.57, 0, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.globalAlpha = 0.81;
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  drawStars();
  drawPlanetaryGlow(performance.now());
  drawAccretionDisk(performance.now());
  drawBlackHoleShadow(performance.now());
  requestAnimationFrame(animate);
}
animate();
