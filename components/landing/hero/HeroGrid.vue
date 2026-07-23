<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const mousePos = shallowRef<{ x: number; y: number } | null>(null);
let rafId: number | null = null;
let isMouseInside = false;

const CELL_SIZE = 40;
const GLOW_RADIUS = 120;
const GLOW_RADIUS_MOBILE = 80;

function handleMouseMove(e: MouseEvent) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  isMouseInside = true;
  mousePos.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

function handleMouseLeave() {
  isMouseInside = false;
  mousePos.value = null;
}

function setupCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const parent = canvas.parentElement;
  if (!parent) return;

  const resizeCanvas = () => {
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function drawGrid() {
    const w = canvas!.clientWidth;
    const h = canvas!.clientHeight;
    const isMobile = window.innerWidth < 768;
    const glowRadius = isMobile ? GLOW_RADIUS_MOBILE : GLOW_RADIUS;

    ctx!.clearRect(0, 0, w, h);

    const cols = Math.ceil(w / CELL_SIZE);
    const rows = Math.ceil(h / CELL_SIZE);

    // Draw grid lines
    ctx!.strokeStyle = 'rgba(26, 86, 219, 0.06)';
    ctx!.lineWidth = 1;

    for (let c = 0; c <= cols; c++) {
      const x = c * CELL_SIZE + 0.5;
      ctx!.beginPath();
      ctx!.moveTo(x, 0);
      ctx!.lineTo(x, h);
      ctx!.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      const y = r * CELL_SIZE + 0.5;
      ctx!.beginPath();
      ctx!.moveTo(0, y);
      ctx!.lineTo(w, y);
      ctx!.stroke();
    }

    // Mouse glow effect
    if (mousePos.value && isMouseInside) {
      const mx = mousePos.value.x;
      const my = mousePos.value.y;

      const startCol = Math.max(0, Math.floor((mx - glowRadius) / CELL_SIZE));
      const endCol = Math.min(cols - 1, Math.ceil((mx + glowRadius) / CELL_SIZE));
      const startRow = Math.max(0, Math.floor((my - glowRadius) / CELL_SIZE));
      const endRow = Math.min(rows - 1, Math.ceil((my + glowRadius) / CELL_SIZE));

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const cx = c * CELL_SIZE + CELL_SIZE / 2;
          const cy = r * CELL_SIZE + CELL_SIZE / 2;
          const dist = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2);

          if (dist < glowRadius) {
            const opacity = Math.max(0, (1 - dist / glowRadius) * 0.25);
            ctx!.fillStyle = `rgba(26, 86, 219, ${opacity})`;
            ctx!.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
      }
    }

    rafId = requestAnimationFrame(drawGrid);
  }

  drawGrid();

  onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas);
    if (rafId !== null) cancelAnimationFrame(rafId);
  });
}

onMounted(() => {
  setupCanvas();
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseleave', handleMouseLeave);
});
</script>

<template>
  <canvas ref="canvasRef" class="absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />
</template>
