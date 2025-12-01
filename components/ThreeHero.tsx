"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface ThreeHeroProps {
    className?: string;
}

function DepthPlane() {
    const mesh = useRef<THREE.Mesh>(null);
    const { viewport, pointer } = useThree();

    // Load textures
    const [colorMap, depthMap] = useTexture([
        "/assets/hero.png",
        "/assets/hero-depth.jpg"
    ]);

    // Calculate aspect ratio from texture safely
    const aspect = (colorMap.image as HTMLImageElement).width / (colorMap.image as HTMLImageElement).height || 0.8;

    // Determine plane size based on viewport
    const planeWidth = Math.min(viewport.width * 0.5, 6);
    const planeHeight = planeWidth / aspect;

    useFrame((state) => {
        if (!mesh.current) return;

        // Smooth mouse movement for rotation/parallax
        // MUCH Increased intensity for "bastante notorio" movement
        // Rotation
        mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, -pointer.y * 0.8, 0.1);
        mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, pointer.x * 0.8, 0.1);

        // Position Parallax (New)
        mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, pointer.x * 0.5, 0.1);
        mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, pointer.y * 0.5, 0.1);
    });

    return (
        <mesh ref={mesh}>
            <planeGeometry args={[planeWidth, planeHeight, 64, 64]} />
            <meshStandardMaterial
                map={colorMap}
                displacementMap={depthMap}
                displacementScale={0.5} // Increased depth scale
                roughness={1} // Matte finish, no shine
                metalness={0}
                transparent={true}
                alphaTest={0.5}
            />
        </mesh>
    );
}

function Lighting() {
    return (
        <>
            {/* Flat, bright ambient light to show image as-is without shadows */}
            <ambientLight intensity={3} />
        </>
    );
}

export default function ThreeHero({ className }: ThreeHeroProps) {
    return (
        <div className={`${className} pointer-events-auto`}>
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <Lighting />
                <React.Suspense fallback={null}>
                    <DepthPlane />
                </React.Suspense>
            </Canvas>
        </div>
    );
}
