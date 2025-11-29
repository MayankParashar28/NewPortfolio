import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "@/components/ThemeProvider";
import * as THREE from "three";

function Particles({ count = 1000 }) {
    const { theme } = useTheme();
    const mesh = useRef<THREE.InstancedMesh>(null);
    const lightColor = new THREE.Color("#4c1d95"); // Darker Purple for better visibility
    const darkColor = new THREE.Color("#ffffff"); // White

    const particleColor = theme === "dark" ? darkColor : lightColor;

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        const currentMesh = mesh.current;
        if (!currentMesh) return;

        const { mouse, viewport } = state;
        // Convert normalized mouse coordinates (-1 to 1) to world coordinates
        const mouseX = (mouse.x * viewport.width) / 2;
        const mouseY = (mouse.y * viewport.height) / 2;

        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            // Base position
            let x = (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10;
            let y = (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10;
            let z = (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10;

            // Mouse interaction (Repulsion)
            const dx = mouseX - x;
            const dy = mouseY - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 10) {
                const force = (10 - dist) / 10;
                const angle = Math.atan2(dy, dx);
                x -= Math.cos(angle) * force * 5;
                y -= Math.sin(angle) * force * 5;
            }

            dummy.position.set(x, y, z);
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();

            currentMesh.setMatrixAt(i, dummy.matrix);
        });

        currentMesh.instanceMatrix.needsUpdate = true;
        // Rotate the whole system slowly
        currentMesh.rotation.y += 0.001;
        currentMesh.rotation.x += 0.0005;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshPhongMaterial color={particleColor} opacity={theme === "dark" ? 0.8 : 0.8} transparent />
        </instancedMesh>
    );
}

export default function ParticleBackground() {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 50 : 300;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 100], fov: 75 }}
                eventSource={document.body}
                eventPrefix="client"
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Particles count={particleCount} />
            </Canvas>
        </div>
    );
}
