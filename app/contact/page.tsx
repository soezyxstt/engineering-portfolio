import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = { title: "Contact", description: "Contact Adi Haditya Nursyam for engineering opportunities and collaboration.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <section className="contact-page">
      <p className="kicker"><span>Channel / 05</span>Contact</p>
      <h1>For engineering work that crosses boundaries.</h1>
      <p className="route-lead">I’m interested in software, robotics, mechatronics, product engineering, technical leadership, and founding-engineer opportunities.</p>
      <div className="contact-links">
        <a href="mailto:soezyxst@gmail.com"><span>Email</span><strong>soezyxst@gmail.com</strong><ArrowUpRight /></a>
        <a href="https://www.linkedin.com/in/adihnursyam/" target="_blank" rel="noreferrer"><span>LinkedIn</span><strong>adihnursyam</strong><ArrowUpRight /></a>
        <a href="https://github.com/soezyxstt" target="_blank" rel="noreferrer"><span>GitHub</span><strong>soezyxstt</strong><ArrowUpRight /></a>
      </div>
      <p className="contact-note">Based in Indonesia · Asia/Jakarta (GMT+7)</p>
    </section>
  );
}

