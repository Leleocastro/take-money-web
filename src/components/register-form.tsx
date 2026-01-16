"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  loanNeedOptions,
  registerLeadSchema,
  type RegisterLeadInput,
} from "@/lib/validation";
import { formatCurrency } from "@/lib/formatters";
import { LoginCodeVerification } from "@/components/login-code-verification";

type RegisterFormProps = {
  referralCode?: string;
};

const currencyMarks = [500, 2000, 5000, 10000];

export function RegisterForm({ referralCode }: RegisterFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "verify">("form");
  const [verificationEmail, setVerificationEmail] = useState<string | null>(
    null
  );
  const [verificationMessage, setVerificationMessage] = useState<string | null>(
    null
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterLeadInput>({
    resolver: zodResolver(registerLeadSchema),
    defaultValues: {
      email: "",
      loanNeed: "PERSONAL",
      referrerCode: referralCode?.toUpperCase() ?? undefined,
    },
  });

  const isBusy = isSubmitting;

  const helperText = useMemo(() => {
    if (referralCode) {
      return `Você está usando o código ${referralCode.toUpperCase()}.`;
    }
    return "Cadastre-se em menos de 2 minutos e ative seu link de indicações.";
  }, [referralCode]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const normalizedEmail = values.email.trim().toLowerCase();
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, email: normalizedEmail }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(
          payload?.message ?? "Não foi possível concluir o cadastro."
        );
      }
      setVerificationEmail(payload?.email ?? normalizedEmail);
      setVerificationMessage(
        payload?.message ??
          "Enviamos um código para confirmar seu email e liberar o painel."
      );
      setStep("verify");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Erro inesperado."
      );
    }
  });

  if (step === "verify" && verificationEmail) {
    return (
      <LoginCodeVerification
        email={verificationEmail}
        headline="Confirme seu email"
        description={
          verificationMessage ??
          "Enviamos um código para o seu email. Digite para liberar o painel."
        }
        onBack={() => setStep("form")}
      />
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl bg-white/90 shadow-lg ring-1 ring-slate-200 backdrop-blur px-6 py-8 sm:px-8"
    >
      <input type="hidden" {...register("referrerCode")} />
      <div className="mb-6 space-y-1">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">
          Cadastro
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">Comece agora</h2>
        <p className="text-sm text-slate-500">{helperText}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Nome completo
          <input
            type="text"
            placeholder="Maria Ferreira"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            {...register("name")}
          />
          {errors.name && (
            <span className="mt-1 block text-xs text-red-500">
              {errors.name.message}
            </span>
          )}
        </label>

        <label className="text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            placeholder="voce@email.com"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            {...register("email")}
          />
          {errors.email && (
            <span className="mt-1 block text-xs text-red-500">
              {errors.email.message}
            </span>
          )}
        </label>

        <label className="text-sm font-medium text-slate-700">
          Telefone com DDD
          <input
            type="tel"
            placeholder="11988887777"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            {...register("phone")}
          />
          {errors.phone && (
            <span className="mt-1 block text-xs text-red-500">
              {errors.phone.message}
            </span>
          )}
        </label>

        <label className="text-sm font-medium text-slate-700">
          Onde você trabalha?
          <input
            type="text"
            placeholder="Empresa, cargo ou tipo de trabalho"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            {...register("workplace")}
          />
          {errors.workplace && (
            <span className="mt-1 block text-xs text-red-500">
              {errors.workplace.message}
            </span>
          )}
        </label>

        <label className="text-sm font-medium text-slate-700">
          Salário mensal (R$)
          <input
            type="number"
            placeholder="2500"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            {...register("salary", { valueAsNumber: true })}
          />
          {errors.salary && (
            <span className="mt-1 block text-xs text-red-500">
              {errors.salary.message}
            </span>
          )}
        </label>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-slate-700">
          Qual crédito você precisa agora?
        </p>
        <Controller
          control={control}
          name="loanNeed"
          render={({ field }) => (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {loanNeedOptions.map((option) => {
                const isActive = field.value === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`rounded-2xl border px-4 py-3 text-left text-sm shadow-sm transition hover:border-slate-400 ${
                      isActive
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                    onClick={() => field.onChange(option.value)}
                  >
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-xs text-slate-500">
                      {option.hint ?? "Receba uma análise personalizada."}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.loanNeed && (
          <span className="mt-1 block text-xs text-red-500">
            {errors.loanNeed.message}
          </span>
        )}
      </div>

      <div className="mt-4 rounded-2xl bg-slate-900/90 px-4 py-3 text-white">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-400">
          Estimativa
        </p>
        <p className="text-lg font-semibold">
          {formatCurrency(currencyMarks[1])} -{" "}
          {formatCurrency(currencyMarks.at(-1) ?? 0)} disponíveis
        </p>
        <p className="text-xs text-slate-300">
          Valores dependem da análise final e do número de indicações aprovadas.
        </p>
      </div>

      {serverError && (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isBusy}
        className="mt-6 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isBusy ? "Enviando..." : "Ativar meu link agora"}
      </button>

      <p className="mt-3 text-center text-xs text-slate-500">
        Seus dados ficam protegidos e usados apenas para retornar sua análise e
        enviar o código de verificação.
      </p>
    </form>
  );
}
