import Link from "next/link";

import { LoginAccessCard } from "@/components/login-access-card";

export default function AccessPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-5xl px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-white/20"
        >
          <span aria-hidden>←</span> Voltar
        </Link>
      </div>
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-8 px-6 py-10 lg:flex-row lg:items-stretch">
        <section className="flex-1 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-200">
            Acesso seguro
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
            Entre com o código enviado por email
          </h1>
          <p className="mt-4 text-base text-slate-200">
            Para proteger seus dados, liberamos o painel apenas depois de você
            confirmar o código de 6 dígitos enviado ao email cadastrado. O
            código expira em alguns minutos, mas você pode solicitar outro
            quando quiser.
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-200">
            <p>✔ Evita acessos não autorizados</p>
            <p>✔ Nada de senhas difíceis, apenas o seu email</p>
            <p>✔ Reenvie quantas vezes precisar</p>
          </div>
          <div className="mt-8 text-sm text-slate-300">
            Ainda não tem um cadastro?{" "}
            <Link href="/" className="font-semibold text-white underline">
              Comece por aqui
            </Link>
            .
          </div>
        </section>

        <section className="flex-1 lg:max-w-[420px]">
          <LoginAccessCard />
        </section>
      </div>
    </div>
  );
}
