/**
 * Derrick's DR monogram — his own SVG, transcribed faithfully.
 * White strokes use currentColor; the small "cut" strokes that create the
 * woven breaks use `cutColor` (match it to the surface behind the logo).
 * `draw` enables the splash draw-on animation; `id` keeps clip ids unique
 * when more than one logo is on the page.
 */
export function BrandLogo({
  id,
  className = "",
  cutColor = "#09090c",
  draw = false,
}: {
  id: string;
  className?: string;
  cutColor?: string;
  draw?: boolean;
}) {
  const ink = draw ? "ink" : undefined;
  const clip = `${id}-ring`;
  return (
    <svg viewBox="0 0 375 375" className={className} aria-hidden fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={clip}>
          <path d="M 190.066406 10.441406 C 87.933594 10.441406 5.136719 89.714844 5.136719 187.496094 C 5.136719 285.28125 87.933594 364.550781 190.066406 364.550781 C 292.203125 364.550781 374.996094 285.28125 374.996094 187.496094 C 374.996094 89.714844 292.203125 10.441406 190.066406 10.441406 Z" />
        </clipPath>
      </defs>

      {/* ring */}
      <g clipPath={`url(#${clip})`}>
        <path
          className={ink}
          pathLength={1}
          transform="matrix(1.145752, 0, 0, 1.145752, 5.135999, 10.443072)"
          d="M 161.405209 -0.00145367 C 72.264823 -0.00145367 0.000628502 69.187523 0.000628502 154.529914 C 0.000628502 239.875714 72.264823 309.061282 161.405209 309.061282 C 250.549004 309.061282 322.809789 239.875714 322.809789 154.529914 C 322.809789 69.187523 250.549004 -0.00145367 161.405209 -0.00145367 Z"
          stroke="currentColor"
          strokeWidth="9.164283"
          strokeLinecap="butt"
          strokeMiterlimit="4"
        />
      </g>

      {/* monogram strokes */}
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="butt" strokeMiterlimit="4">
        <path className={ink} pathLength={1} transform="matrix(0, 1.145752, -1.145752, 0, 118.58134, 122.028333)" d="M -0.00086322 2.999608 L 127.835438 2.999608" />
        <path className={ink} pathLength={1} transform="matrix(-1.145752, 0, 0, -1.145752, 160.71039, 128.022107)" d="M -0.000477893 2.99905 L 42.118406 2.99905" />
        <path className={ink} pathLength={1} transform="matrix(-0.84628, 0.772372, -0.772372, -0.84628, 273.470495, 127.436008)" d="M 0.0014155 2.99979 L 183.576665 2.998925" />
        <path className={ink} pathLength={1} transform="matrix(-0.810169, -0.810169, 0.810169, -0.810169, 281.924868, 251.94804)" d="M 0.00112007 3.001234 L 155.138454 3.001234" />
        <path className={ink} pathLength={1} transform="matrix(-1.14575, -0.00223402, 0.00223402, -1.14575, 273.079909, 128.022092)" d="M 0.000585993 2.999042 L 73.983229 3.00139" />
        <path className={ink} pathLength={1} transform="matrix(-0.0152312, 1.145651, -1.145651, -0.0152312, 194.073493, 122.074797)" d="M -0.00153745 2.999864 L 151.290705 3.000143" />
      </g>

      {/* woven breaks */}
      <g className={draw ? "cut" : undefined} stroke={cutColor} strokeWidth="2" strokeLinecap="butt" strokeMiterlimit="4">
        <path transform="matrix(-0.00914135, 1.145716, -1.145716, -0.00914135, 186.981143, 134.661745)" d="M -0.00023017 0.999557 L 55.058825 1.000074" />
        <path transform="matrix(-0.836003, 0.783485, -0.783485, -0.836003, 244.285976, 143.599488)" d="M -0.00195582 1.00028 L 55.057484 1.002088" />
        <path transform="matrix(-0.00914135, 1.145716, -1.145716, -0.00914135, 195.48944, 172.345505)" d="M -0.000372526 0.999981 L 55.058683 1.000498" />
      </g>
    </svg>
  );
}
