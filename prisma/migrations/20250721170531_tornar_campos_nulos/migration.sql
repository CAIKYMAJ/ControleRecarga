-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recarga" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME,
    "inicio" DATETIME,
    "fim" DATETIME,
    "percentual_inicio" INTEGER,
    "percentual_final" INTEGER,
    "kwh" REAL,
    "km_inicial" REAL,
    "km_final" REAL,
    "status" TEXT,
    "veiculoId" INTEGER NOT NULL,
    "operadorId" INTEGER NOT NULL,
    "eletropostoId" INTEGER NOT NULL,
    CONSTRAINT "Recarga_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Recarga_operadorId_fkey" FOREIGN KEY ("operadorId") REFERENCES "Operador" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Recarga_eletropostoId_fkey" FOREIGN KEY ("eletropostoId") REFERENCES "Eletroposto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Recarga" ("data", "eletropostoId", "fim", "id", "inicio", "km_final", "km_inicial", "kwh", "operadorId", "percentual_final", "percentual_inicio", "status", "veiculoId") SELECT "data", "eletropostoId", "fim", "id", "inicio", "km_final", "km_inicial", "kwh", "operadorId", "percentual_final", "percentual_inicio", "status", "veiculoId" FROM "Recarga";
DROP TABLE "Recarga";
ALTER TABLE "new_Recarga" RENAME TO "Recarga";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
