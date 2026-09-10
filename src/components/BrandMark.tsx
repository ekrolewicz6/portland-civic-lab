import Image from "next/image";

/** The supplied transparent gold mark, paired with the visible site name. */
export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`relative inline-block shrink-0 overflow-hidden ${className}`}>
      <Image
        src="/images/brand/logo-light.png"
        alt=""
        fill
        sizes="52px"
        className="object-contain scale-[1.5]"
      />
    </span>
  );
}
