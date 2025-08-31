import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

// Realistic 3D Coffee Cup Component
function RealisticCoffeeCup() {
  const groupRef = useRef<THREE.Group>(null!);
  const steamRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.05;
    }
    
    // Animate steam particles
    if (steamRef.current) {
      steamRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        mesh.position.y = 0.8 + i * 0.15 + Math.sin(time * 2 + i) * 0.1;
        mesh.position.x = Math.sin(time + i * 0.5) * 0.1;
        mesh.position.z = Math.cos(time + i * 0.5) * 0.1;
        mesh.rotation.z = time * 0.5 + i;
      });
    }
  });

  // Create realistic cup geometry
  const cupGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Create cup profile with curve
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 0.6 + Math.sin(angle * 2) * 0.05; // Slight curve
      points.push(new THREE.Vector2(radius, -0.6 + (i / 20) * 1.2));
    }
    
    const geometry = new THREE.LatheGeometry(points, 32);
    return geometry;
  }, []);

  // Realistic materials
  const cupMaterial = new THREE.MeshPhysicalMaterial({
    color: '#f8f6f0',
    roughness: 0.2,
    metalness: 0.1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
  });

  const coffeeMaterial = new THREE.MeshPhysicalMaterial({
    color: '#2d1810',
    roughness: 0.1,
    metalness: 0.3,
    reflectivity: 0.8,
  });

  const handleMaterial = new THREE.MeshPhysicalMaterial({
    color: '#f8f6f0',
    roughness: 0.3,
    metalness: 0.1,
    clearcoat: 0.6,
  });

  // Create handle geometry
  const handleGeometry = useMemo(() => {
    const curve = new THREE.EllipseCurve(
      0, 0,
      0.35, 0.4,
      0, Math.PI * 1.5,
      false,
      0
    );
    const points = curve.getPoints(32);
    const geometry = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p.x, p.y, 0))),
      32,
      0.03,
      8,
      false
    );
    return geometry;
  }, []);

  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      >
        {/* Main cup body */}
        <mesh position={[0, -0.3, 0]} geometry={cupGeometry} material={cupMaterial} castShadow />
        
        {/* Coffee liquid surface with foam pattern */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.02, 64]} />
          <primitive object={coffeeMaterial} attach="material" />
        </mesh>
        
        {/* Latte art foam */}
        <mesh position={[0, 0.31, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.01, 32]} />
          <meshStandardMaterial 
            color="#f4f1e8" 
            roughness={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Coffee cup handle */}
        <mesh 
          position={[0.7, -0.1, 0]} 
          rotation={[Math.PI / 2, 0, 0]}
          geometry={handleGeometry}
          material={handleMaterial}
          castShadow
        />
        
        {/* Saucer */}
        <mesh position={[0, -0.95, 0]}>
          <cylinderGeometry args={[1.1, 1.1, 0.05, 64]} />
          <primitive object={cupMaterial} attach="material" />
        </mesh>
        
        {/* Realistic steam effect */}
        <group ref={steamRef}>
          {[...Array(12)].map((_, i) => (
            <mesh key={i} position={[
              Math.sin(i * 0.5) * 0.15, 
              0.8 + i * 0.15, 
              Math.cos(i * 0.5) * 0.15
            ]}>
              <sphereGeometry args={[0.015 + Math.random() * 0.01, 8, 8]} />
              <meshStandardMaterial 
                color="white" 
                transparent 
                opacity={0.7 - i * 0.05}
                emissive="#ffffff"
                emissiveIntensity={0.1}
              />
            </mesh>
          ))}
        </group>
        
        {/* Coffee beans around the cup */}
        {[...Array(8)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 1.5,
              -0.9 + Math.random() * 0.1,
              Math.sin((i / 8) * Math.PI * 2) * 1.5
            ]}
            rotation={[Math.random(), Math.random(), Math.random()]}
          >
            <sphereGeometry args={[0.08, 16, 12]} />
            <meshStandardMaterial 
              color="#3c2414" 
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        ))}
        
        {/* Sparkle effects */}
        <Sparkles 
          count={50}
          scale={3}
          size={2}
          speed={0.3}
          opacity={0.6}
          color="#ffd700"
        />
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
        <RealisticCoffeeCup />
        
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