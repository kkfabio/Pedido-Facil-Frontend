import { Cliente, Pedido, Produto } from "./types";
import { clientesMock, pedidosMock, produtosMock } from "./mock";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

// ---- Gerenciamento do token JWT ----

export function salvarToken(token: string) {
  localStorage.setItem("token", token);
}

export function obterToken(): string | null {
  return localStorage.getItem("token");
}

export function removerToken() {
  localStorage.removeItem("token");
}

// ---- Fetch com JWT ----

async function tryFetch<T>(path: string, fallback: T, init?: RequestInit): Promise<T> {
  if (!BASE) return fallback;
  try {
    const token = obterToken();
    const res = await fetch(`${BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...init,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

// ---- Mapeamentos entre backend e frontend ----

function mapCliente(c: any): Cliente {
  return {
    idCliente: c.id,
    nome: c.nome,
    email: c.email,
  };
}

function mapProduto(p: any): Produto {
  return {
    codProduto: p.id,
    nome: p.nome,
    preco: p.preco,
    estoque: p.estoque,
    categoria: p.categoria,
    imagem: p.imagem,
    emoji: p.emoji,
  };
}

function mapPedido(p: any): Pedido {
  return {
    idPedido: p.id,
    cliente: mapCliente(p.cliente ?? { id: p.clienteId, nome: p.clienteNome, email: "" }),
    itens: (p.itens ?? []).map((item: any) => ({
      produto: {
        codProduto: item.produtoId,
        nome: item.produtoNome,
        preco: item.precoUnitario,
        estoque: 0,
      },
      quantidade: item.quantidade,
      preco: item.precoUnitario,
    })),
    valorTotal: p.total,
    statusPedido: p.status,
    dataPedido: p.criadoEm,
    pagamentos: [],
  };
}

// ---- API ----

export const api = {
  // Auth
  login: async (email: string, senha: string) => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    if (!res.ok) throw new Error("Credenciais inválidas.");
    const data = await res.json();
    salvarToken(data.token);
    return data;
  },

  register: async (nome: string, email: string, senha: string) => {
    const res = await fetch(`${BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });
    if (!res.ok) throw new Error("Erro ao cadastrar.");
    return res.json();
  },

  // Clientes
  listarClientes: () =>
    tryFetch<any[]>("/api/clientes", clientesMock).then((data) =>
      Array.isArray(data) && data[0]?.id !== undefined
        ? data.map(mapCliente)
        : (data as Cliente[])
    ),

  criarCliente: (nome: string, email: string, senha: string) =>
    tryFetch<any>("/api/clientes", null, {
      method: "POST",
      body: JSON.stringify({ nome, email, senha }),
    }).then((data) => data && mapCliente(data)),

  // Produtos
  listarProdutos: () =>
    tryFetch<any[]>("/api/produtos", produtosMock).then((data) =>
      Array.isArray(data) && data[0]?.id !== undefined
        ? data.map(mapProduto)
        : (data as Produto[])
    ),

  listarProdutosAdmin: () =>
    tryFetch<any[]>("/api/produtos/admin", produtosMock).then((data) =>
      Array.isArray(data) && data[0]?.id !== undefined
        ? data.map(mapProduto)
        : (data as Produto[])
    ),

  criarProduto: (produto: { nome: string; descricao?: string; preco: number; estoque: number }) =>
    tryFetch<any>("/api/produtos", null, {
      method: "POST",
      body: JSON.stringify(produto),
    }).then((data) => data && mapProduto(data)),

  atualizarProduto: (id: number, produto: { nome: string; descricao?: string; preco: number; estoque: number }) =>
    tryFetch<any>(`/api/produtos/${id}`, null, {
      method: "PUT",
      body: JSON.stringify(produto),
    }).then((data) => data && mapProduto(data)),

  desativarProduto: (id: number) =>
    tryFetch<void>(`/api/produtos/${id}`, undefined, { method: "DELETE" }),

  // Pedidos
  listarPedidos: () =>
    tryFetch<any[]>("/api/pedidos", pedidosMock).then((data) =>
      Array.isArray(data) && data[0]?.id !== undefined
        ? data.map(mapPedido)
        : (data as Pedido[])
    ),

  listarPorCliente: (clienteId: number) =>
    tryFetch<any[]>(`/api/pedidos/cliente/${clienteId}`, pedidosMock).then((data) =>
      Array.isArray(data) && data[0]?.id !== undefined
        ? data.map(mapPedido)
        : (data as Pedido[])
    ),

  buscarPedido: (id: number) =>
    tryFetch<any>(`/api/pedidos/${id}`, pedidosMock.find((p) => p.idPedido === id)).then(
      (data) => data?.id !== undefined ? mapPedido(data) : (data as Pedido)
    ),

  criarPedido: (clienteId: number) =>
    tryFetch<any>(`/api/pedidos?clienteId=${clienteId}`, null, {
      method: "POST",
    }).then((data) => data && mapPedido(data)),

  adicionarItem: (pedidoId: number, produtoId: number, quantidade: number) =>
    tryFetch<any>(`/api/pedidos/${pedidoId}/itens`, null, {
      method: "POST",
      body: JSON.stringify({ produtoId, quantidade }),
    }),

  avancarStatus: (pedidoId: number) =>
    tryFetch<any>(`/api/pedidos/${pedidoId}/status`, null, { method: "PUT" }).then(
      (data) => data && mapPedido(data)
    ),

  // Pagamentos
  registrarPagamento: (pedidoId: number, pagamento: any) =>
    tryFetch<any>(`/api/pedidos/${pedidoId}/pagamentos`, null, {
      method: "POST",
      body: JSON.stringify(pagamento),
    }),

  buscarPagamento: (pedidoId: number) =>
    tryFetch<any>(`/api/pedidos/${pedidoId}/pagamentos`, null),
};

// ---- Validações ----

export function validarEmail(email: string): string | null {
  if (!email.includes("@")) return 'O e-mail deve conter "@".';
  return null;
}

export function validarSenha(senha: string): string | null {
  if (senha.length < 8) return "A senha deve ter no mínimo 8 caracteres.";
  if (!/\d/.test(senha)) return "A senha deve possuir ao menos um número.";
  return null;
}

export function validarPreco(preco: number): string | null {
  if (!(preco > 0)) return "O preço deve ser obrigatoriamente positivo.";
  return null;
}

export function validarEstoque(estoque: number): string | null {
  if (estoque < 0) return "O estoque não pode ser negativo.";
  return null;
}

export function validarItem(produto: Produto, quantidade: number): string | null {
  if (quantidade <= 0) return "Quantidade deve ser maior que zero.";
  if (quantidade > produto.estoque)
    return `Estoque insuficiente: restam ${produto.estoque} un. de ${produto.nome}.`;
  return null;
}

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });