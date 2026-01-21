import type { Metadata } from "next";
import Link from "next/link";

const faqs = [
  {
    question: "O que é o Lead+ Créditos?",
    answer:
      "Uma plataforma para gerar indicações qualificadas de empréstimo, acompanhar a evolução dos seus leads e receber recompensas por cada contrato aprovado.",
  },
  {
    question: "Como solicito um novo código de acesso?",
    answer:
      "Na página de acesso clique em 'Gerar novo código', informe o email cadastrado e aguarde alguns minutos. Caso não receba, verifique a caixa de spam ou promoções.",
  },
  {
    question: "Posso atualizar meus dados cadastrais?",
    answer:
      "Sim. Dentro do painel, acesse o menu de perfil e atualize telefone, documento e chave PIX quando necessário. Alterações sensíveis passam por revisão manual.",
  },
  {
    question: "Como acompanho minhas indicações?",
    answer:
      "No painel principal você encontra a lista de leads com status em tempo real, valores aprovados e comissões previstas. Ative os alertas para ser avisado por email.",
  },
  {
    question: "Existe um limite de indicações?",
    answer:
      "Não há limite de indicações por mês. Entretanto, nos reservamos o direito de revisar contas com atividade suspeita para garantir a qualidade da operação.",
  },
  {
    question: "Como falar com o suporte?",
    answer:
      "Utilize os canais oficiais abaixo ou responda qualquer email automático da plataforma. Nossa equipe atende de segunda a sexta, das 9h às 18h.",
  },
];

export const metadata: Metadata = {
  title: "Suporte | Lead+ Créditos",
  description:
    "Central de ajuda, canais de atendimento e FAQ sobre o Lead+ Créditos.",
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="space-y-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-200">
            Central de ajuda
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white">
            Tire suas dúvidas e fale com o nosso time
          </h1>
          <p className="text-base text-slate-300">
            Reunimos orientações rápidas, canais de atendimento e o passo a
            passo para manter suas indicações sempre em dia. Se ainda precisar
            de ajuda, estamos a um clique de distância.
          </p>
        </div>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Chat e Email</h2>
            <p className="mt-3 text-sm text-slate-300">
              Segunda a sexta, 9h-18h.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-200">
              <p>📧 suporte@leadcreditos.com</p>
              <p>💬 Chat no painel (ícone canto inferior direito)</p>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur">
            <h2 className="text-lg font-semibold text-white">WhatsApp</h2>
            <p className="mt-3 text-sm text-slate-300">
              Atendimento prioritário para parceiros ativos.
            </p>
            <Link
              href="https://wa.me/550000000000"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Abrir conversa
            </Link>
          </article>

          <article className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-left backdrop-blur">
            <h2 className="text-lg font-semibold text-white">
              Status da plataforma
            </h2>
            <p className="mt-3 text-sm text-slate-100">
              Está enfrentando instabilidade? Consulte o status oficial.
            </p>
            <Link
              href="https://status.leadcreditos.com"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Ver status em tempo real
            </Link>
          </article>
        </section>

        <section className="mt-16 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold text-white">
              Perguntas frequentes
            </h2>
            <p className="text-sm text-slate-300">
              Atualizamos este FAQ conforme recebemos novas solicitações.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur"
              >
                <h3 className="text-lg font-semibold text-white">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm text-slate-300">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-400/10 via-slate-900 to-slate-900 p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Não encontrou o que procurava?
          </h2>
          <p className="mt-3 text-sm text-slate-200">
            Envie um email detalhando o que aconteceu ou compartilhe um print.
            Nossa média de resposta é inferior a 2 horas em dias úteis.
          </p>
          <Link
            href="mailto:suporte@leadcreditos.com"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Falar com o suporte
          </Link>
        </section>
      </div>
    </main>
  );
}
