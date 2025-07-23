import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// app/api/recargas/finalizar/route.ts
// /api/recargas/finalizar
export async function PATCH(req: NextRequest) {
  const { idRecarga, percentual_final, fim, kwh, km_final } = await req.json();

  if (
    !idRecarga ||
    percentual_final === undefined ||
    !fim ||
    kwh === undefined ||
    km_final === undefined
  ) {
    return NextResponse.json(
      { erro: "Dados obrigatórios ausentes" },
      { status: 400 }
    );
  }

  try {
    const atualizada = await prisma.recarga.update({
      where: { id: Number(idRecarga) },
      data: {
        percentual_final,
        fim: new Date(fim),
        kwh,
        km_final,
        status: "Finalizado",
      },
    });

    return NextResponse.json(atualizada);
  } catch (error) {
    console.error("Erro ao finalizar recarga:", error);
    return NextResponse.json(
      { erro: "Erro ao finalizar", detalhes: String(error) },
      { status: 500 }
    );
  }
}
