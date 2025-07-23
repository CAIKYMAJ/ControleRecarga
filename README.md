# Controle de Recargas de Veículos

Aplicação web responsiva para controle de recargas elétricas de veículos. Permite iniciar e finalizar recargas, armazenar dados temporários, consultar registros e garantir rastreabilidade por operador, veículo e eletroposto.

## Tecnologias Utilizadas

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM**
- **SQLite** (banco local)
- **React Hook Form / Zod** (validação)
- **LocalStorage** (armazenamento temporário)

---

## Funcionalidades

### Tela Inicial (Login Operacional)
- Seleção do **operador**
- Seleção do **eletroposto**
- Exibe a **data atual automaticamente**
- Dados armazenados no **LocalStorage** para persistência temporária

---

### Tela de Início de Recarga
- Lista de **veículos cadastrados**
- Busca do **último Km_final** automaticamente
- Preenchimento do **Km_inicial** com base na última recarga
- Informar:
  - **Percentual da bateria (inicial)**
  - **Km atual (validação obrigatória)**
- Armazena a recarga com status **"Iniciado"**

---

### Tela de Finalização de Recarga
- Exibe apenas recargas com status **"Iniciado"** para o operador atual
- Captura automática da **data/hora da finalização**
- Permite informar:
  - **Percentual final da bateria**
  - **kWh consumido**
- Atualiza o registro com status **"Finalizado"**

---

## Modelagem da Base de Dados

A base foi modelada a partir de um `.csv` com dados não normalizados, separando as seguintes entidades:

- `Operador`
- `Eletroposto`
- `Veículo`
- `Recarga`

Relacional, com chave primária e estrangeira em todos os relacionamentos. (Ver `prisma/schema.prisma`)

---

## Estrutura do Projeto
### Entidades Modeladas (via Prisma)

```prisma
model Operador {
  id       Int       @id @default(autoincrement())
  nome     String    @unique
  recargas Recarga[]
}

model Veiculo {
  id       Int       @id @default(autoincrement())
  identificador String @unique
  recargas  Recarga[]
}

model Eletroposto {
  id       Int       @id @default(autoincrement())
  nome     String    @unique
  recargas Recarga[]
}

model Recarga {
  id                Int       @id @default(autoincrement())
  data              DateTime
  inicio            DateTime
  fim               DateTime?
  percentual_inicio Int
  percentual_final  Int
  kwh               Float
  km_inicial        Float?
  km_final          Float?
  status            String

  veiculo     Veiculo   @relation(fields: [veiculoId], references: [id])
  veiculoId   Int
  operador    Operador  @relation(fields: [operadorId], references: [id])
  operadorId  Int
  eletroposto Eletroposto @relation(fields: [eletropostoId], references: [id])
  eletropostoId Int
}
```

# Banco de Dados
#### - Aqui está meu script do meu BD utilizado para formar o banco:
```sql
CREATE TABLE Operador (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE
);

CREATE TABLE Veiculo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  identificador TEXT NOT NULL UNIQUE
);

CREATE TABLE Eletroposto (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE
);

CREATE TABLE Recarga (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data DATETIME NOT NULL,
  inicio DATETIME NOT NULL,
  fim DATETIME,
  percentual_inicio INTEGER NOT NULL,
  percentual_final INTEGER NOT NULL,
  kwh REAL NOT NULL,
  km_inicial REAL,
  km_final REAL,
  status TEXT NOT NULL,

  veiculoId INTEGER NOT NULL,
  operadorId INTEGER NOT NULL,
  eletropostoId INTEGER NOT NULL,

  FOREIGN KEY (veiculoId) REFERENCES Veiculo(id),
  FOREIGN KEY (operadorId) REFERENCES Operador(id),
  FOREIGN KEY (eletropostoId) REFERENCES Eletroposto(id)
);

```

# Organização do Projeto

```
controle-recarga/

├── app/                         # Diretório principal do App Router do Next.js
│   └── api/                     # Rotas de API (backend)
│       └── eletropostos/        # Endpoints relacionados aos eletropostos
│           └── [id]/            # Endpoint dinâmico (GET, PUT, DELETE por ID)
│               ├── route.ts     # Lida com uma única requisição de eletroposto
│           ├── route.ts         # Lida com requisições gerais (GET/POST)
│       └── operadores/          # Endpoints relacionados aos operadores
│           └── [id]/            
│               ├── route.ts     # Lida com uma única requisição de operador
│           ├── route.ts         # Lida com requisições gerais (GET/POST)
│       └── recargas/            # Endpoints de controle de recargas
│           └── [id]/            
│               ├── route.ts     # Lida com recargas por ID
│           └── finalizar/       
│               ├── route.ts     # Finaliza uma recarga (PUT ou PATCH)
│           └── iniciadas/       
│               ├── route.ts     # Lista recargas com status "iniciado"
│           └── ultimo/          
│               ├── route.ts     # Busca o último registro de recarga de um veículo
│           ├── route.ts         # Lida com requisições gerais de recarga
│       └── veiculos/            # Endpoints relacionados aos veículos (provavelmente com arquivos em desenvolvimento)
│
│   └── recarga/                 # Página da funcionalidade principal de recarga
│       ├── page.tsx             # Página da tela de recarga (UI)
│   ├── favicon.ico              # Ícone da aba do navegador
│   ├── globals.css              # Estilos globais da aplicação
│   ├── layout.tsx               # Layout raiz da aplicação (usado por todas as páginas)
│   ├── page.tsx                 # Página inicial (tela de login)
│
├── components/                 
│   ├── Recarga.tsx              # Componente React da tela de recarga
│
├── lib/                         
│   ├── prisma.ts                # Instância do cliente Prisma para acesso ao banco
│
├── prisma/
│   └── migrations/              # Histórico das migrações do banco de dados
│   ├── dev.db                   # Banco de dados SQLite local
│   ├── schema.prisma            # Definição dos modelos do banco de dados
│   ├── seed.ts                  # Script para popular dados iniciais no banco
│
├── .env                         # Arquivo de variáveis de ambiente
├── .gitignore                   # Ignora arquivos/pastas no controle de versão (Git)
├── base_inicial.csv             # Arquivo original com os dados não normalizados
├── eslint.config.mjs            # Configurações do ESLint para análise de código
├── next-env.d.ts                # Tipagens automáticas do Next.js para TypeScript
├── next.config.ts               # Arquivo de configuração do Next.js
├── package-lock.json            # Arquivo de travamento de versões do npm
├── package.json                 # Dependências e scripts do projeto
├── postcss.config.mjs           # Configuração do PostCSS
├── README.md                    # Documentação principal do projeto
├── tailwind.config.ts           # Configuração do Tailwind CSS
├── tsconfig.json                # Configurações do compilador TypeScript
```
---
# Instalação e Execução
## 1. Clone o repositório do Git Hub:
```bash
git clone https://github.com/seu-usuario/controle-recarga.git
cd controle-carga
```
## 2. Instale as dependências
#### - Para instalar todas as dependências do projeto, basta colocar esse comando no terminal:
```bash
npm install
```
## 3. Configure o ambiente
#### - Crie um arquivo chamado `.env` na raiz do projeto e coloque isso nele:
```bash
DATABASE_URL="file:./dev.db"
```
## 4. Rode as migrações e o seed.ts
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```
#### - Se quiser popular o banco de dados prisma, com os dados do arquivo CSV, basta usar esse comando:
```bash
npx tsx prisma/seed.ts
```
#### - Para rodar o banco de dados Prisma, basta rodar o:
```bash
npx prisma studio
```
## 5. Inicie o projeto
#### - Para rodar o projeto, basta usar este comando no terminal e entrar no navegador e digitar `http://localhost:3000`:
```bash
npm run dev
```
---
# Instruções para Deploy
## Irei ensinar fazendo deploy na `Vercel`
#### 1. Suba o projeto para o seu GitHub;
#### 2. Acesso o site da `Vercel`: https://vercel.com/import;
#### 3. Conecte com sua conta do Git Hub;
#### 4. Selecione o repositório que você deseja subir, no caso `controle-carga`;
```bash
Importante: O Banco de Dados que utilizei foi o SQLite, que é um banco local e funciona apenas durante a construção inicial do projeto. Para um ambiente em produção, é melhor usar PostgreSQL, MySQL e etc. Se for um banco remoto, atualize a variável DATABASE_URL no .env.
```
#### 5. Configurar os comandos de `Build`, pois na `Vercel`, ela detecta de maneira automática quando o projeto é em Next.js, mas utilize esse comandos para tudo ir bem:
```bash
npm run build
npm install
.next
```
#### 6. Última parte, agora é só fazer o `Deploy` e aguardar o build ser finalizado. Após isso, só pegar o link que eles disponibilizam e você verá sua aplicação online.
# Checklist de tudo que foi pedido
## Tudo que foi feito e entregue
```
- Modelagem do Banco de Dados (diagrama + script SQL);
- Aplicação Web Responsiva (Mobile), usando Next.js e Tailwind;
- Documentação do código e instruções de deploy;
- Código-font em repositório (Git Hub).