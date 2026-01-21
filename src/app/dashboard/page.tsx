import Link from "next/link";
import { headers, cookies } from "next/headers";

import { ReferralsList } from "@/components/referrals-list";
import { SharePanel } from "@/components/share-panel";
import { LogoutButton } from "@/components/logout-button";
import { AccountMenu } from "@/components/account-menu";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/formatters";
import { loanNeedOptions } from "@/lib/validation";

const loanNeedLabel = Object.fromEntries(
  loanNeedOptions.map((item) => [item.value, item.label]),
);

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const cookieCode = cookieStore.get("userCode")?.value;
  const referralCode = cookieCode;

  if (!referralCode) {
    return <EmptyState />;
  }

  const user = await prisma.user.findUnique({
    where: { referralCode },
    include: {
      referrals: {
        orderBy: { createdAt: "desc" },
      },
      referredBy: true,
    },
  });

  if (!user) {
    return <MissingCode code={referralCode} />;
  }

  if (!user.isActive) {
    return <AccountInactive code={user.referralCode} />;
  }

  const headerList = await headers();
  const origin =
    headerList.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://take-money-web.vercel.app";
  const shareUrl = `${origin}/?ref=${user.referralCode}`;
  const projectedLimit = user.salary + user.referrals.length * 800;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-500">
                Seu cockpit
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold text-slate-900">
                  Olá, {user.name.split(" ")[0]}
                </h1>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                  Código {user.referralCode}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <AccountMenu />
              <LogoutButton />
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Compartilhe o link, acompanhe as indicações e veja seu limite
            crescer em tempo real.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Limite estimado
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {formatCurrency(projectedLimit)}
            </p>
            <p className="text-xs text-slate-500">
              Atualizado conforme salário informado e indicações aprovadas.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Indicações confirmadas
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {user.referrals.length}
            </p>
            <p className="text-xs text-slate-500">
              Cada cadastro concluído adiciona pontos ao seu perfil.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Tipo de crédito
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {loanNeedLabel[user.loanNeed ?? "PERSONAL"] ?? "Em avaliação"}
            </p>
            <p className="text-xs text-slate-500">
              Atualize com nosso time caso precise alterar.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                  Indicações
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  Últimos cadastros
                </h2>
              </div>
              <Link href="/" className="text-sm font-semibold text-blue-600">
                adicionar mais
              </Link>
            </div>
            <ReferralsList referrals={user.referrals} />
          </div>

          <SharePanel
            shareUrl={shareUrl}
            referralCode={user.referralCode}
            totalReferrals={user.referrals.length}
          />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">
        Identifique-se primeiro
      </h1>
      <p className="max-w-md text-sm text-slate-500">
        Cadastre-se e confirme o código enviado por email ou acesse a página de
        login para solicitar um novo código.
      </p>
      <Link
        href="/"
        className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
      >
        Voltar para o cadastro
      </Link>
      <Link href="/acesso" className="text-sm font-semibold text-blue-600">
        Já tenho cadastro
      </Link>
    </div>
  );
}

function MissingCode({ code }: { code: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">
        Código {code} não encontrado
      </h1>
      <p className="max-w-md text-sm text-slate-500">
        Confira se o link foi digitado corretamente ou gere um novo cadastro.
      </p>
      <Link
        href="/"
        className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
      >
        Fazer um novo cadastro
      </Link>
    </div>
  );
}

function AccountInactive({ code }: { code: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">
        Conta desativada
      </h1>
      <p className="max-w-md text-sm text-slate-500">
        A conta vinculada ao código {code} foi desativada. Seus dados foram
        mantidos apenas para fins legais e de auditoria. Caso precise reativar,
        fale com o nosso suporte.
      </p>
      <Link
        href="/suporte"
        className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
      >
        Ir para o suporte
      </Link>
      <Link href="/" className="text-sm font-semibold text-blue-600">
        Fazer um novo cadastro
      </Link>
    </div>
  );
}
