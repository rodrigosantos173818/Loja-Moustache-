import type { Metadata } from 'next';
import { QuoteCart } from '@/components/cart/quote-cart';
import { storeConfig } from '@/config/store';

export const metadata: Metadata = { title: 'Sacola de orçamento', description: 'Prepare sua solicitação de orçamento para a Moustache.' };
export default function Sacola() { return <main className="simple-page"><p className="eyebrow">MOUSTACHE / SUA SELEÇÃO</p><h1>Sacola de<br/><em>orçamento.</em></h1><QuoteCart whatsapp={storeConfig.whatsappNumber}/></main>; }
