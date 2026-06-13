"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { validarEmail, validarSenha } from "@/lib/api";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<{ nome?: string; email?: string; senha?: string }>({});

  // Estória 1 — Cadastro de Cliente: nome obrigatório, e-mail com "@" e único,
  // senha mín. 8 com número (hash BCrypt fica no Spring Boot)
  function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    const novos = {
      nome: nome.trim() ? undefined : "O nome é obrigatório.",
      email: validarEmail(email) ?? undefined,
      senha: validarSenha(senha) ?? undefined,
    };
    setErros(novos);
    if (novos.nome || novos.email || novos.senha) return;
    router.push("/login");
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32 }}>
      <form onSubmit={cadastrar} className="card rise" style={{ width: "100%", maxWidth: 420, padding: 36 }}>
        <Link href="/" className="display" style={{ fontSize: 20 }}>
          PedidoFácil<span style={{ color: "var(--gold)" }}>.</span>
        </Link>
        <h1 style={{ fontSize: 28, margin: "18px 0 6px" }}>Criar conta</h1>
        <p className="muted" style={{ marginBottom: 26 }}>
          Leva menos de um minuto — e o primeiro pedido sai mais rápido ainda.
        </p>

        <div className="field">
          <label htmlFor="nome">Nome completo</label>
          <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Maria da Silva" />
          {erros.nome && <span className="field-error">{erros.nome}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" />
          {erros.email && <span className="field-error">{erros.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha" type="password" value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mín. 8 caracteres, ao menos 1 número"
          />
          {erros.senha && <span className="field-error">{erros.senha}</span>}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>
          Cadastrar
        </button>
        <p className="muted" style={{ marginTop: 18, fontSize: 14, textAlign: "center" }}>
          Já tem conta?{" "}
          <Link href="/login" style={{ color: "var(--brand)", fontWeight: 700 }}>Entrar</Link>
        </p>
      </form>
    </main>
  );
}
