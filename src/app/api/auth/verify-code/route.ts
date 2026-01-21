import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { setUserCodeCookie } from "@/lib/auth";
import { verifyLoginCodeSchema } from "@/lib/validation";
import { getCookieValue } from "@/lib/server-cookies";

export async function POST(request: Request) {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    const fcmToken = getCookieValue(request, "fcmToken");
    const payload = await request.json();
    const parsed = verifyLoginCodeSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Código inválido.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { email, code } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.loginCode || user.loginCode !== code) {
      return NextResponse.json(
        { message: "Código incorreto. Gere um novo e tente novamente." },
        { status: 400 },
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          message:
            "Esta conta foi desativada e não pode mais acessar o painel. Entre em contato com o suporte.",
        },
        { status: 403 },
      );
    }

    if (user.loginCodeExpires && user.loginCodeExpires < new Date()) {
      return NextResponse.json(
        { message: "Esse código expirou. Solicite um novo para continuar." },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        loginCode: null,
        loginCodeExpires: null,
        emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
        ...(fcmToken ? { fcmToken } : {}),
      },
    });

    const origin = new URL(request.url).origin;
    const response = NextResponse.json({
      referralCode: updatedUser.referralCode,
      shareUrl: `${origin}/?ref=${updatedUser.referralCode}`,
    });

    return setUserCodeCookie(response, updatedUser.referralCode, isProduction);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Não foi possível confirmar o código agora. Tente novamente.",
      },
      { status: 500 },
    );
  }
}
