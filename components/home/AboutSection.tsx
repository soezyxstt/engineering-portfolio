"use client";

import experienceData from "@/data/experience.json";
import aboutData from "@/data/about.json";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useMemo, useState } from "react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function AboutSection() {
  const [openSection, setOpenSection] = useState<Record<string, boolean>>({
    Education: true,
    Experience: true,
    Organizations: true,
  });
  const [openRole, setOpenRole] = useState<string | null>(null);

  const groupedRows = useMemo(() => {
    const educationRows = [
      {
        key: "education-itb",
        period: `${aboutData.education.institution}`,
        role: aboutData.education.major,
        org: "Education",
        details: aboutData.education.description,
      },
      ...experienceData
        .filter((entry) => entry.company.includes("Institut Teknologi Bandung"))
        .flatMap((entry) =>
          entry.positions.map((position) => ({
            key: `${entry.company}-${position.role}-${position.period}`,
            period: position.period,
            role: position.role,
            org: entry.company,
            details: position.glimpse,
          })),
        ),
    ];

    const experienceRows = experienceData
      .filter((entry) =>
        ["PLN Indonesia Power", "Excelsis Learning Center"].some((token) =>
          entry.company.includes(token),
        ),
      )
      .flatMap((entry) =>
        entry.positions.map((position) => ({
          key: `${entry.company}-${position.role}-${position.period}`,
          period: position.period,
          role: position.role,
          org: entry.company,
          details: position.glimpse,
        })),
      );

    const organizationRows = experienceData
      .filter(
        (entry) =>
          !entry.company.includes("Institut Teknologi Bandung") &&
          !["PLN Indonesia Power", "Excelsis Learning Center"].some((token) =>
            entry.company.includes(token),
          ),
      )
      .flatMap((entry) =>
        entry.positions.map((position) => ({
          key: `${entry.company}-${position.role}-${position.period}`,
          period: position.period,
          role: position.role,
          org: entry.company,
          details: position.glimpse,
        })),
      );

    return [
      { title: "Education", rows: educationRows },
      { title: "Experience", rows: experienceRows },
      { title: "Organizations", rows: organizationRows },
    ];
  }, []);

  return (
    <section id="about" className="w-full max-w-[92rem] mx-auto px-5 md:px-6 py-32">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
        <div className="md:col-span-4 transition-all duration-1000 starting:opacity-0 starting:translate-y-8">
          <div className="sticky top-24 space-y-8 pr-0 md:pr-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="coord-readout text-accent">/04 · PROFILE</span>
                <span className="dim-line flex-1" />
              </div>
              <h2 className="font-display font-extrabold text-6xl md:text-7xl leading-none">About</h2>
            </div>
            <div className="relative aspect-[4/5] border border-border bg-surface/20 overflow-hidden">
              <span className="corner corner-tl z-20" />
              <span className="corner corner-tr z-20" />
              <span className="corner corner-bl z-20" />
              <span className="corner corner-br z-20" />
              <Image
                src="/me_photo.jpeg"
                alt="Portrait of Adi Haditya Nursyam"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/85 to-transparent p-5">
                <p className="font-mono-ui text-[11px] uppercase tracking-[0.1em] text-accent">
                  Adi Haditya Nursyam
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {aboutData.bio.map((paragraph) => (
                <p key={paragraph} className="text-[color:var(--text)]/90 leading-relaxed text-[0.98rem]">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-1">
              <p className="font-mono-ui text-[11px] tracking-[0.1em] uppercase text-accent">
                Focus
              </p>
              <p className="text-[color:var(--muted)] text-sm">
                mechanical systems + modern web architecture
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 flex flex-col gap-10 transition-all duration-1000 delay-100 starting:opacity-0 starting:translate-y-8">
          <div className="pt-1 md:pt-2">
            <h3 className="font-display font-bold text-5xl mb-8">Timeline</h3>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              {groupedRows.map((group) => {
                const isGroupOpen = openSection[group.title];
                return (
                  <div key={group.title} className="border-t border-border pt-3">
                    <button
                      onClick={() =>
                        setOpenSection((prev) => ({
                          ...prev,
                          [group.title]: !prev[group.title],
                        }))
                      }
                      className="cursor-hit w-full flex items-center justify-between pb-2"
                    >
                      <span className="font-mono-ui text-[11px] uppercase tracking-[0.1em] text-accent">
                        {group.title}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-accent transition-transform ${isGroupOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isGroupOpen && (
                      <div className="space-y-0">
                        {group.rows.map((row) => {
                          const isOpen = openRole === row.key;
                          return (
                            <motion.div
                              key={row.key}
                              variants={item}
                              className="border-t"
                              style={{ borderTop: "0.5px solid var(--border)" }}
                            >
                              <button
                                onClick={() => setOpenRole(isOpen ? null : row.key)}
                                className="cursor-hit w-full grid grid-cols-[130px_1fr] gap-4 py-5 text-left"
                              >
                                <p className="font-mono-ui text-[11px] tracking-[0.1em] uppercase text-[color:var(--muted)]">
                                  {row.period}
                                </p>
                                <div className="space-y-1">
                                  <p className="font-display font-semibold text-2xl text-[color:var(--text)] leading-tight">
                                    {row.role}
                                  </p>
                                  <p className="text-sm text-[color:var(--muted)]">{row.org}</p>
                                  <p
                                    className={`text-sm text-[color:var(--text)]/80 leading-relaxed overflow-hidden transition-all duration-300 ${
                                      isOpen ? "max-h-20 mt-2" : "max-h-0"
                                    }`}
                                  >
                                    {row.details}
                                  </p>
                                </div>
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
