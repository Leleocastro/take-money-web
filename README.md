## Lead+ Créditos

Aplicação full-stack em Next.js App Router para geração de leads de empréstimo com fluxo de cadastro, compartilhamento de link personalizado e painel para acompanhar indicações aprovadas.

### Principais recursos

- **Formulário responsivo** com validação via `react-hook-form` + `zod` e campos para nome, telefone, local de trabalho, salário e necessidade de crédito.
- **API Routes + Prisma** para persistir usuários, gerar códigos de indicação únicos e associar quem indicou quem.
- **Login por código no email**: nenhum usuário precisa lembrar senha; basta informar o email e digitar o código de 6 dígitos enviado automaticamente.
- **Painel /dashboard** com cards de limite estimado, share panel com cópia/compartilhamento e lista de indicações mais recentes.
- **Design mobile-first** com Tailwind CSS 4, efeitos de gradiente e componentes em português.

### Stack

- Next.js 16 (App Router, TypeScript, React Compiler)
- Tailwind CSS 4, Geist font
- Prisma + PostgreSQL (`lead_referral_app`)
- React Hook Form, Zod, nanoid

## Como executar localmente

1. **Instale as dependências**

   ```bash
   npm install
   ```

2. **Prepare o banco e o Prisma Client**

   Certifique-se de que o PostgreSQL local está rodando e acessível com o usuário `meubilhete` no database `lead_referral_app` (já criado pelo projeto). Caso precise recriar:

   ```bash
   PGPASSWORD=meubilhete createdb -h localhost -p 5432 -U meubilhete lead_referral_app
   ```

   ```bash
   npx prisma migrate deploy
   # para atualizar o client, rode:
   # npx prisma generate
   ```

   O schema e as migrations ficam em `prisma/`. Tudo já está pronto para PostgreSQL, então nenhuma etapa adicional de seed é necessária.

3. **Execute o servidor de desenvolvimento**

   ```bash
   npm run dev
   ```

4. Acesse [http://localhost:3000](http://localhost:3000) para visualizar o fluxo de cadastro. Após se cadastrar você será redirecionado para `/dashboard?code=SEUCODIGO`.

### Scripts úteis

- `npm run dev` – desenvolvimento com HMR
- `npm run build` – build de produção
- `npm run start` – roda o build
- `npm run lint` – validação com ESLint

### Variáveis de ambiente

Configure o arquivo `.env` com a URL do banco PostgreSQL local (já incluída neste repositório):

```
DATABASE_URL="postgresql://meubilhete:meubilhete@localhost:5432/lead_referral_app"
```

Além do banco, configure as variáveis SMTP para o envio real de emails (exemplo com Mailtrap):

```
SMTP_HOST="sandbox.smtp.mailtrap.io"
SMTP_PORT="587"
SMTP_USER="seu_usuario"
SMTP_PASS="sua_senha"
EMAIL_FROM="Lead+ Créditos <no-reply@leadplus.app>"
```

### Estrutura

- `src/app/page.tsx` – landing + formulário de cadastro
- `src/app/acesso/page.tsx` – fluxo de “já tenho cadastro” para solicitar/validar o código
- `src/app/dashboard/page.tsx` – painel e lista de indicações (liberado após validar o email)
- `src/app/api/register` – endpoint de cadastro/indicação
- `src/app/api/auth/request-code` & `verify-code` – solicitam e validam o código enviado por email
- `src/lib` – Prisma client, validadores e formatadores
- `src/components` – formulário, painel de compartilhamento e lista de indicações

### Login e verificação por email

1. No cadastro, o usuário informa email + dados financeiros. Nenhum link é liberado até ele digitar o código enviado automaticamente.
2. Quem já tem cadastro acessa `/acesso`, informa o email e recebe um novo código de 6 dígitos para validar.
3. Após confirmar o código, um cookie seguro (`userCode`) é definido e o dashboard é liberado. Sem código válido, o painel permanece travado.

## Próximos passos sugeridos

- Conectar autenticação real caso seja necessário proteger o dashboard.
- Publicar em Vercel e configurar variáveis com `DATABASE_URL` apropriada.
