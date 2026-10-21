import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

/** Transparent star layer: the original slow rotation/parallax over the marble. */
export function ParticleField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const surface = canvas.current;
    const context = surface?.getContext('2d', { alpha: true });
    if (!surface || !context) return;
    let width = 0, height = 0, frame = 0, elapsed = 0, last = 0;
    let mouseX = 0, mouseY = 0, offsetX = 0, offsetY = 0;
    // Seeded coordinates keep the field stable through rerenders and language changes.
    let seed = 7419;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const stars = Array.from({ length: 900 }, () => {
      const radius = 50 + random() * 100, theta = random() * Math.PI * 2, phi = Math.acos(2 * random() - 1);
      return { x: radius * Math.sin(phi) * Math.cos(theta), y: radius * Math.sin(phi) * Math.sin(theta), z: radius * Math.cos(phi), size: .12 + random() * .45, brightness: .22 + random() * .52 };
    });
    const draw = (now: number) => {
      if (last) elapsed += Math.min(now - last, 50) / 1000;
      last = now;
      offsetX += (mouseX * 5 - offsetX) * .05;
      offsetY += (mouseY * 5 - offsetY) * .05;
      context.clearRect(0, 0, width, height);
      const cy = Math.cos(elapsed * .02), sy = Math.sin(elapsed * .02), cx = Math.cos(elapsed * .01), sx = Math.sin(elapsed * .01);
      const focal = Math.max(width, height) * .72;
      for (const star of stars) {
        const rx = star.x * cy - star.z * sy, rz = star.x * sy + star.z * cy;
        const ry = star.y * cx - rz * sx, depth = star.y * sx + rz * cx + 220;
        const scale = focal / depth;
        const x = width / 2 + (rx + offsetX) * scale, y = height / 2 + (ry + offsetY) * scale;
        if (x < 0 || y < 0 || x > width || y > height) continue;
        context.beginPath(); context.fillStyle = `rgba(255,255,255,${star.brightness})`;
        context.arc(x, y, Math.min(1.05, star.size * scale * .55), 0, Math.PI * 2); context.fill();
      }
      if (!reduced && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      surface.width = Math.round(width * ratio); surface.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (reduced) draw(0);
    };
    const pointer = (event: PointerEvent) => { if (event.pointerType === 'mouse') { mouseX = event.clientX / width * 2 - 1; mouseY = event.clientY / height * 2 - 1; } };
    const visibility = () => { cancelAnimationFrame(frame); last = 0; if (!document.hidden && !reduced) frame = requestAnimationFrame(draw); };
    resize(); if (!reduced) frame = requestAnimationFrame(draw);
    window.addEventListener('resize', resize); window.addEventListener('pointermove', pointer, { passive: true }); document.addEventListener('visibilitychange', visibility);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', pointer); document.removeEventListener('visibilitychange', visibility); };
  }, [reduced]);
  return <canvas ref={canvas} className="dt-public-particles" aria-hidden="true" data-animated={!reduced} />;
}
