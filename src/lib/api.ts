import { Cliente, Pedido, Produto } from "./types";
import { clientesMock, pedidosMock, produtosMock } from "./mock";

/**
 * Camada de acesso à API Spring Boot.
 *
 * Endpoints esperados no back-end (padrão REST do Spring):
 *   GET/POST        /api/clientes
 *   GET/POST/PUT    /api/produtos
 *   GET/POST        /api/pedidos
 *   POST            /api/pedidos/{id}/itens
 *   POST            /api/pedidos/{id}/pagamentos
 *
 * Enquanto o back não estiver no ar, as funções caem nos dados mock,
 * permitindo desenvolver e demonstrar o front de forma independente.
 */
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function tryFetch<T>(path: string, fallback: T, init?: RequestInit): Promise<T> {
  if (!BASE) return fallback;
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const api = {
  listarProdutos: () => tryFetch<Produto[]>("/api/produtos", produtosMock),
  listarClientes: () => tryFetch<Cliente[]>("/api/clientes", clientesMock),
  listarPedidos: () => tryFetch<Pedido[]>("/api/pedidos", pedidosMock),
  buscarPedido: (id: number) =>
    tryFetch<Pedido | undefined>(
      `/api/pedidos/${id}`,
      pedidosMock.find((p) => p.idPedido === id)
    ),
};

// ---- Validações das estórias de usuário (Levantamento de Requisitos) ----

/** Estória 1: email deve conter "@" */
export function validarEmail(email: string): string | null {
  if (!email.includes("@")) return "O e-mail deve conter \"@\".";
  return null;
}

/** Estória 1: senha mínimo 8 caracteres e ao menos um número */
export function validarSenha(senha: string): string | null {
  if (senha.length < 8) return "A senha deve ter no mínimo 8 caracteres.";
  if (!/\d/.test(senha)) return "A senha deve possuir ao menos um número.";
  return null;
}

/** Estória 2: preço obrigatoriamente positivo */
export function validarPreco(preco: number): string | null {
  if (!(preco > 0)) return "O preço deve ser obrigatoriamente positivo.";
  return null;
}

/** Estória 2: estoque inicial não pode ser negativo */
export function validarEstoque(estoque: number): string | null {
  if (estoque < 0) return "O estoque não pode ser negativo.";
  return null;
}

/** Estória 3: validar estoque antes de confirmar o item */
export function validarItem(produto: Produto, quantidade: number): string | null {
  if (quantidade <= 0) return "Quantidade deve ser maior que zero.";
  if (quantidade > produto.estoque)
    return `Estoque insuficiente: restam ${produto.estoque} un. de ${produto.nome}.`;
  return null;
}

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
