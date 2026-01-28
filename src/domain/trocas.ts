// Tipo do jogador
export type Jogador = {
  id: number;
  posicao: string;
  nome: string;
  nota: number;
  preco: number;
  clube_id: number;
  clube_nome: string;
  foto?: string;
};

/**
 * Verifica se duas posições são compatíveis para troca
 * Regras:
 * - GOL: apenas com GOL
 * - LAT: apenas com LAT
 * - ZAG: apenas com ZAG
 * - VOL/MEI: intercambiáveis entre si
 * - ATA: apenas com ATA
 */
export function posicoesCompativeis(posTitular: string, posReserva: string): boolean {
  if (posTitular === 'GOL' || posReserva === 'GOL') return posTitular === posReserva;
  if (posTitular === 'LAT' || posReserva === 'LAT') return posTitular === posReserva;
  if (posTitular === 'ZAG' || posReserva === 'ZAG') return posTitular === posReserva;
  if ((posTitular === 'VOL' || posTitular === 'MEI') && (posReserva === 'VOL' || posReserva === 'MEI')) return true;
  if (posTitular === 'ATA' || posReserva === 'ATA') return posTitular === posReserva;
  return false;
}

/**
 * Realiza a troca entre um jogador titular e um reserva de forma IMUTÁVEL
 * Retorna novos arrays com a troca realizada
 */
export function trocarTitularPorReserva(
  titulares: Jogador[],
  reservas: Jogador[],
  indexTitular: number,
  indexReserva: number
): { novosTitulares: Jogador[], novasReservas: Jogador[] } {
  const novosTitulares = [...titulares];
  const novasReservas = [...reservas];

  novosTitulares[indexTitular] = reservas[indexReserva];
  novasReservas[indexReserva] = titulares[indexTitular];

  return { novosTitulares, novasReservas };
}
