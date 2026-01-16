import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const codeGenerator = customAlphabet(alphabet, 8);

export const generateReferralCode = () => codeGenerator();
