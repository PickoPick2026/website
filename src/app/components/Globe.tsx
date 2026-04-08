import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

const INDIA_LAT = 20.5937;
const INDIA_LNG = 78.9629;

const DESTINATIONS = [
  { name: 'USA', lat: 37.0902, lng: -95.7129 },
  { name: 'UK', lat: 55.3781, lng: -3.4360 },
  { name: 'Canada', lat: 56.1304, lng: -106.3468 },
  { name: 'Australia', lat: -25.2744, lng: 133.7751 },
  { name: 'UAE', lat: 23.4241, lng: 53.8478 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Europe', lat: 51.1657, lng: 10.4515 }, // Germany as Europe proxy
];

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

function FlightPath({ start, end, radius }: { start: {lat: number, lng: number}, end: {lat: number, lng: number}, radius: number }) {
  const { points, curve } = useMemo(() => {
    const startVec = latLngToVector3(start.lat, start.lng, radius);
    const endVec = latLngToVector3(end.lat, end.lng, radius);
    
    // Create a curve
    const distance = startVec.distanceTo(endVec);
    const midPoint = startVec.clone().lerp(endVec, 0.5);
    midPoint.normalize().multiplyScalar(radius + distance * 0.3); // Curve height based on distance
    
    const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
    return { points: curve.getPoints(50), curve };
  }, [start, end, radius]);

  const lineRef = useRef<any>(null);
  const planeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (lineRef.current) {
      lineRef.current.material.dashOffset -= 0.005;
    }

    if (planeRef.current) {
      // Move plane along the curve
      const t = (time * 0.1) % 1; // Speed of the plane
      const position = curve.getPointAt(t);
      planeRef.current.position.copy(position);
      
      // Orient plane along the curve
      const tangent = curve.getTangentAt(t).normalize();
      // We need to look at the next point to orient correctly
      const lookAtPos = position.clone().add(tangent);
      planeRef.current.lookAt(lookAtPos);
    }
  });

  return (
    <group>
      <Line
        ref={lineRef}
        points={points}
        color="#3b82f6"
        lineWidth={2}
        dashed
        dashScale={50}
        dashSize={1}
        dashOffset={0}
        transparent
        opacity={0.6}
      />
      <mesh ref={planeRef}>
        <coneGeometry args={[0.02, 0.08, 4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

export function Globe() {
  const groupRef = useRef<THREE.Group>(null);
  const radius = 2;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  const indiaPos = latLngToVector3(INDIA_LAT, INDIA_LNG, radius);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Earth Sphere */}
      <Sphere args={[radius, 64, 64]}>
        <meshStandardMaterial 
          color="#f8fafc" 
          roughness={0.8}
          metalness={0.1}
          wireframe={true}
          transparent
          opacity={0.1}
        />
      </Sphere>

      {/* Solid inner sphere to hide back lines */}
      <Sphere args={[radius * 0.99, 32, 32]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>

      {/* India Marker */}
      <mesh position={indiaPos}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#2563eb" />
        <Html center position={[0, 0.1, 0]}>
          <div className="relative flex flex-col items-center">
            <div className="px-3 py-1.5 bg-gradient-to-br from-blue-600 to-indigo-800 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-600/50 whitespace-nowrap mb-2 animate-pulse">
              India
            </div>
            
            {/* Small Flight Image */}
            <img 
              src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=200" 
              alt="Flight" 
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-14 h-14 object-cover rounded-full border-2 border-white shadow-lg animate-[bounce_3s_infinite]"
              referrerPolicy="no-referrer"
            />
          </div>
        </Html>
      </mesh>

      {/* Flight Paths and Destinations */}
      {DESTINATIONS.map((dest, i) => {
        const destPos = latLngToVector3(dest.lat, dest.lng, radius);
        return (
          <group key={i}>
            <FlightPath start={{lat: INDIA_LAT, lng: INDIA_LNG}} end={dest} radius={radius} />
            <mesh position={destPos}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshBasicMaterial color="#3b82f6" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
