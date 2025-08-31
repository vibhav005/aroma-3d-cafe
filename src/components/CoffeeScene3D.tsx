import { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, Text3D, Float } from '@react-three/drei';
import * as THREE from 'three';

// Simple 3D Coffee Cup Component
function CoffeeCup() {
  const meshRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        {/* Coffee Cup Body */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.8, 0.6, 1.2, 32]} />
          <meshStandardMaterial color="#f5f5dc" roughness={0.1} />
        </mesh>
        
        {/* Coffee Liquid */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.1, 32]} />
          <meshStandardMaterial color="#8B4513" roughness={0.2} />
        </mesh>
        
        {/* Cup Handle */}
        <mesh position={[0.9, -0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.3, 0.05, 8, 16]} />
          <meshStandardMaterial color="#f5f5dc" roughness={0.1} />
        </mesh>
        
        {/* Steam Particles */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[Math.sin(i) * 0.2, 0.8 + i * 0.2, Math.cos(i) * 0.2]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial 
              color="white" 
              transparent 
              opacity={0.6 - i * 0.1}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Coffee Bean Component
function CoffeeBean({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#4a2c2a" roughness={0.8} />
    </mesh>
  );
}

const CoffeeScene3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [3, 2, 3], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#fff5ee" />
        
        {/* Main Coffee Cup */}
        <CoffeeCup />
        
        {/* Scattered Coffee Beans */}
        <CoffeeBean position={[-2, -1, 1]} />
        <CoffeeBean position={[2, -0.8, -1]} />
        <CoffeeBean position={[-1.5, -1.2, -0.5]} />
        <CoffeeBean position={[1.8, -0.9, 0.8]} />
        <CoffeeBean position={[0.5, -1.1, 2]} />
        
        {/* Wooden Table Surface */}
        <mesh position={[0, -1.5, 0]} receiveShadow>
          <boxGeometry args={[8, 0.2, 8]} />
          <meshStandardMaterial color="#8b4513" roughness={0.8} />
        </mesh>
        
        {/* Controls */}
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
};

export default CoffeeScene3D;