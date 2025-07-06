# 🛒 E-commerce Platform with Admin Dashboard & Auth.js v5

Este é um projeto completo de E-commerce desenvolvido com **Next.js 15**, **Auth.js v5**, **Prisma ORM**, **TailwindCSS**, e diversos componentes avançados da **Radix UI**. O projeto inclui:

- 💼 Painel administrativo (Admin Dashboard)
- 🔐 Autenticação com Auth.js v5 e Prisma Adapter
- 🛍️ Catálogo de produtos com imagens
- 📦 Sistema de pedidos e estoque
- 💳 Integração com Stripe
- 🌘 Suporte a temas escuro/claro
- 📈 Dashboard com gráficos (Recharts)
- ☁️ Upload de imagens com Next Cloudinary

---

## 🚀 Tecnologias e Bibliotecas

- **Next.js 15**  
- **Auth.js v5**  
- **Prisma ORM** com PostgreSQL  
- **Tailwind CSS** + Tailwind Merge + Animate  
- **Radix UI** (componentes interativos e acessíveis)  
- **Stripe** (pagamentos online)  
- **Zod** (validação de formulários)  
- **React Hook Form**  
- **Recharts** (dashboard gráfico)  
- **Cloudinary** (upload e manipulação de imagens)  
- **Appwrite** (opcional para notificações, storage ou auth alternativa)  
- **Zustand** (gerenciamento de estado leve)

---

## 🧠 Funcionalidades Principais

### 👥 Autenticação
- Registro, login e logout com Auth.js v5
- Integração com banco via Prisma Adapter
- Suporte a múltiplos provedores (ex: OAuth, Email)

### 🛠️ Dashboard Administrativo
- Gerenciamento de produtos, categorias e estoque
- Visualização de pedidos e relatórios
- Interface construída com componentes Radix

### 🛍️ Loja Virtual
- Catálogo com busca e filtros
- Carrinho de compras
- Checkout com Stripe
- Histórico de pedidos

### 📊 Estatísticas
- Dashboard com gráficos de vendas, produtos e usuários
- Recharts integrados ao painel admin

---

## 🧪 Como Rodar o Projeto

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

<!-- ROADMAP -->
## Roadmap

- [x] Next configuration
- [x] Autenticação com Auth.js v5
- [x] Painel administrativo com CRUD de produtos
- [x] Integração com Stripe
- [x] Upload de imagens via Cloudinary
- [ ] Reviews e avaliações de produtos
- [ ] Funcionalidade de favoritos
- [IN PROGRESS] Email sender
    - [ ] Notificações por email com Resend


<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Developer - [Marcelo mazzonetto](https://www.linkedin.com/in/marcelo-mazzonetto-87214b233/) - projecta.contactt@gmail.com
Fone - +55(45)998405219

Project Link: [https://projecta.top/](https://projecta.top/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>




[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/DDANCING
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/marcelo-mazzonetto-87214b233/
