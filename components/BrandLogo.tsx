/** Derrick's DR monogram. Uses currentColor so it inherits text color. */
export function BrandLogo({
  className = "",
  strokeWidth = 2.1,
  draw = false,
}: {
  className?: string;
  strokeWidth?: number;
  draw?: boolean;
}) {
  const c = draw ? "draw" : undefined;
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      aria-hidden
    >
      <circle className={c} pathLength={1} cx="100" cy="100" r="92" />
      {/* D */}
      <path className={c} pathLength={1} d="M58 70.1 L58 149.8" />
      <path className={c} pathLength={1} d="M58 70.1 L88 70.1" />
      <path className={c} pathLength={1} d="M88 70.1 L58 149.8" />
      <path className={c} pathLength={1} d="M58 149.8 L64.3 149.8" />
      {/* R */}
      <path className={c} pathLength={1} d="M101.5 72 L101.5 168.2" />
      <path className={c} pathLength={1} d="M101.5 72 L148 68" />
      <path className={c} pathLength={1} d="M148 68 L101.5 114.6" />
      <path className={c} pathLength={1} d="M101.5 114.6 L156 143" />
    </svg>
  );
}
