import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/eletropostos
export async function GET() {
  const eletropostos = await prisma.eletroposto.findMany({
    include: {
      recargas: true,
    },
  });
  return NextResponse.json(eletropostos);
}

// POST /api/eletropostos
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const novoEletroposto = await prisma.eletroposto.create({ data });
    return NextResponse.json(novoEletroposto);
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro ao criar eletroposto" },
      { status: 500 }
    );
  }
}
