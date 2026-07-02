"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSize;
  attribute float aScale;
  attribute float aSpeed;
  attribute float aOffset;
  attribute float aTint;
  varying float vAlpha;
  varying float vTint;

  void main() {
    vec3 p = position;
    // slow ambient drift
    p.y += sin(uTime * aSpeed + aOffset + position.x * 0.4) * 0.55;
    p.x += cos(uTime * aSpeed * 0.75 + aOffset + position.y * 0.3) * 0.4;
    // lagged mouse parallax — nearer (bigger) particles move more
    p.x += uMouse.x * aScale * 0.6;
    p.y += uMouse.y * aScale * 0.4;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale / -mv.z;

    float twinkle = 0.55 + 0.45 * sin(uTime * aSpeed * 2.4 + aOffset);
    vAlpha = twinkle * (0.25 + 0.5 * aScale) * smoothstep(12.0, 6.0, -mv.z);
    vTint = aTint;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vTint;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.08, d) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(mix(uColorB, uColorA, vTint), a);
  }
`;

const ParticleField = ({ count }: { count: number }) => {
  const pointer = useRef(new THREE.Vector2(0, 0));
  const eased = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uSize: { value: 60 },
      uColorA: { value: new THREE.Color("#cbacf9") },
      uColorB: { value: new THREE.Color("#5b21b6") },
    }),
    []
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const attrs = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    const tints = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 17;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      scales[i] = 0.4 + Math.random();
      speeds[i] = 0.15 + Math.random() * 0.45;
      offsets[i] = Math.random() * Math.PI * 2;
      tints[i] = Math.random();
    }
    return { positions, scales, speeds, offsets, tints };
  }, [count]);

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    // eased tracking so the field trails the cursor instead of snapping
    eased.current.lerp(pointer.current, Math.min(1, delta * 2.5));
    uniforms.uMouse.value.copy(eased.current);
  });

  return (
    <points key={count}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[attrs.positions, 3]}
        />
        <bufferAttribute attach="attributes-aScale" args={[attrs.scales, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[attrs.speeds, 1]} />
        <bufferAttribute
          attach="attributes-aOffset"
          args={[attrs.offsets, 1]}
        />
        <bufferAttribute attach="attributes-aTint" args={[attrs.tints, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

type Mode = "full" | "lite" | "static";

// full-viewport hero background: violet aurora + reactive particle field.
// mobile gets a lighter particle count; reduced-motion / no-WebGL users
// keep the aurora as a CSS-only fallback.
const HeroCanvas = () => {
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("static");
      return;
    }
    const probe = document.createElement("canvas");
    const gl =
      probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!gl) {
      setMode("static");
      return;
    }
    const lite =
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768;
    setMode(lite ? "lite" : "full");
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="hero-aurora" />
      {(mode === "full" || mode === "lite") && (
        <Canvas
          className="absolute inset-0"
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <ParticleField count={mode === "lite" ? 700 : 2400} />
        </Canvas>
      )}
      <div className="hero-fade" />
    </div>
  );
};

export default HeroCanvas;
