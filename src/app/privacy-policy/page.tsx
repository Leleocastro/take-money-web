import type { Metadata } from "next";

const sections = [
  {
    title: "1. Informacoes que coletamos",
    paragraphs: [
      "Coletamos dados fornecidos diretamente por voce, como nome completo, email, telefone, documento de identificacao e informacoes bancarias para repasse de comissao.",
      "Tambem registramos automaticamente informacoes tecnicas como endereco IP, identificadores de dispositivo, navegador, data e horario de acesso, alem de eventos de uso no painel.",
    ],
  },
  {
    title: "2. Finalidade do tratamento",
    paragraphs: [
      "Utilizamos seus dados para validar o cadastro, disparar codigos de autenticacao, registrar indicacoes de credito, calcular comissoes e cumprir com exigencias regulatorias do setor financeiro.",
      "Dados tecnicos sao usados para garantir seguranca, prevenir fraudes e aprimorar a performance da plataforma.",
    ],
  },
  {
    title: "3. Compartilhamento de dados",
    paragraphs: [
      "Compartilhamos apenas o necessario com parceiros financeiros responsaveis pela analise das indicacoes e com provedores que suportam infraestrutura, envio de emails e armazenamento seguro.",
      "Nao vendemos seus dados e exigimos que todos os fornecedores cumpram padroes de confidencialidade equivalentes aos nossos.",
    ],
  },
  {
    title: "4. Direitos do titular",
    paragraphs: [
      "A qualquer momento voce pode solicitar confirmacao do tratamento, acesso, correcao, portabilidade ou exclusao dos dados, conforme previsto na legislacao aplicavel.",
      "Caso deseje exercer seus direitos, entre em contato pelo email privacidade@leadcreditos.com com o assunto 'LGPD'.",
    ],
  },
  {
    title: "5. Retencao e seguranca",
    paragraphs: [
      "Mantemos os dados pelo periodo necessario para cumprir obrigacoes legais, conciliacao financeira e auditorias. Informacoes relacionadas a contratos e pagamentos podem ser mantidas por ate 5 anos.",
      "Aplicamos criptografia em repouso e em transito, controles de acesso com autenticao de dois fatores e auditorias periodicas de seguranca.",
    ],
  },
  {
    title: "6. Atualizacoes desta politica",
    paragraphs: [
      "Podemos atualizar este documento para refletir melhorias ou novas exigencias legais. Sempre exibiremos a data da ultima revisao e notificaremos usuarios ativos via email em caso de mudancas relevantes.",
    ],
  },
];

export const metadata: Metadata = {
  title: "Politica de Privacidade | Lead+ Creditos",
  description:
    "Entenda como tratamos e protegemos seus dados no Lead+ Creditos.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-4xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-200">
          Politica de privacidade
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
          Transparencia no uso dos seus dados
        </h1>
        <p className="mt-4 text-base text-slate-300">
          Esta politica descreve como o Lead+ Creditos trata as informacoes
          pessoais de usuarios, parceiros e leads cadastrados em nossa
          plataforma de indicacoes de emprestimo.
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Ultima atualizacao: 21/01/2026
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <h2 className="text-xl font-semibold text-white">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm text-slate-300">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 to-emerald-400/10 p-6">
          <h2 className="text-xl font-semibold text-white">
            Contato do encarregado
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Em caso de duvidas sobre privacidade, envie um email para
            privacidade@leadcreditos.com ou utilize os canais oficiais listados
            na pagina de suporte. Nossa equipe responde em ate 48 horas uteis.
          </p>
        </section>
      </div>
    </main>
  );
}
