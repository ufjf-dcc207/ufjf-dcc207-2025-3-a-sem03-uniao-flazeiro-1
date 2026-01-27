import type { Jogador } from './trocas';

// ============================================================================
// TYPES DA API CARTOLA
// ============================================================================

type AtletaAPI = {
  atleta_id: number;
  apelido: string;
  foto?: string;
  clube_id: number;
  posicao_id: number;
  status_id: number;
  pontos_num: number;
  preco_num: number;
  media_num: number;
  jogos_num: number;
};

type PosicaoAPI = {
  id: number;
  nome: string;
  abreviacao: string;
};

type CartolaResponse = {
  atletas: AtletaAPI[];
  posicoes: Record<string, PosicaoAPI>;
};

// ============================================================================
// MAPEAMENTO DE POSIÇÕES
// ============================================================================

/**
 * Mapeia ID de posição da API para abreviação usada no app
 */
const MAPA_POSICOES: Record<number, string> = {
  1: 'GOL', // Goleiro
  2: 'LAT', // Lateral
  3: 'ZAG', // Zagueiro
  4: 'MEI', // Meia
  5: 'ATA', // Atacante
  6: 'MEI'  // Técnico -> tratamos como MEI
};

// ============================================================================
// FUNÇÕES DE TRANSFORMAÇÃO
// ============================================================================

/**
 * Transforma um atleta da API para o formato do app
 */
function transformarAtleta(atleta: AtletaAPI): Jogador {
  return {
    posicao: MAPA_POSICOES[atleta.posicao_id] || 'MEI',
    nome: atleta.apelido,
    nota: atleta.media_num || 0,
    preco: atleta.preco_num || 0
  };
}

/**
 * Busca jogadores da API do Cartola FC
 */
export async function buscarJogadoresAPI(): Promise<Jogador[]> {
  const response = await fetch('https://api.cartola.globo.com/atletas/mercado');

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  const dados: CartolaResponse = await response.json();

  // Transformar todos os atletas
  const jogadores = dados.atletas
    .filter(atleta => atleta.status_id === 7) // Apenas jogadores prováveis
    .map(transformarAtleta);

  return jogadores;
}

/**
 * Seleciona os melhores jogadores por posição para montar time inicial
 */
export function selecionarTimePadrao(jogadores: Jogador[]): {
  titulares: Jogador[];
  reservas: Jogador[];
} {
  // Separar por posição
  const porPosicao: Record<string, Jogador[]> = {
    GOL: [],
    LAT: [],
    ZAG: [],
    VOL: [],
    MEI: [],
    ATA: []
  };

  jogadores.forEach(jogador => {
    const posicao = jogador.posicao;
    if (porPosicao[posicao]) {
      porPosicao[posicao].push(jogador);
    }
  });

  // Ordenar por média (nota) decrescente
  Object.keys(porPosicao).forEach(pos => {
    porPosicao[pos].sort((a, b) => b.nota - a.nota);
  });

  // Montar time 4-3-3 (1 GOL, 2 LAT, 2 ZAG, 3 MEI, 3 ATA)
  const titulares: Jogador[] = [
    ...porPosicao.GOL.slice(0, 1),   // 1 goleiro
    ...porPosicao.LAT.slice(0, 2),   // 2 laterais
    ...porPosicao.ZAG.slice(0, 2),   // 2 zagueiros
    ...porPosicao.MEI.slice(0, 3),   // 3 meias (incluindo VOL se necessário)
    ...porPosicao.ATA.slice(0, 3)    // 3 atacantes
  ];

  // Pegar mais alguns para reservas
  const reservas: Jogador[] = [
    ...porPosicao.GOL.slice(1, 2),   // +1 goleiro
    ...porPosicao.ZAG.slice(2, 3),   // +1 zagueiro
    ...porPosicao.MEI.slice(3, 4),   // +1 meia
    ...porPosicao.ATA.slice(3, 4)    // +1 atacante
  ];

  return { titulares, reservas };
}
