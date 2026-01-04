import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Environment } from '@react-three/drei';
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

const LLogo = () => {
    const meshRef = useRef<THREE.Group>(null);

    // L 모양을 큐브들로 구성 (픽셀 아트 느낌)
    const blocks = [
        // Vertical part
        [0, 2, 0], [0, 1, 0], [0, 0, 0], [0, -1, 0], [0, -2, 0],
        // Horizontal part
        [1, -2, 0], [2, -2, 0]
    ];

    useFrame((state) => {
        if (!meshRef.current) return;
        const { x, y } = state.mouse;
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x * 0.5, 0.1);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -y * 0.5, 0.1);
    });

    return (
        <group ref={meshRef}>
            {blocks.map((pos, i) => (
                <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
                    <boxGeometry args={[0.9, 0.9, 0.9]} />
                    <meshStandardMaterial
                        color="#22c55e"
                        emissive="#22c55e"
                        emissiveIntensity={0.2}
                        roughness={0.1}
                        metalness={0.8}
                    />
                </mesh>
            ))}
        </group>
    );
};

const Particles = ({ count = 150 }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -60 + Math.random() * 120;
            const yFactor = -60 + Math.random() * 120;
            const zFactor = -60 + Math.random() * 120;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!mesh.current) return;
        particles.forEach((particle, i) => {
            let { t, factor, xFactor, yFactor, zFactor } = particle;
            t = particle.t += particle.speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            particle.mx += (state.mouse.x * 800 - particle.mx) * 0.01;
            particle.my += (state.mouse.y * 800 - particle.my) * 0.01;

            dummy.position.set(
                (particle.mx / 12) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 12,
                (particle.my / 12) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 12,
                (particle.my / 12) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 12
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial
                color="#FFFF00"
                emissive="#FFFF00"
                emissiveIntensity={0.5}
                roughness={0}
                metalness={1}
            />
        </instancedMesh>
    );
};

export const Luigi3DBackground = () => {
    return (
        <div className="absolute inset-0 w-full h-full -z-20 opacity-40 pointer-events-none">
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 20], fov: 50 }}>
                <Suspense fallback={null}>
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
                    <Particles count={100} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export const LuigiHeroLogo = () => {
    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.8} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={3} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={1.5} color="#004080" />

                    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                        <LLogo />
                    </Float>

                    <Environment preset="night" />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Canvas>
        </div>
    );
};

export const Luigi3DScene = () => {
    return (
        <>
            <Luigi3DBackground />
            <LuigiHeroLogo />
        </>
    );
};
