import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// app/api/recargas/iniciadas/route.ts
// /api/recargas/iniciadas?idOperador=xx
export async function GET(req: NextRequest) {
  const idOperador = req.nextUrl.searchParams.get("idOperador");

  if (!idOperador) {
    return NextResponse.json(
      { erro: "idOperador é obrigatório" },
      { status: 400 }
    );
  }

  const recargasIniciadas = await prisma.recarga.findMany({
    where: {
      operadorId: Number(idOperador),
      status: "Iniciado",
    },
    include: {
      veiculo: true,
      eletroposto: true,
    },
  });

  return NextResponse.json(recargasIniciadas);
}
