import Image from "next/image";
import Link from "next/link";
import { DEFAULT_LOGO_URL, STORE_NAME } from "@/lib/brand";

/** Uses the original company image, retaining its proportions and colors. */
export default function Logo({ variant = "dark", logoUrl }: { variant?: "dark" | "light"; logoUrl?: string | null }) {
  return <Link href="/" className={`store-name ${variant === "light" ? "store-name-light" : ""}`} aria-label={`${STORE_NAME} — Início`}>
    <Image src={logoUrl || DEFAULT_LOGO_URL} alt={`Logo da ${STORE_NAME}`} width={540} height={260} className="h-14 w-auto max-w-[150px] object-contain md:h-16" />
  </Link>;
}
