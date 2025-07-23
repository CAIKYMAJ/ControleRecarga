import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/operadores/[id] - Busca operador por ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const operador = await prisma.operador.findUnique({
    where: { id: Number(params.id) },
  });

  if (!operador) {
    return NextResponse.json(
      { error: "Operador não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(operador);
}

// PUT /api/operadores/[id] - Atualiza operador por ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const operador = await prisma.operador.update({
    where: { id: Number(params.id) },
    data: { nome: body.nome },
  });

  return NextResponse.json(operador);
}

// DELETE /api/operadores/[id] - Remove operador por ID
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.operador.delete({
    where: { id: Number(params.id) },
  });

  return NextResponse.json({ message: "Operador deletado com sucesso" });
}
