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