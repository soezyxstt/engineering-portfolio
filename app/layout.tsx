import type { Metadata, Viewport } from "next";
import { DM_Mono, Syne } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adihnursyam.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Adi Haditya Nursyam — Robotics & Software Engineer",
    template: "%s | Adi Haditya Nursyam",
  },
  description:
    "Portfolio of Adi Haditya Nursyam, a systems builder working across robotics, control, embedded software, web platforms, and product development.",
  keywords: [
    "Adi Haditya Nursyam",
    "robotics engineer",
    "software engineer",
    "mechanical engineer",
    "SCARA robot",
    "embedded systems",
    "Indonesia",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Adi Haditya Nursyam — Robotics & Software Engineer",
    description: "Integrated systems across mechanics, control, embedded software, and production-grade digital products.",
    url: siteUrl,
    siteName: "Adi Haditya Nursyam",
    type: "website",
    locale: "en_US",
    images: [{ url: "/me_photo.jpeg", width: 853, height: 1517, alt: "Adi Haditya Nursyam" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adi Haditya Nursyam — Robotics & Software Engineer",
    description: "I build complete systems across physical and digital layers.",
    images: ["/me_photo.jpeg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f2efe7",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Adi Haditya Nursyam",
    jobTitle: "Robotics & Software Engineer",
    alumniOf: { "@type": "CollegeOrUniversity", name: "Institut Teknologi Bandung" },
    sameAs: ["https://github.com/soezyxstt", "https://www.linkedin.com/in/adihnursyam/"],
    url: siteUrl,
  };

  return (
    <ViewTransitions>
      <html lang="en" className={`${syne.variable} ${dmMono.variable}`}>
        <body>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        </body>
      </html>
    </ViewTransitions>
  );
}
