// app/api/recargas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ou de onde estiver seu prisma.ts

// GET /api/recargas → listar todas as recargas
export async function GET() {
  const recargas = await prisma.recarga.findMany({
    include: {
      veiculo: true,
      operador: true,
      eletroposto: true,
    },
  });

  return NextResponse.json(recargas);
}

// POST /api/recargas → criar uma nova recarga
export async function POST(request: Request) {
  const data = await request.json();

  try {
    const novaRecarga = await prisma.recarga.create({
      data: {
        data: new Date(), // está pegando a data atual
        inicio: new Date(), // está pegando o início da recarga
        fim: data.fim ? new Date(data.fim) : new Date(),
        percentual_inicio: parseInt(data.percentual_inicio),
        percentual_final: 0,
        kwh: 0,
        km_inicial: data.km_inicial ? parseFloat(data.km_inicial) : null,
        km_final: 0,
        status: "Iniciado",
        veiculoId: parseInt(data.veiculoId),
        operadorId: parseInt(data.operadorId),
        eletropostoId: parseInt(data.eletropostoId),
      },
    });

    return NextResponse.json(novaRecarga, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar recarga:", error);
    return NextResponse.json(
      { erro: "Erro ao criar recarga", detalhes: error },
      { status: 500 }
    );
  }
}
