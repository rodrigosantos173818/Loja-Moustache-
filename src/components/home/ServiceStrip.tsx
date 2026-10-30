import { Shirt, MessagesSquare, ShoppingBag, MapPin } from "lucide-react";
import { STORE_NAME } from "@/lib/brand";
export default function ServiceStrip() {
  return <div className="service-strip"><div className="page-width">{[{ icon: Shirt, title: "Seu estilo, suas escolhas", text: "Casual com personalidade" }, { icon: MessagesSquare, title: "Converse com a gente", text: "Atendimento direto com a loja" }, { icon: ShoppingBag, title: "Sua seleção, sem pressa", text: "Monte uma sacola de orçamento" }, { icon: MapPin, title: "Sua moda, do seu jeito", text: `Conheça a ${STORE_NAME}` }].map(item => <div key={item.title}><item.icon size={24} strokeWidth={1.15} /><p><strong>{item.title}</strong><span>{item.text}</span></p></div>)}</div></div>;
}
