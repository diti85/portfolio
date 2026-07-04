/* eslint-disable react/no-unknown-property */
import React, { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPixelRatio;
  varying float vIntensity;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec3 pos = position;
    float n = noise(pos.xz * 0.35 + uTime * 0.08);
    float n2 = noise(pos.xz * 0.12 - uTime * 0.05);
    pos.y += n * 1.1 + n2 * 2.2;

    float dMouse = distance(pos.xz, uMouse);
    float push = smoothstep(3.0, 0.0, dMouse);
    pos.y += push * 1.4;
    vec2 away = normalize(pos.xz - uMouse + vec2(0.0001));
    pos.xz += away * push * 0.9;

    vIntensity = clamp(pos.y * 0.22 + 0.2 + push * 0.8, 0.0, 1.0);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (1.6 + vIntensity * 2.6) * uPixelRatio * (18.0 / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying float vIntensity;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    vec3 deep = vec3(0.478, 0.082, 0.137); /* #7a1523 */
    vec3 hot = vec3(1.0, 0.231, 0.231);    /* #ff3b3b */
    vec3 color = mix(deep, hot, vIntensity);
    float alpha = (0.2 + vIntensity * 0.8) * uOpacity * smoothstep(0.5, 0.15, d);
    gl_FragColor = vec4(color, alpha);
  }
`;

const FIELD_WIDTH = 44;
const FIELD_DEPTH = 24;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Field = ({ density, opacity, interactive }) => {
  const materialRef = useRef();
  const groupRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const reduced = useMemo(prefersReducedMotion, []);

  const positions = useMemo(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const scale = density * (isMobile ? 0.5 : 1);
    const cols = Math.max(20, Math.round(110 * scale));
    const rows = Math.max(10, Math.round(55 * scale));
    const arr = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        arr[i] = (c / (cols - 1) - 0.5) * FIELD_WIDTH;
        arr[i + 1] = 0;
        arr[i + 2] = (r / (rows - 1) - 0.5) * FIELD_DEPTH;
        i += 3;
      }
    }
    return arr;
  }, [density]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uPixelRatio: {
        value: Math.min(
          typeof window !== "undefined" ? window.devicePixelRatio : 1,
          2
        ),
      },
      uOpacity: { value: opacity },
    }),
    [opacity]
  );

  useEffect(() => {
    if (!interactive || reduced) return undefined;
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [interactive, reduced]);

  useFrame((state, delta) => {
    if (reduced) return;
    const mat = materialRef.current;
    if (mat) {
      mat.uniforms.uTime.value += delta;
      const targetX = mouse.current.x * (FIELD_WIDTH / 2) * 0.6;
      const targetZ = -mouse.current.y * (FIELD_DEPTH / 2) * 0.8;
      mat.uniforms.uMouse.value.lerp(
        new THREE.Vector2(
          interactive ? targetX : 999,
          interactive ? targetZ : 999
        ),
        0.06
      );
    }
    if (groupRef.current && interactive) {
      groupRef.current.rotation.y +=
        (mouse.current.x * 0.05 - groupRef.current.rotation.y) * 0.04;
      groupRef.current.rotation.x +=
        (mouse.current.y * 0.03 - groupRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

class CanvasBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

const EmberFieldCanvas = ({ density = 1, opacity = 1, interactive = true }) => (
  <div className="absolute inset-0">
    <CanvasBoundary>
      <Canvas
        camera={{ position: [0, 7, 14], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        frameloop={prefersReducedMotion() ? "demand" : "always"}
      >
        <Field density={density} opacity={opacity} interactive={interactive} />
      </Canvas>
    </CanvasBoundary>
  </div>
);

export default EmberFieldCanvas;
