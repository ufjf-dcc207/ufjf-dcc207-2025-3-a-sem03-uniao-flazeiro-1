import type { Jogador } from '../domain/trocas';
import { posicoesCompativeis, trocarTitularPorReserva } from '../domain/trocas';
import type { Clube } from '../domain/api';
import { encontrarPrimeiraVagaCompativel } from '../domain/formacoes';

// ============================================================================
// TYPES
// ============================================================================

export type Formacao = '4-3-3' | '4-4-2' | '3-5-2';

export type AppState = {
  jogadoresTitulares: Jogador[];
  jogadoresReservas: Jogador[];
  jogadorSelecionado: number | null;
  formacao: Formacao;
  carregando: boolean;
  erro: string | null;
  todosJogadores: Jogador[];
  clubes: Clube[];
};

// ============================================================================
// ACTIONS
// ============================================================================

type SelecionarTitularAction = {
  type: 'SELECIONAR_TITULAR';
  payload: number | null;
};

type DefinirFormacaoAction = {
  type: 'DEFINIR_FORMACAO';
  payload: Formacao;
};

type TrocarComReservaAction = {
  type: 'TROCAR_COM_RESERVA';
  payload: number; // indexReserva
};

type HidratarEstadoAction = {
  type: 'HIDRATAR_ESTADO';
  payload: Partial<AppState>;
};

type CarregarJogadoresInicioAction = {
  type: 'CARREGAR_JOGADORES_INICIO';
};

type CarregarJogadoresSucessoAction = {
  type: 'CARREGAR_JOGADORES_SUCESSO';
  payload: {
    titulares: Jogador[];
    reservas: Jogador[];
    todosJogadores: Jogador[];
    clubes: Clube[];
  };
};

type CarregarJogadoresErroAction = {
  type: 'CARREGAR_JOGADORES_ERRO';
  payload: string; // mensagem de erro
};

type AdicionarTitularAction = {
  type: 'ADICIONAR_TITULAR';
  payload: Jogador;
};

type RemoverTitularAction = {
  type: 'REMOVER_TITULAR';
  payload: number; // index do titular
};

type AdicionarReservaAction = {
  type: 'ADICIONAR_RESERVA';
  payload: Jogador;
};

type RemoverReservaAction = {
  type: 'REMOVER_RESERVA';
  payload: number; // index da reserva
};

export type AppAction =
  | SelecionarTitularAction
  | DefinirFormacaoAction
  | TrocarComReservaAction
  | HidratarEstadoAction
  | CarregarJogadoresInicioAction
  | CarregarJogadoresSucessoAction
  | CarregarJogadoresErroAction
  | AdicionarTitularAction
  | RemoverTitularAction
  | AdicionarReservaAction
  | RemoverReservaAction;

// ============================================================================
// INITIAL STATE
// ============================================================================

const todosJogadores: Jogador[] = [
  { id: 1, posicao: 'GOL', nome: 'Cássio', nota: 7.2, preco: 6.8, clube_id: 264, clube_nome: 'Corinthians' },
  { id: 2, posicao: 'LAT', nome: 'Kaiki', nota: 6.5, preco: 5.2, clube_id: 262, clube_nome: 'Flamengo' },
  { id: 3, posicao: 'ZAG', nome: 'Leo Ortiz', nota: 7.2, preco: 5.8, clube_id: 262, clube_nome: 'Flamengo' },
  { id: 4, posicao: 'ZAG', nome: 'Fabrício Bruno', nota: 6.8, preco: 7.5, clube_id: 262, clube_nome: 'Flamengo' },
  { id: 5, posicao: 'LAT', nome: 'Alex Sandro', nota: 6.3, preco: 4.2, clube_id: 262, clube_nome: 'Flamengo' },
  { id: 6, posicao: 'VOL', nome: 'Matheus Henrique', nota: 7.1, preco: 7.5, clube_id: 263, clube_nome: 'Botafogo' },
  { id: 7, posicao: 'MEI', nome: 'Arrascaeta', nota: 8.1, preco: 18.4, clube_id: 262, clube_nome: 'Flamengo' },
  { id: 8, posicao: 'MEI', nome: 'Matheus Pereira', nota: 8.3, preco: 19.2, clube_id: 283, clube_nome: 'Cruzeiro' },
  { id: 9, posicao: 'ATA', nome: 'Kaio Jorge', nota: 6.7, preco: 17.9, clube_id: 283, clube_nome: 'Cruzeiro' },
  { id: 10, posicao: 'ATA', nome: 'Pedro', nota: 8.5, preco: 16.8, clube_id: 262, clube_nome: 'Flamengo' },
  { id: 11, posicao: 'ATA', nome: 'Juninho Xé', nota: 7.0, preco: 8.3, clube_id: 262, clube_nome: 'Flamengo' },
  { id: 12, posicao: 'GOL', nome: 'Rossi', nota: 6.5, preco: 5.0, clube_id: 262, clube_nome: 'Flamengo' },
  { id: 13, posicao: 'ZAG', nome: 'David Luiz', nota: 6.2, preco: 4.5, clube_id: 262, clube_nome: 'Flamengo' },
  { id: 14, posicao: 'MEI', nome: 'Gerson', nota: 7.5, preco: 12.3, clube_id: 262, clube_nome: 'Flamengo' },
  { id: 15, posicao: 'ATA', nome: 'Gabigol', nota: 7.8, preco: 15.5, clube_id: 262, clube_nome: 'Flamengo' }
];

export const initialState: AppState = {
  jogadoresTitulares: [],  // Começar vazio para permitir montar do zero
  jogadoresReservas: [],
  jogadorSelecionado: null,
  formacao: '4-3-3',
  carregando: false,
  erro: null,
  todosJogadores: todosJogadores, // Fallback caso API falhe
  clubes: []
};

// ============================================================================
// REDUCER
// ============================================================================

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SELECIONAR_TITULAR':
      return {
        ...state,
        jogadorSelecionado: action.payload
      };

    case 'DEFINIR_FORMACAO':
      return {
        ...state,
        formacao: action.payload,
        jogadorSelecionado: null // Limpar seleção ao trocar formação
      };

    case 'TROCAR_COM_RESERVA': {
      // Validação: precisa ter um jogador selecionado
      if (state.jogadorSelecionado === null) {
        return state;
      }

      const indexTitular = state.jogadorSelecionado;
      const indexReserva = action.payload;

      const titular = state.jogadoresTitulares[indexTitular];
      const reserva = state.jogadoresReservas[indexReserva];

      // Validação: posições devem ser compatíveis
      if (!posicoesCompativeis(titular.posicao, reserva.posicao)) {
        return state;
      }

      // Realizar troca imutável usando função do domínio
      const { novosTitulares, novasReservas } = trocarTitularPorReserva(
        state.jogadoresTitulares,
        state.jogadoresReservas,
        indexTitular,
        indexReserva
      );

      return {
        ...state,
        jogadoresTitulares: novosTitulares,
        jogadoresReservas: novasReservas,
        jogadorSelecionado: null // Desmarca após trocar
      };
    }

    case 'HIDRATAR_ESTADO': {
      const payload = action.payload;

      // Validação básica: payload deve ser um objeto
      if (!payload || typeof payload !== 'object') {
        return state;
      }

      // Validar jogadoresTitulares se presente
      if (payload.jogadoresTitulares !== undefined) {
        if (!Array.isArray(payload.jogadoresTitulares)) {
          return state;
        }
      }

      // Validar jogadoresReservas se presente
      if (payload.jogadoresReservas !== undefined) {
        if (!Array.isArray(payload.jogadoresReservas)) {
          return state;
        }
      }

      // Validar formacao se presente
      if (payload.formacao !== undefined) {
        const formacoesValidas: Formacao[] = ['4-3-3', '4-4-2', '3-5-2'];
        if (!formacoesValidas.includes(payload.formacao)) {
          return state;
        }
      }

      // Validar jogadorSelecionado se presente
      if (payload.jogadorSelecionado !== undefined) {
        if (
          payload.jogadorSelecionado !== null &&
          typeof payload.jogadorSelecionado !== 'number'
        ) {
          return state;
        }
      }

      // Se passou nas validações, mesclar com state atual
      return {
        ...state,
        ...payload
      };
    }

    case 'CARREGAR_JOGADORES_INICIO':
      return {
        ...state,
        carregando: true,
        erro: null
      };

    case 'CARREGAR_JOGADORES_SUCESSO':
      return {
        ...state,
        jogadoresTitulares: action.payload.titulares,
        jogadoresReservas: action.payload.reservas,
        todosJogadores: action.payload.todosJogadores,
        clubes: action.payload.clubes,
        carregando: false,
        erro: null
      };

    case 'CARREGAR_JOGADORES_ERRO':
      return {
        ...state,
        carregando: false,
        erro: action.payload
      };

    case 'ADICIONAR_TITULAR': {
      // Validação: não adicionar jogador duplicado
      if (state.jogadoresTitulares.find(j => j && j.id === action.payload.id)) {
        return state;
      }
      if (state.jogadoresReservas.find(j => j && j.id === action.payload.id)) {
        return state;
      }

      // Encontrar primeira posição vazia compatível com a posição do jogador
      const indexCompativel = encontrarPrimeiraVagaCompativel(
        action.payload.posicao,
        state.jogadoresTitulares,
        state.formacao
      );

      // Se não encontrou posição compatível, não adicionar
      if (indexCompativel === -1) {
        return state;
      }

      // Criar array com 11 posições se ainda não tem
      const novosTitulares = [...state.jogadoresTitulares];
      while (novosTitulares.length < 11) {
        novosTitulares.push(undefined as any);
      }

      // Adicionar jogador na posição compatível encontrada
      novosTitulares[indexCompativel] = action.payload;

      return {
        ...state,
        jogadoresTitulares: novosTitulares
      };
    }

    case 'REMOVER_TITULAR': {
      const novosTitulares = state.jogadoresTitulares.filter((_, index) => index !== action.payload);

      return {
        ...state,
        jogadoresTitulares: novosTitulares,
        jogadorSelecionado: null // Limpar seleção
      };
    }

    case 'ADICIONAR_RESERVA': {
      // Validação: não adicionar jogador duplicado
      if (state.jogadoresReservas.find(j => j.id === action.payload.id)) {
        return state;
      }

      return {
        ...state,
        jogadoresReservas: [...state.jogadoresReservas, action.payload]
      };
    }

    case 'REMOVER_RESERVA': {
      const novasReservas = state.jogadoresReservas.filter((_, index) => index !== action.payload);

      return {
        ...state,
        jogadoresReservas: novasReservas
      };
    }

    default:
      return state;
  }
}
