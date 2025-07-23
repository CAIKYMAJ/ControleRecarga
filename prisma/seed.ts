import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  // 🔄 Limpa todas as tabelas
  await prisma.recarga.deleteMany({});
  await prisma.operador.deleteMany({});
  await prisma.eletroposto.deleteMany({});
  await prisma.veiculo.deleteMany({});

  // 📂 Lê o arquivo CSV
  const filePath = path.join(__dirname, "../base_inicial.csv");
  const content = fs.readFileSync(filePath, "utf-8");

  // Remove cabeçalho e divide em linhas
  const linhas = content.split("\n").slice(1);

  for (const [index, linha] of linhas.entries()) {
    if (!linha.trim()) continue;

    try {
      // Separa os campos pelo ;
      const [
        empresa,
        data,
        veiculoId,
        eletropostoNome,
        inicio,
        fim,
        percentualInicio,
        percentualFinal,
        kwhRaw,
        kmInicialRaw,
        kmFinalRaw,
        operadorNome,
        status,
      ] = linha.split(";").map((item) => item.trim());

      // Aqui vai criar as entidades relacionadas (Operador, Eletroposto, Veiculo e Recarga)
      const operador = await prisma.operador.upsert({
        where: { nome: operadorNome },
        update: {},
        create: { nome: operadorNome },
      });

      const eletroposto = await prisma.eletroposto.upsert({
        where: { nome: eletropostoNome },
        update: {},
        create: { nome: eletropostoNome },
      });

      const veiculo = await prisma.veiculo.upsert({
        where: { identificador: veiculoId },
        update: {},
        create: { identificador: veiculoId },
      });

      // Converte campos numéricos
      const kwh = parseFloat(kwhRaw.replace(",", "."));
      const kmInicial = parseFloat(kmInicialRaw.replace(",", "."));
      const kmFinal = parseFloat(kmFinalRaw.replace(",", "."));

      await prisma.recarga.create({
        data: {
          data: new Date(data.split("/").reverse().join("-")),
          inicio: new Date(inicio),
          fim: new Date(fim),
          percentual_inicio: parseInt(percentualInicio),
          percentual_final: parseInt(percentualFinal),
          kwh,
          km_inicial: kmInicial,
          km_final: kmFinal,
          status,
          operadorId: operador.id,
          eletropostoId: eletroposto.id,
          veiculoId: veiculo.id,
        },
      });
    } catch (error) {
      console.error(`Erro na linha ${index + 2}:`, linha);
      console.error(error);
    }
  }

  console.log("Importação concluída com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro geral:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
