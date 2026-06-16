"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, formatBRL } from "@/lib/api";
import { Produto } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { StoreHeader } from "@/components/StoreHeader";
import { ProductIcon } from "@/components/ProductIcon";
import { ChefHat } from "lucide-react";

export default function VitrinePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categoria, setCategoria] = useState<string>("Todos");
  const [toast, setToast] = useState<{ msg: string; erro: boolean } | null>(null);
  const { adicionar } = useCart();
  const router = useRouter();

  useEffect(() => {
    const usuarioLogado = localStorage.getItem("token_pedido_facil");
    
    if (!usuarioLogado) {
      router.push("/login");
    } else {
      api.listarProdutos().then(setProdutos);
    }
  }, [router]);

  const categorias = useMemo(
    () => ["Todos", ...Array.from(new Set(produtos.map((p) => p.categoria ?? "Outros")))],
    [produtos]
  );

  const visiveis = produtos.filter(
    (p) => categoria === "Todos" || p.categoria === categoria
  );

  function handleAdd(p: Produto) {
    const erro = adicionar(p);
    setToast(erro ? { msg: erro, erro: true } : { msg: `${p.nome} no carrinho!`, erro: false });
    setTimeout(() => setToast(null), 2600);
  }

  return (
    <>
      <StoreHeader />

      <section
        style={{
          background: "linear-gradient(135deg, var(--ink) 0%, #3a2014 70%, #4a2410 100%)",
          color: "var(--paper)",
          overflow: "hidden",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid", gridTemplateColumns: "1.2fr 0.8fr",
            alignItems: "center", gap: 32, padding: "72px 24px",
          }}
        >
          <div>
            <p
              className="rise"
              style={{
                color: "var(--gold)", fontWeight: 700, fontSize: 13,
                textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 14,
              }}
            >
              Aberto agora · entrega rápida
            </p>
            <h1 className="rise d1" style={{ fontSize: "clamp(38px, 5.5vw, 58px)" }}>
              Pedir ficou{" "}
              <em style={{ color: "var(--brand)", fontStyle: "italic" }}>fácil</em>.
              <br />
              Comer, melhor ainda.
            </h1>
            <p className="rise d2" style={{ marginTop: 16, fontSize: 17, color: "#d9c9bb", maxWidth: 440 }}>
              Catálogo sempre atualizado, estoque em tempo real e pagamento por
              PIX ou cartão — do pedido à entrega sem complicação.
            </p>
            <div className="rise d3" style={{ marginTop: 28, display: "flex", gap: 12 }}>
              <a href="#cardapio" className="btn btn-primary">Ver cardápio ↓</a>
              <a href="/meus-pedidos" className="btn btn-ghost" style={{ color: "var(--paper)", borderColor: "#5d4a3e" }}>
                Acompanhar pedido
              </a>
            </div>
          </div>
          <div
            className="rise d2"
            aria-hidden
            style={{
              display: "grid", placeItems: "center",
              filter: "drop-shadow(0 24px 32px rgba(0,0,0,0.45))",
              transform: "rotate(-6deg)",
            }}
          >
            <ChefHat size={150} color="var(--brand)" strokeWidth={1.2} />
          </div>
        </div>
      </section>

      <main id="cardapio" className="container" style={{ padding: "48px 24px 80px" }}>
        <h2 className="rise" style={{ fontSize: 30, marginBottom: 6 }}>Cardápio</h2>
        <p className="muted rise d1" style={{ marginBottom: 24 }}>
          Estoque validado na hora — sem surpresas no checkout.
        </p>

        <div className="rise d1" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              className="btn btn-sm"
              style={{
                background: c === categoria ? "var(--ink)" : "var(--card)",
                color: c === categoria ? "var(--paper)" : "var(--ink-soft)",
                border: "1.5px solid var(--line)",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {visiveis.map((p, i) => {
            const esgotado = p.estoque === 0;
            const pouco = p.estoque > 0 && p.estoque < 10;
            return (
              <article
                key={p.codProduto}
                className={`card rise d${Math.min(i % 6 + 1, 6)}`}
                style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10, opacity: esgotado ? 0.6 : 1 }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 140,
                    borderRadius: 12,
                    background: "var(--brand-tint)",
                    overflow: "hidden",
                    display: "grid",
                    placeItems: p.imagem ? "stretch" : "center",
                  }}
                >
                  {p.imagem ? (
                    <img 
                      src={p.imagem} 
                      alt={p.nome}
                      className="produto-img"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    <ProductIcon categoria={p.categoria} size={32} />
                  )}
                </div>

                <div>
                  <p className="faint" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                    {p.categoria}
                  </p>
                  <h3 style={{ fontSize: 19 }}>{p.nome}</h3>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <span className="price" style={{ fontSize: 19 }}>{formatBRL(p.preco)}</span>
                  {esgotado ? (
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--error)" }}>Esgotado</span>
                  ) : pouco ? (
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)" }}>
                      Últimas {p.estoque} un.
                    </span>
                  ) : (
                    <span className="faint" style={{ fontSize: 12 }}>{p.estoque} em estoque</span>
                  )}
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={esgotado}
                  onClick={() => handleAdd(p)}
                  style={{ marginTop: "auto" }}
                >
                  Adicionar +
                </button>
              </article>
            );
          })}
        </div>
      </main>

      {toast && (
        <div
          role="status"
          className="rise"
          style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            background: toast.erro ? "var(--error)" : "var(--ink)",
            color: "#fff", padding: "12px 22px", borderRadius: 999,
            fontWeight: 600, fontSize: 14, boxShadow: "var(--shadow-lift)", zIndex: 100,
          }}
        >
          {toast.msg}
        </div>
      )}

      <style>{`
        .produto-img {
          transition: transform 0.3s ease;
        }
        .card:hover .produto-img {
          transform: scale(1.08);
        }
      `}</style>

      <footer style={{ borderTop: "1px solid var(--line)", padding: "28px 0", textAlign: "center" }}>
        <p className="faint" style={{ fontSize: 13 }}>
          PedidoFácil © 2026 — Projeto de Banco de Dados Aplicado & POO
        </p>
      </footer>
    </>
  );
}