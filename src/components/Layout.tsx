import React from 'react';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.container}>
      {/* Aqui ficaria nossa Navbar, que aparecerá em todas as telas */}
      <header className={styles.header}>
        <h1 className={styles.title}>PedidoFácil</h1>
      </header>

      {/* Onde a mágica acontece: o conteúdo específico de cada página é injetado aqui */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};