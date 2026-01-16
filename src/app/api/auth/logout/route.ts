import { NextResponse } from "next/server";

import { clearUserCodeCookie } from "@/lib/auth";

export async function POST() {
  const isProduction = process.env.NODE_ENV === "production";
  const response = NextResponse.json({ message: "Sessão encerrada." });
  return clearUserCodeCookie(response, isProduction);
}
