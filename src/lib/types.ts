// Tipos espelhando o modelo conceitual do banco (CLIENTE, PRODUTO, PEDIDO, PAGAMENTO)

export type StatusPedido = "ABERTO" | "PAGO" | "ENVIADO";
export type StatusPagamento = "PENDENTE" | "APROVADO" | "RECUSADO";
export type MetodoPagamento = "CARTAO" | "PIX";

export interface Cliente {
  idCliente: number;
  nome: string;
  email: string;
}

export interface Produto {
  codProduto: number;
  nome: string;
  preco: number;
  estoque: number;
  /** Front-only: não existe no banco; usado para filtros e ícones */
  categoria?: string;
}

export interface ItemPedido {
  produto: Produto;
  quantidade: number;
  preco: number; // preço unitário no momento da venda
}

export interface Pagamento {
  idPagamento: number;
  metodo: MetodoPagamento;
  dataPagamento: string;
  statusPagamento: StatusPagamento;
  valorPago: number;
  // CARTAO
  bandeira?: string;
  qtdParcelas?: number;
  numCartao?: string;
  tipoCartao?: "CREDITO" | "DEBITO";
  // PIX
  chavePix?: string;
  qrCode?: string;
  dataLimitePagamento?: string;
}

export interface Pedido {
  idPedido: number;
  cliente: Cliente;
  itens: ItemPedido[];
  valorTotal: number;
  statusPedido: StatusPedido;
  dataPedido: string;
  pagamentos: Pagamento[];
}
