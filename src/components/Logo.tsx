import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8 w-auto" }: LogoProps) {
  return (
    <Link href="/" className="inline-flex items-center">
      <Image
        src="/skiolo-logo.png"
        alt="SKIOLO"
        width={130}
        height={40}
        priority
        className={`object-contain ${className}`}
      />
    </Link>
  );
}
