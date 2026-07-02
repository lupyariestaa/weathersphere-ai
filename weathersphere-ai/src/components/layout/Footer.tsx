import { SITE_CONFIG } from "@/config/site";

const BUILT_WITH = ["Next.js", "TypeScript", "Tailwind CSS", "Three.js", "Framer Motion", "Open-Meteo"];

export function Footer() {
  return (
    <footer className="mx-auto mt-16 max-w-6xl px-4 pb-10 sm:px-6">
      <div className="glass-panel flex flex-col items-center gap-4 rounded-xl3 px-6 py-8 text-center shadow-glass dark:shadow-glassDark sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-sm font-semibold text-slate-800 dark:text-white">{SITE_CONFIG.name}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            © {SITE_CONFIG.year} {SITE_CONFIG.name} — by {SITE_CONFIG.author}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">MIT License</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          {BUILT_WITH.map((tech) => (
            <span key={tech} className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
