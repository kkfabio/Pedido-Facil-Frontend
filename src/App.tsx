import { Layout } from './components/Layout';
import { Button } from './components/Button';

function App() {
  return (
    <Layout>
      <h2>Bem-vindo ao sistema de gestão!</h2>
      <p style={{ margin: '1rem 0' }}>Selecione uma ação abaixo:</p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="primary">Novo Pedido</Button>
        <Button variant="secondary">Ver Estoque</Button>
      </div>
    </Layout>
  );
}

export default App;