import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/veiculos/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const veiculo = await prisma.veiculo.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        recargas: {
          include: {
            operador: true, // operador da recarga
          },
        },
      },
    });

    if (!veiculo) {
      return NextResponse.json(
        { erro: "Veículo não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(veiculo);
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro ao buscar veículo" },
      { status: 500 }
    );
  }
}

// PUT /api/veiculos/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const veiculoAtualizado = await prisma.veiculo.update({
      where: {
        id: parseInt(params.id),
      },
      data,
    });

    return NextResponse.json(veiculoAtualizado);
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro ao atualizar veículo" },
      { status: 500 }
    );
  }
}

// DELETE /api/veiculos/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.veiculo.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return NextResponse.json({ mensagem: "Veículo deletado com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro ao deletar veículo" },
      { status: 500 }
    );
  }
}
