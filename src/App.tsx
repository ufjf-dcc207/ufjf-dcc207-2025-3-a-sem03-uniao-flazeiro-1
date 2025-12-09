import './styles/App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Campo from './components/Campo'
import Jogador from './components/Jogador'
import ListaJogadores from './components/ListaJogadores'
import Banco from './components/Banco'
import { useState } from 'react'

function App() {
  const todosJogadores = [
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

  const [jogadoresTitulares, setJogadoresTitulares] = useState(todosJogadores.slice(0, 11));
  const [jogadoresReservas, setJogadoresReservas] = useState(todosJogadores.slice(11));
  const [jogadorSelecionado, setJogadorSelecionado] = useState<number | null>(null);
  const [formacao, setFormacao] = useState('4-3-3');

  const formacoesDisponiveis = [
    { nome: '4-3-3', linhas: [[1], [2, 3, 4, 5], [6, 7, 8], [9, 10, 11]] },
    { nome: '4-4-2', linhas: [[1], [2, 3, 4, 5], [6, 7, 8, 9], [10, 11]] },
    { nome: '3-5-2', linhas: [[1], [2, 3, 4], [5, 6, 7, 8, 9], [10, 11]] }
  ];

  const obterFormacao = () => {
    return formacoesDisponiveis.find(f => f.nome === formacao) || formacoesDisponiveis[0];
  };

  const trocarJogador = (indexReserva: number) => {
    if (jogadorSelecionado === null) return;
    
    const titular = jogadoresTitulares[jogadorSelecionado];
    const reserva = jogadoresReservas[indexReserva];
    
    const posicoesCompativeis = (pos1: string, pos2: string) => {
      if (pos1 === 'GOL' || pos2 === 'GOL') return pos1 === pos2;
      if (pos1 === 'LAT' || pos2 === 'LAT') return pos1 === pos2;
      if (pos1 === 'ZAG' || pos2 === 'ZAG') return pos1 === pos2;
      if ((pos1 === 'VOL' || pos1 === 'MEI') && (pos2 === 'VOL' || pos2 === 'MEI')) return true;
      if (pos1 === 'ATA' || pos2 === 'ATA') return pos1 === pos2;
      return false;
    };
    
    if (!posicoesCompativeis(titular.posicao, reserva.posicao)) {
      return;
    }
    
    const novosTitulares = [...jogadoresTitulares];
    const novasReservas = [...jogadoresReservas];
    
    novosTitulares[jogadorSelecionado] = reserva;
    novasReservas[indexReserva] = titular;
    
    setJogadoresTitulares(novosTitulares);
    setJogadoresReservas(novasReservas);
    setJogadorSelecionado(null);
  };

  const pontuacaoTotal = jogadoresTitulares.reduce((total, jogador) => total + jogador.nota, 0);
  const valorTotal = jogadoresTitulares.reduce((total, jogador) => total + jogador.preco, 0);
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
              onClick={() => setFormacao(f.nome)}
              style={{
                padding: '10px 20px',
                background: formacao === f.nome ? '#00d9ff' : '#1a1a1a',
                color: formacao === f.nome ? '#000' : '#fff',
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
                      <div key={index} onClick={() => setJogadorSelecionado(index)} style={{cursor: 'pointer', opacity: jogadorSelecionado === index ? 0.6 : 1}}>
                        <Jogador nome={jogadoresTitulares[index].nome} posicao={jogadoresTitulares[index].posicao} nota={jogadoresTitulares[index].nota} preco={jogadoresTitulares[index].preco} />
                      </div>
                    );
                  })}
                </div>
              ))}
            </Campo>
            <Banco jogadores={jogadoresReservas} onTrocar={trocarJogador} />
          </div>
          <ListaJogadores jogadores={jogadoresTitulares} />
        </div>
        
        
      </main>
      <Footer />
    </>
  )
}

export default App
