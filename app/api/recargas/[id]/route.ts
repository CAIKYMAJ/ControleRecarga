// app/api/recargas/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Parametros = {
  params: { id: string };
};

// GET /api/recargas/:id → obter uma recarga específica
export async function GET(_: Request, { params }: Parametros) {
  const recarga = await prisma.recarga.findUnique({
    where: { id: Number(params.id) },
    include: {
      veiculo: true,
      operador: true,
      eletroposto: true,
    },
  });

  if (!recarga)
    return NextResponse.json({ erro: "Não encontrada" }, { status: 404 });

  return NextResponse.json(recarga);
}

// PUT /api/recargas/:id → atualizar uma recarga
export async function PUT(request: Request, { params }: Parametros) {
  const data = await request.json();

  try {
    const recargaAtualizada = await prisma.recarga.update({
      where: { id: Number(params.id) },
      data: {
        data: new Date(data.data),
        inicio: new Date(data.inicio),
        fim: new Date(data.fim),
        percentual_inicio: data.percentual_inicio,
        percentual_final: data.percentual_final,
        kwh: data.kwh,
        km_inicial: data.km_inicial,
        km_final: data.km_final,
        status: data.status,
        veiculoId: data.veiculoId,
        operadorId: data.operadorId,
        eletropostoId: data.eletropostoId,
      },
    });

    return NextResponse.json(recargaAtualizada);
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro ao atualizar", detalhes: error },
      { status: 500 }
    );
  }
}

// DELETE /api/recargas/:id → deletar uma recarga
export async function DELETE(_: Request, { params }: Parametros) {
  try {
    await prisma.recarga.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ mensagem: "Deletado com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro ao deletar", detalhes: error },
      { status: 500 }
    );
  }
}
