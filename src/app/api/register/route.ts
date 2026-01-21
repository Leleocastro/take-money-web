import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { generateReferralCode } from "@/lib/referral";
import { issueLoginCode } from "@/lib/auth";
import { sendLoginCodeEmail } from "@/lib/email";
import { registerLeadSchema } from "@/lib/validation";
import { getCookieValue } from "@/lib/server-cookies";

const sanitizePhone = (value: string) => value.replace(/[^0-9]/g, "");

const createUniqueReferralCode = async () => {
  let code = generateReferralCode();
  let retries = 0;

  while (retries < 5) {
    const existing = await prisma.user.findUnique({
      where: { referralCode: code },
    });
    if (!existing) return code;
    code = generateReferralCode();
    retries += 1;
  }

  throw new Error("Não foi possível gerar um código de indicação único.");
};

export async function POST(request: Request) {
  try {
    const fcmToken = getCookieValue(request, "fcmToken");
    const payload = await request.json();
    const parsed = registerLeadSchema.safeParse({
      ...payload,
      salary: Number(payload.salary),
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Revise os dados enviados.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { name, email, phone, workplace, salary, loanNeed, referrerCode } =
      parsed.data;
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = sanitizePhone(phone);
    const normalizedReferrer = referrerCode?.trim().toUpperCase();

    const existingByEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingByEmail) {
      if (!existingByEmail.isActive) {
        return NextResponse.json(
          {
            message:
              "Sua conta foi desativada. Entre em contato com o suporte para solicitar uma revisão.",
          },
          { status: 403 },
        );
      }

      const { code } = await issueLoginCode(existingByEmail.id, fcmToken);
      await sendLoginCodeEmail(normalizedEmail, code);

      return NextResponse.json({
        message:
          "Encontramos seu cadastro e enviamos um novo código para confirmar seu acesso.",
        email: normalizedEmail,
        requiresVerification: true,
      });
    }

    const existingByPhone = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });
    if (existingByPhone) {
      if (!existingByPhone.isActive) {
        return NextResponse.json(
          {
            message:
              "Já existe um cadastro desativado com esse telefone. Procure nosso suporte para recuperar o acesso.",
          },
          { status: 403 },
        );
      }
      return NextResponse.json(
        {
          message:
            "Já existe um cadastro com esse telefone. Use o email cadastrado para entrar.",
        },
        { status: 400 },
      );
    }

    const referralOwner = normalizedReferrer
      ? await prisma.user.findUnique({
          where: { referralCode: normalizedReferrer },
        })
      : null;

    const referralCode = await createUniqueReferralCode();

    const createdUser = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone: normalizedPhone,
        workplace,
        salary,
        loanNeed,
        referralCode,
        ...(fcmToken ? { fcmToken } : {}),
        ...(referralOwner && referralOwner.isActive
          ? { referredBy: { connect: { id: referralOwner.id } } }
          : {}),
      },
    });

    const { code } = await issueLoginCode(createdUser.id, fcmToken);
    await sendLoginCodeEmail(normalizedEmail, code);

    return NextResponse.json(
      {
        message:
          "Cadastro iniciado! Enviamos um código para confirmar seu email antes de liberar o painel.",
        email: normalizedEmail,
        requiresVerification: true,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          "Não foi possível concluir o cadastro. Tente novamente em instantes.",
      },
      { status: 500 },
    );
  }
}
