"use client";

import { useState } from "react";
import Link from "next/link";
import { StoreHeader } from "@/components/StoreHeader";
import { ProductIcon } from "@/components/ProductIcon";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/api";
import { ShoppingBasket } from "lucide-react";

export default function CarrinhoPage() {
  const { itens, total, alterarQuantidade, remover } = useCart();
  const [erro, setErro] = useState<string | null>(null);

  function mudar(cod: number, qtd: number) {
    setErro(alterarQuantidade(cod, qtd));
  }

  return (
    <>
      <StoreHeader />
      <main className="container" style={{ padding: "40px 24px 80px", maxWidth: 880 }}>
        <h1 className="rise" style={{ fontSize: 32, marginBottom: 6 }}>Seu carrinho</h1>
        <p className="muted rise d1" style={{ marginBottom: 28 }}>
          Total = quantidade × preço unitário, calculado automaticamente.
        </p>

        {itens.length === 0 ? (
          <div className="card rise d1" style={{ padding: 48, textAlign: "center" }}>
            <ShoppingBasket size={44} color="var(--ink-faint)" strokeWidth={1.5} aria-hidden />

            <h2 style={{ fontSize: 22, margin: "10px 0 6px" }}>Carrinho vazio</h2>
            <p className="muted" style={{ marginBottom: 22 }}>Que tal dar uma olhada no cardápio?</p>
            <Link href="/" className="btn btn-primary">Ver cardápio</Link>
          </div>
        ) : (
          <>
            <div className="card rise d1" style={{ overflow: "hidden", marginBottom: 24 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Produto</th><th>Preço un.</th><th>Qtd.</th><th>Subtotal</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((i) => (
                    <tr key={i.produto.codProduto}>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                          <ProductIcon categoria={i.produto.categoria} size={20} />
                          <strong>{i.produto.nome}</strong>
                        </span>
                      </td>
                      <td>{formatBRL(i.produto.preco)}</td>
                      <td>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => mudar(i.produto.codProduto, i.quantidade - 1)}>−</button>
                          <strong>{i.quantidade}</strong>
                          <button className="btn btn-ghost btn-sm" onClick={() => mudar(i.produto.codProduto, i.quantidade + 1)}>+</button>
                        </div>
                      </td>
                      <td className="price">{formatBRL(i.produto.preco * i.quantidade)}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => remover(i.produto.codProduto)}>
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {erro && (
              <p className="rise" style={{ background: "var(--error-tint)", color: "var(--error)", padding: "10px 16px", borderRadius: "var(--radius-sm)", fontWeight: 600, marginBottom: 18 }}>
                {erro}
              </p>
            )}

            <div className="rise d2" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 18 }}>
                Total: <span className="price" style={{ fontSize: 26 }}>{formatBRL(total)}</span>
              </p>
              <Link href="/checkout" className="btn btn-primary">Fechar pedido →</Link>
            </div>
          </>
        )}
      </main>
    </>
  );
}
