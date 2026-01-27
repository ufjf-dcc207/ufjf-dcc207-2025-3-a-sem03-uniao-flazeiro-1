import type { Jogador } from '../domain/trocas';
import { posicoesCompativeis, trocarTitularPorReserva } from '../domain/trocas';

// ============================================================================
// TYPES
// ============================================================================

export type Formacao = '4-3-3' | '4-4-2' | '3-5-2';

export type AppState = {
  jogadoresTitulares: Jogador[];
  jogadoresReservas: Jogador[];
  jogadorSelecionado: number | null;
  formacao: Formacao;
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

export type AppAction =
  | SelecionarTitularAction
  | DefinirFormacaoAction
  | TrocarComReservaAction;

// ============================================================================
// INITIAL STATE
// ============================================================================

const todosJogadores: Jogador[] = [
  { posicao: 'GOL', nome: 'Cássio', nota: 7.2, preco: 6.8 },
  { posicao: 'LAT', nome: 'Kaiki', nota: 6.5, preco: 5.2 },
  { posicao: 'ZAG', nome: 'Leo Ortiz', nota: 7.2, preco: 5.8 },
  { posicao: 'ZAG', nome: 'Fabrício Bruno', nota: 6.8, preco: 7.5 },
  { posicao: 'LAT', nome: 'Alex Sandro', nota: 6.3, preco: 4.2 },
  { posicao: 'VOL', nome: 'Matheus Henrique', nota: 7.1, preco: 7.5 },
  { posicao: 'MEI', nome: 'Arrascaeta', nota: 8.1, preco: 18.4 },
  { posicao: 'MEI', nome: 'Matheus Pereira', nota: 8.3, preco: 19.2 },
  { posicao: 'ATA', nome: 'Kaio Jorge', nota: 6.7, preco: 17.9 },
  { posicao: 'ATA', nome: 'Pedro', nota: 8.5, preco: 16.8 },
  { posicao: 'ATA', nome: 'Juninho Xé', nota: 7.0, preco: 8.3 },
  { posicao: 'GOL', nome: 'Rossi', nota: 6.5, preco: 5.0 },
  { posicao: 'ZAG', nome: 'David Luiz', nota: 6.2, preco: 4.5 },
  { posicao: 'MEI', nome: 'Gerson', nota: 7.5, preco: 12.3 },
  { posicao: 'ATA', nome: 'Gabigol', nota: 7.8, preco: 15.5 }
];

export const initialState: AppState = {
  jogadoresTitulares: todosJogadores.slice(0, 11),
  jogadoresReservas: todosJogadores.slice(11),
  jogadorSelecionado: null,
  formacao: '4-3-3'
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
        formacao: action.payload
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

    default:
      return state;
  }
}
