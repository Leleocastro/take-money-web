"use client";

import { useState } from "react";

type SharePanelProps = {
  shareUrl: string;
  referralCode: string;
  totalReferrals: number;
};

export function SharePanel({
  shareUrl,
  referralCode,
  totalReferrals,
}: SharePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Meu link de crédito",
          text: "Entrar no meu grupo de indicações para liberar empréstimo",
          url: shareUrl,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <section className="rounded-3xl border border-white/5 bg-slate-900/60 px-6 py-6 text-white shadow-2xl shadow-blue-900/20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Compartilhar
          </p>
          <h2 className="text-2xl font-semibold">Seu link está pronto</h2>
        </div>
        <button
          type="button"
          onClick={handleNativeShare}
          className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/20"
        >
          Compartilhar agora
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-white">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Seu código
        </p>
        <p className="text-2xl font-semibold">{referralCode}</p>
        <p className="mt-3 truncate rounded-2xl bg-slate-950/40 px-3 py-2 font-mono text-xs text-blue-100">
          {shareUrl}
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full bg-blue-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-400"
          >
            {copied ? "Copiado!" : "Copiar link"}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              "Cadastre-se usando meu link: " + shareUrl
            )}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/20 px-4 py-1.5 text-xs text-white transition hover:border-white/40"
          >
            Disparar no WhatsApp
          </a>
        </div>
      </div>

      <div className="mt-5 grid gap-2 text-xs text-slate-200 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/5 px-3 py-2">
          <p className="uppercase tracking-[0.35em] text-slate-400">
            Novas indicações
          </p>
          <p className="text-2xl font-semibold">{totalReferrals}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 px-3 py-2">
          <p className="uppercase tracking-[0.35em] text-slate-400">
            Meta do dia
          </p>
          <p className="text-2xl font-semibold">+3 aprovações</p>
        </div>
      </div>
    </section>
  );
}
