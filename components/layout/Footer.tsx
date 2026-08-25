import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-callout">
        <p className="kicker">Contact / Jakarta time</p>
        <h2>Let’s build the whole system.</h2>
        <p>
          Open to software, robotics, mechatronics, product engineering, and founding-engineer conversations.
        </p>
        <a href="mailto:soezyxst@gmail.com" className="text-link">
          soezyxst@gmail.com <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Adi Haditya Nursyam</p>
        <nav aria-label="Footer navigation">
          <a href="https://github.com/soezyxstt" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/adihnursyam/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <Link href="/archive">Archive</Link>
          <Link href="/resume">Résumé</Link>
        </nav>
      </div>
    </footer>
  );
}
