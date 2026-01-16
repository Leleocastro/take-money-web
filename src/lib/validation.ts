import { z } from "zod";

export const loanNeedOptions = [
  {
    label: "Empréstimo pessoal",
    value: "PERSONAL",
    hint: "Liberação rápida e flexível.",
  },
  {
    label: "Consignado",
    value: "CONSIGNADO",
    hint: "Taxas menores para CLT/INSS.",
  },
  {
    label: "Cartão consignado",
    value: "CARTAO",
    hint: "Limite extra sem anuidade.",
  },
  { label: "Outro", value: "OUTRO", hint: "Conta pra gente o que precisa." },
] as const;

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .email("Informe um email válido.");

export const registerLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo com ao menos 3 letras.")
    .max(80, "Nome muito longo."),
  email: emailField,
  phone: z
    .string()
    .trim()
    .regex(
      /^[0-9+()\s-]{10,}$/,
      "Telefone inválido. Use DDD e apenas números."
    ),
  workplace: z
    .string()
    .trim()
    .min(2, "Digite o nome da empresa ou tipo de trabalho."),
  salary: z
    .number()
    .finite("Informe seu salário aproximado.")
    .int("Somente números inteiros.")
    .min(500, "O salário mínimo para análise é R$ 500,00.")
    .max(200000, "Valor máximo permitido: R$ 200.000,00"),
  loanNeed: z.enum(["PERSONAL", "CONSIGNADO", "CARTAO", "OUTRO"]),
  referrerCode: z.string().optional(),
});

export type RegisterLeadInput = z.infer<typeof registerLeadSchema>;

export const requestLoginCodeSchema = z.object({
  email: emailField,
});

export const verifyLoginCodeSchema = requestLoginCodeSchema.extend({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "O código deve ter 6 dígitos."),
});
