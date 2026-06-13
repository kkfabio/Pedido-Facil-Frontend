"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { Produto } from "./types";
import { validarItem } from "./api";

export interface CartItem {
  produto: Produto;
  quantidade: number;
}

interface CartContextValue {
  itens: CartItem[];
  total: number;
  adicionar: (produto: Produto, quantidade?: number) => string | null;
  alterarQuantidade: (codProduto: number, quantidade: number) => string | null;
  remover: (codProduto: number) => void;
  limpar: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<CartItem[]>([]);

  const adicionar = (produto: Produto, quantidade = 1): string | null => {
    const existente = itens.find((i) => i.produto.codProduto === produto.codProduto);
    const novaQtd = (existente?.quantidade ?? 0) + quantidade;
    // Estória 3: validar estoque antes de confirmar o item
    const erro = validarItem(produto, novaQtd);
    if (erro) return erro;
    setItens((prev) =>
      existente
        ? prev.map((i) =>
            i.produto.codProduto === produto.codProduto ? { ...i, quantidade: novaQtd } : i
          )
        : [...prev, { produto, quantidade }]
    );
    return null;
  };

  const alterarQuantidade = (codProduto: number, quantidade: number): string | null => {
    const item = itens.find((i) => i.produto.codProduto === codProduto);
    if (!item) return null;
    if (quantidade <= 0) {
      remover(codProduto);
      return null;
    }
    const erro = validarItem(item.produto, quantidade);
    if (erro) return erro;
    setItens((prev) =>
      prev.map((i) => (i.produto.codProduto === codProduto ? { ...i, quantidade } : i))
    );
    return null;
  };

  const remover = (codProduto: number) =>
    setItens((prev) => prev.filter((i) => i.produto.codProduto !== codProduto));

  const limpar = () => setItens([]);

  const total = useMemo(
    () => itens.reduce((acc, i) => acc + i.produto.preco * i.quantidade, 0),
    [itens]
  );

  return (
    <CartContext.Provider value={{ itens, total, adicionar, alterarQuantidade, remover, limpar }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
