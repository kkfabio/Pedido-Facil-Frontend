import { Cliente, Pedido, Produto } from "./types";

// Dados de demonstração — substituídos pela API Spring Boot via src/lib/api.ts

export const produtosMock: Produto[] = [
  { codProduto: 1, nome: "X-Brasa Artesanal", preco: 28.9, estoque: 42, categoria: "Lanches" },
  { codProduto: 2, nome: "Pizza Margherita", preco: 49.0, estoque: 18, categoria: "Pizzas", emoji: "🍕" },
  { codProduto: 3, nome: "Açaí 500ml", preco: 18.5, estoque: 60, categoria: "Sobremesas", emoji: "🍧" },
  { codProduto: 4, nome: "Combo Família", preco: 89.9, estoque: 9, categoria: "Combos", emoji: "🍱" },
  { codProduto: 5, nome: "Suco de Laranja 1L", preco: 12.0, estoque: 35, categoria: "Bebidas", emoji: "🍊" },
  { codProduto: 6, nome: "Batata Rústica", preco: 16.9, estoque: 0, categoria: "Acompanhamentos", emoji: "🍟" },
  { codProduto: 7, nome: "Wrap de Frango", preco: 24.5, estoque: 22, categoria: "Lanches", emoji: "🌯" },
  { codProduto: 8, nome: "Brownie da Casa", preco: 14.0, estoque: 27, categoria: "Sobremesas", emoji: "🍫" },
];

export const clientesMock: Cliente[] = [
  { idCliente: 1, nome: "Ana Beatriz Souza", email: "ana.souza@gmail.com" },
  { idCliente: 2, nome: "Carlos Mendes", email: "carlos.mendes@hotmail.com" },
  { idCliente: 3, nome: "Fernanda Lima", email: "fe.lima@outlook.com" },
  { idCliente: 4, nome: "João Pedro Alves", email: "jp.alves@gmail.com" },
];

export const pedidosMock: Pedido[] = [
  {
    idPedido: 1042,
    cliente: clientesMock[0],
    itens: [
      { produto: produtosMock[0], quantidade: 2, preco: 28.9 },
      { produto: produtosMock[4], quantidade: 1, preco: 12.0 },
    ],
    valorTotal: 69.8,
    statusPedido: "ABERTO",
    dataPedido: "2026-06-11T11:32:00",
    pagamentos: [],
  },
  {
    idPedido: 1041,
    cliente: clientesMock[1],
    itens: [{ produto: produtosMock[1], quantidade: 1, preco: 49.0 }],
    valorTotal: 49.0,
    statusPedido: "PAGO",
    dataPedido: "2026-06-11T10:05:00",
    pagamentos: [
      {
        idPagamento: 501,
        metodo: "PIX",
        dataPagamento: "2026-06-11T10:07:00",
        statusPagamento: "APROVADO",
        valorPago: 49.0,
        chavePix: "pedidofacil@pix.com.br",
        qrCode: "00020126580014BR.GOV.BCB.PIX",
        dataLimitePagamento: "2026-06-11T10:35:00",
      },
    ],
  },
  {
    idPedido: 1040,
    cliente: clientesMock[2],
    itens: [
      { produto: produtosMock[3], quantidade: 1, preco: 89.9 },
      { produto: produtosMock[7], quantidade: 2, preco: 14.0 },
    ],
    valorTotal: 117.9,
    statusPedido: "ENVIADO",
    dataPedido: "2026-06-10T19:48:00",
    pagamentos: [
      {
        idPagamento: 500,
        metodo: "CARTAO",
        dataPagamento: "2026-06-10T19:50:00",
        statusPagamento: "APROVADO",
        valorPago: 117.9,
        bandeira: "Visa",
        qtdParcelas: 2,
        numCartao: "**** 4412",
        tipoCartao: "CREDITO",
      },
    ],
  },
  {
    idPedido: 1039,
    cliente: clientesMock[3],
    itens: [{ produto: produtosMock[2], quantidade: 3, preco: 18.5 }],
    valorTotal: 55.5,
    statusPedido: "ENVIADO",
    dataPedido: "2026-06-10T15:12:00",
    pagamentos: [
      {
        idPagamento: 499,
        metodo: "PIX",
        dataPagamento: "2026-06-10T15:13:00",
        statusPagamento: "APROVADO",
        valorPago: 55.5,
        chavePix: "pedidofacil@pix.com.br",
      },
    ],
  },
];
