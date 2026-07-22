interface PageHeadingProps {
  eyebrow:  string;
  title:    string;
  sub?:     string;
  className?: string;
}

/** Portal page intro: small magenta eyebrow + serif h1 + optional sub. */
export function PageHeading({ eyebrow, title, sub, className }: PageHeadingProps) {
  return (
    <div className={className}>
      <p className="type-badge font-medium text-brand-magenta">{eyebrow}</p>
      <h1 className="type-heading mt-1 text-brand-dark">{title}</h1>
      {sub && <p className="type-body-sm mt-2 text-gray-500">{sub}</p>}
    </div>
  );
}
