'use client';
import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import type * as THREE from 'three';

function Stars(props: any) {
  const ref = useRef<THREE.Points>(null!);
  const [sphere] = random.inSphere(new Float32Array(5001), { radius: 1.2 });

  useFrame((_state, delta) => {
    if (ref.current) {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere as Float32Array} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation={true}
          dithering={false}
        />
      </Points>
    </group>
  );
}


function RotatingIcosahedron() {
    const meshRef = useRef<THREE.Mesh>(null!);
  
    useFrame((_state, delta) => {
      if (meshRef.current) {
          meshRef.current.rotation.x += delta * 0.1;
          meshRef.current.rotation.y += delta * 0.2;
      }
    });
  
    return (
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial 
            color="#ffffff"
            emissive="#a369f7"
            emissiveIntensity={3}
            roughness={0.1}
            metalness={0.9}
        />
      </mesh>
    );
  }

export function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10">
       <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[0, 0, 1]} intensity={100} color="#a369f7"/>
        <pointLight position={[-10, -10, -10]} intensity={50} color="blue"/>
        <pointLight position={[10, 10, 10]} intensity={50} color="red"/>
        <Suspense fallback={null}>
          <Stars />
          <RotatingIcosahedron />
        </Suspense>
      </Canvas>
    </div>
  );
}
