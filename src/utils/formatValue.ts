const formatValue = (value: number): string =>
  Intl.NumberFormat('pt-BR', {
    // maximumSignificantDigits: 2,
    style: 'currency',
    currency: 'BRL',
  }).format(value); // TODO

export const formatValueData = (value: Date): string =>
  Intl.DateTimeFormat('pt-BR').format(value);

export default formatValue;
