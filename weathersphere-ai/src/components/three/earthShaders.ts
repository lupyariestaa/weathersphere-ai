import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { Color } from "three";

/**
 * Procedural low-poly Earth shader. No texture assets required — land,
 * ocean, and polar ice are all derived from layered noise so the planet
 * always renders correctly even if no external assets are available.
 */
const EarthMaterial = shaderMaterial(
  {
    uTime: 0,
    uOceanColor: new Color("#0b3d91"),
    uLandColor: new Color("#2f6f4f"),
    uIceColor: new Color("#eef6ff"),
    uSunDirection: [1, 0.3, 0.6],
    uDayIntensity: 1.0,
    uNightTint: new Color("#040912"),
  },
  /* vertex */ `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment */ `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uOceanColor;
    uniform vec3 uLandColor;
    uniform vec3 uIceColor;
    uniform vec3 uSunDirection;
    uniform float uDayIntensity;
    uniform vec3 uNightTint;

    // Classic value-noise, kept cheap and dependency-free for performance.
    vec3 hash3(vec3 p) {
      p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
      return fract(sin(p) * 43758.5453123) * 2.0 - 1.0;
    }
    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      vec3 u = f * f * (3.0 - 2.0 * f);
      float n = 0.0;
      for (int x = 0; x <= 1; x++)
        for (int y = 0; y <= 1; y++)
          for (int z = 0; z <= 1; z++) {
            vec3 o = vec3(float(x), float(y), float(z));
            n += dot(hash3(i + o), f - o) *
              (x == 0 ? (1.0 - u.x) : u.x) *
              (y == 0 ? (1.0 - u.y) : u.y) *
              (z == 0 ? (1.0 - u.z) : u.z);
          }
      return n;
    }
    float fbm(vec3 p) {
      float total = 0.0;
      float amp = 0.5;
      for (int i = 0; i < 4; i++) {
        total += noise(p) * amp;
        p *= 2.02;
        amp *= 0.5;
      }
      return total;
    }

    void main() {
      vec3 p = normalize(vPosition);
      float continent = fbm(p * 2.2 + 4.0);
      float landMask = smoothstep(0.02, 0.12, continent);
      float poleMask = smoothstep(0.78, 0.95, abs(p.y));

      vec3 surface = mix(uOceanColor, uLandColor, landMask);
      surface = mix(surface, uIceColor, poleMask);

      float lightAmount = clamp(dot(vNormal, normalize(uSunDirection)), 0.0, 1.0);
      float terminator = smoothstep(0.0, 0.35, lightAmount);

      vec3 dayColor = surface * (0.55 + 0.65 * lightAmount) * uDayIntensity;
      vec3 nightColor = surface * 0.12 + uNightTint * 0.5;

      vec3 color = mix(nightColor, dayColor, terminator);

      // Faint city-light glow on the dark side of land masses.
      float cityGlow = landMask * (1.0 - terminator) * smoothstep(0.05, 0.3, fbm(p * 8.0));
      color += vec3(1.0, 0.85, 0.55) * cityGlow * 0.25;

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ EarthMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    earthMaterial: any;
  }
}

const AtmosphereMaterial = shaderMaterial(
  { uGlowColor: new Color("#7ec8ff"), uIntensity: 1.0 },
  /* vertex */ `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment */ `
    varying vec3 vNormal;
    uniform vec3 uGlowColor;
    uniform float uIntensity;
    void main() {
      float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
      gl_FragColor = vec4(uGlowColor, fresnel * uIntensity);
    }
  `
);

extend({ AtmosphereMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    atmosphereMaterial: any;
  }
}

export {};
