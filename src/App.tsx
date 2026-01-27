import './styles/App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Campo from './components/Campo'
import Jogador from './components/Jogador'
import ListaJogadores from './components/ListaJogadores'
import Banco from './components/Banco'
import { useReducer, useEffect, useRef } from 'react'
import { posicoesCompativeis } from './domain/trocas'
import { appReducer, initialState } from './state/appReducer'
import { carregarEstado, salvarEstado } from './domain/persistencia'

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const refsTitulares = useRef<Map<number, HTMLDivElement>>(new Map());
  const primeiroRender = useRef(true);

  const formacoesDisponiveis = [
    { nome: '4-3-3', linhas: [[1], [2, 3, 4, 5], [6, 7, 8], [9, 10, 11]] },
    { nome: '4-4-2', linhas: [[1], [2, 3, 4, 5], [6, 7, 8, 9], [10, 11]] },
    { nome: '3-5-2', linhas: [[1], [2, 3, 4], [5, 6, 7, 8, 9], [10, 11]] }
  ];

  // Hidratar estado do localStorage no mount
  useEffect(() => {
    const estadoSalvo = carregarEstado();
    if (estadoSalvo) {
      dispatch({ type: 'HIDRATAR_ESTADO', payload: estadoSalvo });
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

  const pontuacaoTotal = state.jogadoresTitulares.reduce((total, jogador) => total + jogador.nota, 0);
  const valorTotal = state.jogadoresTitulares.reduce((total, jogador) => total + jogador.preco, 0);
  const patrimonio = 140.0;

  return (
    <>
      <Header />
      <main className="main-content">
        <section className="hero">
          <h2>Flazeiro FC</h2>
        </section>
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
        <section className="stats" style={{marginBottom: '24px'}}>
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
        <div className="campo-container">
          <div>
            <Campo>
              {obterFormacao().linhas.map((linha, indexLinha) => (
                <div key={indexLinha} style={{display: 'flex', justifyContent: linha.length === 1 ? 'center' : 'space-around', gap: '12px', flexWrap: 'wrap'}}>
                  {linha.map((jogadorIndex) => {
                    const index = jogadorIndex - 1;
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
                        <Jogador nome={state.jogadoresTitulares[index].nome} posicao={state.jogadoresTitulares[index].posicao} nota={state.jogadoresTitulares[index].nota} preco={state.jogadoresTitulares[index].preco} />
                      </div>
                    );
                  })}
                </div>
              ))}
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
