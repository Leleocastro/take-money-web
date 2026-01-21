"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

export function AccountMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleDeactivate = useCallback(() => {
    const confirmed = window.confirm(
      "Ao desativar sua conta você encerra o acesso ao painel, mas mantém o histórico para fins regulatórios. Deseja continuar?",
    );

    if (!confirmed) return;

    startTransition(async () => {
      setError(null);
      try {
        const response = await fetch("/api/account/deactivate", {
          method: "POST",
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          setError(
            data?.message ?? "Não conseguimos desativar sua conta agora.",
          );
          return;
        }

        setOpen(false);
        router.replace("/");
      } catch (err) {
        console.error(err);
        setError("Erro inesperado. Tente novamente.");
      }
    });
  }, [router, startTransition]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((prev) => !prev);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Conta
        <span
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}
        >
          v
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 z-10 mt-2 w-64 rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Opções
          </p>
          <button
            type="button"
            onClick={handleDeactivate}
            disabled={isPending}
            className="mt-3 w-full rounded-2xl bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Desativando..." : "Desativar conta"}
          </button>
          <p className="mt-3 text-xs text-slate-500">
            A desativação encerra o acesso imediato, mas mantém registros
            financeiros por requisitos legais.
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="mt-2 text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
