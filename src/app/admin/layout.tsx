"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Package, ReceiptText, Users } from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", Icon: BarChart3 },
  { href: "/admin/pedidos", label: "Pedidos", Icon: ReceiptText },
  { href: "/admin/produtos", label: "Produtos & Estoque", Icon: Package },
  { href: "/admin/clientes", label: "Clientes", Icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "248px 1fr", minHeight: "100vh" }}>
      <aside
        style={{
          background: "linear-gradient(180deg, var(--ink) 0%, #31201a 100%)",
          color: "var(--paper)", padding: "28px 18px",
          display: "flex", flexDirection: "column",
          position: "sticky", top: 0, height: "100vh",
        }}
      >
        <Link href="/admin" className="display" style={{ fontSize: 21, padding: "0 10px" }}>
          PedidoFácil<span style={{ color: "var(--gold)" }}>.</span>
        </Link>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--gold)", padding: "4px 10px 0", fontWeight: 700 }}>
          Painel de gestão
        </p>

        <nav style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 4 }}>
          {nav.map((n) => {
            const ativo = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "11px 12px", borderRadius: 10, fontSize: 14.5, fontWeight: 600,
                  background: ativo ? "var(--brand)" : "transparent",
                  color: ativo ? "#fff" : "#cdbcae",
                  transition: "background 0.15s ease",
                }}
              >
                <n.Icon size={18} strokeWidth={2} aria-hidden /> {n.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", borderTop: "1px solid #4a352a", paddingTop: 16 }}>
          <Link href="/" style={{ display: "block", padding: "8px 12px", fontSize: 13.5, color: "#cdbcae" }}>
            ← Ver vitrine
          </Link>
          <Link href="/login" style={{ display: "block", padding: "8px 12px", fontSize: 13.5, color: "#cdbcae" }}>
            Sair
          </Link>
        </div>
      </aside>

      <main style={{ padding: "36px 40px", minWidth: 0 }}>{children}</main>
    </div>
  );
}
