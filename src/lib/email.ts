import nodemailer from "nodemailer";

type MailerConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  secure: boolean;
};

const requiredEnv = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "EMAIL_FROM",
] as const;

const readMailerConfig = (): MailerConfig => {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(
      `Faltam variáveis SMTP para envio de email: ${missing.join(", ")}`
    );
  }

  const port = Number(process.env.SMTP_PORT);
  return {
    host: process.env.SMTP_HOST!,
    port: Number.isNaN(port) ? 587 : port,
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
    from: process.env.EMAIL_FROM!,
    secure: process.env.SMTP_SECURE?.toLowerCase() === "true" || port === 465,
  };
};

let transporterPromise: Promise<
  ReturnType<typeof nodemailer.createTransport>
> | null = null;
let cachedConfig: MailerConfig | null = null;

const getTransporter = async () => {
  if (!transporterPromise) {
    cachedConfig = readMailerConfig();
    transporterPromise = (async () => {
      const transporter = nodemailer.createTransport({
        host: cachedConfig!.host,
        port: cachedConfig!.port,
        secure: cachedConfig!.secure,
        auth: {
          user: cachedConfig!.user,
          pass: cachedConfig!.pass,
        },
      });
      await transporter.verify();
      return transporter;
    })();
  }

  return transporterPromise;
};

export async function sendLoginCodeEmail(email: string, code: string) {
  const transporter = await getTransporter();
  const config = cachedConfig ?? readMailerConfig();
  const subject = "Seu código de acesso Lead+";
  const text = `Digite o código ${code} para liberar o painel. Ele expira em poucos minutos.`;
  const html = `
    <p>Olá!</p>
    <p>Use o código <strong style="font-size:18px;letter-spacing:6px;">${code}</strong> para confirmar seu acesso.</p>
    <p>Se você não solicitou, pode ignorar este email.</p>
  `;

  await transporter.sendMail({
    from: config.from,
    to: email,
    subject,
    text,
    html,
  });
}
