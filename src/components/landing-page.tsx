'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
    let bgStars: THREE.Points, activeStars: THREE.Points;
    let mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const init = () => {
      const container = containerRef.current;
      if (!container) return;

      document.body.classList.add('landing-page-active');

      // Scene setup
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.0015);

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      camera.position.z = 100;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      // Star Texture
      const createStarTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (!ctx) return new THREE.Texture();
        const cx = 32, cy = 32, outerRadius = 30, innerRadius = 12, spikes = 5;
        let rot = Math.PI / 2 * 3, x = cx, y = cy, step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius; y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y); rot += step;
            x = cx + Math.cos(rot) * innerRadius; y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y); rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius); ctx.closePath();
        ctx.fillStyle = '#ffffff'; ctx.fill();
        ctx.shadowBlur = 10; ctx.shadowColor = "white";
        return new THREE.CanvasTexture(canvas);
      };
      const starTexture = createStarTexture();

      // Background Stars
      const bgStarGeometry = new THREE.BufferGeometry();
      const bgStarCount = 2000;
      const bgPosArray = new Float32Array(bgStarCount * 3);
      for(let i = 0; i < bgStarCount * 3; i++) { bgPosArray[i] = (Math.random() - 0.5) * 1500; }
      bgStarGeometry.setAttribute('position', new THREE.BufferAttribute(bgPosArray, 3));
      const bgStarMaterial = new THREE.PointsMaterial({ size: 1.5, map: starTexture, color: 0xffffff, transparent: true, opacity: 0.4, alphaTest: 0.1 });
      bgStars = new THREE.Points(bgStarGeometry, bgStarMaterial);
      scene.add(bgStars);

      // Active Stars
      const activeStarGeometry = new THREE.BufferGeometry();
      const activeStarCount = 800;
      const activeStarPosArray = new Float32Array(activeStarCount * 3);
      for(let i = 0; i < activeStarCount * 3; i++) { activeStarPosArray[i] = (Math.random() - 0.5) * 600; }
      activeStarGeometry.setAttribute('position', new THREE.BufferAttribute(activeStarPosArray, 3));
      const activeStarMaterial = new THREE.PointsMaterial({ size: 4, map: starTexture, color: 0xffffff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
      activeStars = new THREE.Points(activeStarGeometry, activeStarMaterial);
      scene.add(activeStars);

      // Event Listeners
      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('touchmove', onTouchMove, false);
      window.addEventListener('resize', onWindowResize, false);
    };

    const onMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    };

    const onTouchMove = (event: TouchEvent) => {
        if (event.touches.length > 0) {
            mouseX = (event.touches[0].clientX - windowHalfX);
            mouseY = (event.touches[0].clientY - windowHalfY);
        }
    };
    
    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        if (activeStars && bgStars) {
            activeStars.rotation.y = elapsedTime * 0.02;
            activeStars.rotation.x = mouseY * 0.0001;
            bgStars.rotation.y = -elapsedTime * 0.005;
            camera.rotation.y += 0.05 * (-mouseX * 0.0005 - camera.rotation.y);
            camera.rotation.x += 0.05 * (-mouseY * 0.0005 - camera.rotation.x);
            (activeStars.material as THREE.PointsMaterial).opacity = 0.7 + Math.sin(elapsedTime * 2) * 0.2;
        }

        renderer.render(scene, camera);
    };

    init();
    animate();

    // Cleanup function
    return () => {
        cancelAnimationFrame(animationFrameId);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('resize', onWindowResize);
        if (containerRef.current && renderer) {
            containerRef.current.removeChild(renderer.domElement);
        }
        document.body.classList.remove('landing-page-active');
    };
  }, []);

  const handleEnterClick = () => {
    setIsExiting(true);
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.style.transition = 'opacity 1s ease-out';
      overlay.style.opacity = '0';
    }
    // Call the parent onEnter function after animation
    setTimeout(() => {
        onEnter();
    }, 1000);
  };

  if (isExiting) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100 }}>
        <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}></div>
        <div ref={overlayRef} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, textAlign: 'center', width: '90%', maxWidth: '800px', pointerEvents: 'none' }}>
            <h1 className="landing-h1">MEARİC</h1>
            <div className="landing-divider"></div>
            <p className="landing-p">
                "İslam'ın ışığında, Kuran ve Sünnetin rehberliğinde ebedi bir yolculuk."
            </p>
            <button className="landing-btn-enter" onClick={handleEnterClick}>Bismillah</button>
        </div>
    </div>
  );
};
