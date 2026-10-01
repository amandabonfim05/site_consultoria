

export function formatarEntradaMoeda(valorDigitado: string): string {
  const somenteDigitosEVirgula = valorDigitado.replace(/[^\d,]/g, '');
  if (somenteDigitosEVirgula === '') return '';

  const [parteInteiraBruta, ...resto] = somenteDigitosEVirgula.split(',');
  let parteInteira = parteInteiraBruta.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  if (parteInteira === '' && resto.length > 0) parteInteira = '0';
  const inteiroFormatado = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (resto.length === 0) return inteiroFormatado;

  const parteDecimal = resto.join('').slice(0, 2);
  return `${inteiroFormatado},${parteDecimal}`;
}

export function paraNumero(valorFormatado: string): number {
  if (!valorFormatado) return 0;
  const normalizado = valorFormatado.replace(/\./g, '').replace(',', '.');
  const numero = Number(normalizado);
  return Number.isNaN(numero) ? 0 : numero;
}