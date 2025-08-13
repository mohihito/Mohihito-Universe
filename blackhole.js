// Simple animated black hole background using canvas

const canvas = document.getElementById('blackhole-canvas');
const ctx = canvas.getContext('2d');
let width, height, centerX, centerY;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  centerX = width / 2;
  centerY = height / 2;
  canvas.width = width;
  canvas.height = height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawBlackhole(t) {
  ctx.clearRect(0, 0, width, height);

  // Draw glowing stars
  for (let i = 0; i < 100; i++) {
    let angle = Math.random() * Math.PI * 2;
    let dist = Math.random() * (width > height ? width : height) * 0.5 + 100;
    let starX = centerX + Math.cos(angle) * dist;
    let starY = centerY + Math.sin(angle) * dist;
    ctx.beginPath();
    ctx.arc(starX, starY, Math.random() * 1.5 + 0.2, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.7 + 0.2})`;
    ctx.fill();
  }

  // Black hole swirl
  for (let r = 190; r > 20; r -= 3) {
    let a = (t * 0.00025) + r * 0.03;
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${40 + r},${60 + r/2},${80 + r},${0.06 + r/500})`;
    ctx.lineWidth = 15 - r/16;
    ctx.shadowColor = '#0ff';
    ctx.shadowBlur = 70 - r/2;
    ctx.stroke();
  }

  // Event horizon
  ctx.beginPath();
  ctx.arc(centerX, centerY, 38, 0, Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.shadowColor = '#fff';
  ctx.shadowBlur = 22;
  ctx.fill();

  // Accretion disk
  for (let i = 0; i < 2; i++) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(t*0.00012 + i);
    ctx.beginPath();
    ctx.ellipse(0, 0, 60 + i*10, 16 + i*6, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, ${200-i*80}, 40, 0.5)`;
    ctx.lineWidth = 10 - i*4;
    ctx.shadowColor = '#ffb900';
    ctx.shadowBlur = 35 - i*9;
    ctx.stroke();
    ctx.restore();
  }
}

function animate() {
  drawBlackhole(performance.now());
  requestAnimationFrame(animate);
}
animate();
