import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/eletropostos/:id
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const eletroposto = await prisma.eletroposto.findUnique({
    where: { id: Number(params.id) },
    include: { recargas: true },
  });

  if (!eletroposto) {
    return NextResponse.json(
      { erro: "Eletroposto não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(eletroposto);
}

// PUT /api/eletropostos/:id
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const eletropostoAtualizado = await prisma.eletroposto.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json(eletropostoAtualizado);
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro ao atualizar eletroposto" },
      { status: 500 }
    );
  }
}

// DELETE /api/eletropostos/:id
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.eletroposto.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ mensagem: "Eletroposto deletado com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro ao deletar eletroposto" },
      { status: 500 }
    );
  }
}
