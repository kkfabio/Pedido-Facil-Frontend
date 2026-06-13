"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/lib/cart";

const links = [
  { href: "/", label: "Cardápio" },
  { href: "/meus-pedidos", label: "Meus pedidos" },
];

export function StoreHeader() {
  const { itens } = useCart();
  const pathname = usePathname();
  const count = itens.reduce((acc, i) => acc + i.quantidade, 0);

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(250,244,234,0.92)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        className="container"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}
      >
        <Link href="/" className="display" style={{ fontSize: 22 }}>
          Pedido<span style={{ color: "var(--brand)" }}>Fácil</span>
          <span style={{ color: "var(--gold)" }}>.</span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: 14, fontWeight: 600,
                color: pathname === l.href ? "var(--brand)" : "var(--ink-soft)",
                borderBottom: pathname === l.href ? "2px solid var(--brand)" : "2px solid transparent",
                paddingBottom: 2,
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="btn btn-ghost btn-sm">Entrar</Link>
          <Link href="/carrinho" className="btn btn-ink btn-sm" style={{ position: "relative" }}>
            <ShoppingBasket size={16} aria-hidden /> Carrinho
            {count > 0 && (
              <span
                style={{
                  position: "absolute", top: -8, right: -8,
                  background: "var(--brand)", color: "#fff",
                  borderRadius: 999, fontSize: 11, fontWeight: 700,
                  minWidth: 20, height: 20, display: "grid", placeItems: "center",
                  padding: "0 5px", boxShadow: "var(--shadow)",
                }}
              >
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
