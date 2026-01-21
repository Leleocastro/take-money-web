import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { issueLoginCode } from "@/lib/auth";
import { sendLoginCodeEmail } from "@/lib/email";
import { requestLoginCodeSchema } from "@/lib/validation";
import { getCookieValue } from "@/lib/server-cookies";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const fcmToken = getCookieValue(request, "fcmToken");
    const parsed = requestLoginCodeSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Informe um email válido para receber o código.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const normalizedEmail = parsed.data.email;
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user && !user.isActive) {
      return NextResponse.json(
        {
          message:
            "Esta conta foi desativada. Fale com o suporte para solicitar uma nova análise.",
        },
        { status: 403 },
      );
    }

    if (user) {
      const { code } = await issueLoginCode(user.id, fcmToken);
      await sendLoginCodeEmail(normalizedEmail, code);
    }

    return NextResponse.json({
      message:
        "Se o email informado estiver cadastrado, enviamos um novo código.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          "Não conseguimos enviar o código agora. Tente de novo em instantes.",
      },
      { status: 500 },
    );
  }
}
