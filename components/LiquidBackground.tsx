"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
}

interface Props {
  forceSlow?: boolean;
  startFast?: boolean;
}

export default function WarpBackground({ forceSlow = false, startFast = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0, height = 0, cx = 0, cy = 0;
    let animationFrameId: number;
    let mx = -10000, my = -10000;

    // CONFIG
    const starCount = 600;
    // Start fast if requested (simulating exit from warp), otherwise normal speed
    let speed = startFast ? 40 : 2;
    let tailLength = 15;
    const depth = 1000;
    const starColor = "#E0FFFF"; // Whitish cyan

    const safeRadius = 120;
    const fadeRange = 200;

    const stars: Star[] = [];

    // Scroll control config
    const maxSpeed = 2.0;
    const minSpeed = 0.1;
    const scrollRange = 1000; // pixels to reach min speed
    let targetSpeed = maxSpeed;
    let currentScrollY = 0;

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: (Math.random() - 0.5) * width * 3,
          y: (Math.random() - 0.5) * height * 3,
          z: Math.random() * depth,
        });
      }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cx = width / 2;
      cy = height / 2;
      initStars();
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        mx = e.clientX; my = e.clientY;
      } else {
        const t = (e as TouchEvent).touches[0];
        if (t) { mx = t.clientX; my = t.clientY; }
      }
    };

    const onPointerLeave = () => { mx = -10000; my = -10000; };

    const render = () => {
      // Calculate target speed based on scroll
      // Use currentScrollY updated by event listeners
      if (forceSlow) {
        targetSpeed = minSpeed;
      } else {
        const scrollRatio = Math.min(1, currentScrollY / scrollRange);
        targetSpeed = maxSpeed - (maxSpeed - minSpeed) * scrollRatio;
      }

      // Smoothly interpolate current speed to target speed
      // Using a simple lerp factor of 0.05 for smoothness
      speed += (targetSpeed - speed) * 0.05;

      // Update tail length based on speed
      tailLength = Math.max(0, Math.round(15 * (speed / maxSpeed)));

      ctx.fillStyle = "#000510"; ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = starColor; ctx.lineWidth = 1.5; ctx.lineCap = "round";

      stars.forEach((star, idx) => {
        star.z -= speed;
        if (star.z <= 0) { star.z = depth; star.x = (Math.random() - 0.5) * width * 3; star.y = (Math.random() - 0.5) * height * 3; }

        const k = 128.0 / star.z; const x1 = cx + star.x * k; const y1 = cy + star.y * k;
        const dx = x1 - cx; const dy = y1 - cy; const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < safeRadius) return;

        // Determine if we are in "slow mode" effectively for rendering style
        // We can say if speed is close to minSpeed, we use the dot style
        const isSlow = speed < 0.5;

        if (!isSlow) {
          const k2 = 128.0 / (star.z + tailLength); const x2 = cx + star.x * k2; const y2 = cy + star.y * k2;
          let alpha = 1; if (dist < safeRadius + fadeRange) alpha = (dist - safeRadius) / fadeRange; alpha *= (1 - star.z / depth);
          if (alpha > 0.05 && x1 > 0 && x1 < width && y1 > 0 && y1 < height) { ctx.globalAlpha = alpha; ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x1, y1); ctx.stroke(); }
        } else {
          const now = performance.now() / 1000;
          const twinkle = 0.6 + 0.4 * Math.sin((star.z * 0.02) + now * 1.5 + idx);
          const alpha = Math.max(0.05, (1 - star.z / depth) * twinkle);
          const radius = Math.max(0.35, (1 - star.z / depth) * 1.6);
          if (x1 > -10 && x1 < width + 10 && y1 > -10 && y1 < height + 10) { ctx.globalAlpha = alpha; ctx.fillStyle = starColor; ctx.beginPath(); ctx.arc(x1, y1, radius, 0, Math.PI * 2); ctx.fill(); }
        }
      });

      if (mx > -9999 && my > -9999) {
        const blurRadius = Math.min(420, Math.max(120, Math.hypot(width, height) * 0.14));
        ctx.save(); ctx.filter = 'blur(10px)'; const grad = ctx.createRadialGradient(mx, my, 0, mx, my, blurRadius);
        grad.addColorStop(0, 'rgba(0,5,16,0.85)'); grad.addColorStop(0.45, 'rgba(0,5,16,0.55)'); grad.addColorStop(1, 'rgba(0,5,16,0)');
        ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(mx, my, blurRadius, 0, Math.PI * 2); ctx.fill(); ctx.filter = 'none'; ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const onScroll = () => {
      currentScrollY = window.scrollY;
    };

    const onLenisScroll = (e: any) => {
      // e.detail contains the scroll info from Lenis
      if (e.detail && typeof e.detail.scroll === 'number') {
        currentScrollY = e.detail.scroll;
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('touchend', onPointerLeave);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('lenis-scroll', onLenisScroll as EventListener);

    resize(); render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('touchend', onPointerLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('lenis-scroll', onLenisScroll as EventListener);
      cancelAnimationFrame(animationFrameId);
    };
  }, [forceSlow, startFast]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 -z-10 w-full h-full pointer-events-none" />
  );
}
