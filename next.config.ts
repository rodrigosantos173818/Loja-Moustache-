import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // O catálogo consome imagens hospedadas onde a loja preferir (Supabase
    // Storage, CDN próprio, etc.) — por isso liberamos qualquer host https
    // em vez de travar em domínios fixos. Ajuste para uma lista restrita de
    // hostnames em produção, se preferir mais controle.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
