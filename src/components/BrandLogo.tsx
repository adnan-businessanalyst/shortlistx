import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  priority?: boolean;
  className?: string;
  /** Visual height in px; width follows logo aspect (~360×76) */
  height?: number;
};

export function BrandLogo({
  href = "/",
  priority = false,
  className = "",
  height = 36,
}: BrandLogoProps) {
  const width = Math.round((360 / 76) * height);

  const img = (
    <Image
      src="/logo.webp"
      alt="Shortlist X"
      width={width}
      height={height}
      priority={priority}
      className="brand-logo-img"
    />
  );

  if (!href) {
    return <span className={`brand-logo ${className}`.trim()}>{img}</span>;
  }

  const isInternal = href.startsWith("/");
  if (isInternal) {
    return (
      <Link href={href} className={`brand-logo ${className}`.trim()}>
        {img}
      </Link>
    );
  }

  return (
    <a href={href} className={`brand-logo ${className}`.trim()}>
      {img}
    </a>
  );
}
