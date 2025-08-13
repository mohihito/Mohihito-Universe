// Realistyczna czarna dziura z akrecyjnym dyskiem i grawitacyjnym soczewkowaniem - styl M87

const canvas = document.getElementById('blackhole-canvas');
const ctx = canvas.getContext('2d');
let width, height, centerX, centerY, scale;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  centerX = width / 2;
  centerY = height / 2;
  scale = Math.min(width, height) / 1000;
  canvas.width = width;
  canvas.height = height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Helper: losowanie gwiazd
const stars = [];
for (let i = 0; i < 180; i++) {
  stars.push({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.2 + 0.2,
    opacity: Math.random() * 0.7 + 0.2,
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

function drawBlackHoleShadow() {
  // Cień czarnej dziury (event horizon + cień soczewkowania)
  const r = 120 * scale;
  const grad = ctx.createRadialGradient(centerX, centerY, r * 0.7, centerX, centerY, r * 1.25);
  grad.addColorStop(0, "#000");
  grad.addColorStop(0.9, "#1a0d15");
  grad.addColorStop(1, "rgba(10,0,30,0.1)");
  ctx.save();
  ctx.globalAlpha = 0.97;
  ctx.beginPath();
  ctx.arc(centerX, centerY, r * 1.1, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.shadowColor = "#000";
  ctx.shadowBlur = 50 * scale;
  ctx.fill();
  ctx.restore();
}

// Helper: kolor jasnego dysku (od żółto-białego, przez pomarańcz, po czerwień)
function diskColor(angle, t) {
  // angle: 0 (po lewej) do PI (po prawej)
  const normalized = Math.abs(Math.sin(angle + t/4800));
  const r = 255;
  const g = 190 + 60 * normalized;
  const b = 60 + 60 * (1 - normalized);
  return `rgba(${r},${g|0},${b|0},0.82)`;
}

function drawAccretionDisk(t) {
  // Parametry
  const R1 = 140 * scale; // promień wewnętrzny
  const R2 = 250 * scale; // promień zewnętrzny
  const yShift = 20 * scale; // lekkie przesunięcie grawitacyjne
  for(let i=0;i<68;i++) {
    // Kąt w płaszczyźnie dysku (od -PI do PI)
    let a = -Math.PI + i * (2 * Math.PI / 68);
    // Soczewkowanie grawitacyjne (górny łuk)
    for(let d=0;d<2;d++) {
      const f = d===0 ? 1 : -1;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(
        centerX + Math.cos(a) * R1,
        centerY + Math.sin(a) * R1 * 0.18 * f - yShift * f
      );
      ctx.lineTo(
        centerX + Math.cos(a) * R2,
        centerY + Math.sin(a) * R2 * 0.32 * f - yShift * f
      );
      ctx.lineWidth = 13 * scale + Math.sin(a*3 + t/690) * 3.5 * scale;
      ctx.strokeStyle = diskColor(a, t + d * 1200);
      ctx.shadowColor = "#fff8";
      ctx.shadowBlur = 18 * scale + Math.abs(Math.cos(a*2 + t/1300)) * 12 * scale;
      ctx.globalAlpha = 0.74 + 0.19 * Math.sin(a + t/1800);
      ctx.stroke();
      ctx.restore();
    }
  }
  // Zewnętrzne poświaty dysku
  for(let j=0;j<2;j++) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, R2 * (1.09 + j*0.03), 57 * scale * (1.1 - j*0.11), 0, 0, 2 * Math.PI);
    ctx.strokeStyle = `rgba(255,180,90,${0.08 - j*0.017})`;
    ctx.lineWidth = 22 * scale * (0.85 - j*0.13);
    ctx.shadowColor = "#fbb";
    ctx.shadowBlur = 36 * scale * (0.95 - j*0.16);
    ctx.globalAlpha = 0.5 - j*0.2;
    ctx.stroke();
    ctx.restore();
  }
}

function drawInnerGlow(t) {
  // Poświata pomarańczowa w środku dysku
  const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 110 * scale);
  grad.addColorStop(0, "rgba(255,200,90,0.16)");
  grad.addColorStop(0.5, "rgba(255,140,60,0.1)");
  grad.addColorStop(1, "rgba(30,0,10,0.01)");
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, 110 * scale, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.globalAlpha = 0.75 + 0.15 * Math.sin(t/1700);
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  drawStars();
  drawInnerGlow(performance.now());
  drawAccretionDisk(performance.now());
  drawBlackHoleShadow();
  requestAnimationFrame(animate);
}
animate();
