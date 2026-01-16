import { formatCurrency, formatPhone } from "@/lib/formatters";
import { loanNeedOptions } from "@/lib/validation";

type LoanNeedValue = (typeof loanNeedOptions)[number]["value"];

type ReferralItem = {
  id: string;
  name: string;
  phone: string;
  createdAt: string | Date;
  loanNeed: string | null;
  salary: number;
};

const loanNeedLabels: Record<LoanNeedValue, string> = Object.fromEntries(
  loanNeedOptions.map((item) => [item.value, item.label])
) as Record<LoanNeedValue, string>;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

type ReferralsListProps = {
  referrals: ReferralItem[];
};

export function ReferralsList({ referrals }: ReferralsListProps) {
  if (!referrals.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-500">
        <p className="text-sm">Nenhuma indicação registrada ainda.</p>
        <p className="text-xs text-slate-400">
          Compartilhe seu link para acompanhar aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {referrals.map((referral) => (
        <article
          key={referral.id}
          className="rounded-3xl border border-slate-100 bg-white/90 px-5 py-4 shadow-sm shadow-slate-200/60"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold text-slate-900">
                {referral.name}
              </p>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                {dateFormatter.format(new Date(referral.createdAt))}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="rounded-full border border-slate-200 px-3 py-1">
                {formatPhone(referral.phone)}
              </span>
              <span className="rounded-full border border-slate-200 px-3 py-1">
                {loanNeedLabels[
                  (referral.loanNeed?.toUpperCase() ??
                    "PERSONAL") as LoanNeedValue
                ] ?? "Em análise"}
              </span>
              <span className="rounded-full border border-slate-200 px-3 py-1">
                {formatCurrency(referral.salary)}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
