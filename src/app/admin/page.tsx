"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, formatBRL } from "@/lib/api";
import { Pedido, Produto } from "@/lib/types";
import { ProductIcon } from "@/components/ProductIcon";
import { TriangleAlert } from "lucide-react";

export default function DashboardPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    api.listarPedidos().then(setPedidos);
    api.listarProdutos().then(setProdutos);
  }, []);

  const faturamento = pedidos
    .filter((p) => p.statusPedido !== "ABERTO")
    .reduce((acc, p) => acc + p.valorTotal, 0);
  const abertos = pedidos.filter((p) => p.statusPedido === "ABERTO").length;
  const estoqueBaixo = produtos.filter((p) => p.estoque < 10);

  const cards = [
    { titulo: "Faturamento (pagos)", valor: formatBRL(faturamento), cor: "var(--basil)", tint: "var(--basil-tint)" },
    { titulo: "Pedidos abertos", valor: String(abertos), cor: "var(--st-aberto)", tint: "var(--st-aberto-tint)" },
    { titulo: "Pedidos no total", valor: String(pedidos.length), cor: "var(--brand)", tint: "var(--brand-tint)" },
    { titulo: "Estoque baixo", valor: String(estoqueBaixo.length), cor: "#b07d12", tint: "var(--gold-tint)" },
  ];

  return (
    <>
      <h1 className="rise" style={{ fontSize: 30 }}>Bom dia, chef</h1>
      <p className="muted rise d1" style={{ marginBottom: 28 }}>
        Visão geral da loja em {new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {cards.map((c, i) => (
          <div key={c.titulo} className={`card rise d${i + 1}`} style={{ padding: 20, borderTop: `4px solid ${c.cor}` }}>
            <p className="faint" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>
              {c.titulo}
            </p>
            <p className="display" style={{ fontSize: 28, marginTop: 6, color: c.cor }}>{c.valor}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Últimos pedidos */}
        <section className="card rise d3" style={{ overflow: "hidden" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px 0" }}>
            <h2 style={{ fontSize: 19 }}>Últimos pedidos</h2>
            <Link href="/admin/pedidos" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--brand)" }}>
              Ver todos →
            </Link>
          </header>
          <table className="table" style={{ marginTop: 10 }}>
            <thead>
              <tr><th>#</th><th>Cliente</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {pedidos.slice(0, 5).map((p) => (
                <tr key={p.idPedido}>
                  <td><Link href={`/admin/pedidos/${p.idPedido}`} style={{ fontWeight: 700, color: "var(--brand)" }}>#{p.idPedido}</Link></td>
                  <td>{p.cliente.nome}</td>
                  <td className="price">{formatBRL(p.valorTotal)}</td>
                  <td><span className={`badge badge-${p.statusPedido}`}>{p.statusPedido.toLowerCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Alerta de estoque */}
        <section className="card rise d4" style={{ padding: 20 }}>
          <h2 style={{ fontSize: 19, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
            <TriangleAlert size={19} color="#b07d12" aria-hidden /> Estoque baixo
          </h2>
          <p className="muted" style={{ fontSize: 13.5, marginBottom: 14 }}>Produtos com menos de 10 unidades.</p>
          {estoqueBaixo.length === 0 ? (
            <p className="muted">Tudo abastecido ✓</p>
          ) : (
            estoqueBaixo.map((p) => (
              <div key={p.codProduto} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px dashed var(--line)", fontSize: 14.5 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <ProductIcon categoria={p.categoria} size={17} color="var(--ink-soft)" /> {p.nome}
                </span>
                <strong style={{ color: p.estoque === 0 ? "var(--error)" : "#b07d12" }}>
                  {p.estoque === 0 ? "Esgotado" : `${p.estoque} un.`}
                </strong>
              </div>
            ))
          )}
          <Link href="/admin/produtos" className="btn btn-ghost btn-sm" style={{ marginTop: 16, width: "100%" }}>
            Gerenciar estoque
          </Link>
        </section>
      </div>
    </>
  );
}
