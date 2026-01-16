import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code: rawCode } = await context.params;
    const code = rawCode.toUpperCase();
    const user = await prisma.user.findUnique({
      where: { referralCode: code },
      include: {
        referrals: {
          orderBy: { createdAt: "desc" },
          take: 25,
        },
        referredBy: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Código não encontrado." },
        { status: 404 }
      );
    }

    const origin = new URL(request.url).origin;
    const shareUrl = `${origin}/?ref=${user.referralCode}`;

    return NextResponse.json({
      user,
      shareUrl,
      stats: {
        totalReferrals: user.referrals.length,
        lastReferralAt: user.referrals[0]?.createdAt ?? null,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao buscar o usuário." },
      { status: 500 }
    );
  }
}
