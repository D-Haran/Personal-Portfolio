import Image from "next/image";

/** A brand/tech logo centered on a clean white rounded tile (PTQ-style). */
export function LogoTile({
  src,
  alt,
  size = 44,
  fill = 62,
  radius = "rounded-[26%]",
  className = "",
}: {
  src: string;
  alt: string;
  size?: number;
  /** Logo size as a percentage of the tile. */
  fill?: number;
  radius?: string;
  className?: string;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center bg-white shadow-[0_2px_8px_-2px_rgb(0_0_0/0.4)] ring-1 ring-black/5 ${radius} ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        unoptimized
        className="object-contain"
        style={{ width: `${fill}%`, height: `${fill}%` }}
      />
    </span>
  );
}
