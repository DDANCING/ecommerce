# Plataforma de E-commerce Full-Stack

Este é um projeto de e-commerce completo, construído com as tecnologias mais modernas do ecossistema JavaScript. A aplicação é dividida em duas partes principais: uma loja virtual para os clientes e um painel de administração para gerenciamento.

## Funcionalidades

### Loja (Storefront)
- **Navegação e Visualização de Produtos**: Explore produtos por categorias, preços e mais.
- **Busca Avançada**: Encontre produtos facilmente com uma busca rápida e eficiente.
- **Carrinho de Compras**: Adicione, remova e gerencie produtos no carrinho.
- **Autenticação de Usuário**: Sistema completo de login, registro e recuperação de senha.
- **Checkout Seguro**: Integração com Stripe para processamento de pagamentos.
- **Design Responsivo**: Experiência de usuário otimizada para desktops, tablets e celulares.

### Painel de Administração (Dashboard)
- **Gerenciamento de Loja**: Crie e gerencie múltiplas lojas a partir de um único painel.
- **Gerenciamento de Produtos**: Adicione, edite e remova produtos, incluindo imagens, preços e estoque.
- **Gerenciamento de Categorias**: Organize produtos em categorias personalizadas.
- **Gerenciamento de "Billboards"**: Destaque promoções e categorias na página inicial.
- **Visualização de Pedidos**: Acompanhe todos os pedidos realizados na loja.
- **Análises e Gráficos**: Visualize a receita, vendas e outros dados importantes em gráficos interativos.
- **API Segura**: Endpoints de API para gerenciar os recursos da loja.

## Tecnologias Utilizadas

- **Framework**: [Next.js](https://nextjs.org/) (com App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Autenticação**: [NextAuth.js](https://next-auth.js.org/)
- **UI**: [Tailwind CSS](https://tailwindcss.com/) e [shadcn/ui](https://ui.shadcn.com/)
- **Pagamentos**: [Stripe](https://stripe.com/)
- **Validação de Formulários e Esquemas**: [Zod](https://zod.dev/)
- **Gerenciador de Pacotes**: [Bun](https://bun.sh/)

## Como Começar

Siga as instruções abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [Bun](https://bun.sh/)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    ```

2.  **Instale as dependências:**
    ```bash
    bun install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto, copiando o exemplo de `.env.example` (se existir) ou usando as variáveis abaixo.

4.  **Execute as migrações do banco de dados:**
    Isso irá criar as tabelas no seu banco de dados com base no schema do Prisma.
    ```bash
    bunx prisma db push
    ```

5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    bun dev
    ```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Variáveis de Ambiente

Para que a aplicação funcione corretamente, você precisa configurar as seguintes variáveis no seu arquivo `.env`:

```env
# URL do Banco de Dados (Ex: PostgreSQL, MySQL, etc.)
# Usado pelo Prisma para conectar ao banco.
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# URL da sua aplicação, usado pelo NextAuth.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Segredo para o NextAuth.js. Gere um com `openssl rand -base64 32`
NEXTAUTH_SECRET="seu-segredo-aqui"
NEXTAUTH_URL="http://localhost:3000/api/auth"

# Chaves da API do Stripe
STRIPE_API_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# (Opcional) Configuração para envio de emails (ex: Resend)
RESEND_API_KEY="seu-api-key"
```

## Estrutura do Projeto

- **/app**: Contém as rotas, layouts e páginas da aplicação (usando o App Router do Next.js).
- **/actions**: Funções server-side (Server Actions) para mutações de dados.
- **/components**: Componentes React reutilizáveis, incluindo componentes de UI da `shadcn/ui`.
- **/lib**: Funções utilitárias, configuração de clientes (Stripe, Prisma) e lógica de autenticação.
- **/prisma**: Schema do banco de dados (`schema.prisma`) e migrações.
- **/hooks**: Hooks React customizados para lógica de estado e outras funcionalidades.
- **/schemas**: Esquemas de validação com Zod.