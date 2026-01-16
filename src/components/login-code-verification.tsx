"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginCodeVerificationProps = {
  email: string;
  headline?: string;
  description?: string;
  onBack?: () => void;
};

export function LoginCodeVerification({
  email,
  headline = "Digite o código recebido",
  description = "Enviamos um código de 6 dígitos para o seu email.",
  onBack,
}: LoginCodeVerificationProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState(description);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!/^[0-9]{6}$/.test(code)) {
      setError("Digite os 6 dígitos do código.");
      return;
    }

    try {
      setIsVerifying(true);
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload?.message ?? "Não foi possível validar o código agora."
        );
      }

      setFeedback("Código confirmado! Redirecionando...");
      await router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código inválido.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    try {
      setIsResending(true);
      const response = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message ?? "Não conseguimos reenviar agora.");
      }
      setFeedback("Reenviamos um novo código. Confira seu email em instantes.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível reenviar o código."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form
      onSubmit={handleVerify}
      className="rounded-3xl bg-white/90 shadow-lg ring-1 ring-slate-200 backdrop-blur px-6 py-8 sm:px-8"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-500">
        Verificação
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{headline}</h2>
      <p className="mt-1 text-sm text-slate-500">
        {feedback} <br /> <span className="font-semibold">{email}</span>
      </p>

      <label className="mt-6 block text-sm font-medium text-slate-700">
        Código de 6 dígitos
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(event) =>
            setCode(event.target.value.replace(/[^0-9]/g, ""))
          }
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-2xl tracking-[0.3em] text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none"
          placeholder="000000"
        />
      </label>

      {error && (
        <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isVerifying}
        className="mt-6 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isVerifying ? "Validando..." : "Confirmar e acessar"}
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="font-semibold text-blue-600 disabled:text-slate-400"
        >
          {isResending ? "Reenviando..." : "Reenviar código"}
        </button>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="font-semibold text-slate-500"
          >
            Trocar email
          </button>
        )}
      </div>
    </form>
  );
}
