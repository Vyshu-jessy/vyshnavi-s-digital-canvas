import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight, Download, Mail, Github, Code2, Database, GitBranch,
  Cpu, Boxes, Sparkles, Brain, Users, Rocket, GraduationCap, Trophy, Target,
  ExternalLink, MapPin, Languages, ChevronDown, Zap, Layers, Terminal,
  Award, BadgeCheck, BookOpen,
} from "lucide-react";
import profileImg from "@/assets/profile.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vyshnavi Patoju — Graduate | Java Developer" },
      { name: "description", content: "Portfolio of Vyshnavi Patoju, a Computer Science Engineering Graduate and Java Developer building reliable, real-world software." },
      { property: "og:title", content: "Vyshnavi Patoju — Graduate | Java Developer" },
      { property: "og:description", content: "Portfolio of Vyshnavi Patoju, a Computer Science Engineering Graduate and Java Developer." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Portfolio,
});

const RESUME_URL = "/resume.pdf";

/* ---------- Helpers ---------- */

function useMouseGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    const handler = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [x, y]);
  return { x, y };
}

function Counter({ to, suffix = "", duration = 1.8 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const start = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / (duration * 1000));
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(to * eased);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);
  const display = Number.isInteger(to) ? Math.floor(val) : val.toFixed(1);
  return <span ref={ref}>{display}{suffix}</span>;
}

function Reveal({ children, delay = 0, y = 24 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Sections ---------- */

function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-16 w-16">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-brand/30 border-t-brand"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, ease: "linear", repeat: Infinity }}
          />
        </div>
        <motion.p
          className="font-mono text-xs tracking-[0.3em] text-ink-soft"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        >
          INITIALIZING · VP
        </motion.p>
      </div>
    </motion.div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["About", "#about"], ["Journey", "#journey"], ["Skills", "#skills"],
    ["Projects", "#projects"], ["Contact", "#contact"],
  ] as const;
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}
    >
      <div className={`mx-auto max-w-6xl px-4 transition-all duration-300 ${scrolled ? "" : ""}`}>
        <div className={`flex items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300 ${scrolled ? "glass-strong" : "bg-transparent"}`}>
          <a href="#top" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg btn-brand text-sm font-bold">VP</div>
            <span className="hidden sm:block font-display font-semibold">Vyshnavi</span>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            {links.map(([label, href]) => (
              <a key={href} href={href} className="rounded-full px-4 py-1.5 text-sm text-ink-soft hover:text-ink hover:bg-brand/10 transition-colors">
                {label}
              </a>
            ))}
          </nav>
          <a href={RESUME_URL} download className="rounded-full btn-brand px-4 py-1.5 text-xs font-medium flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" /> Resume
          </a>
        </div>
      </div>
    </motion.header>
  );
}

function Particles({ count = 20 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 53) % 100;
        const delay = (i * 0.4) % 6;
        const size = 4 + ((i * 7) % 8);
        return (
          <span
            key={i}
            className="absolute rounded-full bg-brand/40 blur-[1px]"
            style={{
              left: `${left}%`, bottom: "-10px", width: size, height: size,
              animation: `particle-rise ${6 + (i % 4)}s ease-in ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

function Hero() {
  const { x, y } = useMouseGlow();
  const glowX = useSpring(x, { stiffness: 60, damping: 20 });
  const glowY = useSpring(y, { stiffness: 60, damping: 20 });

  return (
    <section id="top" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* background */}
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 -z-10 grid-bg opacity-60" />
      <motion.div
        className="pointer-events-none fixed h-[400px] w-[400px] -z-10 rounded-full"
        style={{
          x: glowX, y: glowY, translateX: "-50%", translateY: "-50%",
          background: "radial-gradient(circle, rgba(0,171,228,0.18), transparent 70%)",
        }}
      />
      <Particles count={24} />

      <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center w-full relative">
        <div>
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-mono tracking-widest text-ink-soft">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-brand opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                HELLO, I'M VYSHNAVI
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full btn-brand px-3 py-1.5 text-[11px] font-mono tracking-widest">
                <BadgeCheck className="h-3.5 w-3.5" /> AVAILABLE FOR OPPORTUNITIES
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-ink">
              Crafting <span className="text-gradient">software</span> that solves real problems
            </h1>
            <p className="mt-3 font-mono text-sm tracking-[0.25em] text-brand">GRADUATE · JAVA DEVELOPER</p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-lg text-ink-soft leading-relaxed">
              Computer Science Engineering Graduate passionate about Java development, software engineering, problem solving, and building reliable software solutions. I enjoy transforming ideas into practical applications while continuously learning and improving my technical expertise.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#projects" className="group inline-flex items-center gap-2 rounded-full btn-brand px-6 py-3 text-sm font-semibold">
                Explore Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a href={RESUME_URL} download className="inline-flex items-center gap-2 rounded-full bg-surface border border-border px-6 py-3 text-sm font-semibold text-ink hover:border-brand/50 transition-colors">
                <Download className="h-4 w-4" /> Download Resume
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-transparent border border-border px-6 py-3 text-sm font-semibold text-ink-soft hover:text-ink hover:border-ink/30 transition-colors">
                <Mail className="h-4 w-4" /> Contact Me
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.45}>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-mono tracking-wider text-ink-soft">
              <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-brand" /> B.TECH CSE · GVPCEW</div>
              <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-brand" /> 83.7% ACADEMIC</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand" /> OPEN TO WORK</div>
            </div>
          </Reveal>
        </div>

        {/* Right: profile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto"
        >
          <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px]">
            {/* rotating gradient ring */}
            <motion.div
              className="absolute -inset-4 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, #00ABE4, #9be7ff, #00ABE4, transparent 70%, #00ABE4)",
                filter: "blur(6px)", opacity: 0.7,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            {/* counter-rotating dashed ring */}
            <motion.div
              className="absolute -inset-2 rounded-full border-2 border-dashed border-brand/40"
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            {/* image */}
            <motion.div
              className="relative h-full w-full rounded-full overflow-hidden border-4 border-white shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={profileImg} alt="Vyshnavi Patoju" className="h-full w-full object-cover" width={720} height={720} />
            </motion.div>

            {/* floating chips */}
            <motion.div
              className="absolute -left-6 top-10 rounded-2xl glass-strong px-3 py-2 text-xs font-mono"
              animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-brand">☕</span> Java
            </motion.div>
            <motion.div
              className="absolute -right-4 top-1/3 rounded-2xl glass-strong px-3 py-2 text-xs font-mono"
              animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-brand">{`{ }`}</span> REST API
            </motion.div>
            <motion.div
              className="absolute -left-2 bottom-12 rounded-2xl glass-strong px-3 py-2 text-xs font-mono"
              animate={{ y: [0, -6, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <span className="text-brand">◆</span> OOP
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ink-soft"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </section>
  );
}

function About() {
  const stats = [
    { value: 83.7, suffix: "%", label: "Academic Performance" },
    { value: 100, suffix: "+", label: "Coding Problems Solved" },
    { value: 3, suffix: "+", label: "Major Projects" },
    { value: 2026, suffix: "", label: "Graduate" },
  ];
  const pillars = [
    { icon: Code2, title: "Software Development", text: "Building practical applications that ship and serve real users." },
    { icon: Brain, title: "Problem Solving", text: "Breaking down hard problems into elegant, efficient solutions." },
    { icon: Rocket, title: "Continuous Learning", text: "Every day is a chance to learn one more pattern, language, or idea." },
    { icon: Layers, title: "Efficient Systems", text: "Clean code, thoughtful architecture, and reliability by design." },
  ];

  return (
    <section id="about" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-brand">01 — ABOUT</p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Who am I?</h2>
        </Reveal>

        <div className="mt-14 grid lg:grid-cols-2 gap-10">
          <Reveal delay={0.1}>
            <div className="space-y-6 text-lg leading-relaxed text-ink-soft">
              <p>
                I'm <span className="text-ink font-semibold">Vyshnavi Patoju</span>, a <span className="text-ink">Computer Science Engineering Graduate</span> from Gayatri Vidya Parishad College of Engineering for Women.
              </p>
              <p>
                Passionate about <span className="text-ink">Java development</span>, software engineering, problem solving, and building reliable software solutions. I enjoy transforming ideas into practical applications while continuously learning and improving my technical expertise.
              </p>
              <p>
                Today I focus on writing software that's <span className="text-brand font-medium">reliable, readable, and built to last</span> — the kind of code I'd be proud to hand off to anyone.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["Java", "REST APIs", "CRUD", "OOP", "DSA"].map((t) => (
                  <span key={t} className="rounded-full bg-brand/10 px-3 py-1 text-xs font-mono text-brand">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-6 pt-2 text-sm text-ink-soft">
                <span className="flex items-center gap-2"><Languages className="h-4 w-4 text-brand" /> English · Telugu</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="grid sm:grid-cols-2 gap-4">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  whileHover={{ y: -6 }}
                  className="card-elev p-6 group"
                >
                  <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand group-hover:btn-brand group-hover:text-white transition-all">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft leading-relaxed">{p.text}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="card-elev p-6 text-center relative overflow-hidden group">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "var(--gradient-brand)", filter: "blur(40px)", transform: "scale(0.4)" }} />
                <div className="relative">
                  <div className="text-4xl font-bold font-display text-ink">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 text-xs font-mono tracking-wider text-ink-soft uppercase">{s.label}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journey() {
  const milestones = [
    { year: "2026", title: "Bachelor of Technology", sub: "Computer Science and Engineering · GVPCEW · 83.7% — Completed", icon: Trophy },
    { year: "2022", title: "Intermediate Education", sub: "Narayana Junior College", icon: GraduationCap },
    { year: "2020", title: "SSC (10th)", sub: "ZPHS Thotagaruvu", icon: GraduationCap },
    { year: "Now", title: "Java Developer", sub: "Graduate — actively looking for full-time opportunities", icon: Target, current: true },
  ];

  return (
    <section id="journey" className="relative py-32 px-6 bg-surface/40">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-brand">02 — JOURNEY</p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">The path so far</h2>
          <p className="mt-4 text-ink-soft max-w-xl">From first lines of code to the developer I'm becoming — a roadmap of milestones.</p>
        </Reveal>

        <div className="relative mt-16">
          {/* vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px">
            <div className="h-full w-full bg-gradient-to-b from-transparent via-brand/40 to-transparent" />
          </div>

          <div className="space-y-12">
            {milestones.map((m, i) => {
              const left = i % 2 === 0;
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`relative grid md:grid-cols-2 gap-6 items-center`}>
                    {/* dot */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                      <motion.div
                        className={`h-5 w-5 rounded-full btn-brand ring-4 ring-background`}
                        animate={m.current ? { scale: [1, 1.3, 1], boxShadow: ["0 0 0 0 rgba(0,171,228,0.6)", "0 0 0 12px rgba(0,171,228,0)", "0 0 0 0 rgba(0,171,228,0)"] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>

                    <div className={`pl-16 md:pl-0 ${left ? "md:pr-16 md:text-right" : "md:order-2 md:pl-16"}`}>
                      <div className={`card-elev p-6 inline-block w-full ${left ? "md:ml-auto" : ""} max-w-md`}>
                        <div className="flex items-center gap-2 mb-2 font-mono text-xs tracking-widest text-brand">
                          <m.icon className="h-4 w-4" /> {m.year}
                        </div>
                        <h3 className="text-xl font-bold text-ink">{m.title}</h3>
                        <p className="mt-1 text-sm text-ink-soft">{m.sub}</p>
                        {m.current && <span className="mt-3 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-mono tracking-wider text-brand">CURRENT</span>}
                        
                      </div>
                    </div>
                    <div className={`hidden md:block ${left ? "" : "md:order-1"}`} />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const groups = [
    { title: "Programming Languages", icon: Code2, items: ["Java", "C"] },
    { title: "Development Skills", icon: Layers, items: ["Java Development", "REST APIs", "CRUD Operations", "Software Development"] },
    { title: "Tools", icon: GitBranch, items: ["Git", "GitHub", "VS Code", "IntelliJ IDEA"] },
    { title: "Core Strengths", icon: Brain, items: ["OOP", "Data Structures", "Algorithms", "Problem Solving"] },
  ];
  return (
    <section id="skills" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-brand">03 — EXPERTISE</p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Technical toolkit</h2>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-2 gap-5">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6, rotate: -0.5 }}
                className="card-elev p-7 group relative overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "var(--gradient-brand)", filter: "blur(60px)" }} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl btn-brand">
                      <g.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{g.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((it) => (
                      <motion.span
                        key={it}
                        whileHover={{ scale: 1.08 }}
                        className="rounded-full bg-background border border-border px-3.5 py-1.5 text-sm font-medium text-ink hover:border-brand hover:text-brand transition-colors cursor-default"
                      >
                        {it}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  const items = [
    { icon: Code2, label: "Java Development" },
    { icon: Brain, label: "Problem Solving" },
    { icon: Rocket, label: "Software Engineering" },
    { icon: Users, label: "Team Collaboration" },
    { icon: Sparkles, label: "Continuous Learning" },
  ];
  return (
    <section className="relative py-16 px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {items.map((it, i) => (
              <motion.div
                key={it.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.04 }}
                className="group inline-flex items-center gap-2 rounded-full glass-strong px-5 py-2.5 text-sm font-medium text-ink hover:border-brand transition-colors"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full btn-brand text-white">
                  <it.icon className="h-3.5 w-3.5" />
                </span>
                {it.label}
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Certifications() {
  const certs = [
    {
      title: "NPTEL Deep Learning",
      issuer: "IIT Roorkee",
      type: "Elite Certification",
      description:
        "Successfully completed NPTEL Deep Learning course covering neural networks, deep learning fundamentals, and practical applications of machine learning.",
      icon: Brain,
    },
    {
      title: "NPTEL Data Analytics Using Python",
      issuer: "IIT Ropar",
      type: "Elite Certification",
      description:
        "Successfully completed NPTEL Data Analytics Using Python course focusing on data analysis, visualization, and analytical problem-solving using Python tools.",
      icon: BookOpen,
    },
  ];
  return (
    <section id="certifications" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-brand">04 — CERTIFICATIONS</p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Certifications</h2>
          <p className="mt-4 text-ink-soft max-w-xl">
            Professional certifications demonstrating continuous learning and technical growth.
          </p>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {certs.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                className="card-elev p-7 h-full relative overflow-hidden group"
              >
                <div
                  className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 group-hover:opacity-60 transition-opacity"
                  style={{ background: "var(--gradient-brand)", filter: "blur(60px)" }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl btn-brand">
                      <Award className="h-7 w-7" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-mono tracking-wider text-brand">
                      <BadgeCheck className="h-3.5 w-3.5" /> {c.type.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-ink">{c.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-sm font-mono text-ink-soft">
                    <c.icon className="h-4 w-4 text-brand" /> Issued by {c.issuer}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft">{c.description}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}



type Project = {
  title: string;
  description: string;
  tech: string[];
  highlights: string[];
  accent: string;
  icon: typeof Code2;
  github?: string;
};

const projects: Project[] = [
  {
    title: "Secure Federated Learning — Healthcare",
    description: "A secure healthcare platform focused on privacy-preserving data collaboration and information sharing across institutions.",
    tech: ["Java", "Federated Learning", "REST", "Security"],
    highlights: ["Frontend Contribution", "Backend Services", "Team Collaboration", "Secure Data Processing"],
    accent: "from-cyan-400 to-blue-500",
    icon: Cpu,
    github: "https://github.com/Vyshu-jessy/HealthCareApplication",
  },
  {
    title: "Expense Tracker",
    description: "A complete expense management system with data persistence and full CRUD functionality, designed for clarity and speed.",
    tech: ["Java", "CRUD", "Persistence", "UI"],
    highlights: ["Expense Tracking", "CRUD Operations", "Data Management", "User-Friendly Interface"],
    accent: "from-sky-400 to-indigo-500",
    icon: Boxes,
    github: "https://github.com/Vyshu-jessy/expense-tracker-backend",
  },
  {
    title: "Healthcare Information Management",
    description: "A healthcare information platform built on structured relational database concepts, supporting organized care workflows.",
    tech: ["SQL", "DBMS", "CRUD", "Modeling"],
    highlights: ["Database Design", "Information Management", "CRUD Operations", "Data Organization"],
    accent: "from-blue-400 to-teal-500",
    icon: Database,
  },
];

function Projects() {
  return (
    <section id="projects" className="relative py-32 px-6 bg-surface/40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-brand">05 — WORK</p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Featured projects</h2>
          <p className="mt-4 text-ink-soft max-w-xl">A selection of work where I focused on real problems — privacy, money, and care.</p>
        </Reveal>

        <div className="mt-14 space-y-8">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <motion.article
                whileHover={{ y: -4 }}
                className="card-elev overflow-hidden group"
              >
                <div className="grid md:grid-cols-[1.2fr_1fr] gap-0">
                  {/* visual */}
                  <div className={`relative min-h-[260px] bg-gradient-to-br ${p.accent} p-8 flex items-center justify-center overflow-hidden`}>
                    <div className="absolute inset-0 grid-bg opacity-30" />
                    <motion.div
                      animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="relative"
                    >
                      <div className="rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 p-10 shadow-2xl">
                        <p.icon className="h-20 w-20 text-white" strokeWidth={1.2} />
                      </div>
                    </motion.div>
                    <div className="absolute top-4 left-4 font-mono text-xs tracking-widest text-white/80">
                      0{i + 1} / 03
                    </div>
                  </div>
                  {/* content */}
                  <div className="p-8 flex flex-col">
                    <h3 className="text-2xl font-bold tracking-tight">{p.title}</h3>
                    <p className="mt-3 text-ink-soft leading-relaxed">{p.description}</p>
                    <ul className="mt-5 grid grid-cols-2 gap-2">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-sm text-ink-soft">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand" /> {h}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.tech.map((t) => (
                        <span key={t} className="rounded-md bg-background border border-border px-2 py-0.5 text-xs font-mono text-ink-soft">{t}</span>
                      ))}
                    </div>
                    {p.github && (
                      <div className="mt-6 flex gap-3">
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full btn-brand px-5 py-2.5 text-sm font-semibold"
                        >
                          <Github className="h-4 w-4" /> View Source Code
                          <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyMe() {
  const reasons = [
    { icon: Brain, title: "Problem Solver", text: "I treat every bug as a puzzle and every requirement as a question worth asking twice." },
    { icon: Code2, title: "Java Developer", text: "From core Java to REST APIs — it's the language I think in." },
    { icon: Zap, title: "Quick Learner", text: "New framework, new domain, new stack — I get productive fast." },
    { icon: Users, title: "Team Collaborator", text: "Clear communication, honest reviews, shared ownership." },
    { icon: Rocket, title: "Project Builder", text: "I love finishing things. Shipping > planning forever." },
    { icon: Sparkles, title: "Continuous Learner", text: "Every day, one more concept. The curve compounds." },
  ];
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-brand">06 — WHY ME</p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">What I bring to a team</h2>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -8 }}
                className="card-elev p-7 h-full group relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-brand/5 to-transparent transition-opacity" />
                <div className="relative">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl btn-brand mb-5">
                    <r.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{r.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft leading-relaxed">{r.text}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FunFacts() {
  const facts = [
    { value: 100, suffix: "+", label: "Coding Problems Solved", icon: Terminal },
    { value: 3, suffix: "+", label: "Major Projects", icon: Boxes },
    { value: 83.7, suffix: "%", label: "Academic Performance", icon: Trophy },
    { value: 2026, suffix: "", label: "Graduate", icon: GraduationCap },
  ];
  return (
    <section className="relative py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="relative rounded-3xl overflow-hidden p-10 sm:p-14" style={{ background: "var(--gradient-brand)" }}>
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 text-white">
            {facts.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.08}>
                <div>
                  <f.icon className="h-6 w-6 mb-3 opacity-80" />
                  <div className="text-4xl sm:text-5xl font-bold font-display">
                    <Counter to={f.value} suffix={f.suffix} />
                  </div>
                  <div className="mt-2 text-xs font-mono tracking-widest opacity-90 uppercase">{f.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-brand">07 — CONTACT</p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Let's build something good</h2>
          <p className="mt-4 text-ink-soft max-w-xl">Open to internships, full-time roles, and collaborations. I read every message.</p>
        </Reveal>

        <div className="mt-14 grid lg:grid-cols-[1.1fr_1fr] gap-6">
          <Reveal>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 3000); }}
              className="glass-strong rounded-3xl p-8 space-y-4"
            >
              <div>
                <label className="text-xs font-mono tracking-wider text-ink-soft uppercase">Name</label>
                <input required className="mt-2 w-full rounded-xl bg-white/70 border border-border px-4 py-3 text-ink focus:outline-none focus:border-brand transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label className="text-xs font-mono tracking-wider text-ink-soft uppercase">Email</label>
                <input required type="email" className="mt-2 w-full rounded-xl bg-white/70 border border-border px-4 py-3 text-ink focus:outline-none focus:border-brand transition-colors" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-xs font-mono tracking-wider text-ink-soft uppercase">Message</label>
                <textarea required rows={5} className="mt-2 w-full rounded-xl bg-white/70 border border-border px-4 py-3 text-ink focus:outline-none focus:border-brand transition-colors resize-none" placeholder="Tell me about the role or project..." />
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" className="inline-flex items-center gap-2 rounded-full btn-brand px-6 py-3 text-sm font-semibold">
                  <Mail className="h-4 w-4" /> Send Message
                </button>
                <a href={RESUME_URL} download className="inline-flex items-center gap-2 rounded-full bg-surface border border-border px-6 py-3 text-sm font-semibold text-ink hover:border-brand/50 transition-colors">
                  <Download className="h-4 w-4" /> Download Resume
                </a>
              </div>
              <AnimatePresence>
                {sent && (
                  <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-brand font-medium">
                    Thanks! I'll get back to you soon.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-4">
              {[
                { icon: Github, label: "GitHub", value: "github.com/Vyshu-jessy", href: "https://github.com/Vyshu-jessy/" },
                { icon: Mail, label: "Email", value: "vyshnavipatoju@gmail.com", href: "mailto:vyshnavipatoju@gmail.com" },
              ].map((l) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  whileHover={{ x: 4 }}
                  className="card-elev p-5 flex items-center gap-4 group"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand group-hover:btn-brand group-hover:text-white transition-all">
                    <l.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-mono tracking-wider text-ink-soft uppercase">{l.label}</div>
                    <div className="truncate text-ink font-medium">{l.value}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-ink-soft group-hover:text-brand group-hover:translate-x-1 transition-all" />
                </motion.a>
              ))}

              <div className="card-elev p-6">
                <p className="text-sm text-ink-soft leading-relaxed">
                  Based in India · Open to remote and on-site roles · <span className="text-ink font-medium">Available immediately</span>.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative px-6 pb-10 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="border-t border-border pt-10 grid sm:grid-cols-[1fr_auto] gap-6 items-end">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl btn-brand text-sm font-bold">VP</div>
              <div>
                <div className="font-display font-bold text-ink">Vyshnavi Patoju</div>
                <div className="text-xs text-ink-soft font-mono">Graduate · Java Developer</div>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm italic text-ink-soft">
              "Learning, Building, Improving Every Day."
            </p>
          </div>
          <div className="text-xs font-mono text-ink-soft text-left sm:text-right">
            © {new Date().getFullYear()} Vyshnavi Patoju<br />
            Crafted with care.
          </div>
        </div>
      </div>
    </footer>
  );
}

function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <AnimatePresence>{!loaded && <Loader onDone={() => setLoaded(true)} />}</AnimatePresence>

      <motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left"
        style={{ scaleX, background: "var(--gradient-brand)" }}
      />

      <Nav />
      <main>
        <Hero />
        <About />
        <Journey />
        <Skills />
        <Projects />
        <WhyMe />
        <FunFacts />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
