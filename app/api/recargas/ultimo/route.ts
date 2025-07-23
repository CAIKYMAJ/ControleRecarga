import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// app/api/recargas/ultimo/route.ts
// api/recargas/ultimo?idVeiculo=xx
export async function GET(req: NextRequest) {
  const idVeiculo = req.nextUrl.searchParams.get("idVeiculo");

  if (!idVeiculo) {
    return NextResponse.json(
      { erro: "idVeiculo é obrigatório" },
      { status: 400 }
    );
  }

  const ultimaRecarga = await prisma.recarga.findFirst({
    where: { veiculoId: Number(idVeiculo) },
    orderBy: { data: "desc" },
  });

  return NextResponse.json(ultimaRecarga);
}
