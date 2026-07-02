"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// liquid ripple radiating from the cursor + slight chromatic split on hover
const frag = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform float uImageAspect;
  uniform float uCanvasAspect;
  varying vec2 vUv;

  void main() {
    // object-fit: cover, aligned to the top (matches the old CSS object-top)
    vec2 s = vec2(
      min(uCanvasAspect / uImageAspect, 1.0),
      min(uImageAspect / uCanvasAspect, 1.0)
    );
    s *= 1.0 - 0.045 * uHover; // gentle zoom while hovered
    vec2 uv;
    uv.x = (vUv.x - 0.5) * s.x + 0.5;
    uv.y = 1.0 - (1.0 - vUv.y) * s.y;

    float d = distance(vUv, uMouse);
    float ripple = sin(d * 30.0 - uTime * 5.0) * 0.018 * uHover *
      smoothstep(0.45, 0.0, d);
    vec2 dir = normalize(vUv - uMouse + 0.0001);
    uv += dir * ripple;

    float ca = 0.006 * uHover;
    float r = texture2D(uTex, uv + dir * ca).r;
    float g = texture2D(uTex, uv).g;
    float b = texture2D(uTex, uv - dir * ca).b;
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

const DistortPlane = ({
  src,
  mouse,
  hoverTarget,
  invalidateRef,
}: {
  src: string;
  mouse: React.MutableRefObject<THREE.Vector2>;
  hoverTarget: React.MutableRefObject<number>;
  invalidateRef: React.MutableRefObject<() => void>;
}) => {
  const tex = useLoader(THREE.TextureLoader, src);
  const { viewport, invalidate } = useThree();

  // expose invalidate so the DOM wrapper can wake the demand-mode loop
  useEffect(() => {
    invalidateRef.current = invalidate;
  }, [invalidate, invalidateRef]);

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uImageAspect: { value: 1 },
      uCanvasAspect: { value: 1 },
    }),
    [tex]
  );

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
  }, [tex]);

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMouse.value.lerp(mouse.current, Math.min(1, delta * 8));
    uniforms.uHover.value +=
      (hoverTarget.current - uniforms.uHover.value) * Math.min(1, delta * 6);
    const img = tex.image as HTMLImageElement | undefined;
    if (img?.width) uniforms.uImageAspect.value = img.width / img.height;
    uniforms.uCanvasAspect.value = state.size.width / state.size.height;
    // demand mode: keep the loop alive only while the ripple is active
    if (hoverTarget.current > 0 || uniforms.uHover.value > 0.004) {
      state.invalidate();
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
      />
    </mesh>
  );
};

// screenshot with WebGL liquid distortion on hover. the plain <img> always
// renders (SEO/fallback); the canvas overlays it on capable desktops only.
const DistortImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [enabled, setEnabled] = useState(false);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const hoverTarget = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);
  const invalidateRef = useRef<() => void>(() => {});

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    setEnabled(fine && !reduced && !!gl);
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const rect = wrap.current?.getBoundingClientRect();
    if (!rect) return;
    mouse.current.set(
      (e.clientX - rect.left) / rect.width,
      1 - (e.clientY - rect.top) / rect.height
    );
  };

  return (
    <div
      ref={wrap}
      className="relative h-full w-full"
      onPointerMove={
        enabled
          ? (e) => {
              onMove(e);
              invalidateRef.current();
            }
          : undefined
      }
      onPointerEnter={
        enabled
          ? () => {
              hoverTarget.current = 1;
              invalidateRef.current();
            }
          : undefined
      }
      onPointerLeave={enabled ? () => (hoverTarget.current = 0) : undefined}
    >
      <img src={src} alt={alt} className={className} />
      {enabled && (
        <div aria-hidden className="absolute inset-0">
          <Canvas
            dpr={[1, 1.25]}
            frameloop="demand"
            camera={{ position: [0, 0, 2], fov: 50 }}
            gl={{ antialias: false, alpha: true }}
          >
            <Suspense fallback={null}>
              <DistortPlane
                src={src}
                mouse={mouse}
                hoverTarget={hoverTarget}
                invalidateRef={invalidateRef}
              />
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
};

export default DistortImage;
