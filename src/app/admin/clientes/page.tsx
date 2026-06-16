"use client";

import { useEffect, useState } from "react";
import { api, validarEmail, validarSenha } from "@/lib/api";
import { Cliente } from "@/lib/types";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<{ nome?: string; email?: string; senha?: string; geral?: string }>({});
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    api.listarClientes().then(setClientes);
  }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    const novos = {
      nome: nome.trim() ? undefined : "O nome é obrigatório.",
      email:
        validarEmail(email) ??
        (clientes.some((c) => c.email === email) ? "Este e-mail já está cadastrado." : undefined),
      senha: validarSenha(senha) ?? undefined,
    };
    setErros(novos);
    if (novos.nome || novos.email || novos.senha) return;

    setCarregando(true);
    try {
      const novo = await api.criarCliente(nome, email, senha);
      if (novo) setClientes((prev) => [...prev, novo]);
      setNome(""); setEmail(""); setSenha(""); setAberto(false);
    } catch {
      setErros({ geral: "Erro ao cadastrar cliente. Tente novamente." });
    } finally {
      setCarregando(false);
    }
  }

  const visiveis = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <h1 className="rise" style={{ fontSize: 30 }}>Clientes</h1>
          <p className="muted rise d1">Cadastro centralizado com acesso seguro.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setAberto(true)}>+ Novo cliente</button>
      </header>

      <div className="field rise d1" style={{ maxWidth: 360 }}>
        <input placeholder="🔍 Buscar por nome ou e-mail…" value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      <div className="card rise d2" style={{ overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Nome</th><th>E-mail</th></tr>
          </thead>
          <tbody>
            {visiveis.map((c) => (
              <tr key={c.idCliente}>
                <td className="faint">#{c.idCliente}</td>
                <td style={{ fontWeight: 600 }}>{c.nome}</td>
                <td className="muted">{c.email}</td>
              </tr>
            ))}
            {visiveis.length === 0 && (
              <tr>
                <td colSpan={3} className="muted" style={{ textAlign: "center", padding: 32 }}>
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
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
            style={{ width: "100%", maxWidth: 420, padding: 32 }}
          >
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>Novo cliente</h2>

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
              <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Maria da Silva" />
              {erros.nome && <span className="field-error">{erros.nome}</span>}
            </div>
            <div className="field">
              <label>E-mail (único)</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="maria@exemplo.com" />
              {erros.email && <span className="field-error">{erros.email}</span>}
            </div>
            <div className="field">
              <label>Senha</label>
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Mín. 8 caracteres, com número" />
              {erros.senha && <span className="field-error">{erros.senha}</span>}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1, opacity: carregando ? 0.7 : 1 }}
                disabled={carregando}
              >
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