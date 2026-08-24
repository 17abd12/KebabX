"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Tuned down from a denser field: past roughly 450 the embers stop reading as
// heat rising off a grill and start reading as falling snow over the headline.
const PARTICLE_COUNT = 420;
const COLUMN_HEIGHT = 12;

/**
 * Deterministic pseudo-random in [0,1). Math.random() would be impure inside
 * render and would reshuffle the field on every remount; this keeps the ember
 * layout stable and identical between server and client.
 */
function hash(index: number, channel: number) {
  const x = Math.sin(index * 127.1 + channel * 311.7 + 0.5) * 43758.5453;
  return x - Math.floor(x);
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uPixelRatio;

  attribute float aScale;
  attribute float aSpeed;
  attribute float aOffset;
  attribute float aHeat;

  varying float vAlpha;
  varying float vHeat;

  void main() {
    vec3 p = position;

    // Rise, then wrap back to the bottom of the column.
    float t = uTime * aSpeed + aOffset;
    p.y = mod(p.y + t + ${(COLUMN_HEIGHT / 2).toFixed(1)}, ${COLUMN_HEIGHT.toFixed(1)}) - ${(COLUMN_HEIGHT / 2).toFixed(1)};

    // Lazy convection drift.
    p.x += sin(t * 0.55 + aOffset * 3.0) * 0.42;
    p.z += cos(t * 0.37 + aOffset * 2.0) * 0.30;

    // Parallax: closer embers track the cursor harder.
    float depth = clamp((p.z + 4.0) / 8.0, 0.0, 1.0);
    p.x += uMouse.x * (0.35 + depth * 1.25);
    p.y += uMouse.y * (0.20 + depth * 0.70);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * uPixelRatio * (26.0 / max(-mv.z, 0.001));

    // Fade in low, burn out high.
    vAlpha = smoothstep(-6.0, -3.2, p.y) * (1.0 - smoothstep(1.0, 5.2, p.y));
    vHeat = aHeat;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying float vHeat;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);

    // Soft core with a wide falloff halo.
    float core = smoothstep(0.5, 0.02, d);
    float glow = smoothstep(0.5, 0.15, d) * 0.45;
    float mask = core * core + glow;

    vec3 hot  = vec3(1.00, 0.92, 0.66);
    vec3 mid  = vec3(0.96, 0.62, 0.11);
    vec3 deep = vec3(0.85, 0.26, 0.03);

    vec3 color = mix(deep, mid, smoothstep(0.0, 0.6, vHeat));
    color = mix(color, hot, smoothstep(0.65, 1.0, vHeat));

    // Held well below 1 so the field stays behind the copy rather than
    // competing with it — this layer is atmosphere, not content.
    float alpha = mask * vAlpha * 0.62;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

function EmberField() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const smoothedMouse = useRef(new THREE.Vector2(0, 0));
  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  // The canvas is pointer-events:none so it never blocks the hero CTAs, which
  // also means R3F's own pointer state stays at zero. Track the window instead.
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      targetMouse.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const { positions, scales, speeds, offsets, heats } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const offsets = new Float32Array(PARTICLE_COUNT);
    const heats = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      // Wider than tall so the field fills ultrawide hero crops.
      positions[i * 3 + 0] = (hash(i, 0) - 0.5) * 16;
      positions[i * 3 + 1] = (hash(i, 1) - 0.5) * COLUMN_HEIGHT;
      positions[i * 3 + 2] = (hash(i, 2) - 0.5) * 8;

      // Bias small: a few big embers read as sparks, the rest as smoke motes.
      const r = hash(i, 3);
      scales[i] = 0.5 + r * r * 4.2;
      speeds[i] = 0.18 + hash(i, 4) * 0.55;
      offsets[i] = hash(i, 5) * 100;
      heats[i] = Math.pow(hash(i, 6), 1.6);
    }
    return { positions, scales, speeds, offsets, heats };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uTime.value += Math.min(delta, 0.05);
    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio();

    // Ease toward the pointer so motion stays ambient, never twitchy.
    smoothedMouse.current.lerp(targetMouse.current, 0.035);
    material.uniforms.uMouse.value.copy(smoothedMouse.current);

    if (pointsRef.current) {
      pointsRef.current.rotation.y = smoothedMouse.current.x * 0.08;
      pointsRef.current.rotation.x = -smoothedMouse.current.y * 0.05;
    }
  });

  // Keep the field filling the frame on very wide viewports.
  const spread = Math.max(1, viewport.width / 11);

  return (
    <points ref={pointsRef} scale={[spread, 1, 1]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aOffset" args={[offsets, 1]} />
        <bufferAttribute attach="attributes-aHeat" args={[heats, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

let webglSupport: boolean | null = null;

/** One-time capability probe. Cached because creating contexts is not free. */
function supportsWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const probe = document.createElement("canvas");
    webglSupport = Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/**
 * Ambient ember/smoke field behind the hero. Pointer-reactive, additive-blended
 * and deliberately low-contrast so foreground copy stays readable.
 *
 * Renders nothing without WebGL or when the visitor asks for reduced motion —
 * the hero's CSS gradients carry the look on their own.
 */
export default function HeroCanvas() {
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  if (reducedMotion || !supportsWebGL()) return null;

  return (
    <Canvas
      className="absolute! inset-0"
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 9], fov: 55 }}
      style={{ pointerEvents: "none" }}
    >
      <EmberField />
    </Canvas>
  );
}
