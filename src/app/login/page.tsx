"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, validarEmail, validarSenha } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<{ email?: string; senha?: string; geral?: string }>({});
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    const novos = {
      email: validarEmail(email) ?? undefined,
      senha: validarSenha(senha) ?? undefined,
    };
    setErros(novos);
    if (novos.email || novos.senha) return;

    setCarregando(true);
    try {
      const data = await api.login(email, senha);
      // token já salvo dentro de api.login()
      router.push(data.role === "ADMIN" ? "/admin" : "/");
    } catch {
      setErros({ geral: "E-mail ou senha incorretos." });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <aside
        style={{
          background: "linear-gradient(160deg, var(--brand) 0%, var(--brand-deep) 100%)",
          color: "#fff", display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: 48,
        }}
      >
        <Link href="/" className="display" style={{ fontSize: 24 }}>
          PedidoFácil<span style={{ color: "var(--gold)" }}>.</span>
        </Link>
        <div>
          <h1 className="rise" style={{ fontSize: "clamp(32px, 4vw, 46px)" }}>
            O balcão digital do seu negócio.
          </h1>
          <p className="rise d1" style={{ marginTop: 14, fontSize: 16, opacity: 0.85, maxWidth: 380 }}>
            Clientes, estoque, pedidos e pagamentos — tudo num só lugar,
            sem caderninho e sem erro de conta.
          </p>
        </div>
        <p style={{ fontSize: 13, opacity: 0.7 }}>© 2026 PedidoFácil</p>
      </aside>

      <section style={{ display: "grid", placeItems: "center", padding: 32 }}>
        <form onSubmit={entrar} className="rise" style={{ width: "100%", maxWidth: 380 }}>
          <h2 style={{ fontSize: 28, marginBottom: 6 }}>Bem-vindo de volta</h2>
          <p className="muted" style={{ marginBottom: 28 }}>
            Entre para acompanhar pedidos ou gerenciar sua loja.
          </p>

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
            <label htmlFor="email">E-mail</label>
            <input
              id="email" type="text" value={email} placeholder="voce@exemplo.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            {erros.email && <span className="field-error">{erros.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha" type="password" value={senha} placeholder="Mín. 8 caracteres, com número"
              onChange={(e) => setSenha(e.target.value)}
            />
            {erros.senha && <span className="field-error">{erros.senha}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 8, opacity: carregando ? 0.7 : 1 }}
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          <p className="muted" style={{ marginTop: 20, fontSize: 14, textAlign: "center" }}>
            Não tem conta?{" "}
            <Link href="/cadastro" style={{ color: "var(--brand)", fontWeight: 700 }}>
              Cadastre-se
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}