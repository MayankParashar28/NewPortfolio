import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import { useTheme } from "@/components/ThemeProvider";
import * as THREE from "three";


// Manual random point generator to avoid NaN issues
const generateSpherePoints = (count: number, radius: number) => {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = Math.cbrt(Math.random()) * radius; // Cubic root for uniform distribution

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    points[i * 3] = isNaN(x) ? 0 : x;
    points[i * 3 + 1] = isNaN(y) ? 0 : y;
    points[i * 3 + 2] = isNaN(z) ? 0 : z;
  }
  return points;
};

function Stars(props: any) {
  const ref = useRef<any>();
  const [sphere] = useMemo(() => {
    return [generateSpherePoints(10000, 10)];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;

      // Mouse interaction
      const { mouse } = state;
      ref.current.rotation.x += mouse.y * 0.0005;
      ref.current.rotation.y += mouse.x * 0.0005;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color={props.color}
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function Connections({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const linesGeometryRef = useRef<THREE.BufferGeometry>(null);
  const { viewport } = useThree();

  // Shockwave state
  const shockwaveRef = useRef({ active: false, radius: 0, time: 0 });

  useEffect(() => {
    const handleClick = () => {
      shockwaveRef.current = { active: true, radius: 0, time: 0 };
    };

    const handleShockwave = (e: any) => {
      shockwaveRef.current = { active: true, radius: 0, time: 0 };
      if (e.detail && typeof e.detail.x === 'number' && typeof e.detail.y === 'number') {
        // Use the provided normalized coordinates
        mouseRef.current.x = e.detail.x;
        mouseRef.current.y = e.detail.y;
      }
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("trigger-shockwave", handleShockwave);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("trigger-shockwave", handleShockwave);
    };
  }, []);

  const [data] = useState(() => {
    const count = 400; // Increased from 250
    const radius = 12; // Increased radius
    const points = generateSpherePoints(count, radius);
    const indices: number[] = [];
    const colors = new Float32Array(count * 3);

    // Initialize colors
    const baseColor = new THREE.Color(color);
    for (let i = 0; i < count; i++) {
      colors[i * 3] = baseColor.r;
      colors[i * 3 + 1] = baseColor.g;
      colors[i * 3 + 2] = baseColor.b;
    }

    // Create connections indices
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const p1x = points[i * 3];
        const p1y = points[i * 3 + 1];
        const p1z = points[i * 3 + 2];
        const p2x = points[j * 3];
        const p2y = points[j * 3 + 1];
        const p2z = points[j * 3 + 2];

        const dx = p1x - p2x;
        const dy = p1y - p2y;
        const dz = p1z - p2z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 3.5) { // Increased threshold
          indices.push(i, j);
        }
      }
    }

    return {
      initialPositions: new Float32Array(points),
      positions: new Float32Array(points),
      indices: new Uint16Array(indices),
      colors: colors
    };
  });

  // Global mouse tracking to bypass DOM layering issues
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates to -1 to +1
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current && geometryRef.current) {
      // Rotation
      groupRef.current.rotation.x -= delta / 15;
      groupRef.current.rotation.y -= delta / 20;

      // Use global mouse for rotation
      groupRef.current.rotation.x += mouseRef.current.y * 0.0005;
      groupRef.current.rotation.y += mouseRef.current.x * 0.0005;

      // IMPORTANT: Update matrix world before using it for raycasting
      groupRef.current.updateMatrixWorld();

      // Physics
      const inverseMatrix = new THREE.Matrix4().copy(groupRef.current.matrixWorld).invert();

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouseRef.current, state.camera);

      const rayOrigin = raycaster.ray.origin.clone().applyMatrix4(inverseMatrix);
      const rayDir = raycaster.ray.direction.clone().transformDirection(inverseMatrix).normalize();
      const localRay = new THREE.Ray(rayOrigin, rayDir);

      const positions = geometryRef.current.attributes.position.array as Float32Array;
      const colors = geometryRef.current.attributes.color.array as Float32Array;
      const initialPositions = data.initialPositions;

      // Update Shockwave
      if (shockwaveRef.current.active) {
        shockwaveRef.current.time += delta * 2;
        shockwaveRef.current.radius = shockwaveRef.current.time * 20; // Expansion speed
        if (shockwaveRef.current.time > 2) {
          shockwaveRef.current.active = false;
        }
      }

      const baseColor = new THREE.Color(color);
      const highlightColor = new THREE.Color("#ff0080"); // Hot pink highlight
      if (color.includes("eb")) highlightColor.set("#00ffff"); // Cyan for light mode (blue base)

      for (let i = 0; i < positions.length; i += 3) {
        const px = positions[i];
        const py = positions[i + 1];
        const pz = positions[i + 2];
        const pVec = new THREE.Vector3(px, py, pz);

        // Mouse Interaction
        const distSq = localRay.distanceSqToPoint(pVec);
        const interactionRadius = 15.0;

        if (distSq < interactionRadius) {
          const closestPointOnRay = new THREE.Vector3();
          localRay.closestPointToPoint(pVec, closestPointOnRay);

          const dir = pVec.clone().sub(closestPointOnRay).normalize();

          // Smoother force calculation
          // Use sqrt to make falloff linear with distance, not quadratic
          // And reduce the multiplier significantly
          const dist = Math.sqrt(distSq);
          const radius = Math.sqrt(interactionRadius);
          const force = (radius - dist) * 2.0; // Reduced from ~225 max to ~8 max

          positions[i] += dir.x * force * delta;
          positions[i + 1] += dir.y * force * delta;
          positions[i + 2] += dir.z * force * delta;
        }

        // Shockwave Interaction
        if (shockwaveRef.current.active) {
          // ... (shockwave logic remains same, or can be smoothed too if needed)
          const shockDist = pVec.distanceTo(rayOrigin);
          const distFromCenter = pVec.length();
          const wavePos = shockwaveRef.current.radius;
          const waveWidth = 2.0;

          if (Math.abs(distFromCenter - wavePos) < waveWidth) {
            const dir = pVec.clone().normalize();
            const force = 5.0 * (1 - Math.abs(distFromCenter - wavePos) / waveWidth); // Reduced from 10.0
            positions[i] += dir.x * force * delta;
            positions[i + 1] += dir.y * force * delta;
            positions[i + 2] += dir.z * force * delta;
          }
        }

        // Spring back
        const ix = initialPositions[i];
        const iy = initialPositions[i + 1];
        const iz = initialPositions[i + 2];

        const springStrength = 5.0; // Increased from 3.0 for snappier but smooth return
        positions[i] += (ix - positions[i]) * springStrength * delta;
        positions[i + 1] += (iy - positions[i + 1]) * springStrength * delta;
        positions[i + 2] += (iz - positions[i + 2]) * springStrength * delta;

        // Color Update based on displacement
        const dx = positions[i] - ix;
        const dy = positions[i + 1] - iy;
        const dz = positions[i + 2] - iz;
        const displacement = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const lerpFactor = Math.min(displacement * 0.5, 1); // 0 to 1 based on movement

        const c = baseColor.clone().lerp(highlightColor, lerpFactor);
        colors[i] = c.r;
        colors[i + 1] = c.g;
        colors[i + 2] = c.b;
      }

      geometryRef.current.attributes.position.needsUpdate = true;
      geometryRef.current.attributes.color.needsUpdate = true;

      // Update lines geometry
      if (linesGeometryRef.current) {
        linesGeometryRef.current.attributes.position.needsUpdate = true;
        // Lines don't strictly need vertex colors if we want them simple,
        // but let's try to give them colors too if possible.
        // LineSegments with BufferGeometry and vertexColors is tricky with indexed geometry?
        // Actually, if we share the buffer, the colors should map!
        // But we need to make sure the material has vertexColors={true}
      }
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <group ref={groupRef}>
        <points>
          <bufferGeometry ref={geometryRef}>
            <bufferAttribute
              attach="attributes-position"
              count={data.positions.length / 3}
              array={data.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={data.colors.length / 3}
              array={data.colors}
              itemSize={3}
            />
            <bufferAttribute
              attach="index"
              count={data.indices.length}
              array={data.indices}
              itemSize={1}
            />
          </bufferGeometry>
          <PointMaterial
            transparent
            vertexColors
            size={0.015}
            sizeAttenuation={true}
            depthWrite={false}
          />
        </points>

        <lineSegments>
          <bufferGeometry ref={linesGeometryRef}>
            <bufferAttribute
              attach="attributes-position"
              count={data.positions.length / 3}
              array={data.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={data.colors.length / 3}
              array={data.colors}
              itemSize={3}
            />
            <bufferAttribute
              attach="index"
              count={data.indices.length}
              array={data.indices}
              itemSize={1}
            />
          </bufferGeometry>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.2}
            linewidth={1}
          />
        </lineSegments>
      </group>
    </group>
  );
}


function MouseTrail({ color }: { color: string }) {
  const { viewport } = useThree();
  const ref = useRef<any>();
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 5 : 20;
  const [positions] = useState(() => new Float32Array(particleCount * 3).fill(9999)); // Init off-screen
  const hasMoved = useRef(false);

  // Global mouse tracking
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      hasMoved.current = true;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!hasMoved.current) return;

    // Convert normalized mouse coordinates to viewport coordinates
    // We use mouseRef instead of state.mouse
    const x = (mouseRef.current.x * viewport.width) / 2;
    const y = (mouseRef.current.y * viewport.height) / 2;

    // Shift all positions back to create a trail effect
    for (let i = (particleCount - 1) * 3; i >= 3; i -= 3) {
      positions[i] = positions[i - 3];
      positions[i + 1] = positions[i - 2];
      positions[i + 2] = positions[i - 1];
    }

    // Set the new head position to the current mouse position
    positions[0] = x;
    positions[1] = y;
    positions[2] = 0;

    if (ref.current) {
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}
export default function Background3D() {
  const { theme } = useTheme();
  const starColor = theme === "dark" ? "#ffa0e0" : "#2563eb"; // Pinkish for dark, Blue for light

  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars color={starColor} />
        <Connections color={starColor} />
        <MouseTrail color={starColor} />

      </Canvas>
    </div>
  );
}
