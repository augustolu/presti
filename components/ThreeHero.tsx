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

    const [colorMap, depthMap] = useTexture([
        "/assets/hero.png",
        "/assets/hero-depth.jpg",
    ]);

    // Texture configuration to prevent edge tearing and pixelation
    React.useLayoutEffect(() => {
        // Linear filtering for smooth scaling
        depthMap.minFilter = THREE.LinearFilter;
        depthMap.magFilter = THREE.LinearFilter;
        
        // Prevent texture wrapping at the edges
        depthMap.wrapS = THREE.ClampToEdgeWrapping;
        depthMap.wrapT = THREE.ClampToEdgeWrapping;
        
        // Apply the same to the color map
        colorMap.minFilter = THREE.LinearFilter;
        colorMap.magFilter = THREE.LinearFilter;
        colorMap.wrapS = THREE.ClampToEdgeWrapping;
        colorMap.wrapT = THREE.ClampToEdgeWrapping;
        
        // Tell Three.js to update the texture with the new settings
        depthMap.needsUpdate = true;
        colorMap.needsUpdate = true;
    }, [depthMap, colorMap]);

    const aspect = (colorMap.image as HTMLImageElement).width / (colorMap.image as HTMLImageElement).height || 0.8;
    const planeWidth = 6; // Fixed width for consistency
    const planeHeight = planeWidth / aspect;

    useFrame((state) => {
        if (!mesh.current) return;

        // Get mouse values and convert to [-1, 1] range
        const pointerX = mouseX.get() * 2;
        const pointerY = -mouseY.get() * 2;

        // 1. Add subtle rotation
        const targetRotX = pointerY * 0.2; // Restore vertical rotation intensity
        const targetRotY = pointerX * 0.07; // Greatly reduced intensity
        mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetRotX, 0.1);
        mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, targetRotY, 0.1);

        // 2. Apply Position Parallax with a 10-pixel limit
        
        // Calculate the world-unit equivalent of 10 pixels
        const pixelToWorldRatio = viewport.width / size.width;
        const limitInWorldUnits = 10 * pixelToWorldRatio;

        // Apply original intensity
        const targetPosX = pointerX * 0.4;
        const targetPosY = pointerY * 0.4;

        // Clamp the movement to the calculated 10-pixel limit
        const limitedTargetX = THREE.MathUtils.clamp(targetPosX, -limitInWorldUnits, limitInWorldUnits);
        const limitedTargetY = THREE.MathUtils.clamp(targetPosY, -limitInWorldUnits, limitInWorldUnits);

        mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, limitedTargetX, 0.1);
        mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, limitedTargetY, 0.1);

        // We are moving the mesh, so keep the camera still and centered.
        state.camera.lookAt(0, 0, 0);
    });

    return (
        <mesh ref={mesh}>
            <planeGeometry args={[planeWidth, planeHeight, 64, 64]} />
            <meshStandardMaterial
                map={colorMap}
                displacementMap={depthMap}
                displacementScale={0.5}
                roughness={1}
                metalness={0}
                transparent={true}
                alphaTest={0.5}
                onBeforeCompile={shader => {
                    // Pass UVs to the fragment shader
                    shader.vertexShader = `
                        varying vec2 vUv;
                        ${shader.vertexShader}
                    `;
                    shader.vertexShader = shader.vertexShader.replace(
                        '#include <uv_vertex>',
                        `
                        #include <uv_vertex>
                        vUv = uv;
                        `
                    );
                    shader.fragmentShader = `
                        varying vec2 vUv;
                        ${shader.fragmentShader}
                    `;
                    // Add the edge fade logic
                    shader.fragmentShader = shader.fragmentShader.replace(
                        '#include <dithering_fragment>',
                        `
                        #include <dithering_fragment>
                        // Add a soft fade to the edges to avoid hard cuts
                        float edgeFade = 0.05; // Fade width
                        float edgeFactorX = smoothstep(0.0, edgeFade, vUv.x) * (1.0 - smoothstep(1.0 - edgeFade, 1.0, vUv.x));
                        float edgeFactorY = smoothstep(0.0, edgeFade, vUv.y) * (1.0 - smoothstep(1.0 - edgeFade, 1.0, vUv.y));
                        gl_FragColor.a *= edgeFactorX * edgeFactorY;
                        `
                    );
                }}
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
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <Lighting />
                <React.Suspense fallback={null}>
                    <DepthPlane mouseX={mouseX} mouseY={mouseY} />
                </React.Suspense>
            </Canvas>
        </div>
    );
}
