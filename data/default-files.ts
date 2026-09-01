export interface DefaultFileDefinition {
  slug: string;
  targetKey: string;
  contentType: string;
  isPublic: boolean;
  cacheControl?: string;
  description: string;
}

export const DEFAULT_FILES: DefaultFileDefinition[] = [
  {
    slug: "resume.pdf",
    targetKey: "resume/Adi-Haditya-Nursyam-Software-Engineer-Resume-EN.pdf",
    contentType: "application/pdf",
    isPublic: true,
    cacheControl: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    description: "Primary English Software Engineer Résumé (Latest)",
  },
  {
    slug: "cv.pdf",
    targetKey: "resume/Adi-Haditya-Nursyam-Software-Engineer-Resume-EN.pdf",
    contentType: "application/pdf",
    isPublic: true,
    cacheControl: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    description: "Canonical Curriculum Vitae alias",
  },
  {
    slug: "resume-id.pdf",
    targetKey: "resume/Adi-Haditya-Nursyam-Software-Engineer-Resume-ID.pdf",
    contentType: "application/pdf",
    isPublic: true,
    cacheControl: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    description: "Software Engineer Résumé (Bahasa Indonesia)",
  },
  {
    slug: "cv-id.pdf",
    targetKey: "resume/Adi-Haditya-Nursyam-Software-Engineer-Resume-ID.pdf",
    contentType: "application/pdf",
    isPublic: true,
    cacheControl: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    description: "Curriculum Vitae (Bahasa Indonesia)",
  },
  {
    slug: "automation-resume.pdf",
    targetKey: "resume/Adi-Haditya-Nursyam-Automation-Engineer-Resume-EN.pdf",
    contentType: "application/pdf",
    isPublic: true,
    cacheControl: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    description: "Automation & Robotics Engineer Résumé (EN)",
  },
  {
    slug: "automation-resume-id.pdf",
    targetKey: "resume/Adi-Haditya-Nursyam-Automation-Engineer-Resume-ID.pdf",
    contentType: "application/pdf",
    isPublic: true,
    cacheControl: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    description: "Automation & Robotics Engineer Résumé (ID)",
  },
  {
    slug: "mechanical-resume.pdf",
    targetKey: "resume/Adi-Haditya-Nursyam-Mechanical-Engineer-Resume-EN.pdf",
    contentType: "application/pdf",
    isPublic: true,
    cacheControl: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    description: "Mechanical & Systems Engineer Résumé (EN)",
  },
  {
    slug: "mechanical-resume-id.pdf",
    targetKey: "resume/Adi-Haditya-Nursyam-Mechanical-Engineer-Resume-ID.pdf",
    contentType: "application/pdf",
    isPublic: true,
    cacheControl: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    description: "Mechanical & Systems Engineer Résumé (ID)",
  },
  {
    slug: "general-resume.pdf",
    targetKey: "resume/Adi-Haditya-Nursyam-General-Master-Resume-EN.pdf",
    contentType: "application/pdf",
    isPublic: true,
    cacheControl: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    description: "General Master Profile Résumé (EN)",
  },
  {
    slug: "general-resume-id.pdf",
    targetKey: "resume/Adi-Haditya-Nursyam-General-Master-Resume-ID.pdf",
    contentType: "application/pdf",
    isPublic: true,
    cacheControl: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    description: "General Master Profile Résumé (ID)",
  },
  {
    slug: "resume-2026-09.pdf",
    targetKey: "resume/Adi-Haditya-Nursyam-Software-Engineer-Resume-EN.pdf",
    contentType: "application/pdf",
    isPublic: true,
    cacheControl: "public, max-age=31536000, immutable",
    description: "Snapshot version: September 2026",
  },
];
