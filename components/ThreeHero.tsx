"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { MotionValue } from "framer-motion";

interface DepthPlaneProps {
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
}

function DepthPlane({ mouseX, mouseY }: DepthPlaneProps) {
    const mesh = useRef<THREE.Mesh>(null);
    const { size, viewport } = useThree();

    const [colorMap] = useTexture([
        "/assets/hero.png",
    ]);

    // Texture configuration to prevent edge tearing and pixelation
    React.useLayoutEffect(() => {
        // Apply the same to the color map
        colorMap.minFilter = THREE.LinearFilter;
        colorMap.magFilter = THREE.LinearFilter;
        colorMap.wrapS = THREE.ClampToEdgeWrapping;
        colorMap.wrapT = THREE.ClampToEdgeWrapping;
        
        // Tell Three.js to update the texture with the new settings
        colorMap.needsUpdate = true;
    }, [colorMap]);

    const aspect = (colorMap.image as HTMLImageElement).width / (colorMap.image as HTMLImageElement).height || 0.8;
    const planeWidth = 8; // Adjusted width for the new logo
    const planeHeight = planeWidth / aspect;

    useFrame((state) => {
        if (!mesh.current) return;

        // Get mouse values and convert to [-0.5, 0.5] range for a more subtle effect
        const pointerX = mouseX.get();
        const pointerY = mouseY.get();

        // 1. Add subtle rotation (tilt effect)
        const targetRotX = pointerY * 0.5; 
        const targetRotY = pointerX * 0.5;
        mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetRotX, 0.1);
        mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, targetRotY, 0.1);

        // We are moving the mesh, so keep the camera still and centered.
        state.camera.lookAt(0, 0, 0);
    });

    return (
        <mesh ref={mesh}>
            <planeGeometry args={[planeWidth, planeHeight, 64, 64]} />
            <meshStandardMaterial
                map={colorMap}
                roughness={0.7}
                metalness={0.1}
                transparent={true}
                alphaTest={0.5}
            />
        </mesh>
    );
}

function Lighting() {
    return (
        <>
            <ambientLight intensity={3} />
        </>
    );
}

interface ThreeHeroProps {
    className?: string;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
}

export default function ThreeHero({ className, mouseX, mouseY }: ThreeHeroProps) {
    return (
        <div className={`${className} pointer-events-none`}>
            {/* The canvas itself should not capture events now */}
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <Lighting />
                <React.Suspense fallback={null}>
                    <DepthPlane mouseX={mouseX} mouseY={mouseY} />
                </React.Suspense>
            </Canvas>
        </div>
    );
}
