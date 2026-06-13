"use client";

import { useState } from "react";
import Link from "next/link";
import { StoreHeader } from "@/components/StoreHeader";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/api";
import { MetodoPagamento } from "@/lib/types";
import { CreditCard, PartyPopper, Zap } from "lucide-react";

export default function CheckoutPage() {
  const { itens, total, limpar } = useCart();
  const [metodo, setMetodo] = useState<MetodoPagamento>("PIX");
  const [parcelas, setParcelas] = useState(1);
  const [numCartao, setNumCartao] = useState("");
  const [bandeira, setBandeira] = useState("Visa");
  const [tipoCartao, setTipoCartao] = useState<"CREDITO" | "DEBITO">("CREDITO");
  const [erro, setErro] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState<number | null>(null);

  function confirmar() {
    if (metodo === "CARTAO" && numCartao.replace(/\D/g, "").length < 13) {
      setErro("Número de cartão inválido.");
      return;
    }
    setErro(null);
    // Em produção: POST /api/pedidos + POST /api/pedidos/{id}/pagamentos no Spring Boot
    setConfirmado(Math.floor(1000 + Math.random() * 9000));
    limpar();
  }

  if (confirmado) {
    return (
      <>
        <StoreHeader />
        <main className="container" style={{ padding: "80px 24px", maxWidth: 560, textAlign: "center" }}>
          <div className="card rise" style={{ padding: 48 }}>
            <PartyPopper size={56} color="var(--brand)" strokeWidth={1.5} aria-hidden />

            <h1 style={{ fontSize: 30, margin: "12px 0 8px" }}>Pedido #{confirmado} confirmado!</h1>
            <p className="muted" style={{ marginBottom: 8 }}>
              Status: <span className="badge badge-ABERTO">Aberto</span>
            </p>
            <p className="muted" style={{ marginBottom: 28 }}>
              {metodo === "PIX"
                ? "Pague o PIX em até 30 minutos para confirmar."
                : "Pagamento no cartão em processamento."}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Link href="/meus-pedidos" className="btn btn-primary">Acompanhar pedido</Link>
              <Link href="/" className="btn btn-ghost">Voltar ao cardápio</Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (itens.length === 0) {
    return (
      <>
        <StoreHeader />
        <main className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
          <p className="muted">Seu carrinho está vazio.</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: 16 }}>Ver cardápio</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <StoreHeader />
      <main
        className="container"
        style={{ padding: "40px 24px 80px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 32, alignItems: "start" }}
      >
        {/* Pagamento */}
        <section className="rise">
          <h1 style={{ fontSize: 30, marginBottom: 20 }}>Pagamento</h1>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {(["PIX", "CARTAO"] as MetodoPagamento[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetodo(m)}
                className="card"
                style={{
                  padding: 18, textAlign: "left", cursor: "pointer",
                  border: metodo === m ? "2px solid var(--brand)" : "1px solid var(--line)",
                  background: metodo === m ? "var(--brand-tint)" : "var(--card)",
                }}
              >
                {m === "PIX" ? (
                  <Zap size={26} color="var(--brand)" aria-hidden />
                ) : (
                  <CreditCard size={26} color="var(--brand)" aria-hidden />
                )}
                <p style={{ fontWeight: 700, marginTop: 6 }}>{m === "PIX" ? "PIX" : "Cartão"}</p>
                <p className="muted" style={{ fontSize: 13 }}>
                  {m === "PIX" ? "Aprovação na hora" : "Crédito ou débito, parcele em até 6×"}
                </p>
              </button>
            ))}
          </div>

          {metodo === "PIX" ? (
            <div className="card rise" style={{ padding: 24, textAlign: "center" }}>
              <div
                aria-label="QR Code PIX"
                style={{
                  width: 160, height: 160, margin: "0 auto 14px",
                  background:
                    "repeating-conic-gradient(var(--ink) 0% 25%, var(--card) 0% 50%) 0 0 / 20px 20px",
                  borderRadius: 12, border: "6px solid var(--ink)",
                }}
              />
              <p style={{ fontWeight: 700 }}>Escaneie o QR Code</p>
              <p className="muted" style={{ fontSize: 13.5 }}>
                Chave: pedidofacil@pix.com.br · expira em 30 min
              </p>
            </div>
          ) : (
            <div className="card rise" style={{ padding: 24 }}>
              <div className="field">
                <label>Número do cartão</label>
                <input
                  value={numCartao} placeholder="0000 0000 0000 0000"
                  onChange={(e) => setNumCartao(e.target.value)}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label>Bandeira</label>
                  <select value={bandeira} onChange={(e) => setBandeira(e.target.value)}>
                    <option>Visa</option><option>Mastercard</option><option>Elo</option><option>Amex</option>
                  </select>
                </div>
                <div className="field">
                  <label>Tipo</label>
                  <select value={tipoCartao} onChange={(e) => setTipoCartao(e.target.value as "CREDITO" | "DEBITO")}>
                    <option value="CREDITO">Crédito</option>
                    <option value="DEBITO">Débito</option>
                  </select>
                </div>
                <div className="field">
                  <label>Parcelas</label>
                  <select
                    value={parcelas} disabled={tipoCartao === "DEBITO"}
                    onChange={(e) => setParcelas(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n}× de {formatBRL(total / n)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {erro && (
            <p style={{ color: "var(--error)", fontWeight: 600, marginTop: 14 }}>{erro}</p>
          )}
        </section>

        {/* Resumo */}
        <aside className="card rise d1" style={{ padding: 24, position: "sticky", top: 88 }}>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Resumo do pedido</h2>
          {itens.map((i) => (
            <div
              key={i.produto.codProduto}
              style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5, padding: "7px 0", borderBottom: "1px dashed var(--line)" }}
            >
              <span>{i.quantidade}× {i.produto.nome}</span>
              <span>{formatBRL(i.produto.preco * i.quantidade)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 17 }}>
            <strong>Total</strong>
            <strong className="price" style={{ fontSize: 22 }}>{formatBRL(total)}</strong>
          </div>
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 20 }} onClick={confirmar}>
            Confirmar pagamento
          </button>
          <Link href="/carrinho" className="btn btn-ghost" style={{ width: "100%", marginTop: 10 }}>
            ← Voltar ao carrinho
          </Link>
        </aside>
      </main>
    </>
  );
}
