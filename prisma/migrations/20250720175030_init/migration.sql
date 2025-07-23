-- CreateTable
CREATE TABLE "Operador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Veiculo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "identificador" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Eletroposto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Recarga" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL,
    "inicio" DATETIME NOT NULL,
    "fim" DATETIME NOT NULL,
    "percentual_inicio" INTEGER NOT NULL,
    "percentual_final" INTEGER NOT NULL,
    "kwh" REAL NOT NULL,
    "km_inicial" REAL NOT NULL,
    "km_final" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "veiculoId" INTEGER NOT NULL,
    "operadorId" INTEGER NOT NULL,
    "eletropostoId" INTEGER NOT NULL,
    CONSTRAINT "Recarga_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Recarga_operadorId_fkey" FOREIGN KEY ("operadorId") REFERENCES "Operador" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Recarga_eletropostoId_fkey" FOREIGN KEY ("eletropostoId") REFERENCES "Eletroposto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Operador_nome_key" ON "Operador"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_identificador_key" ON "Veiculo"("identificador");

-- CreateIndex
CREATE UNIQUE INDEX "Eletroposto_nome_key" ON "Eletroposto"("nome");
