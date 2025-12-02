"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
}

export default function WarpBackground() {
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
    let speed = 2;
    let tailLength = 15;
    const depth = 1000;
    const starColor = "#00FFFF";

    const safeRadius = 120;
    const fadeRange = 200;

    const stars: Star[] = [];

    let scrollCount = 0;
    let slowMode = false;
    let decayActive = false;
    let decayStart = 0;
    let initialSpeed = speed;
    const speedMin = 0.12; // velocidad mínima al decaer
    const decayLambda = 1.8; // constante de decaimiento (1/s)
    let scrollAccum = 0; // acumulador de magnitud de scroll
    const scrollThreshold = 600; // umbral para activar decaimiento (ajustable)
    const initialTailLength = tailLength;
    const startTime = performance.now();

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

    const enableSlowMode = () => {
      if (slowMode) return; slowMode = true; speed = 0.25; tailLength = 0;
    };

    const render = () => {
      const now = performance.now();
      const t = (now - startTime) / 1000;
      // Si el decay está activo, actualizar la velocidad exponencialmente hacia speedMin
      if (decayActive) {
        const elapsed = (now - decayStart) / 1000;
        speed = Math.max(speedMin, speedMin + (initialSpeed - speedMin) * Math.exp(-decayLambda * elapsed));
        // Reducir gradualmente la estela proporcional a la velocidad
        tailLength = Math.max(0, Math.round(15 * (speed / initialSpeed)));
      }
      ctx.fillStyle = "#000510"; ctx.fillRect(0,0,width,height);

      ctx.strokeStyle = starColor; ctx.lineWidth = 1.5; ctx.lineCap = "round";

      stars.forEach((star, idx) => {
        star.z -= speed;
        if (star.z <= 0) { star.z = depth; star.x = (Math.random()-0.5)*width*3; star.y = (Math.random()-0.5)*height*3; }

        const k = 128.0 / star.z; const x1 = cx + star.x * k; const y1 = cy + star.y * k;
        const dx = x1 - cx; const dy = y1 - cy; const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < safeRadius) return;

        if (!slowMode) {
          const k2 = 128.0 / (star.z + tailLength); const x2 = cx + star.x * k2; const y2 = cy + star.y * k2;
          let alpha = 1; if (dist < safeRadius + fadeRange) alpha = (dist - safeRadius) / fadeRange; alpha *= (1 - star.z / depth);
          if (alpha > 0.05 && x1 > 0 && x1 < width && y1 > 0 && y1 < height) { ctx.globalAlpha = alpha; ctx.beginPath(); ctx.moveTo(x2,y2); ctx.lineTo(x1,y1); ctx.stroke(); }
        } else {
          const twinkle = 0.6 + 0.4 * Math.sin((star.z * 0.02) + t * 1.5 + idx);
          const alpha = Math.max(0.05, (1 - star.z / depth) * twinkle);
          const radius = Math.max(0.35, (1 - star.z / depth) * 1.6);
          if (x1 > -10 && x1 < width + 10 && y1 > -10 && y1 < height + 10) { ctx.globalAlpha = alpha; ctx.fillStyle = starColor; ctx.beginPath(); ctx.arc(x1,y1,radius,0,Math.PI*2); ctx.fill(); }
        }
      });

      if (mx > -9999 && my > -9999) {
        const blurRadius = Math.min(420, Math.max(120, Math.hypot(width, height) * 0.14));
        ctx.save(); ctx.filter = 'blur(10px)'; const grad = ctx.createRadialGradient(mx,my,0,mx,my,blurRadius);
        grad.addColorStop(0,'rgba(0,5,16,0.85)'); grad.addColorStop(0.45,'rgba(0,5,16,0.55)'); grad.addColorStop(1,'rgba(0,5,16,0)');
        ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(mx,my,blurRadius,0,Math.PI*2); ctx.fill(); ctx.filter='none'; ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const onWheel = (e: WheelEvent) => {
      // Acumular magnitud de scroll (soporta touchpads con pequeños deltaY)
      scrollAccum += Math.abs(e.deltaY);
      if (!decayActive && scrollAccum >= scrollThreshold) {
        decayActive = true;
        decayStart = performance.now();
        initialSpeed = speed;
        slowMode = true;
      }
    };

    const onTouchStart = () => {
      // Contar touch como una cantidad significativa de scroll
      scrollAccum += 200;
      if (!decayActive && scrollAccum >= scrollThreshold) {
        decayActive = true;
        decayStart = performance.now();
        initialSpeed = speed;
        slowMode = true;
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('touchend', onPointerLeave);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    resize(); render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('touchend', onPointerLeave);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 -z-10 w-full h-full pointer-events-none" />
  );
}
