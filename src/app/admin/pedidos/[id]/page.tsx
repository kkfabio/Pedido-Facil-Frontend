"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { api, formatBRL } from "@/lib/api";
import { Pedido, StatusPedido } from "@/lib/types";
import { ProductIcon } from "@/components/ProductIcon";

const proximoStatus: Partial<Record<StatusPedido, StatusPedido>> = {
  PAGO: "ENVIADO",
};

export default function DetalhePedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [avancando, setAvancando] = useState(false);

  useEffect(() => {
    api.buscarPedido(Number(id)).then((p) => {
      setPedido(p ?? null);
      setCarregando(false);
    });
  }, [id]);

  async function avancarStatus() {
    if (!pedido) return;
    setAvancando(true);
    try {
      const atualizado = await api.avancarStatus(pedido.idPedido);
      if (atualizado) setPedido(atualizado);
    } catch {
      alert("Erro ao avançar status do pedido.");
    } finally {
      setAvancando(false);
    }
  }

  if (carregando) return <p className="muted">Carregando…</p>;
  if (!pedido) {
    return (
      <div className="card" style={{ padding: 40, textAlign: "center" }}>
        <h1 style={{ fontSize: 24, marginBottom: 10 }}>Pedido não encontrado</h1>
        <Link href="/admin/pedidos" className="btn btn-ghost">← Voltar à lista</Link>
      </div>
    );
  }

  const prox = proximoStatus[pedido.statusPedido];
  const pagamento = pedido.pagamentos[0];

  return (
    <>
      <Link href="/admin/pedidos" className="muted" style={{ fontSize: 14 }}>← Pedidos</Link>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 0 26px" }}>
        <div>
          <h1 className="rise" style={{ fontSize: 30 }}>
            Pedido #{pedido.idPedido}{" "}
            <span className={`badge badge-${pedido.statusPedido}`} style={{ verticalAlign: "middle", marginLeft: 8 }}>
              {pedido.statusPedido.toLowerCase()}
            </span>
          </h1>
          <p className="muted rise d1">
            {pedido.cliente.nome} · {new Date(pedido.dataPedido).toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" })}
          </p>
        </div>
        {prox && (
          <button
            className="btn btn-primary"
            onClick={avancarStatus}
            disabled={avancando}
            style={{ opacity: avancando ? 0.7 : 1 }}
          >
            {avancando ? "Atualizando..." : `Marcar como Enviado →`}
          </button>
        )}
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Itens */}
        <section className="card rise d1" style={{ overflow: "hidden" }}>
          <h2 style={{ fontSize: 19, padding: "18px 20px 6px" }}>Itens do pedido</h2>
          <table className="table">
            <thead>
              <tr><th>Produto</th><th>Preço un.</th><th>Qtd.</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {pedido.itens.map((i) => (
                <tr key={i.produto.codProduto}>
                  <td style={{ fontWeight: 600 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                      <ProductIcon categoria={i.produto.categoria} size={19} /> {i.produto.nome}
                    </span>
                  </td>
                  <td>{formatBRL(i.preco)}</td>
                  <td>{i.quantidade}</td>
                  <td className="price">{formatBRL(i.preco * i.quantidade)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} style={{ fontWeight: 700, textAlign: "right" }}>Valor total</td>
                <td className="price" style={{ fontSize: 17 }}>{formatBRL(pedido.valorTotal)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Pagamento */}
        <section className="card rise d2" style={{ padding: 22 }}>
          <h2 style={{ fontSize: 19, marginBottom: 14 }}>Pagamento</h2>
          {!pagamento ? (
            <p className="muted">Nenhum pagamento registrado — pedido aguardando.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14.5 }}>
              <Linha rotulo="Método" valor={pagamento.metodo === "PIX" ? "⚡ PIX" : `💳 Cartão ${pagamento.bandeira}`} />
              <Linha
                rotulo="Status"
                valor={pagamento.statusPagamento === "APROVADO" ? "Aprovado ✓" : pagamento.statusPagamento.toLowerCase()}
                cor={pagamento.statusPagamento === "APROVADO" ? "var(--basil)" : undefined}
              />
              <Linha rotulo="Valor pago" valor={formatBRL(pagamento.valorPago)} cor="var(--basil)" />
              <Linha
                rotulo="Data"
                valor={new Date(pagamento.dataPagamento).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
              />
              {pagamento.metodo === "CARTAO" && (
                <>
                  <Linha rotulo="Cartão" valor={`${pagamento.numCartao} (${pagamento.tipoCartao?.toLowerCase()})`} />
                  <Linha rotulo="Parcelas" valor={`${pagamento.qtdParcelas}×`} />
                </>
              )}
              {pagamento.metodo === "PIX" && <Linha rotulo="Chave PIX" valor={pagamento.chavePix ?? "—"} />}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function Linha({ rotulo, valor, cor }: { rotulo: string; valor: string; cor?: string }) {
  return (
    <p style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--line)", paddingBottom: 8 }}>
      <span className="muted">{rotulo}</span>
      <strong style={{ color: cor }}>{valor}</strong>
    </p>
  );
}