import {
  CupSoda,
  IceCreamCone,
  Pizza,
  Salad,
  Sandwich,
  UtensilsCrossed,
  Cookie,
  type LucideIcon,
} from "lucide-react";

// PRODUTO no banco não tem coluna de ícone — o visual deriva da categoria (front-only)
const porCategoria: Record<string, LucideIcon> = {
  Lanches: Sandwich,
  Pizzas: Pizza,
  Sobremesas: IceCreamCone,
  Combos: UtensilsCrossed,
  Bebidas: CupSoda,
  Acompanhamentos: Salad,
  Doces: Cookie,
};

export function ProductIcon({
  categoria,
  size = 22,
  color = "var(--brand)",
}: {
  categoria?: string;
  size?: number;
  color?: string;
}) {
  const Icon = porCategoria[categoria ?? ""] ?? UtensilsCrossed;
  return <Icon size={size} color={color} strokeWidth={1.8} aria-hidden />;
}
