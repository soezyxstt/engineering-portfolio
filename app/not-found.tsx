import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="kicker"><span>404</span>Coordinate not found</p>
      <h1>This route is outside the working envelope.</h1>
      <p>The page may have moved, or the address may be incomplete.</p>
      <Link href="/" className="button button-primary"><ArrowLeft size={16} /> Return home</Link>
    </section>
  );
}

