export const storeConfig = {
  name: 'MOUSTACHE',
  description: 'Moda masculina urbana. Conheça a seleção demonstrativa da Moustache.',
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '',
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, ''),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, ''),
  demoCatalog: true,
} as const;
