import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import type { Banner } from "@/lib/types";

export default function PromoBanners({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 md:px-8">
      <div
        className={`grid gap-4 md:gap-6 ${banners.length > 1 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}
      >
        {banners.map((banner, i) => (
          <Reveal key={banner.id} delay={i * 100}>
            <div className="group relative aspect-[16/9] overflow-hidden rounded-sm bg-carvao md:aspect-[16/10]">
              <Image
                src={banner.image_url}
                alt={banner.title ?? ""}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-85 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carvao/85 via-carvao/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-9">
                {banner.title && (
                  <h3 className="font-display text-2xl text-offwhite md:text-3xl text-balance">
                    {banner.title}
                  </h3>
                )}
                {banner.subtitle && (
                  <p className="mt-2 max-w-xs text-sm text-offwhite/75">{banner.subtitle}</p>
                )}
                {banner.button_text && banner.button_link && (
                  <Link
                    href={banner.button_link}
                    className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-wide-plus text-dourado hover:text-offwhite transition-colors"
                  >
                    {banner.button_text}
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
