import type { Formacao } from '../state/appReducer';

/**
 * Define quais posições de jogador são permitidas em cada índice da formação
 * Índices 0-10 representam as 11 posições no campo
 */
type MapaPosicoes = {
  [index: number]: string[];
};

/**
 * Retorna o mapa de posições permitidas para cada índice baseado na formação
 */
export function obterMapaPosicoes(formacao: Formacao): MapaPosicoes {
  switch (formacao) {
    case '4-3-3':
      return {
        0: ['GOL'],                    // Goleiro
        1: ['LAT'],                    // Lateral esquerdo
        2: ['ZAG'],                    // Zagueiro esquerdo
        3: ['ZAG'],                    // Zagueiro direito
        4: ['LAT'],                    // Lateral direito
        5: ['MEI', 'VOL'],             // Meio-campo esquerdo
        6: ['MEI', 'VOL'],             // Meio-campo centro
        7: ['MEI', 'VOL'],             // Meio-campo direito
        8: ['ATA'],                    // Atacante esquerdo
        9: ['ATA'],                    // Atacante centro
        10: ['ATA']                    // Atacante direito
      };

    case '4-4-2':
      return {
        0: ['GOL'],                    // Goleiro
        1: ['LAT'],                    // Lateral esquerdo
        2: ['ZAG'],                    // Zagueiro esquerdo
        3: ['ZAG'],                    // Zagueiro direito
        4: ['LAT'],                    // Lateral direito
        5: ['MEI', 'VOL'],             // Meio-campo esquerdo
        6: ['MEI', 'VOL'],             // Meio-campo centro-esquerdo
        7: ['MEI', 'VOL'],             // Meio-campo centro-direito
        8: ['MEI', 'VOL'],             // Meio-campo direito
        9: ['ATA'],                    // Atacante esquerdo
        10: ['ATA']                    // Atacante direito
      };

    case '3-5-2':
      return {
        0: ['GOL'],                    // Goleiro
        1: ['ZAG'],                    // Zagueiro esquerdo
        2: ['ZAG'],                    // Zagueiro centro
        3: ['ZAG'],                    // Zagueiro direito
        4: ['LAT', 'MEI', 'VOL'],      // Ala esquerdo (lateral ou meia)
        5: ['MEI', 'VOL'],             // Meio-campo esquerdo
        6: ['MEI', 'VOL'],             // Meio-campo centro
        7: ['MEI', 'VOL'],             // Meio-campo direito
        8: ['LAT', 'MEI', 'VOL'],      // Ala direito (lateral ou meia)
        9: ['ATA'],                    // Atacante esquerdo
        10: ['ATA']                    // Atacante direito
      };

    default:
      return obterMapaPosicoes('4-3-3');
  }
}

/**
 * Verifica se um jogador pode ser escalado em determinado índice
 */
export function posicaoPermitidaNoIndice(
  posicaoJogador: string,
  indice: number,
  formacao: Formacao
): boolean {
  const mapa = obterMapaPosicoes(formacao);
  const posicoesPermitidas = mapa[indice] || [];
  return posicoesPermitidas.includes(posicaoJogador);
}

/**
 * Encontra o primeiro índice vazio compatível com a posição do jogador
 */
export function encontrarPrimeiraVagaCompativel(
  posicaoJogador: string,
  titulares: Array<any>,
  formacao: Formacao
): number {
  const mapa = obterMapaPosicoes(formacao);

  // Percorrer todas as 11 posições
  for (let i = 0; i < 11; i++) {
    // Verificar se posição está vazia
    const posicaoVazia = !titulares[i];

    // Verificar se a posição do jogador é permitida neste índice
    const posicoesPermitidas = mapa[i] || [];
    const posicaoCompativel = posicoesPermitidas.includes(posicaoJogador);

    if (posicaoVazia && posicaoCompativel) {
      return i;
    }
  }

  return -1; // Nenhuma vaga compatível encontrada
}
