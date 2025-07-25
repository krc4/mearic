'use client';

import React, { useRef, useEffect } from 'react';

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const stars: {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
    }[] = [];
    const numStars = 200;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }

    const mouse = {
      x: width / 2,
      y: height / 2,
    };
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    canvas.addEventListener('mouseleave', () => {
        mouse.x = width / 2;
        mouse.y = height / 2;
    });


    function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);

        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 50, mouse.x, mouse.y, 250);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 250, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'white';
        stars.forEach(star => {
            ctx.beginPath();
            const dist = Math.hypot(star.x - mouse.x, star.y - mouse.y);
            const opacity = dist < 150 ? 1 - dist / 150 : star.opacity;
            ctx.globalAlpha = opacity * 0.8;
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();

            star.x += star.vx;
            star.y += star.vy;

            if (star.x < 0 || star.x > width) star.vx *= -1;
            if (star.y < 0 || star.y > height) star.vy *= -1;
        });

        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }

    draw();
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10 bg-gray-900" />;
}
