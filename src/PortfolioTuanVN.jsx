import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Github, Mail, MapPin, Phone, ArrowDownRight, ExternalLink, Code2, Sparkles, GraduationCap, Goal } from "lucide-react";

/*************************
 * Palette & helpers
 *************************/
const brand = {
  bg: "bg-[#0b1220]", // very dark blue/gray
  card: "bg-[#101828]",
  soft: "bg-[#111827]",
  text: "text-slate-100",
  sub: "text-slate-400",
  accent: "from-blue-500 via-blue-400 to-cyan-400",
  ring: "ring-1 ring-white/10",
};

const sections = [
  { id: "gioi-thieu", label: "Giới thiệu" },
  { id: "kinh-nghiem", label: "Kinh nghiệm" },
  { id: "hoc-van", label: "Học vấn" },
  { id: "ky-nang", label: "Kỹ năng" },
  { id: "muc-tieu", label: "Mục tiêu" },
  { id: "lien-he", label: "Liên hệ" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/*************************
 * Global style injector (keyframes + utilities)
 *************************/
function StyleInjector() {
  return (
    <style>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .hover-3d {
        transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 600ms cubic-bezier(0.22, 1, 0.36, 1), background 600ms;
        will-change: transform, box-shadow;
      }
      .hover-3d:hover { transform: translateY(-4px) scale(1.02) rotateX(0.5deg) rotateY(-0.5deg); box-shadow: 0 10px 40px rgba(56, 189, 248, 0.25); }
      .shimmer::after {
        content: ""; position: absolute; inset: 0; pointer-events: none; 
        background: linear-gradient(120deg, transparent, rgba(255,255,255,0.16), transparent);
        transform: translateX(-100%); animation: shimmer 2.2s infinite;
      }
      .glow-text { text-shadow: 0 0 28px rgba(56, 189, 248, .45), 0 0 8px rgba(56, 189, 248, .35); }
      .cursor-blink { display:inline-block; width:1ch; animation: blink 1s step-end infinite; }
      @keyframes blink { 50% { opacity: 0; } }
    `}</style>
  );
}

/*************************
 * Scroll progress bar (top)
 *************************/
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-400"
    />
  );
}

/*************************
 * Scroll spy for nav
 *************************/
function useScrollSpy(ids) {
  const [active, setActive] = useState(ids?.[0] ?? "");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

/*************************
 * Navbar (sticky with backdrop blur)
 *************************/
function Nav() {
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(sections.map((s) => s.id));
  return (
    <div className="fixed top-2 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className={`rounded-2xl ${brand.card} ${brand.ring} backdrop-blur-md supports-[backdrop-filter]:bg-white/5`}>
          <div className="flex items-center justify-between px-4 py-3">
            <a href="#gioi-thieu" className="group inline-flex items-center gap-2">
              <div className="relative">
                <div className={`absolute inset-0 blur-md opacity-50 bg-gradient-to-r ${brand.accent} rounded-full`} />
                <div className="relative w-8 h-8 rounded-full bg-white/5 grid place-items-center">
                  <Code2 className="w-4 h-4 text-sky-300 animate-pulse" />
                </div>
              </div>
              <span className="font-semibold tracking-tight text-slate-100">Nguyễn Minh Tuấn</span>
              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 hidden sm:inline">Fresher Fullstack</span>
            </a>

            <button
              className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 text-slate-200"
              onClick={() => setOpen((v) => !v)}
              aria-label="Mở menu"
            >
              <span>≡</span>
            </button>

            <nav className="hidden sm:flex items-center gap-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }); }}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition ease-[cubic-bezier(.22,1,.36,1)] ${
                    active === s.id ? "bg-white/10 text-white" : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {s.label}
                </a>
              ))}
              <a
                href="#lien-he"
                onClick={(e) => { e.preventDefault(); document.getElementById("lien-he")?.scrollIntoView({ behavior: "smooth" }); }}
                className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:translate-y-[-1px] transition ease-[cubic-bezier(.22,1,.36,1)]"
              >
                Liên hệ <ArrowDownRight className="w-4 h-4" />
              </a>
            </nav>
          </div>
          {open && (
            <div className="sm:hidden border-t border-white/10 px-3 pb-3">
              <div className="grid gap-1 pt-2">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={(e) => { e.preventDefault(); setOpen(false); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }); }}
                    className={`px-3 py-2 rounded-lg text-sm ${brand.text} hover:bg-white/5 ${active === s.id ? "bg-white/10" : ""}`}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/*************************
 * Particles (floating) for Hero background
 *************************/
function Particles({ count = 36 }) {
  const containerRef = useRef(null);
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 8 + 8,
    opacity: Math.random() * 0.6 + 0.2,
  })), [count]);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-cyan-300/70 blur-[1px]"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, opacity: p.opacity }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: p.duration, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/*************************
 * Typewriter hook
 *************************/
function useTypewriter(text, speed = 35, pause = 1200) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    let mounted = true;
    let timer;
    const tick = () => {
      timer = setTimeout(() => {
        if (!mounted) return;
        setIdx((i) => (i < text.length ? i + 1 : i));
      }, speed);
    };
    if (idx < text.length) tick();
    else timer = setTimeout(() => setIdx(0), pause);
    return () => { mounted = false; clearTimeout(timer); };
  }, [idx, text, speed, pause]);
  return text.slice(0, idx);
}

/*************************
 * Hero (parallax + particles + glow + typewriter)
 *************************/
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const ySub = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const typed = useTypewriter("Fresher Fullstack Developer · Đam mê Công nghệ & AI");

  return (
    <section id="gioi-thieu" ref={ref} className={`${brand.bg} relative overflow-hidden pt-28 sm:pt-32 pb-24`}> 
      {/* gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -top-20 -right-16 w-72 h-72 rounded-full blur-3xl opacity-30 bg-gradient-to-br ${brand.accent}`} />
        <div className={`absolute bottom-0 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20 bg-gradient-to-tl ${brand.accent}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
      </div>
      <Particles />

      <motion.div className="relative mx-auto max-w-6xl px-4" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
        <motion.div variants={fadeUp} style={{ y: yTitle }} className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Danh mục cá nhân · Phong cách nhà phát triển
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white glow-text">
            Nguyễn Minh Tuấn
          </h1>
          <motion.p style={{ y: ySub }} className="mt-4 text-lg sm:text-xl text-slate-300 leading-relaxed">
            <span className="text-sky-300/90 font-semibold">{typed}</span>
            <span className="cursor-blink">|</span>
          </motion.p>
          <motion.div variants={stagger} className="mt-6 flex flex-wrap gap-3">
            <motion.a
              variants={fadeUp}
              href="#lien-he"
              onClick={(e) => { e.preventDefault(); document.getElementById("lien-he")?.scrollIntoView({ behavior: "smooth" }); }}
              className="relative inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 hover-3d shimmer overflow-hidden"
            >
              Liên hệ ngay <ArrowDownRight className="w-4 h-4" />
            </motion.a>
            <motion.a
              variants={fadeUp}
              href="https://github.com/NMT2211"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-100 border border-white/15 hover:bg-white/5 hover-3d"
            >
              <Github className="w-4 h-4" /> Xem GitHub
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/*************************
 * Generic section title
 *************************/
function SectionTitle({ icon: Icon, title, sub }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={`absolute inset-0 blur-md opacity-40 bg-gradient-to-r ${brand.accent} rounded-full`} />
          <div className="relative w-9 h-9 rounded-xl bg-white/5 grid place-items-center border border-white/10 backdrop-blur-md">
            <Icon className="w-5 h-5 text-sky-300 animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
      </div>
      {sub && <p className="mt-2 text-slate-300">{sub}</p>}
    </div>
  );
}

/*************************
 * Timeline item
 *************************/
function TimelineItem({ time, company, role, tech, project }) {
  return (
    <motion.li variants={fadeUp} className={`relative pl-6 pb-8 ${brand.text}`}>
      <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow" />
      <div className={`relative rounded-2xl ${brand.card} ${brand.ring} p-4 md:p-5 hover-3d overflow-hidden`}> 
        <div className="absolute -top-1 -left-1 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-400">{time}</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{company}</h3>
          </div>
          <span className="text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200 backdrop-blur-sm">{role}</span>
        </div>
        <p className="mt-3 text-slate-300"><span className="font-semibold text-slate-200">Công nghệ:</span> {tech}</p>
        {project && (
          <p className="mt-2 text-slate-300"><span className="font-semibold text-slate-2 00">Dự án:</span> {project}</p>
        )}
      </div>
    </motion.li>
  );
}

function Experience() {
  return (
    <section id="kinh-nghiem" className={`${brand.bg} py-16`}>
      <div className="mx-auto max-w-6xl px-4">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle icon={Code2} title="Kinh nghiệm" sub="Một vài trải nghiệm thực tế trong quá trình học và làm việc" />
          <ol className="relative border-l border-white/10 ml-2">
            <TimelineItem
              time="05/2025 – 07/2025"
              company="H-PAI Media"
              role="Fullstack Developer (.NET + React)"
              tech="ASP.NET Core, ReactJS, REST API, SQL Server"
              project="KidSeek – Nền tảng học tập AI cho trẻ em"
            />
            <TimelineItem
              time="05/2025 – 06/2025"
              company="Tech Store"
              role="Fullstack Developer (Spring Boot + VueJS)"
              tech="Spring Boot, VueJS, MySQL, REST API"
              project="Hệ thống bán lẻ thiết bị công nghệ"
            />
          </ol>
        </motion.div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section id="hoc-van" className={`${brand.bg} py-16`}>
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle icon={GraduationCap} title="Học vấn" />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className={`grid md:grid-cols-2 gap-6`}>
          <motion.div variants={fadeUp} className={`${brand.card} ${brand.ring} rounded-2xl p-6 hover-3d`}> 
            <h3 className="text-xl font-semibold text-white">FPT Polytechnic</h3>
            <p className="text-slate-300 mt-1">Chuyên ngành Phát triển phần mềm (2023–2025)</p>
            <p className="text-slate-300 mt-1">GPA: <span className="font-semibold text-white">3.59/4</span></p>
          </motion.div>
          <motion.div variants={fadeUp} className={`${brand.card} ${brand.ring} rounded-2xl p-6 hover-3d`}> 
            <h4 className="text-lg font-semibold text-white">Tự học & dự án cá nhân</h4>
            <p className="text-slate-300 mt-2">Thực hành React, Vue, ASP.NET Core, Spring Boot; triển khai API, xác thực, và tích hợp cơ sở dữ liệu. Tập trung vào trải nghiệm người dùng và hiệu năng.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Badge({ children }) {
  return (
    <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-sm backdrop-blur-sm">
      {children}
    </span>
  );
}

function Skills() {
  const frontend = ["HTML", "CSS", "JavaScript", "ReactJS", "VueJS"];
  const backend = ["ASP.NET Core", "Spring Boot", "REST API"];
  const db = ["SQL Server", "MySQL"];
  const tools = ["Git", "Jira", "Figma"];
  const soft = ["Làm việc nhóm", "Giao tiếp", "Tư duy logic"];

  return (
    <section id="ky-nang" className={`${brand.bg} py-16`}>
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle icon={Sparkles} title="Kỹ năng" sub="Tập trung vào trải nghiệm người dùng, chất lượng mã nguồn và hiệu quả làm việc" />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid md:grid-cols-2 gap-6">
          <motion.div variants={fadeUp} className={`${brand.card} ${brand.ring} rounded-2xl p-6 hover-3d`}>
            <h3 className="font-semibold text-white">Frontend</h3>
            <div className="mt-3 flex flex-wrap gap-2">{frontend.map((s) => (<Badge key={s}>{s}</Badge>))}</div>
          </motion.div>
          <motion.div variants={fadeUp} className={`${brand.card} ${brand.ring} rounded-2xl p-6 hover-3d`}>
            <h3 className="font-semibold text-white">Backend</h3>
            <div className="mt-3 flex flex-wrap gap-2">{backend.map((s) => (<Badge key={s}>{s}</Badge>))}</div>
          </motion.div>
          <motion.div variants={fadeUp} className={`${brand.card} ${brand.ring} rounded-2xl p-6 hover-3d`}>
            <h3 className="font-semibold text-white">Cơ sở dữ liệu</h3>
            <div className="mt-3 flex flex-wrap gap-2">{db.map((s) => (<Badge key={s}>{s}</Badge>))}</div>
          </motion.div>
          <motion.div variants={fadeUp} className={`${brand.card} ${brand.ring} rounded-2xl p-6 hover-3d`}>
            <h3 className="font-semibold text-white">Công cụ</h3>
            <div className="mt-3 flex flex-wrap gap-2">{tools.map((s) => (<Badge key={s}>{s}</Badge>))}</div>
          </motion.div>
          <motion.div variants={fadeUp} className={`${brand.card} ${brand.ring} rounded-2xl p-6 md:col-span-2 hover-3d`}>
            <h3 className="font-semibold text-white">Kỹ năng mềm</h3>
            <div className="mt-3 flex flex-wrap gap-2">{soft.map((s) => (<Badge key={s}>{s}</Badge>))}</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Goals() {
  return (
    <section id="muc-tieu" className={`${brand.bg} py-16`}>
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle icon={Goal} title="Mục tiêu" />
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className={`${brand.card} ${brand.ring} rounded-2xl p-6 hover-3d`}> 
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold">Ngắn hạn</h4>
              <p className="text-slate-300 mt-2">Phát triển và tích lũy kinh nghiệm trong một đội ngũ chuyên nghiệp, học hỏi quy trình và nâng cao kỹ năng Fullstack.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold">Dài hạn</h4>
              <p className="text-slate-300 mt-2">Trở thành Senior Web Developer, dẫn dắt kỹ thuật và tạo ra các sản phẩm có tác động đến người dùng.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="lien-he" className={`${brand.bg} py-16`}>
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle icon={ExternalLink} title="Liên hệ" sub="Sẵn sàng trao đổi cơ hội thực tập/việc làm và hợp tác dự án" />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { Icon: MapPin, label: "Địa điểm", value: "TP. Hồ Chí Minh", href: "https://maps.app.goo.gl/" },
            { Icon: Mail, label: "Email", value: "nguyentuanw135@gmail.com", href: "mailto:nguyentuanw135@gmail.com" },
            { Icon: Phone, label: "Điện thoại", value: "0867 922 174", href: "tel:0867922174" },
            { Icon: Github, label: "GitHub", value: "github.com/NMT2211", href: "https://github.com/NMT2211" },
          ].map(({ Icon, label, value, href }, idx) => (
            <motion.a key={idx} variants={fadeUp} href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={`relative ${brand.card} ${brand.ring} rounded-2xl p-5 hover-3d overflow-hidden`}>
              <div className="absolute inset-0 opacity-[.07] bg-gradient-to-br from-white/10 to-transparent" />
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-sky-300 animate-pulse" />
                <div>
                  <p className="text-slate-400 text-sm">{label}</p>
                  <p className="text-white font-semibold">{value}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
        <p className="text-slate-400 text-sm mt-8">Hoặc gửi email trực tiếp, mình sẽ phản hồi sớm nhất có thể.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className={`${brand.bg} pb-10 pt-6`}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Nguyễn Minh Tuấn. Mọi quyền được bảo lưu.</p>
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <a href="#gioi-thieu" onClick={(e)=>{e.preventDefault();document.getElementById("gioi-thieu")?.scrollIntoView({behavior:"smooth"});}} className="hover:text-slate-200">Về đầu trang</a>
            <span>•</span>
            <a href="https://github.com/NMT2211" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-slate-200">
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/*************************
 * App
 *************************/
export default function PortfolioTuanVN() {
  return (
    <main className={`${brand.bg} min-h-screen ${brand.text} font-sans antialiased selection:bg-blue-600 selection:text-white`}>
      <StyleInjector />
      <ScrollProgress />
      <Nav />
      <Hero />
      <Experience />
      <Education />
      <Skills />
      <Goals />
      <Contact />
      <Footer />
    </main>
  );
}

// ===== Tailwind suggestion =====
// Use a bold, readable type like Inter / Manrope.
// html { scroll-behavior: smooth; }
// body { background: #0b1220; }
