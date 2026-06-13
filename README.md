# PedidoFácil — Front-end (Next.js)

Front-end do sistema **PedidoFácil** (e-commerce e gestão para pequenos comércios e delivery), construído com **React + Next.js (App Router) + TypeScript**, preparado para consumir uma API **Spring Boot**.

## Como rodar

```bash
npm install
npm run dev        # http://localhost:3000
```

Para apontar ao back-end Spring Boot, crie `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Sem o back no ar, o app usa dados mock automaticamente (`src/lib/mock.ts`).

## Fluxo de telas

```
                          ┌─────────────┐
                          │   /login    │◄──── /cadastro
                          └──────┬──────┘
                 e-mail comum │  │ e-mail com "admin"
              ┌───────────────┘  └───────────────┐
              ▼                                  ▼
   VITRINE (cliente)                  PAINEL DE GESTÃO (lojista)
   ┌──────────────────┐               ┌──────────────────────────┐
   │ /        Cardápio │               │ /admin        Dashboard  │
   │   └► /carrinho    │               │ /admin/pedidos  Lista    │
   │        └► /checkout (PIX/Cartão)  │   └► /admin/pedidos/[id] │
   │ /meus-pedidos     │               │       (itens + pagamento,│
   │  (Aberto→Pago→    │               │        avançar status)   │
   │   Enviado)        │               │ /admin/produtos Estoque  │
   └──────────────────┘               │ /admin/clientes Cadastro │
                                      └──────────────────────────┘
```

## Cobertura dos requisitos

| Estória / requisito | Onde está |
|---|---|
| Cliente: e-mail com "@" e único, senha mín. 8 com número | `/cadastro`, `/login`, modal em `/admin/clientes` (`validarEmail`/`validarSenha` em `src/lib/api.ts`) |
| Produto: preço > 0, estoque inicial ≥ 0 | modal em `/admin/produtos` (`validarPreco`/`validarEstoque`) |
| Pedido: validar estoque antes de confirmar item | carrinho (`src/lib/cart.tsx` → `validarItem`) |
| Total = quantidade × preço unitário | carrinho/checkout, calculado automaticamente |
| Status Aberto → Pago → Enviado | timeline em `/meus-pedidos`, badges e botão de avanço em `/admin/pedidos/[id]` |
| Pagamento Cartão (bandeira, parcelas, tipo) e PIX (chave, QR, prazo) | `/checkout` e detalhe do pedido no admin |
| Responsivo, hash BCrypt | hash fica no Spring Boot; o front nunca armazena senha |

## Design system "Brasa"

Paleta redesenhada (esquema **complementar-dividido**, teoria das cores aplicada à temática food):

| Token | Cor | Papel |
|---|---|---|
| `--brand` | `#E4570F` laranja-queimado | Ação principal, marca (apetite/energia) |
| `--ink` | `#26160E` espresso | Texto, sidebar, ancoragem (contraste quente) |
| `--paper` | `#FAF4EA` papel-creme | Fundo (substitui o cinza frio anterior) |
| `--basil` | `#3E7C4F` verde manjericão | Preços, sucesso (complementar do laranja) |
| `--gold` | `#F2B33D` dourado | Acento pontual (alertas de estoque baixo) |
| Status | azul / verde / violeta | Aberto / Pago / Enviado (distinção imediata) |

Tipografia: **Fraunces** (display, editorial de cardápio) + **Albert Sans** (corpo), via `next/font`.

## Endpoints esperados no Spring Boot

```
GET/POST     /api/clientes
GET/POST/PUT /api/produtos
GET/POST     /api/pedidos
GET          /api/pedidos/{id}
POST         /api/pedidos/{id}/itens
POST         /api/pedidos/{id}/pagamentos
PUT          /api/pedidos/{id}/status
POST         /api/auth/login
```
