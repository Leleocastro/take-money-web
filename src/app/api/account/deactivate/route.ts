import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { clearUserCodeCookie } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const referralCode = cookieStore.get("userCode")?.value;

    if (!referralCode) {
      return NextResponse.json(
        { message: "Faça login para gerenciar sua conta." },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { referralCode },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Conta não encontrada." },
        { status: 404 },
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: "Esta conta já está desativada." },
        { status: 400 },
      );
    }

    const now = new Date();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: false,
        deactivatedAt: now,
        loginCode: null,
        loginCodeExpires: null,
        fcmToken: null,
      },
    });

    const isProduction = process.env.NODE_ENV === "production";
    const response = NextResponse.json({
      message:
        "Conta desativada. Seus dados permanecem armazenados para fins legais e de auditoria.",
      deactivatedAt: now.toISOString(),
    });

    return clearUserCodeCookie(response, isProduction);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Não conseguimos desativar sua conta agora. Tente novamente.",
      },
      { status: 500 },
    );
  }
}
