import Link from "next/link";

import { RegisterForm } from "@/components/register-form";

const stats = [
  { label: "Indicações aprovadas", value: "2.480+" },
  { label: "Ticket médio liberado", value: "R$ 8.400" },
  { label: "Tempo médio de análise", value: "< 4h" },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const resolvedParams = await searchParams;
  const referralCode = resolvedParams?.ref?.toUpperCase();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
      >
        <div className="absolute -left-20 top-32 h-80 w-80 rounded-full bg-blue-600 blur-[140px]" />
        <div className="absolute right-[-10%] top-0 h-96 w-96 rounded-full bg-lime-400 blur-[160px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-500 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-10 lg:flex-row lg:items-center lg:gap-16">
        <section className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em]">
            Lead+ Créditos
          </div>
          <header className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.5em] text-slate-300">
              Compartilhe & monetize
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Cadastro rápido para disparar pedidos de empréstimo com link de
              indicações infinito.
            </h1>
            <p className="max-w-2xl text-lg text-slate-200">
              Cada pessoa que se cadastra pelo seu link gera pontos, aumenta o
              limite disponível e acelera sua aprovação. Sem burocracia e
              totalmente mobile.
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-sm uppercase tracking-[0.25em] text-slate-300">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-300">
            <div className="rounded-full border border-white/10 px-4 py-2">
              Compartilhamento pelo WhatsApp
            </div>
            <div className="rounded-full border border-white/10 px-4 py-2">
              Tracking em tempo real
            </div>
            <div className="rounded-full border border-white/10 px-4 py-2">
              Painel mobile-first
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
            <Link
              href="/acesso"
              className="rounded-full bg-white px-5 py-2 font-semibold text-slate-900 shadow-lg shadow-white/20"
            >
              Já tenho cadastro
            </Link>
            {referralCode && (
              <span className="rounded-full border border-white/15 px-4 py-2 text-xs">
                Código aplicado: {referralCode}
              </span>
            )}
          </div>
        </section>

        <section className="flex-1 lg:max-w-[420px]">
          <RegisterForm referralCode={referralCode} />
        </section>
      </div>
    </div>
  );
}
