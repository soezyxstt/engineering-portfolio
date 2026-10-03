type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "split";
};

export function SectionHeading({
  title,
  intro,
  align = "split",
}: SectionHeadingProps) {
  return (
    <header className={`section-heading ${align === "left" ? "section-heading-left" : ""}`}>
      <div>
        <h2>{title}</h2>
      </div>
      {intro ? <p className="section-intro">{intro}</p> : null}
    </header>
  );
}
