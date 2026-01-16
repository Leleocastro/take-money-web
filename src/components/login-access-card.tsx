"use client";

import Link from "next/link";
import { useState } from "react";

import { LoginCodeVerification } from "@/components/login-code-verification";

export function LoginAccessCard() {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Digite seu email para receber o código.");
      return;
    }

    try {
      setIsSubmitting(true);
      const normalizedEmail = email.trim().toLowerCase();
      const response = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(
          payload?.message ?? "Não foi possível enviar o código."
        );
      }
      setInfo(
        payload?.message ??
          "Se o email existir em nossa base você receberá o código em instantes."
      );
      setEmail(normalizedEmail);
      setStep("verify");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não conseguimos enviar o código agora."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "verify" && email) {
    return (
      <LoginCodeVerification
        email={email}
        headline="Digite o código para entrar"
        description={
          info ?? "Enviamos seu código por email. Ele expira em alguns minutos."
        }
        onBack={() => setStep("request")}
      />
    );
  }

  return (
    <form
      onSubmit={handleRequest}
      className="rounded-3xl bg-white/90 shadow-lg ring-1 ring-slate-200 backdrop-blur px-6 py-8 sm:px-8"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-500">
        Acesso rápido
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">
        Digite seu email
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Vamos enviar um código de 6 dígitos para confirmar que você é o titular
        do cadastro.
      </p>

      <label className="mt-6 block text-sm font-medium text-slate-700">
        Email cadastrado
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@email.com"
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
        />
      </label>

      {error && (
        <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Enviando..." : "Receber código"}
      </button>

      <p className="mt-3 text-center text-xs text-slate-500">
        Não lembra o email? Faça um novo cadastro e atualize seus dados.
      </p>

      <Link
        href="/"
        className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
      >
        ← Voltar
      </Link>
    </form>
  );
}
