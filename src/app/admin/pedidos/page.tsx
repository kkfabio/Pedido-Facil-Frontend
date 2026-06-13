"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, formatBRL } from "@/lib/api";
import { Pedido, StatusPedido } from "@/lib/types";

const filtros: ("TODOS" | StatusPedido)[] = ["TODOS", "ABERTO", "PAGO", "ENVIADO"];

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>("TODOS");

  useEffect(() => {
    api.listarPedidos().then(setPedidos);
  }, []);

  const visiveis = pedidos.filter((p) => filtro === "TODOS" || p.statusPedido === filtro);

  return (
    <>
      <header style={{ marginBottom: 24 }}>
        <h1 className="rise" style={{ fontSize: 30 }}>Pedidos</h1>
        <p className="muted rise d1">Acompanhe e atualize o status de cada venda.</p>
      </header>

      <div className="rise d1" style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {filtros.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className="btn btn-sm"
            style={{
              background: f === filtro ? "var(--ink)" : "var(--card)",
              color: f === filtro ? "var(--paper)" : "var(--ink-soft)",
              border: "1.5px solid var(--line)",
            }}
          >
            {f === "TODOS" ? "Todos" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="card rise d2" style={{ overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr><th>#</th><th>Data</th><th>Cliente</th><th>Itens</th><th>Total</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {visiveis.map((p) => (
              <tr key={p.idPedido}>
                <td style={{ fontWeight: 700 }}>#{p.idPedido}</td>
                <td className="muted">
                  {new Date(p.dataPedido).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                </td>
                <td>{p.cliente.nome}</td>
                <td className="muted">{p.itens.reduce((a, i) => a + i.quantidade, 0)} itens</td>
                <td className="price">{formatBRL(p.valorTotal)}</td>
                <td><span className={`badge badge-${p.statusPedido}`}>{p.statusPedido.toLowerCase()}</span></td>
                <td>
                  <Link href={`/admin/pedidos/${p.idPedido}`} className="btn btn-ghost btn-sm">
                    Detalhes →
                  </Link>
                </td>
              </tr>
            ))}
            {visiveis.length === 0 && (
              <tr><td colSpan={7} className="muted" style={{ textAlign: "center", padding: 32 }}>Nenhum pedido com esse status.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
