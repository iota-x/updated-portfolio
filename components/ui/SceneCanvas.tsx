"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";

import { isEntered } from "./EntrySequence";
import { useQualityTier } from "@/lib/quality";

/* ------------------------------------------------------------------ */
/*  simplex noise (Ashima / Ian McEwan, public domain)                 */
/* ------------------------------------------------------------------ */
const simplex = /* glsl */ `
  vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
         i.z + vec4(0.0, i1.z, i2.z, 1.0))
       + i.y + vec4(0.0, i1.y, i2.y, 1.0))
       + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

/* ------------------------------------------------------------------ */
/*  morphing blob — noise-displaced sphere, crystalline fresnel skin   */
/* ------------------------------------------------------------------ */
const blobVertex = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  varying vec3 vViewPos;
  ${simplex}
  void main() {
    float n = snoise(position * 1.15 + vec3(0.0, uTime * 0.22, 0.0));
    float n2 = snoise(position * 3.4 - vec3(uTime * 0.15));
    vec3 p = position + normal * (n * 0.8 + n2 * 0.22) * uAmp;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const blobFragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vViewPos;
  void main() {
    // derivative normals -> subtly faceted, crystalline skin
    vec3 nrm = normalize(cross(dFdx(vViewPos), dFdy(vViewPos)));
    vec3 vd = normalize(-vViewPos);
    float ndv = max(dot(nrm, vd), 0.0);
    float fres = pow(1.0 - ndv, 2.4);

    vec3 deep = vec3(0.05, 0.02, 0.10);
    vec3 mid  = vec3(0.32, 0.18, 0.62);
    float irid = 0.5 + 0.5 * sin(ndv * 7.0 + uTime * 0.5);

    // HDR rim feeds the bloom pass
    vec3 col = mix(deep, mid, fres)
      + vec3(0.62, 0.50, 1.00) * fres * fres * 2.4
      + vec3(0.30, 0.12, 0.55) * irid * fres * 0.8;

    gl_FragColor = vec4(col, 0.95);
  }
`;

// where the blob lives at each point of the page scroll (x scaled by aspect)
const KEYFRAMES = [
  { p: 0.0, x: 2.5, y: 0.1, z: -1.8, s: 1.1 }, // hero — right of the copy
  { p: 0.16, x: -2.6, y: 0.4, z: -3.2, s: 0.55 }, // about — crosses to the left
  { p: 0.42, x: 2.7, y: 0.1, z: -3.6, s: 0.45 }, // projects — far right, calm
  { p: 0.7, x: -2.5, y: -0.2, z: -3.2, s: 0.5 }, // tech/approach — left
  { p: 1.0, x: 0.0, y: -0.35, z: -2.4, s: 0.85 }, // contact — returns center
];

const sampleKeyframes = (p: number) => {
  let a = KEYFRAMES[0];
  let b = KEYFRAMES[KEYFRAMES.length - 1];
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (p >= KEYFRAMES[i].p && p <= KEYFRAMES[i + 1].p) {
      a = KEYFRAMES[i];
      b = KEYFRAMES[i + 1];
      break;
    }
  }
  const raw = b.p === a.p ? 0 : (p - a.p) / (b.p - a.p);
  const t = raw * raw * (3 - 2 * raw); // smoothstep
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
    s: a.s + (b.s - a.s) * t,
  };
};

const Blob = ({ detail }: { detail: number }) => {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const eased = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector3(0, 0.25, -2));
  const entryT = useRef<number | null>(null);
  const maxScroll = useRef(1);
  // click impulse: a jolt of energy that ripples through the noise field
  const impulse = useRef(0);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uAmp: { value: 0.32 } }),
    []
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    const measure = () => {
      maxScroll.current = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
    };
    const onDown = () => {
      impulse.current = 1;
    };
    measure();
    // page height settles as fonts/images load
    const id = setInterval(measure, 1500);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      clearInterval(id);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;

    // hold at zero until the entry curtain lifts
    if (!isEntered()) {
      entryT.current = t;
      g.scale.setScalar(0);
      return;
    }
    const te = t - (entryT.current ?? 0);
    const appear = 1 - Math.pow(1 - Math.min(1, te / 1.8), 3);

    // travel along the scroll keyframes
    const p = Math.min(1, window.scrollY / maxScroll.current);
    const k = sampleKeyframes(p);
    const xf = Math.min(1, state.viewport.width / 12); // keep on-screen on narrow viewports
    target.current.set(k.x * xf, k.y, k.z);
    g.position.lerp(target.current, Math.min(1, delta * 3));

    eased.current.lerp(pointer.current, Math.min(1, delta * 2));
    g.rotation.y = t * 0.1 + eased.current.x * 0.35;
    g.rotation.x = Math.sin(t * 0.13) * 0.1 - eased.current.y * 0.25;

    // click impulse decays exponentially; adds a flinch + churn
    impulse.current *= Math.exp(-delta * 2.4);
    const imp = impulse.current;

    g.scale.setScalar(
      appear * k.s * (1 + Math.sin(t * 0.6) * 0.02 + imp * 0.07)
    );

    // breathing + impulse-driven turbulence
    uniforms.uAmp.value = 0.32 + Math.sin(t * 0.4) * 0.06 + imp * 0.38;
  });

  return (
    <group ref={group} scale={0} position={[0, 0.25, -2]}>
      <mesh key={detail}>
        <sphereGeometry args={[1.35, detail, detail]} />
        <shaderMaterial
          vertexShader={blobVertex}
          fragmentShader={blobFragment}
          uniforms={uniforms}
          transparent
        />
      </mesh>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/*  camera rig — gentle drift along the scroll so the whole scene      */
/*  moves, not just the subject                                        */
/* ------------------------------------------------------------------ */
const CameraRig = () => {
  const maxScroll = useRef(1);

  useEffect(() => {
    const measure = () => {
      maxScroll.current = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useFrame((state, delta) => {
    const p = Math.min(1, window.scrollY / maxScroll.current);
    const cam = state.camera;
    const tx = Math.sin(p * Math.PI * 2) * 0.55;
    const ty = -Math.sin(p * Math.PI) * 0.35;
    cam.position.x += (tx - cam.position.x) * Math.min(1, delta * 2);
    cam.position.y += (ty - cam.position.y) * Math.min(1, delta * 2);
    cam.lookAt(0, 0, -2);
  });

  return null;
};

/* ------------------------------------------------------------------ */
/*  particle field (violet starfield with lagged mouse parallax)       */
/* ------------------------------------------------------------------ */
const particleVertex = /* glsl */ `
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
    p.y += sin(uTime * aSpeed + aOffset + position.x * 0.4) * 0.55;
    p.x += cos(uTime * aSpeed * 0.75 + aOffset + position.y * 0.3) * 0.4;
    p.x += uMouse.x * aScale * 1.1;
    p.y += uMouse.y * aScale * 0.75;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale / -mv.z;

    float twinkle = 0.55 + 0.45 * sin(uTime * aSpeed * 2.4 + aOffset);
    vAlpha = twinkle * (0.25 + 0.5 * aScale) * smoothstep(12.0, 6.0, -mv.z);
    vTint = aTint;
  }
`;

const particleFragment = /* glsl */ `
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
  const points = useRef<THREE.Points>(null);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const eased = useRef(new THREE.Vector2(0, 0));
  const maxScroll = useRef(1);

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
    const measure = () => {
      maxScroll.current = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
    };
    measure();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", measure);
    };
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
    eased.current.lerp(pointer.current, Math.min(1, delta * 3.5));
    uniforms.uMouse.value.copy(eased.current);
    // the starfield slowly rises as you travel down the page
    if (points.current) {
      const p = Math.min(1, window.scrollY / maxScroll.current);
      points.current.position.y = p * 2.5;
    }
  });

  return (
    <points ref={points} key={count}>
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
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/* ------------------------------------------------------------------ */
/*  persistent scene — fixed behind the whole page                     */
/* ------------------------------------------------------------------ */
type Mode = "full" | "lite" | "static";

// what each quality tier is allowed to spend
const TIER_CONFIG = {
  high: { dpr: [1, 1.5] as [number, number], particles: 2400, blob: 160, bloom: true },
  medium: { dpr: [1, 1.15] as [number, number], particles: 1400, blob: 110, bloom: true },
  low: { dpr: [1, 1] as [number, number], particles: 800, blob: 72, bloom: false },
};

const SceneCanvas = () => {
  const [mode, setMode] = useState<Mode | null>(null);
  const tier = useQualityTier();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("static");
      return;
    }
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!gl) {
      setMode("static");
      return;
    }
    const lite =
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768;
    setMode(lite ? "lite" : "full");
  }, []);

  if (mode !== "full" && mode !== "lite") return null;

  // mobile ("lite") is its own floor; desktop scales with the measured tier
  const cfg =
    mode === "lite"
      ? { dpr: [1, 1.25] as [number, number], particles: 700, blob: 72, bloom: false }
      : TIER_CONFIG[tier];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={cfg.dpr}
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ParticleField count={cfg.particles} />
        <Blob detail={cfg.blob} />
        {mode === "full" && <CameraRig />}

        {cfg.bloom && (
          <EffectComposer multisampling={0}>
            <Bloom
              mipmapBlur
              intensity={1.15}
              luminanceThreshold={0.22}
              luminanceSmoothing={0.75}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default SceneCanvas;
