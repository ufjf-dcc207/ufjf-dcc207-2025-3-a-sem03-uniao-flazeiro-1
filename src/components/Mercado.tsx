import { useState } from 'react';
import type { Jogador } from '../domain/trocas';
import type { Clube } from '../domain/api';
import '../styles/Mercado.css';

type MercadoProps = {
  jogadores: Jogador[];
  clubes: Clube[];
  jogadoresTitulares: Jogador[];
  jogadoresReservas: Jogador[];
  onAdicionarTitular: (jogador: Jogador) => void;
  onAdicionarReserva: (jogador: Jogador) => void;
};

function Mercado({
  jogadores,
  clubes,
  jogadoresTitulares,
  jogadoresReservas,
  onAdicionarTitular,
  onAdicionarReserva
}: MercadoProps) {
  const [posicaoFiltro, setPosicaoFiltro] = useState<string>('TODAS');
  const [clubeFiltro, setClubeFiltro] = useState<number>(0);
  const [busca, setBusca] = useState('');

  // IDs dos jogadores já escalados
  const idsEscalados = new Set([
    ...jogadoresTitulares.filter(j => j).map(j => j.id),
    ...jogadoresReservas.filter(j => j).map(j => j.id)
  ]);

  // Filtrar jogadores
  const jogadoresFiltrados = jogadores.filter(jogador => {
    // Filtro de posição
    if (posicaoFiltro !== 'TODAS' && jogador.posicao !== posicaoFiltro) {
      return false;
    }

    // Filtro de clube
    if (clubeFiltro !== 0 && jogador.clube_id !== clubeFiltro) {
      return false;
    }

    // Filtro de busca por nome
    if (busca && !jogador.nome.toLowerCase().includes(busca.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Ordenar por média decrescente
  const jogadoresOrdenados = [...jogadoresFiltrados].sort((a, b) => b.nota - a.nota);

  return (
    <div className="mercado">
      <h2>Mercado de Jogadores</h2>

      {/* Filtros */}
      <div className="mercado-filtros">
        <input
          type="text"
          placeholder="Buscar jogador..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="mercado-busca"
        />

        <select
          value={posicaoFiltro}
          onChange={(e) => setPosicaoFiltro(e.target.value)}
          className="mercado-select"
        >
          <option value="TODAS">Todas as Posições</option>
          <option value="GOL">Goleiro</option>
          <option value="LAT">Lateral</option>
          <option value="ZAG">Zagueiro</option>
          <option value="MEI">Meia</option>
          <option value="VOL">Volante</option>
          <option value="ATA">Atacante</option>
        </select>

        <select
          value={clubeFiltro}
          onChange={(e) => setClubeFiltro(Number(e.target.value))}
          className="mercado-select"
        >
          <option value={0}>Todos os Clubes</option>
          {clubes.map(clube => (
            <option key={clube.id} value={clube.id}>
              {clube.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de jogadores */}
      <div className="mercado-lista">
        <p className="mercado-total">
          {jogadoresOrdenados.length} jogador(es) encontrado(s)
        </p>

        <div className="mercado-jogadores">
          {jogadoresOrdenados.map(jogador => {
            const jaEscalado = idsEscalados.has(jogador.id);

            return (
              <div key={jogador.id} className={`mercado-jogador ${jaEscalado ? 'escalado' : ''}`}>
                <div className="mercado-jogador-info">
                  <span className="mercado-jogador-posicao">{jogador.posicao}</span>
                  <div>
                    <p className="mercado-jogador-nome">{jogador.nome}</p>
                    <p className="mercado-jogador-clube">{jogador.clube_nome}</p>
                  </div>
                </div>

                <div className="mercado-jogador-stats">
                  <span className={`mercado-jogador-nota ${jogador.nota >= 7 ? 'alta' : ''}`}>
                    {jogador.nota.toFixed(1)}
                  </span>
                  <span className="mercado-jogador-preco">
                    ${jogador.preco.toFixed(1)}
                  </span>
                </div>

                {!jaEscalado && (
                  <div className="mercado-jogador-acoes">
                    <button
                      onClick={() => onAdicionarTitular(jogador)}
                      className="btn-adicionar-titular"
                      title="Adicionar aos titulares"
                    >
                      Titular
                    </button>
                    <button
                      onClick={() => onAdicionarReserva(jogador)}
                      className="btn-adicionar-reserva"
                      title="Adicionar às reservas"
                    >
                      Reserva
                    </button>
                  </div>
                )}

                {jaEscalado && (
                  <span className="mercado-escalado-badge">Escalado</span>
                )}
              </div>
            );
          })}
        </div>

        {jogadoresOrdenados.length === 0 && (
          <p className="mercado-vazio">Nenhum jogador encontrado com esses filtros.</p>
        )}
      </div>
    </div>
  );
}

export default Mercado;
