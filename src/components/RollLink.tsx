import Link from "next/link";
import type { CSSProperties } from "react";
// Adapted interaction: DesignBookmark, Roll Links. No autoplay or custom RAF loop.
// https://designbookmark.com/motion#db-roll-links
export default function RollLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <Link href={href} className="roll-link" aria-label={children}>
      <span aria-hidden="true" className="roll-word">
        {[...children].map((letter, index) => (
          <span className="roll-letter" key={index}>
            <span
              className="roll-drum"
              style={{ "--letter-delay": `${index * 18}ms` } as CSSProperties}
            >
              <span>{letter === " " ? "\u00a0" : letter}</span>
              <span>{letter === " " ? "\u00a0" : letter}</span>
            </span>
          </span>
        ))}
      </span>
    </Link>
  );
}
