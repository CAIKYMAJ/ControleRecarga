import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/veiculos
export async function GET() {
  const veiculos = await prisma.veiculo.findMany({
    include: {
      recargas: {
        include: {
          operador: true,
        },
      },
    },
  });
  return NextResponse.json(veiculos);
}

// POST /api/veiculos
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const novoVeiculo = await prisma.veiculo.create({ data });
    return NextResponse.json(novoVeiculo);
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro ao criar veículo" },
      { status: 500 }
    );
  }
}
