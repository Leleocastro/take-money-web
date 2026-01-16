import { NextResponse } from "next/server";

import { prisma } from "./prisma";

const LOGIN_CODE_TTL_MINUTES = 15;

export const generateLoginCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export async function issueLoginCode(userId: string, fcmToken?: string | null) {
  const code = generateLoginCode();
  const expiresAt = new Date(Date.now() + LOGIN_CODE_TTL_MINUTES * 60 * 1000);

  await prisma.user.update({
    where: { id: userId },
    data: {
      loginCode: code,
      loginCodeExpires: expiresAt,
      ...(fcmToken ? { fcmToken } : {}),
    },
  });

  return { code, expiresAt };
}

export function setUserCodeCookie(
  response: NextResponse,
  code: string,
  isProduction: boolean
) {
  response.cookies.set("userCode", code, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

export function clearUserCodeCookie(
  response: NextResponse,
  isProduction: boolean
) {
  response.cookies.set("userCode", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
