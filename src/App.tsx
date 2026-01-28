import './styles/App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Campo from './components/Campo'
import Jogador from './components/Jogador'
import ListaJogadores from './components/ListaJogadores'
import Banco from './components/Banco'
import Mercado from './components/Mercado'
import { useReducer, useEffect, useRef, useState } from 'react'
import { posicoesCompativeis } from './domain/trocas'
import type { Jogador as JogadorType } from './domain/trocas'
import { appReducer, initialState } from './state/appReducer'
import { carregarEstado, salvarEstado } from './domain/persistencia'
import { buscarJogadoresAPI } from './domain/api'
import { obterMapaPosicoes, encontrarPrimeiraVagaCompativel } from './domain/formacoes'

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const refsTitulares = useRef<Map<number, HTMLDivElement>>(new Map());
  const primeiroRender = useRef(true);
  const [mostrarMercado, setMostrarMercado] = useState(true);
  const [mensagemAlerta, setMensagemAlerta] = useState<string | null>(null);

  const formacoesDisponiveis = [
    { nome: '4-3-3', linhas: [[1], [2, 3, 4, 5], [6, 7, 8], [9, 10, 11]] },
    { nome: '4-4-2', linhas: [[1], [2, 3, 4, 5], [6, 7, 8, 9], [10, 11]] },
    { nome: '3-5-2', linhas: [[1], [2, 3, 4], [5, 6, 7, 8, 9], [10, 11]] }
  ];

  // Hidratar estado do localStorage ou buscar da API no mount
  useEffect(() => {
    const estadoSalvo = carregarEstado();

    if (estadoSalvo) {
      // Se tem dados salvos, usar eles
      dispatch({ type: 'HIDRATAR_ESTADO', payload: estadoSalvo });
    } else {
      // Se não tem dados salvos, buscar da API
      const buscarJogadores = async () => {
        dispatch({ type: 'CARREGAR_JOGADORES_INICIO' });

        try {
          const { jogadores, clubes } = await buscarJogadoresAPI();

          dispatch({
            type: 'CARREGAR_JOGADORES_SUCESSO',
            payload: {
              titulares: [],  // Começar com time vazio
              reservas: [],
              todosJogadores: jogadores,
              clubes: clubes
            }
          });
        } catch (erro) {
          const mensagem = erro instanceof Error ? erro.message : 'Erro ao carregar jogadores';
          dispatch({
            type: 'CARREGAR_JOGADORES_ERRO',
            payload: mensagem
          });
        }
      };

      buscarJogadores();
    }
  }, []);

  // Salvar estado no localStorage quando mudar (pula primeiro render)
  useEffect(() => {
    if (primeiroRender.current) {
      primeiroRender.current = false;
      return;
    }
    salvarEstado(state);
  }, [state.jogadoresTitulares, state.jogadoresReservas, state.formacao]);

  // Scroll automático quando selecionar titular
  useEffect(() => {
    if (state.jogadorSelecionado !== null) {
      const element = refsTitulares.current.get(state.jogadorSelecionado);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [state.jogadorSelecionado]);

  const obterFormacao = () => {
    return formacoesDisponiveis.find(f => f.nome === state.formacao) || formacoesDisponiveis[0];
  };

  const trocarJogador = (indexReserva: number) => {
    if (state.jogadorSelecionado === null) return;

    const titular = state.jogadoresTitulares[state.jogadorSelecionado];
    const reserva = state.jogadoresReservas[indexReserva];

    if (!posicoesCompativeis(titular.posicao, reserva.posicao)) {
      return;
    }

    dispatch({
      type: 'TROCAR_COM_RESERVA',
      payload: indexReserva
    });
  };

  const adicionarTitular = (jogador: JogadorType) => {
    // Verificar se já está escalado
    if (state.jogadoresTitulares.find(j => j && j.id === jogador.id)) {
      setMensagemAlerta(`${jogador.nome} já está escalado como titular!`);
      setTimeout(() => setMensagemAlerta(null), 3000);
      return;
    }
    if (state.jogadoresReservas.find(j => j && j.id === jogador.id)) {
      setMensagemAlerta(`${jogador.nome} já está escalado como reserva!`);
      setTimeout(() => setMensagemAlerta(null), 3000);
      return;
    }

    // Verificar se há vaga compatível
    const indexVaga = encontrarPrimeiraVagaCompativel(
      jogador.posicao,
      state.jogadoresTitulares,
      state.formacao
    );

    if (indexVaga === -1) {
      const mapaPosicoes = obterMapaPosicoes(state.formacao);
      const posicoesOcupadas: string[] = [];

      for (let i = 0; i < 11; i++) {
        const posPermitidas = mapaPosicoes[i] || [];
        if (posPermitidas.includes(jogador.posicao) && state.jogadoresTitulares[i]) {
          posicoesOcupadas.push(state.jogadoresTitulares[i].nome);
        }
      }

      setMensagemAlerta(
        `Não há vagas para ${jogador.posicao} na formação ${state.formacao}. ` +
        `Posições ocupadas: ${posicoesOcupadas.join(', ')}`
      );
      setTimeout(() => setMensagemAlerta(null), 4000);
      return;
    }

    dispatch({ type: 'ADICIONAR_TITULAR', payload: jogador });
    setMensagemAlerta(`${jogador.nome} adicionado como titular!`);
    setTimeout(() => setMensagemAlerta(null), 2000);
  };

  const adicionarReserva = (jogador: JogadorType) => {
    // Verificar se já está escalado
    if (state.jogadoresTitulares.find(j => j && j.id === jogador.id)) {
      setMensagemAlerta(`${jogador.nome} já está escalado como titular!`);
      setTimeout(() => setMensagemAlerta(null), 3000);
      return;
    }
    if (state.jogadoresReservas.find(j => j && j.id === jogador.id)) {
      setMensagemAlerta(`${jogador.nome} já está escalado como reserva!`);
      setTimeout(() => setMensagemAlerta(null), 3000);
      return;
    }

    dispatch({ type: 'ADICIONAR_RESERVA', payload: jogador });
    setMensagemAlerta(`${jogador.nome} adicionado ao banco de reservas!`);
    setTimeout(() => setMensagemAlerta(null), 2000);
  };

  const jogadoresEscalados = state.jogadoresTitulares.filter(j => j).length;
  const pontuacaoTotal = state.jogadoresTitulares.reduce((total, jogador) => total + (jogador?.nota || 0), 0);
  const valorTotal = state.jogadoresTitulares.reduce((total, jogador) => total + (jogador?.preco || 0), 0);
  const patrimonio = 140.0;

  return (
    <>
      <Header />
      <main className="main-content">
        <section className="hero">
          <h2>Flazeiro FC</h2>
        </section>

        {/* Feedback de carregamento */}
        {state.carregando && (
          <div style={{textAlign: 'center', padding: '20px', color: '#00d9ff'}}>
            <p>Carregando jogadores da API do Cartola FC...</p>
          </div>
        )}

        {/* Feedback de erro */}
        {state.erro && (
          <div style={{textAlign: 'center', padding: '20px', color: '#ff4444', background: '#2a1a1a', borderRadius: '8px', margin: '0 20px 20px'}}>
            <p><strong>Erro:</strong> {state.erro}</p>
            <p style={{fontSize: '0.9em', marginTop: '10px'}}>Usando dados locais como fallback.</p>
          </div>
        )}

        <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px'}}>
          {formacoesDisponiveis.map(f => (
            <button
              key={f.nome}
              onClick={() => dispatch({ type: 'DEFINIR_FORMACAO', payload: f.nome as any })}
              style={{
                padding: '10px 20px',
                background: state.formacao === f.nome ? '#00d9ff' : '#1a1a1a',
                color: state.formacao === f.nome ? '#000' : '#fff',
                border: '2px solid #2a2a2a',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              {f.nome}
            </button>
          ))}
        </div>

          <button
            onClick={() => setMostrarMercado(!mostrarMercado)}
            style={{
              padding: '10px 20px',
              background: mostrarMercado ? '#4ade80' : '#1a1a1a',
              color: mostrarMercado ? '#000' : '#fff',
              border: '2px solid #2a2a2a',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            {mostrarMercado ? '🔒 Fechar Mercado' : '🛒 Abrir Mercado'}
          </button>

        {/* Mercado de Jogadores */}
        {mostrarMercado && (
          <Mercado
            jogadores={state.todosJogadores}
            clubes={state.clubes}
            jogadoresTitulares={state.jogadoresTitulares}
            jogadoresReservas={state.jogadoresReservas}
            onAdicionarTitular={adicionarTitular}
            onAdicionarReserva={adicionarReserva}
          />
        )}
        <section className="stats" style={{marginBottom: '24px'}}>
          <div className="stat-card">
            <h3>Jogadores Escalados</h3>
            <p className="stat-value" style={{color: jogadoresEscalados === 11 ? '#4ade80' : '#00d9ff'}}>
              {jogadoresEscalados} / 11
            </p>
          </div>
          <div className="stat-card">
            <h3>Pontuação Total</h3>
            <p className="stat-value">{pontuacaoTotal.toFixed(1)}</p>
          </div>
          <div className="stat-card">
            <h3>Valor do Time</h3>
            <p className="stat-value">{valorTotal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</p>
          </div>
          <div className="stat-card">
            <h3>Patrimônio</h3>
            <p className="stat-value">{patrimonio.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</p>
          </div>
        </section>

        {/* Alerta de feedback */}
        {mensagemAlerta && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: mensagemAlerta.includes('adicionado') ? '#4ade80' : '#ff4444',
            color: '#000',
            padding: '16px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 1000,
            maxWidth: '400px',
            fontWeight: '600',
            animation: 'slideIn 0.3s ease'
          }}>
            {mensagemAlerta}
          </div>
        )}

        {/* Mensagem quando time está vazio */}
        {state.jogadoresTitulares.length === 0 && !mostrarMercado && (
          <div style={{textAlign: 'center', padding: '40px 20px', background: '#1a1a1a', borderRadius: '12px', margin: '20px'}}>
            <h3 style={{color: '#00d9ff', marginBottom: '16px'}}>🛒 Seu time está vazio!</h3>
            <p style={{color: '#999', marginBottom: '20px'}}>Abra o mercado para começar a escalar seus jogadores.</p>
            <button
              onClick={() => setMostrarMercado(true)}
              style={{
                padding: '12px 24px',
                background: '#4ade80',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              🛒 Abrir Mercado
            </button>
          </div>
        )}

        <div className="campo-container">
          <div>
            <Campo>
              {obterFormacao().linhas.map((linha, indexLinha) => {
                const mapaPosicoes = obterMapaPosicoes(state.formacao);

                return (
                <div key={indexLinha} style={{display: 'flex', justifyContent: linha.length === 1 ? 'center' : 'space-around', gap: '12px', flexWrap: 'wrap'}}>
                  {linha.map((jogadorIndex) => {
                    const index = jogadorIndex - 1;
                    const jogador = state.jogadoresTitulares[index];
                    const posicoesPermitidas = mapaPosicoes[index] || [];

                    // Se não há jogador nesta posição, mostrar placeholder
                    if (!jogador) {
                      return (
                        <div
                          key={index}
                          style={{
                            width: '120px',
                            height: '140px',
                            border: '2px dashed #444',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#666',
                            fontSize: '0.75rem',
                            textAlign: 'center',
                            padding: '8px',
                            gap: '4px'
                          }}
                        >
                          <div style={{fontSize: '0.85rem', color: '#00d9ff', fontWeight: '600'}}>
                            {posicoesPermitidas.join(' / ')}
                          </div>
                          <div style={{fontSize: '0.7rem'}}>
                            Vaga {index + 1}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={index}
                        ref={(el) => {
                          if (el) {
                            refsTitulares.current.set(index, el);
                          } else {
                            refsTitulares.current.delete(index);
                          }
                        }}
                        onClick={() => dispatch({ type: 'SELECIONAR_TITULAR', payload: index })}
                        style={{cursor: 'pointer', opacity: state.jogadorSelecionado === index ? 0.6 : 1}}
                      >
                        <Jogador nome={jogador.nome} posicao={jogador.posicao} nota={jogador.nota} preco={jogador.preco} />
                      </div>
                    );
                  })}
                </div>
              );
              })}
            </Campo>
            <Banco jogadores={state.jogadoresReservas} onTrocar={trocarJogador} />
          </div>
          <ListaJogadores jogadores={state.jogadoresTitulares} />
        </div>
        
        
      </main>
      <Footer />
    </>
  )
}

export default App
