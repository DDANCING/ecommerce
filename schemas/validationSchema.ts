import { z } from "zod";

/**
 * Remove todos os caracteres não numéricos de uma string.
 */
const onlyDigits = (value: string) => value.replace(/\D/g, "");

/**
 * Verifica se CPF é válido.
 */
function isValidCPF(cpf: string): boolean {
  cpf = onlyDigits(cpf);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) firstDigit = 0;
  if (firstDigit !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) secondDigit = 0;

  return secondDigit === parseInt(cpf[10]);
}

/**
 * Verifica se CNPJ é válido.
 */
function isValidCNPJ(cnpj: string): boolean {
  cnpj = onlyDigits(cnpj);
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const calcCheckDigit = (base: string, weights: number[]) =>
    (11 -
      base
        .split("")
        .reduce((sum, num, idx) => sum + parseInt(num) * weights[idx], 0)) %
    11;

  const base = cnpj.slice(0, 12);
  const digit1 = calcCheckDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const digit2 = calcCheckDigit(base + digit1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return (
    parseInt(cnpj[12]) === (digit1 < 2 ? 0 : digit1) &&
    parseInt(cnpj[13]) === (digit2 < 2 ? 0 : digit2)
  );
}

/**
 * Validação de CPF ou CNPJ via Zod + algoritmos reais
 */
export const cpfCnpjSchema = z
  .string({ required_error: "CPF ou CNPJ é obrigatório." })
  .transform(onlyDigits)
  .refine(
    (value) => value.length === 11 || value.length === 14,
    "CPF deve ter 11 dígitos e CNPJ deve ter 14 dígitos."
  )
  .refine(
    (value) => isValidCPF(value) || isValidCNPJ(value),
    "CPF ou CNPJ inválido."
  );
