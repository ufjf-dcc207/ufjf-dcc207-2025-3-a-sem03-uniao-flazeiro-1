import type { AppState } from '../state/appReducer';

const STORAGE_KEY = 'cartola-fc-estado';

/**
 * Salva o estado no localStorage
 * Retorna true se salvou com sucesso, false se falhou
 */
export function salvarEstado(estado: AppState): boolean {
  try {
    const estadoSerializado = JSON.stringify(estado);
    localStorage.setItem(STORAGE_KEY, estadoSerializado);
    return true;
  } catch (erro) {
    console.error('Erro ao salvar estado:', erro);
    return false;
  }
}

/**
 * Carrega o estado do localStorage
 * Retorna o estado salvo ou null se não houver/falhar
 */
export function carregarEstado(): Partial<AppState> | null {
  try {
    const estadoSerializado = localStorage.getItem(STORAGE_KEY);

    if (estadoSerializado === null) {
      return null;
    }

    const estado = JSON.parse(estadoSerializado);
    return estado;
  } catch (erro) {
    console.error('Erro ao carregar estado:', erro);
    return null;
  }
}

/**
 * Remove o estado salvo do localStorage
 */
export function limparEstado(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (erro) {
    console.error('Erro ao limpar estado:', erro);
  }
}
