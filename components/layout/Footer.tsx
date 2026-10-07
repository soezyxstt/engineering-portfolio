import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-callout">
        <h2>Let’s build the whole system.</h2>
        <p>
          Open to software engineering, full-stack, backend, AI product, and product-engineering conversations.
        </p>
        <a href="mailto:soezyxst@gmail.com" className="text-link">
          soezyxst@gmail.com <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="footer-bottom">
        <div className="footer-brand">
          <Link href="/" aria-label="Adi Haditya Nursyam, home">
            <Image src="/brand/ahn-navbar-light.svg" alt="" width={240} height={48} className="footer-mark footer-mark-light" />
            <Image src="/brand/ahn-footer.svg" alt="" width={320} height={64} className="footer-mark footer-mark-dark" />
          </Link>
          <p>© {new Date().getFullYear()} Adi Haditya Nursyam</p>
        </div>
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
