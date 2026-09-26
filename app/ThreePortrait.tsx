import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { CatmullRomCurve3, CanvasTexture, MathUtils, Vector3, type Group } from "three";
import type { MotionValue } from "framer-motion";

type Point = [number, number, number];

const skin = "#f2ae86";
const skinLight = "#ffd2b0";
const hair = "#19131b";
const purple = "#5427a9";
const purpleLight = "#7548d5";

function Oval({ position, scale, color, roughness = .6, metalness = 0, rotation = [0, 0, 0] }: {
  position: Point; scale: Point; color: string; roughness?: number; metalness?: number; rotation?: Point;
}) {
  return <mesh position={position} scale={scale} rotation={rotation}>
    <sphereGeometry args={[1, 36, 24]} />
    <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
  </mesh>;
}

function Stroke({ points, radius, color, metalness = 0 }: { points: Point[]; radius: number; color: string; metalness?: number }) {
  const curve = useMemo(() => new CatmullRomCurve3(points.map(point => new Vector3(...point))), [points]);
  return <mesh>
    <tubeGeometry args={[curve, 36, radius, 8, false]} />
    <meshStandardMaterial color={color} roughness={metalness ? .27 : .55} metalness={metalness} />
  </mesh>;
}

const leftBrow: Point[] = [[-.82, 1.72, .91], [-.56, 1.82, 1.01], [-.25, 1.76, 1.04]];
const rightBrow: Point[] = [[.25, 1.76, 1.04], [.56, 1.82, 1.01], [.82, 1.72, .91]];
const smile: Point[] = [[-.37, .56, .94], [-.19, .49, 1.02], [0, .47, 1.04], [.19, .49, 1.02], [.37, .56, .94]];
const hairSweeps: Point[][] = [
  [[-1.14, 2.03, .05], [-1.0, 2.42, .52], [-.48, 2.64, .78], [.28, 2.45, .83], [.79, 2.07, .5]],
  [[-1.07, 1.94, .45], [-.75, 2.24, .8], [-.18, 2.32, .96], [.43, 2.14, .87]],
  [[-1.0, 1.85, .61], [-.59, 2.08, .95], [-.08, 2.05, 1.06], [.4, 1.92, .91]],
  [[-.54, 2.7, .28], [-.05, 2.86, .46], [.53, 2.73, .45], [1.0, 2.36, .16]],
  [[.63, 2.57, .48], [.99, 2.32, .54], [1.11, 2.0, .36], [.99, 1.67, .38]],
];

function Eye({ side }: { side: -1 | 1 }) {
  const x = side * .45;
  return <group>
    <Oval position={[x, 1.35, .87]} scale={[.34, .28, .17]} color="#fffaf3" roughness={.4} />
    <Oval position={[x + side * .015, 1.34, 1.025]} scale={[.17, .19, .07]} color="#282127" roughness={.25} />
    <Oval position={[x + side * .01, 1.35, 1.085]} scale={[.115, .14, .025]} color="#08070a" roughness={.15} />
    <Oval position={[x - .052, 1.425, 1.11]} scale={[.052, .06, .012]} color="#ffffff" roughness={.15} />
  </group>;
}

function Character() {
  return <group>
    {/* Silhouette and hood are full meshes, so the profile remains visible on a turn. */}
    <Oval position={[0, -3.27, -.06]} scale={[1.0, .48, .62]} color="#17151e" />
    <Oval position={[0, -1.65, -.14]} scale={[1.44, 1.76, .77]} color={purple} />
    <Oval position={[-1.36, -1.74, .05]} scale={[.58, 1.18, .61]} rotation={[0, 0, -.31]} color={purple} />
    <Oval position={[1.36, -1.74, .05]} scale={[.58, 1.18, .61]} rotation={[0, 0, .31]} color={purple} />
    <Oval position={[-.68, -.28, -.28]} scale={[.68, .55, .55]} color="#45208f" />
    <Oval position={[.68, -.28, -.28]} scale={[.68, .55, .55]} color="#45208f" />
    <Oval position={[0, -1.21, .61]} scale={[.64, 1.23, .17]} color="#9a81dd" />
    <Oval position={[0, -.2, .13]} scale={[.31, .42, .32]} color={skin} />
    <Stroke points={[[-.25, -.36, .7], [-.23, -.83, .81], [-.2, -1.31, .84]]} radius={.038} color="#c8aae9" />
    <Stroke points={[[.25, -.36, .7], [.23, -.83, .81], [.2, -1.31, .84]]} radius={.038} color="#c8aae9" />
    <Stroke points={[[0, -1.1, .81], [0, -2.0, .78], [0, -3.08, .72]]} radius={.024} color="#251454" />
    <Oval position={[0, 1.22, 0]} scale={[1.12, 1.24, .94]} color={skinLight} />
    <Oval position={[-1.12, 1.12, -.03]} scale={[.27, .4, .25]} color={skin} />
    <Oval position={[1.12, 1.12, -.03]} scale={[.27, .4, .25]} color={skin} />
    <Oval position={[-1.17, 1.1, .17]} scale={[.13, .23, .045]} color="#cc7d70" />
    <Oval position={[1.17, 1.1, .17]} scale={[.13, .23, .045]} color="#cc7d70" />
    <Oval position={[-.63, .9, .84]} scale={[.2, .085, .03]} color="#f8b7ab" />
    <Oval position={[.63, .9, .84]} scale={[.2, .085, .03]} color="#f8b7ab" />
    <Eye side={-1} /><Eye side={1} />
    <Stroke points={leftBrow} radius={.085} color={hair} />
    <Stroke points={rightBrow} radius={.085} color={hair} />
    <Oval position={[0, .95, .99]} scale={[.13, .17, .14]} color={skin} />
    <Oval position={[0, .85, 1.1]} scale={[.12, .065, .07]} color="#f5b08b" />
    <Stroke points={smile} radius={.024} color="#713b38" />
    <Oval position={[0, .41, .98]} scale={[.2, .045, .025]} color="#f5a28f" />
    <Oval position={[0, 2.08, -.15]} scale={[1.17, .78, .82]} color={hair} roughness={.34} />
    <Oval position={[-.96, 1.92, .05]} scale={[.33, .5, .46]} color={hair} roughness={.34} />
    <Oval position={[.96, 1.98, .02]} scale={[.29, .53, .42]} color={hair} roughness={.34} />
    {hairSweeps.map((points, i) => <Stroke key={i} points={points} radius={i < 3 ? .20 - i * .017 : .15} color={i % 2 ? "#211820" : "#16121b"} />)}
    <Stroke points={[[-.98, 2.2, .58], [-.67, 2.47, .81], [-.18, 2.5, .94], [.43, 2.28, .83]]} radius={.018} color="#51455f" metalness={.3} />
    {/* Laptop, hands and name badge match the previous composition. */}
    <RoundedBox args={[3.1, 1.63, .13]} radius={.11} smoothness={5} position={[0, -2.11, 1.22]}>
      <meshStandardMaterial color="#9da2af" metalness={.58} roughness={.31} />
    </RoundedBox>
    <RoundedBox args={[3.0, 1.53, .015]} radius={.09} smoothness={4} position={[0, -2.11, 1.301]}>
      <meshStandardMaterial color="#b0b4be" metalness={.47} roughness={.39} />
    </RoundedBox>
    <Oval position={[-1.34, -2.91, 1.28]} scale={[.34, .18, .24]} color={skin} />
    <Oval position={[1.34, -2.91, 1.28]} scale={[.34, .18, .24]} color={skin} />
    <RoundedBox args={[.73, .51, .09]} radius={.07} smoothness={4} position={[1.04, -.99, .79]} rotation={[0, -.1, -.08]}>
      <meshStandardMaterial color="#e6e2ec" roughness={.36} metalness={.08} />
    </RoundedBox>
    <BadgeText />
  </group>;
}

function makeLabelTexture(label: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 256, 256);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${label.length > 2 ? 105 : 135}px Arial, sans-serif`;
  ctx.fillText(label, 128, 136);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = "srgb";
  return texture;
}

function BadgeText() {
  const texture = useMemo(() => makeLabelTexture("CH", "#3d1b8e"), []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={[1.04, -.99, .846]} rotation={[0, -.1, -.08]}>
    <planeGeometry args={[.57, .43]} />
    <meshBasicMaterial map={texture} transparent depthWrite={false} />
  </mesh>;
}

const icons = [
  { label: "Photoshop", crop: [72, 113, 279, 270], base: [-2.5, 2.08, .1] as Point, tilt: -.16 },
  { label: "Illustrator", crop: [897, 237, 278, 240], base: [2.5, 1.71, .05] as Point, tilt: .18 },
  { label: "Figma", crop: [4, 438, 225, 215], base: [-2.67, .51, .1] as Point, tilt: .15 },
  { label: "ChatGPT", crop: [1012, 501, 225, 218], base: [2.67, .36, -.15] as Point, tilt: -.15 },
  { label: "Code", crop: [974, 27, 220, 185], base: [-2.69, -1.94, -.25] as Point, tilt: -.16 },
  { label: "After Effects", crop: [946, 973, 277, 235], base: [2.69, -1.94, .12] as Point, tilt: .17 },
];

function SkillIcon({ crop, position, tilt, index, pointerX, pointerY, reducedMotion }: {
  crop: number[]; position: Point; tilt: number; index: number;
  pointerX: MotionValue<number>; pointerY: MotionValue<number>; reducedMotion: boolean;
}) {
  const group = useRef<Group>(null);
  const source = useTexture(`${import.meta.env.BASE_URL}ch-classic-purple-smile.webp`);
  const texture = useMemo(() => {
    const copy = source.clone();
    copy.repeat.set(crop[2] / 1254, crop[3] / 1254);
    copy.offset.set(crop[0] / 1254, 1 - (crop[1] + crop[3]) / 1254);
    copy.needsUpdate = true;
    return copy;
  }, [source, crop]);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame((_, delta) => {
    const icon = group.current;
    if (!icon) return;
    const nx = reducedMotion ? 0 : pointerX.get() / 96;
    const ny = reducedMotion ? 0 : pointerY.get() / 36;
    icon.position.x = MathUtils.damp(icon.position.x, position[0] + nx * (.17 + index % 3 * .07), 7, delta);
    icon.position.y = MathUtils.damp(icon.position.y, position[1] + ny * .11, 7, delta);
    icon.rotation.y = MathUtils.damp(icon.rotation.y, -nx * .22, 7, delta);
  });
  return <group ref={group} position={position} rotation={[0, 0, tilt]}>
    <mesh>
      <planeGeometry args={[crop[2] / 205, crop[3] / 205]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  </group>;
}

const wheelColors = ["#f72f46", "#ff8d20", "#ffd624", "#83d537", "#13cba8", "#1eacfa", "#5763ff", "#9b3ff3", "#e135b9", "#f4476f"];

function ColorWheel({ x, y, reducedMotion }: { x: MotionValue<number>; y: MotionValue<number>; reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.position.x = MathUtils.damp(group.current.position.x, -1.95 + (reducedMotion ? 0 : x.get() / 96 * .17), 7, delta);
    group.current.position.y = MathUtils.damp(group.current.position.y, .55 + (reducedMotion ? 0 : y.get() / 36 * .09), 7, delta);
  });
  return <group ref={group} position={[-1.95, .55, .28]} rotation={[0, -.12, -.18]}>
    <mesh><torusGeometry args={[.35, .17, 12, 48]} /><meshStandardMaterial color="#26202e" roughness={.36} /></mesh>
    {wheelColors.map((color, index) => <mesh key={color} position={[0, 0, .11]} rotation={[0, 0, index * Math.PI * 2 / wheelColors.length]}>
      <ringGeometry args={[.19, .51, 5, 1, 0, Math.PI * 2 / wheelColors.length + .002]} />
      <meshBasicMaterial color={color} side={2} />
    </mesh>)}
  </group>;
}

function Swatches({ side }: { side: -1 | 1 }) {
  const colors = side === -1 ? ["#4d288e", "#aaa0d5", "#f1f0f7"] : ["#24222c", "#bcb8cc", "#6336aa"];
  return <group position={[side * 2.8, -.95, -.22]} rotation={[0, side * -.14, side * .16]}>
    {colors.map((color, i) => <RoundedBox key={color} args={[.51, .77, .07]} radius={.075} smoothness={4} position={[(i - 1) * .18, (i - 1) * -.19, i * .045]} rotation={[0, 0, (i - 1) * -.08]}>
      <meshStandardMaterial color={color} roughness={.35} metalness={.12} />
    </RoundedBox>)}
  </group>;
}

function PortraitScene({ x, y, reducedMotion }: { x: MotionValue<number>; y: MotionValue<number>; reducedMotion: boolean }) {
  const model = useRef<Group>(null);
  const { invalidate } = useThree();
  useEffect(() => {
    const offX = x.on("change", invalidate);
    const offY = y.on("change", invalidate);
    invalidate();
    return () => { offX(); offY(); };
  }, [x, y, invalidate]);
  useFrame((_, delta) => {
    if (!model.current) return;
    const nx = reducedMotion ? 0 : x.get() / 96;
    const ny = reducedMotion ? 0 : y.get() / 36;
    const turn = nx * .63;
    model.current.rotation.y = MathUtils.damp(model.current.rotation.y, turn, 5.5, delta);
    model.current.rotation.x = MathUtils.damp(model.current.rotation.x, -ny * .075, 5.5, delta);
    model.current.position.x = MathUtils.damp(model.current.position.x, nx * .14, 5.5, delta);
    if (Math.abs(model.current.rotation.y - turn) > .001 || Math.abs(model.current.rotation.x + ny * .075) > .001 || Math.abs(model.current.position.x - nx * .14) > .001) invalidate();
  });
  return <>
    <ambientLight intensity={1.28} />
    <hemisphereLight args={["#ffffff", "#482884", 1.4]} />
    <directionalLight position={[-4, 5, 7]} intensity={2.3} color="#fff1df" />
    <directionalLight position={[4, 2, -4]} intensity={2.1} color="#9e77ff" />
    <pointLight position={[-4, 0, -1]} intensity={21} color="#9445ff" distance={8} />
    <group position={[0, .2, 0]}>
      <group ref={model}><Character /></group>
      {icons.map((icon, index) => <SkillIcon key={icon.label} index={index} crop={icon.crop} position={icon.base} tilt={icon.tilt} pointerX={x} pointerY={y} reducedMotion={reducedMotion} />)}
      <ColorWheel x={x} y={y} reducedMotion={reducedMotion} />
      <Swatches side={-1} /><Swatches side={1} />
    </group>
  </>;
}

export default function ThreePortrait({ x, y, label, reducedMotion }: {
  x: MotionValue<number>; y: MotionValue<number>; label: string; reducedMotion: boolean;
}) {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try { setSupported(Boolean(document.createElement("canvas").getContext("webgl2"))); }
    catch { setSupported(false); }
  }, []);
  return <div className="three-portrait" role="img" aria-label={label}>
    {supported !== true && <img src={`${import.meta.env.BASE_URL}ch-classic-purple-smile.webp`} alt="" draggable={false} />}
    {supported && <Canvas camera={{ position: [0, 0, 13.4], fov: 29, near: .1, far: 50 }} dpr={[1, 1.8]} frameloop="demand" gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
      <PortraitScene x={x} y={y} reducedMotion={reducedMotion} />
    </Canvas>}
  </div>;
}
