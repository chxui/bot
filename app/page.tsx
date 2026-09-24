"use client";

import { ArrowUpRight, Copy, Check, Menu, X } from "lucide-react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

type Language = "en" | "zh";
const translations = {
  en: {
    home: "Home", about: "About", servicesNav: "Services", projects: "Projects", contact: "Contact", navigation: "Primary navigation",
    hello: "HI, I'M CH", intro: "A UI designer using AI to empower design and create the digital experiences of tomorrow.", contactMe: "Contact me",
    aboutTitle: "About me", aboutCopy: "With years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!",
    services: "Services", projectTitle: "Project", client: "Client", personal: "Personal", live: "Live project",
    available: "Available for selected projects", create: "Let's create", motion: "Selected motion work", preview: "3D motion project preview", detail: "detail",
    portrait: "CH, a smiling UI designer holding a laptop, surrounded by creative software and programming icons", originalPortrait: "Jack, 3D creator",
  },
  zh: {
    home: "首页", about: "关于", servicesNav: "服务", projects: "作品", contact: "联系", navigation: "主导航",
    hello: "你好，我是 CH", intro: "一位用 AI 赋能设计，创造未来数字体验的 UI 设计师。", contactMe: "联系我",
    aboutTitle: "关于我", aboutCopy: "拥有多年设计经验，我专注于品牌设计、网页设计与用户体验。我热爱与希望脱颖而出、展现最佳形象的企业合作。让我们一起创造出色的作品！",
    services: "设计服务", projectTitle: "精选作品", client: "客户项目", personal: "个人项目", live: "查看项目",
    available: "欢迎洽谈合适的项目", create: "一起创作", motion: "精选动态作品", preview: "3D 动态作品预览", detail: "细节",
    portrait: "CH，手持笔记本电脑的微笑 UI 设计师，四周环绕创意软件和编程图标", originalPortrait: "3D 创作者 Jack",
  },
};
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void }>({ language: "en", setLanguage: () => {} });
function useLanguage() {
  const context = useContext(LanguageContext);
  return { ...context, t: translations[context.language] };
}

function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  return <div className="language-switch" role="group" aria-label="语言 / Language">
    <button type="button" lang="zh-CN" aria-pressed={language === "zh"} onClick={() => setLanguage("zh")}>中文</button>
    <button type="button" lang="en" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
  </div>;
}

function FloatingNavigation() {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0);
    const dismiss = (event: globalThis.PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && header.current?.classList.contains("menu-open")) { setOpen(false); toggle.current?.focus(); }
    };
    const desktop = window.matchMedia("(min-width: 640px)");
    const resize = () => { if (desktop.matches) setOpen(false); };
    update();
    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    desktop.addEventListener("change", resize);
    return () => {
      window.removeEventListener("scroll", update);
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
      desktop.removeEventListener("change", resize);
    };
  }, []);
  return <>
    <header ref={header} className={`floating-header${scrolled ? " is-scrolled" : ""}${open ? " menu-open" : ""}`}>
      <nav className="nav" aria-label={t.navigation}>
        <button ref={toggle} className="menu-toggle" type="button" aria-label={language === "zh" ? (open ? "关闭菜单" : "打开菜单") : (open ? "Close menu" : "Open menu")} aria-expanded={open} aria-controls="primary-links" onClick={() => setOpen(!open)}>
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
        <div className="nav-links" id="primary-links" onClick={() => setOpen(false)}>
          <a href="#top">{t.home}</a><a href="#about">{t.about}</a><a href="#services">{t.servicesNav}</a><a href="#projects">{t.projects}</a><a href="#contact">{t.contact}</a>
        </div>
        <LanguageSwitch />
      </nav>
    </header>
  </>;
}

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const marqueeImages = Array.from({ length: 20 }, (_, index) => asset(`motion/preview-${index + 1}.webp`));

const services = [
  ["3D Modeling", "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations."],
  ["Rendering", "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life."],
  ["Motion Design", "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences."],
  ["Branding", "Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence."],
  ["Web Design", "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience."],
];

const servicesZh = [
  ["3D 建模", "根据客户需求打造精细的物体、角色与场景模型，适用于游戏、产品展示和可视化项目。"],
  ["渲染表现", "通过定制灯光、纹理与材质，呈现高品质、逼真的渲染效果，让设计构想栩栩如生。"],
  ["动态设计", "以动画和动态图形，为品牌、产品及数字体验注入活力与叙事表现力。"],
  ["品牌设计", "从标志到完整的品牌视觉系统，打造统一、鲜明且令人难忘的品牌形象。"],
  ["网页设计", "注重布局、字体与用户体验，设计简洁、现代且有助于提升转化的网站。"],
];

const projects = [
  {
    name: "Nextlevel Studio", category: "Client",
    images: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
    ],
  },
  {
    name: "Aura Brand Identity", category: "Personal",
    images: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
    ],
  },
  {
    name: "Solaris Digital", category: "Client",
    images: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
    ],
  },
];

function FadeIn({ children, delay = 0, x = 0, y = 30, className = "" }: { children: ReactNode; delay?: number; x?: number; y?: number; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, x, y }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, margin: "50px", amount: 0 }} transition={{ duration: .7, delay, ease: [.25, .1, .25, 1] }}>{children}</motion.div>;
}

function ContactButton({ footer = false }: { footer?: boolean }) {
  const { language, t } = useLanguage();
  const dialog = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const zh = language === "zh";
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  const copy = async () => {
    try { await navigator.clipboard.writeText("RMB_101"); setCopyState("copied"); }
    catch { setCopyState("failed"); }
  };
  return <>
    <button className={footer ? "footer-contact" : "contact-button"} type="button" onClick={() => { setCopyState("idle"); dialog.current?.showModal(); dialog.current?.querySelector<HTMLElement>(".wechat-card")?.focus({ preventScroll: true }); setOpen(true); }}>{footer ? t.create : t.contactMe} <ArrowUpRight size={17} strokeWidth={2} /></button>
    {mounted && createPortal(<dialog ref={dialog} className="wechat-dialog" aria-label={zh ? "添加我的微信" : "Connect on WeChat"} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="wechat-card" tabIndex={-1}>
        <button className="wechat-close" type="button" aria-label={zh ? "关闭弹窗" : "Close dialog"} onClick={() => dialog.current?.close()}><X size={22} /></button>
        <div className="wechat-badge-top" aria-hidden="true"><div className="wechat-badge-slot" /><div className="wechat-lanyard" /></div>
        <h2>{zh ? "添加我的微信" : "Connect on WeChat"}</h2>
        <p className="wechat-intro">{zh ? "欢迎随时和我联系" : "Feel free to contact me anytime."}</p>
        <div className="wechat-qr"><img src={asset("ch-wechat-code.png")} alt={zh ? "CH 的微信二维码，微信号 RMB_101" : "CH’s WeChat QR code, ID RMB_101"} /></div>
        <p className="wechat-hint">{zh ? "使用微信扫码，或在微信内长按识别" : "Scan with WeChat, or long-press inside WeChat."}</p>
        <div className="wechat-id"><span>{zh ? "微信号" : "WeChat ID"}</span><strong>RMB_101</strong></div>
        <button className="wechat-copy" type="button" onClick={copy}>{copyState === "copied" ? <Check size={18} /> : <Copy size={18} />}{copyState === "copied" ? (zh ? "已复制微信号" : "WeChat ID copied") : (zh ? "复制微信号" : "Copy WeChat ID")}</button>
        <p className="wechat-status" role="status">{copyState === "failed" ? (zh ? "复制失败，请长按上方微信号手动复制。" : "Copy unavailable. Select the ID above to copy manually.") : copyState === "copied" ? (zh ? "在微信中搜索 RMB_101 即可添加" : "Search RMB_101 in WeChat to add me.") : ""}</p>
      </div>
    </dialog>, document.body)}
  </>;
}

function TrackingEyes({ x, y }: { x: MotionValue<number>; y: MotionValue<number> }) {
  // SVG masks keep the original iris texture inside the original eyelid outlines.
  return <svg className="hero-eyes" viewBox="0 0 1450 1570" aria-hidden="true">
    <defs>
      <radialGradient id="eye-white-left" cx="65%" cy="55%" r="75%"><stop stopColor="#e4cfc1" /><stop offset=".55" stopColor="#b6abae" /><stop offset="1" stopColor="#4c566b" /></radialGradient>
      <radialGradient id="eye-white-right" cx="62%" cy="58%" r="77%"><stop stopColor="#f1dfd0" /><stop offset=".6" stopColor="#c9b9b1" /><stop offset="1" stopColor="#5c5558" /></radialGradient>
      <clipPath id="eye-lid-left"><path d="M 500 1081 C 493 1031 511 982 548 971 C 602 948 666 965 698 1006 C 719 1033 720 1069 702 1089 C 651 1128 558 1115 500 1081 Z" /></clipPath>
      <clipPath id="eye-lid-right"><path d="M 890 1082 C 878 1043 897 993 931 976 C 969 953 1032 963 1067 984 C 1092 1000 1100 1037 1096 1080 C 1034 1115 952 1125 890 1082 Z" /></clipPath>
      <clipPath id="iris-left"><ellipse cx="638" cy="1024" rx="60" ry="63" /></clipPath>
      <clipPath id="iris-right"><ellipse cx="968" cy="1026" rx="61" ry="62" /></clipPath>
    </defs>
    {(["left", "right"] as const).map(side => <g key={side} clipPath={`url(#eye-lid-${side})`}>
      <rect x={side === "left" ? 490 : 880} y="955" width="230" height="165" fill={`url(#eye-white-${side})`} />
      <motion.g className="hero-iris" style={{ x, y }}><g clipPath={`url(#iris-${side})`}><image href={asset("jack-portrait.png")} width="1450" height="1570" /></g></motion.g>
    </g>)}
  </svg>;
}

const designerIconOutlines = [
  "64,171 81,117 288,104 359,322 319,377 135,398 73,321",
  "3,483 54,435 141,422 196,446 247,550 235,620 185,672 77,681 8,644",
  "222,451 277,393 355,392 422,431 450,517 426,579 375,616 290,620 226,560",
  "886,299 934,210 1065,202 1176,276 1186,351 1159,454 1084,496 978,483 895,420",
  "1001,569 1061,478 1178,470 1254,535 1254,648 1223,721 1092,732 1010,670",
  "1038,719 1137,710 1252,820 1252,980 1118,981 1038,866",
  "945,981 1008,930 1148,930 1216,1002 1216,1115 1158,1184 1063,1198 942,1157 932,1072",
];

function DesignerPortrait({ x, y, eyeX, eyeY, label }: {
  x: MotionValue<number>; y: MotionValue<number>;
  eyeX: MotionValue<number>; eyeY: MotionValue<number>; label: string;
}) {
  const source = asset("ch-designer-skills-v3.png");
  const iconX = useTransform(x, value => value * .3);
  const iconY = useTransform(y, value => value * .55);
  return <svg className="designer-portrait" viewBox="0 0 1254 1254" role="img" aria-label={label}>
    <defs>
      <mask id="designer-person-mask" maskUnits="userSpaceOnUse">
        <rect width="1254" height="1254" fill="white" />
        {designerIconOutlines.map((points, index) => <polygon key={index} points={points} fill="black" />)}
        <polygon points="970,80 1008,25 1138,20 1196,57 1199,128 1188,190 1142,226 1071,237 1013,211 969,169 959,116" fill="black" />
        <rect x="865" width="389" height="255" fill="black" />
      </mask>
      <mask id="designer-icons-mask" maskUnits="userSpaceOnUse">
        <rect width="1254" height="1254" fill="black" />
        {designerIconOutlines.map((points, index) => <polygon key={index} points={points} fill="white" />)}
        <rect x="950" width="280" height="222" fill="black" />
      </mask>
      <clipPath id="designer-code-icon"><polygon points="970,80 1008,25 1138,20 1196,57 1199,128 1188,190 1142,226 1071,228 1021,207 977,166 968,116" /></clipPath>
      <clipPath id="designer-eye-left"><path d="M 514 303 C 519 283 535 279 559 279 C 582 278 600 286 604 303 C 602 320 586 328 558 328 C 531 328 518 320 514 303 Z" /></clipPath>
      <clipPath id="designer-eye-right"><path d="M 660 303 C 665 283 680 279 698 279 C 720 279 737 287 741 303 C 738 320 723 328 698 328 C 675 328 662 320 660 303 Z" /></clipPath>
      <clipPath id="designer-iris-left"><circle cx="560" cy="298" r="25" /></clipPath>
      <clipPath id="designer-iris-right"><circle cx="697" cy="298" r="25" /></clipPath>
      <clipPath id="designer-sleeve-repair-right"><path d="M 918 838 C 1002 831 1055 868 1070 929 C 1076 987 1035 1042 943 1052 L 910 1006 Z" /></clipPath>
      <radialGradient id="designer-eye-white"><stop stopColor="#faf8f3" /><stop offset=".78" stopColor="#f1e9e3" /><stop offset="1" stopColor="#bb9b94" /></radialGradient>
    </defs>
    <g clipPath="url(#designer-sleeve-repair-right)"><image href={source} width="1254" height="1254" transform="translate(72 0)" /></g>
    <image href={source} width="1254" height="1254" mask="url(#designer-person-mask)" />
    {(["left", "right"] as const).map(side => <g key={side} clipPath={`url(#designer-eye-${side})`}>
      <ellipse cx={side === "left" ? 559 : 699} cy="302" rx="47" ry="28" fill="url(#designer-eye-white)" />
      <motion.g style={{ x: eyeX, y: eyeY }}><g clipPath={`url(#designer-iris-${side})`}><image href={source} width="1254" height="1254" /></g></motion.g>
    </g>)}
    <motion.g className="designer-floating-icons" style={{ x: iconX, y: iconY }}>
      <image href={source} width="1254" height="1254" mask="url(#designer-icons-mask)" />
      <g transform="translate(-950 990)"><g clipPath="url(#designer-code-icon)"><image href={source} width="1254" height="1254" /></g></g>
    </motion.g>
  </svg>;
}

function HeroSection({ designer = false }: { designer?: boolean }) {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 110, damping: 22 });
  const y = useSpring(pointerY, { stiffness: 110, damping: 22 });
  const rotate = useTransform(x, [-96, 96], [-3, 3]);
  const eyeTargetX = useMotionValue(0);
  const eyeTargetY = useMotionValue(0);
  const eyeX = useSpring(eyeTargetX, { stiffness: 220, damping: 25 });
  const eyeY = useSpring(eyeTargetY, { stiffness: 220, damping: 25 });
  const reset = () => { pointerX.set(0); pointerY.set(0); eyeTargetX.set(0); eyeTargetY.set(0); };
  const move = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || reducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const ny = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    pointerX.set(nx * Math.min(96, bounds.width * .09));
    pointerY.set(ny * Math.min(36, bounds.height * .04));
    eyeTargetX.set(nx * (designer ? 10 : 25));
    eyeTargetY.set(ny * (designer ? 6 : 15));
  };
  useEffect(() => {
    const resetOnBlur = () => { pointerX.set(0); pointerY.set(0); eyeTargetX.set(0); eyeTargetY.set(0); };
    if (reducedMotion) resetOnBlur();
    window.addEventListener("blur", resetOnBlur);
    return () => window.removeEventListener("blur", resetOnBlur);
  }, [pointerX, pointerY, eyeTargetX, eyeTargetY, reducedMotion]);
  return <section className={designer ? "hero hero-designer" : "hero"} id="top" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
    <div className="nav-spacer" aria-hidden="true" />
    <div className="hero-scene"><div className="hero-composition">
      <div className="hero-title-wrap"><h1 className="hero-heading hero-title">{t.hello}</h1></div>
      <div className="hero-person-wrap">{designer
        ? <DesignerPortrait x={x} y={y} eyeX={eyeX} eyeY={eyeY} label={t.portrait} />
        : <motion.div className="hero-person-motion" style={{ x, y, rotate }}>
          <img className="hero-portrait" src={asset("jack-portrait.png")} width={1450} height={1570} fetchPriority="high" draggable={false} alt={t.originalPortrait} />
          <TrackingEyes x={eyeX} y={eyeY} />
        </motion.div>}
      </div>
    </div></div>
    <div className="hero-bottom"><FadeIn delay={.35} y={20}><p>{t.intro}</p></FadeIn><FadeIn delay={.5} y={20}><ContactButton /></FadeIn></div>
  </section>;
}

function MarqueeSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const update = () => { if (ref.current) setOffset((window.scrollY - ref.current.offsetTop + window.innerHeight) * .3); };
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const rows = [marqueeImages.slice(0, 11), marqueeImages.slice(11)];
  return <section className="marquee" ref={ref} aria-label={t.motion}>
    {rows.map((row, rowIndex) => <div className="marquee-viewport" key={rowIndex}><div className="marquee-track" style={{ transform: `translate3d(${rowIndex === 0 ? offset - 200 : -(offset - 200)}px,0,0)` }}>{[...row, ...row, ...row].map((src, index) => <img src={src} alt={t.preview} loading="lazy" key={`${rowIndex}-${index}`} />)}</div></div>)}
  </section>;
}

function AnimatedCharacter({ char, progress, start, end }: { char: string; progress: MotionValue<number>; start: number; end: number }) {
  const opacity = useTransform(progress, [start, end], [.2, 1]);
  return <span className="animated-char"><span aria-hidden>{char === " " ? "\u00a0" : char}</span><motion.span style={{ opacity }}>{char === " " ? "\u00a0" : char}</motion.span></span>;
}

function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  return <p ref={ref} className="about-copy">{[...text].map((char, index) => <AnimatedCharacter key={index} char={char} progress={scrollYProgress} start={index / text.length} end={Math.min(1, index / text.length + .12)} />)}</p>;
}

function AboutSection() {
  const { t } = useLanguage();
  const decorations = [
    ["about-moon", "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png", -.8, .1],
    ["about-orb", "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png", -.8, .25],
    ["about-lego", "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png", .8, .15],
    ["about-group", "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png", .8, .3],
  ] as const;
  return <section className="about" id="about">
    {decorations.map(([className, src, direction, delay]) => <FadeIn className={`about-decoration ${className}`} x={direction * 100} y={0} delay={delay} key={className}><img src={src} alt="" /></FadeIn>)}
    <div className="about-content"><FadeIn y={40}><h2 className="section-heading hero-heading">{t.aboutTitle}</h2></FadeIn><AnimatedText text={t.aboutCopy} /><FadeIn y={20}><ContactButton /></FadeIn></div>
  </section>;
}

function ServicesSection() {
  const { language, t } = useLanguage();
  return <section className="services" id="services"><FadeIn><h2 className="section-heading dark-heading">{t.services}</h2></FadeIn><div className="service-list">{(language === "zh" ? servicesZh : services).map(([name, description], index) => <FadeIn delay={index * .1} key={index}><article className="service-item"><span className="big-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{name}</h3><p>{description}</p></div></article></FadeIn>)}</div></section>;
}

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  const { language, t } = useLanguage();
  const name = language === "zh" && index === 1 ? "Aura 品牌视觉设计" : project.name;
  const stackOffset = index === 0 ? "0px" : `clamp(${index * 10}px, ${index * 1.4}vw, ${index * 20}px)`;
  return <div className="project-stage" style={{ top: `calc(var(--card-top) + ${stackOffset})`, zIndex: index + 1 }}><article className="project-card">
    <div className="project-meta"><span className="big-number">{String(index + 1).padStart(2, "0")}</span><div className="project-label"><span>{project.category === "Client" ? t.client : t.personal}</span><h3>{name}</h3></div><a className="live-button" href={project.images[2]} target="_blank" rel="noreferrer">{t.live}</a></div>
    <div className="project-grid"><div className="project-left"><img src={project.images[0]} alt={`${name} ${t.detail}`} loading="lazy" /><img src={project.images[1]} alt={`${name} ${t.detail}`} loading="lazy" /></div><img className="project-main" src={project.images[2]} alt={name} loading="lazy" /></div>
  </article></div>;
}

function ProjectsSection() {
  const { t } = useLanguage();
  return <section className="projects" id="projects"><FadeIn><h2 className="section-heading hero-heading">{t.projectTitle}</h2></FadeIn><div className="projects-list">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.name} />)}</div><div className="project-footer" id="contact"><span>{t.available}</span><ContactButton footer /></div></section>;
}

export function Portfolio({ designer = false }: { designer?: boolean }) {
  const [language, setLanguageState] = useState<Language>("en");
  useEffect(() => {
    try { if (localStorage.getItem("ch-portfolio-language") === "zh") setLanguageState("zh"); } catch { /* Storage can be unavailable in private browsers. */ }
  }, []);
  useEffect(() => { document.documentElement.lang = language === "zh" ? "zh-CN" : "en"; }, [language]);
  const setLanguage = (value: Language) => {
    setLanguageState(value);
    try { localStorage.setItem("ch-portfolio-language", value); } catch { /* Switching still works without persistence. */ }
  };
  return <LanguageContext.Provider value={{ language, setLanguage }}><main className={`locale-${language}`} lang={language === "zh" ? "zh-CN" : "en"}><FloatingNavigation /><HeroSection designer={designer} /><MarqueeSection /><AboutSection /><ServicesSection /><ProjectsSection /></main></LanguageContext.Provider>;
}

export default function Home() {
  return <Portfolio />;
}
