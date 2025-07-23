import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/operadores - Lista todos os operadores
export async function GET() {
  const operadores = await prisma.operador.findMany();
  return NextResponse.json(operadores);
}

// POST /api/operadores - Cria um novo operador
export async function POST(request: Request) {
  const body = await request.json();
  const operador = await prisma.operador.create({
    data: {
      nome: body.nome,
    },
  });
  return NextResponse.json(operador, { status: 201 });
}
