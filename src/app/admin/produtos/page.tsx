"use client";

import { useEffect, useState } from "react";
import { api, formatBRL, validarEstoque, validarPreco } from "@/lib/api";
import { Produto } from "@/lib/types";
import { ProductIcon } from "@/components/ProductIcon";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [categoria, setCategoria] = useState("");
  const [erros, setErros] = useState<{ nome?: string; preco?: string; estoque?: string; geral?: string }>({});
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    api.listarProdutosAdmin().then(setProdutos);
  }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    const p = parseFloat(preco.replace(",", "."));
    const est = parseInt(estoque, 10);
    const novos = {
      nome: nome.trim() ? undefined : "O nome é obrigatório.",
      preco: isNaN(p) ? "Informe um preço." : validarPreco(p) ?? undefined,
      estoque: isNaN(est) ? "Informe o estoque." : validarEstoque(est) ?? undefined,
    };
    setErros(novos);
    if (novos.nome || novos.preco || novos.estoque) return;

    setCarregando(true);
    try {
      const novo = await api.criarProduto({ nome, preco: p, estoque: est, descricao: categoria });
      if (novo) setProdutos((prev) => [...prev, novo]);
      setNome(""); setPreco(""); setEstoque(""); setCategoria(""); setAberto(false);
    } catch {
      setErros({ geral: "Erro ao salvar produto. Verifique se o nome já existe." });
    } finally {
      setCarregando(false);
    }
  }

  async function ajustarEstoque(produto: Produto, delta: number) {
    const novoEstoque = Math.max(0, produto.estoque + delta);
    try {
      await api.atualizarProduto(produto.codProduto, {
        nome: produto.nome,
        preco: produto.preco,
        estoque: novoEstoque,
        descricao: produto.categoria,
      });
      setProdutos((prev) =>
        prev.map((p) => p.codProduto === produto.codProduto ? { ...p, estoque: novoEstoque } : p)
      );
    } catch {
      alert("Erro ao ajustar estoque.");
    }
  }

  async function desativar(id: number) {
    if (!confirm("Desativar este produto?")) return;
    try {
      await api.desativarProduto(id);
      setProdutos((prev) => prev.filter((p) => p.codProduto !== id));
    } catch {
      alert("Erro ao desativar produto.");
    }
  }

  return (
    <>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <h1 className="rise" style={{ fontSize: 30 }}>Produtos & Estoque</h1>
          <p className="muted rise d1">Controle dinâmico, validado no ato da venda.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setAberto(true)}>+ Novo produto</button>
      </header>

      <div className="card rise d1" style={{ overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr><th>Cód.</th><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Ajuste</th><th></th></tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.codProduto}>
                <td className="faint">#{p.codProduto}</td>
                <td style={{ fontWeight: 600 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    <ProductIcon categoria={p.categoria} size={19} /> {p.nome}
                  </span>
                </td>
                <td className="muted">{p.categoria}</td>
                <td className="price">{formatBRL(p.preco)}</td>
                <td>
                  <span style={{
                    fontWeight: 700,
                    color: p.estoque === 0 ? "var(--error)" : p.estoque < 10 ? "#b07d12" : "var(--basil)",
                  }}>
                    {p.estoque === 0 ? "Esgotado" : `${p.estoque} un.`}
                  </span>
                </td>
                <td>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => ajustarEstoque(p, -1)} disabled={p.estoque === 0}>−</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => ajustarEstoque(p, +1)}>+</button>
                  </div>
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm" style={{ color: "var(--error)" }} onClick={() => desativar(p.codProduto)}>
                    Desativar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {aberto && (
        <div
          onClick={() => setAberto(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(38,22,14,0.5)",
            display: "grid", placeItems: "center", zIndex: 100, backdropFilter: "blur(3px)",
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={salvar}
            className="card rise"
            style={{ width: "100%", maxWidth: 440, padding: 32 }}
          >
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>Novo produto</h2>

            {erros.geral && (
              <div style={{
                background: "#fee2e2", border: "1px solid #fca5a5",
                borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                color: "#dc2626", fontSize: 14,
              }}>
                {erros.geral}
              </div>
            )}

            <div className="field">
              <label>Nome</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Pizza Calabresa" />
              {erros.nome && <span className="field-error">{erros.nome}</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field">
                <label>Preço (R$)</label>
                <input value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="49,90" inputMode="decimal" />
                {erros.preco && <span className="field-error">{erros.preco}</span>}
              </div>
              <div className="field">
                <label>Estoque inicial</label>
                <input value={estoque} onChange={(e) => setEstoque(e.target.value)} placeholder="20" inputMode="numeric" />
                {erros.estoque && <span className="field-error">{erros.estoque}</span>}
              </div>
            </div>
            <div className="field">
              <label>Categoria</label>
              <input value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Pizzas" />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, opacity: carregando ? 0.7 : 1 }} disabled={carregando}>
                {carregando ? "Salvando..." : "Salvar"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setAberto(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}