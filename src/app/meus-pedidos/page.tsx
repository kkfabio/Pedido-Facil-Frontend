"use client";

import { useEffect, useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { api, formatBRL, obterToken } from "@/lib/api";
import { Pedido, StatusPedido } from "@/lib/types";

const passos: StatusPedido[] = ["ABERTO", "PAGO", "ENVIADO"];
const rotulos: Record<StatusPedido, string> = {
  ABERTO: "Aberto", PAGO: "Pago", ENVIADO: "Enviado",
};

function Timeline({ status }: { status: StatusPedido }) {
  const atual = passos.indexOf(status);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "14px 0 4px" }}>
      {passos.map((p, i) => (
        <div key={p} style={{ display: "flex", alignItems: "center", flex: i < passos.length - 1 ? 1 : "none" }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 26, height: 26, borderRadius: "50%", display: "grid", placeItems: "center",
                fontSize: 13, fontWeight: 700,
                background: i <= atual ? `var(--st-${p.toLowerCase()})` : "var(--paper-deep)",
                color: i <= atual ? "#fff" : "var(--ink-faint)",
              }}
            >
              {i <= atual ? "✓" : i + 1}
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, marginTop: 4, color: i <= atual ? "var(--ink)" : "var(--ink-faint)" }}>
              {rotulos[p]}
            </p>
          </div>
          {i < passos.length - 1 && (
            <div
              style={{
                flex: 1, height: 3, margin: "0 8px 18px", borderRadius: 2,
                background: i < atual ? "var(--basil)" : "var(--line)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function MeusPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const token = obterToken();
    if (!token) return;

    // Extrai o clienteId do token JWT
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const clienteId = payload.clienteId ?? payload.sub;
      if (clienteId) {
        api.listarPorCliente(Number(clienteId)).then(setPedidos);
      } else {
        // fallback: lista todos se não tiver clienteId no token
        api.listarPedidos().then(setPedidos);
      }
    } catch {
      api.listarPedidos().then(setPedidos);
    }
  }, []);

  return (
    <>
      <StoreHeader />
      <main className="container" style={{ padding: "40px 24px 80px", maxWidth: 760 }}>
        <h1 className="rise" style={{ fontSize: 32, marginBottom: 6 }}>Meus pedidos</h1>
        <p className="muted rise d1" style={{ marginBottom: 28 }}>
          Acompanhe cada etapa: Aberto → Pago → Enviado.
        </p>

        {pedidos.length === 0 ? (
          <div className="card rise d1" style={{ padding: 48, textAlign: "center" }}>
            <p className="muted">Nenhum pedido encontrado.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {pedidos.map((p, i) => (
              <article key={p.idPedido} className={`card rise d${Math.min(i + 1, 6)}`} style={{ padding: 24 }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h2 style={{ fontSize: 20 }}>Pedido #{p.idPedido}</h2>
                  <span className={`badge badge-${p.statusPedido}`}>{rotulos[p.statusPedido]}</span>
                </header>
                <p className="faint" style={{ fontSize: 13 }}>
                  {new Date(p.dataPedido).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                </p>

                <Timeline status={p.statusPedido} />

                <div style={{ borderTop: "1px dashed var(--line)", marginTop: 14, paddingTop: 12 }}>
                  {p.itens.map((it) => (
                    <p key={it.produto.codProduto} style={{ fontSize: 14.5, display: "flex", justifyContent: "space-between" }}>
                      <span>{it.quantidade}× {it.produto.nome}</span>
                      <span className="muted">{formatBRL(it.preco * it.quantidade)}</span>
                    </p>
                  ))}
                  <p style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontWeight: 700 }}>
                    <span>Total</span>
                    <span className="price">{formatBRL(p.valorTotal)}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}