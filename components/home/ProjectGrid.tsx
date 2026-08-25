"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { motion, Variants } from "framer-motion";
import projectsData from "@/data/projects.json";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export function ProjectGrid() {
  const getLayoutClass = (index: number) => {
    if (index === 0) return "md:col-span-12";
    if (index === 1) return "md:col-span-7";
    if (index === 2) return "md:col-span-5";
    return "md:col-span-6";
  };

  return (
    <section id="work" className="w-full max-w-[92rem] mx-auto px-5 md:px-6 py-32">
      <div className="flex items-end justify-between gap-6 mb-4">
        <h2 className="font-display font-extrabold text-6xl md:text-8xl tracking-tight transition-all duration-1000 starting:opacity-0 starting:translate-y-8">
          Selected Work
        </h2>
        <span className="coord-readout hidden sm:block pb-3 whitespace-nowrap">
          <span className="text-accent">/03</span> · {projectsData.length} entries
        </span>
      </div>
      <div className="flex items-center gap-3 mb-12">
        <span className="coord-readout text-accent">WEB · SYSTEMS</span>
        <span className="dim-line flex-1" />
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10"
      >
        {projectsData.map((project, index) => (
          <motion.div
            key={project.id}
            variants={itemVariants}
            className={`${getLayoutClass(index)} relative border-t border-border pt-4 md:pt-5`}
          >
            <span className="pointer-events-none absolute -top-4 -left-1 z-0 font-display font-extrabold text-[6rem] md:text-[8rem] leading-none text-accent/[0.06] select-none">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Link
              href={`/work/${project.id}`}
              className="cursor-hit group relative z-10 block"
            >
              <span className="absolute top-3 left-3 z-20 inline-flex items-center gap-2 text-[11px] px-2 py-1 bg-background/70 backdrop-blur-sm font-mono-ui uppercase tracking-[0.1em] text-accent border border-accent/20">
                <span className="text-[color:var(--muted)]">{String(index + 1).padStart(2, "0")}</span>
                {project.category}
              </span>

              <div
                className={`relative w-full overflow-hidden border border-border group-hover:border-accent/40 transition-colors duration-500 ${index === 0 ? "aspect-[16/7]" : "aspect-[16/10]"}`}
              >
                {/* corner registration ticks */}
                <span className="corner corner-tl z-20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="corner corner-tr z-20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="corner corner-bl z-20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="corner corner-br z-20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:[filter:saturate(1)_brightness(1)]"
                  style={{ filter: "saturate(0.35) brightness(0.85)", viewTransitionName: `project-img-${project.id}` }}
                />
                <div className="absolute inset-0 bg-[rgba(10,12,16,0.86)] opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between">
                    <div className="font-mono-ui text-[11px] uppercase tracking-[0.1em] text-accent">
                      {project.stack.join(" · ")}
                    </div>
                    <span className="text-accent text-xl">↗</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4 md:pt-5">
                <h3
                  className="font-display font-bold text-4xl md:text-5xl tracking-tight text-foreground group-hover:text-accent transition-colors duration-300"
                  style={{ viewTransitionName: `project-title-${project.id}` }}
                >
                  {project.title}
                </h3>

                <p className="text-[0.98rem] md:text-lg leading-relaxed text-[color:var(--muted)] line-clamp-2 mt-1">
                  {project.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
