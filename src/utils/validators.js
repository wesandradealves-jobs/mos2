import { getCpfNumbers, getMobileNumbers, getCepNumbers } from './functions';

export const validateCpf = cpf => {
  if (cpf) {
    const cpfNumbers = getCpfNumbers(cpf);

    if (
      cpfNumbers.length !== 11 ||
      cpfNumbers === '00000000000' ||
      cpfNumbers === '11111111111' ||
      cpfNumbers === '22222222222' ||
      cpfNumbers === '33333333333' ||
      cpfNumbers === '44444444444' ||
      cpfNumbers === '55555555555' ||
      cpfNumbers === '66666666666' ||
      cpfNumbers === '77777777777' ||
      cpfNumbers === '88888888888' ||
      cpfNumbers === '99999999999'
    )
      return false;

    let sum;
    let rest;
    sum = 0;

    let i;

    for (i = 1; i <= 9; i += 1)
      sum += parseInt(cpfNumbers.substring(i - 1, i), 10) * (11 - i);
    rest = (sum * 10) % 11;

    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpfNumbers.substring(9, 10), 10)) return false;

    sum = 0;
    for (i = 1; i <= 10; i += 1)
      sum += parseInt(cpfNumbers.substring(i - 1, i), 10) * (12 - i);
    rest = (sum * 10) % 11;

    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpfNumbers.substring(10, 11), 10)) return false;

    return true;
  }
  return false;
};

export const validateMobileNumber = mobile =>
  mobile ? getMobileNumbers(mobile).length === 11 : false;

export const validateCep = cep =>
  cep ? getCepNumbers(cep).length === 8 : false;
