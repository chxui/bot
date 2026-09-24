import { motion, useTransform, type MotionValue } from "framer-motion";

const icons = [
  { name: "Photoshop", position: "ps", cell: "0% 0%", depth: .5 },
  { name: "Illustrator", position: "ai", cell: "50% 0%", depth: .65 },
  { name: "After Effects", position: "ae", cell: "100% 0%", depth: .45 },
  { name: "Figma", position: "figma", cell: "0% 100%", depth: .6 },
  { name: "ChatGPT", position: "chatgpt", cell: "50% 100%", depth: .5 },
  { name: "Code", position: "code", cell: "100% 100%", depth: .7 },
];

function SkillIcon({ icon, x, y }: {
  icon: typeof icons[number]; x: MotionValue<number>; y: MotionValue<number>;
}) {
  const moveX = useTransform(x, value => value * icon.depth);
  const moveY = useTransform(y, value => value * icon.depth);
  const rotate = useTransform(x, [-96, 96], [-4 * icon.depth, 4 * icon.depth]);
  return <motion.div className={`purple-skill purple-skill-${icon.position}`} style={{ x: moveX, y: moveY, rotate }}>
    <div className="purple-skill-art" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}ch-purple-skills.webp)`, backgroundPosition: icon.cell }} />
  </motion.div>;
}

export function PurplePortrait({ x, y, label }: { x: MotionValue<number>; y: MotionValue<number>; label: string }) {
  return <div className="purple-portrait">
    <img className="purple-character" src={`${import.meta.env.BASE_URL}ch-purple-character.webp`} width="1254" height="1254" alt={label} fetchPriority="high" draggable={false} />
    <div className="purple-skills" aria-hidden="true">
      {icons.map(icon => <SkillIcon key={icon.name} icon={icon} x={x} y={y} />)}
    </div>
  </div>;
}
