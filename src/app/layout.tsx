import type { Metadata } from "next";
import { Fraunces, Albert_Sans } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
});

const albert = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "PedidoFácil — Pedidos sem complicação",
  description:
    "E-commerce e gestão para pequenos comércios e delivery: catálogo, pedidos, estoque e pagamentos em um só lugar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${fraunces.variable} ${albert.variable}`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
