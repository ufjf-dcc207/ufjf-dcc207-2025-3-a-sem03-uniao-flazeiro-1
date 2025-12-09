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

  const trocarJogador = (indexReserva: number) => {
    if (jogadorSelecionado === null) return;
    
    const novosTitulares = [...jogadoresTitulares];
    const novasReservas = [...jogadoresReservas];
    
    const temp = novosTitulares[jogadorSelecionado];
    novosTitulares[jogadorSelecionado] = novasReservas[indexReserva];
    novasReservas[indexReserva] = temp;
    
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
        <div className="campo-container">
          <Campo>
            <div style={{display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap'}}>
              <div onClick={() => setJogadorSelecionado(0)} style={{cursor: 'pointer', opacity: jogadorSelecionado === 0 ? 0.6 : 1}}>
                <Jogador nome={jogadoresTitulares[0].nome} posicao={jogadoresTitulares[0].posicao} nota={jogadoresTitulares[0].nota} preco={jogadoresTitulares[0].preco} />
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-around', gap: '12px', flexWrap: 'wrap'}}>
              <div onClick={() => setJogadorSelecionado(1)} style={{cursor: 'pointer', opacity: jogadorSelecionado === 1 ? 0.6 : 1}}>
                <Jogador nome={jogadoresTitulares[1].nome} posicao={jogadoresTitulares[1].posicao} nota={jogadoresTitulares[1].nota} preco={jogadoresTitulares[1].preco} />
              </div>
              <div onClick={() => setJogadorSelecionado(2)} style={{cursor: 'pointer', opacity: jogadorSelecionado === 2 ? 0.6 : 1}}>
                <Jogador nome={jogadoresTitulares[2].nome} posicao={jogadoresTitulares[2].posicao} nota={jogadoresTitulares[2].nota} preco={jogadoresTitulares[2].preco} />
              </div>
              <div onClick={() => setJogadorSelecionado(3)} style={{cursor: 'pointer', opacity: jogadorSelecionado === 3 ? 0.6 : 1}}>
                <Jogador nome={jogadoresTitulares[3].nome} posicao={jogadoresTitulares[3].posicao} nota={jogadoresTitulares[3].nota} preco={jogadoresTitulares[3].preco} />
              </div>
              <div onClick={() => setJogadorSelecionado(4)} style={{cursor: 'pointer', opacity: jogadorSelecionado === 4 ? 0.6 : 1}}>
                <Jogador nome={jogadoresTitulares[4].nome} posicao={jogadoresTitulares[4].posicao} nota={jogadoresTitulares[4].nota} preco={jogadoresTitulares[4].preco} />
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-around', gap: '12px', flexWrap: 'wrap'}}>
              <div onClick={() => setJogadorSelecionado(5)} style={{cursor: 'pointer', opacity: jogadorSelecionado === 5 ? 0.6 : 1}}>
                <Jogador nome={jogadoresTitulares[5].nome} posicao={jogadoresTitulares[5].posicao} nota={jogadoresTitulares[5].nota} preco={jogadoresTitulares[5].preco} />
              </div>
              <div onClick={() => setJogadorSelecionado(6)} style={{cursor: 'pointer', opacity: jogadorSelecionado === 6 ? 0.6 : 1}}>
                <Jogador nome={jogadoresTitulares[6].nome} posicao={jogadoresTitulares[6].posicao} nota={jogadoresTitulares[6].nota} preco={jogadoresTitulares[6].preco} />
              </div>
              <div onClick={() => setJogadorSelecionado(7)} style={{cursor: 'pointer', opacity: jogadorSelecionado === 7 ? 0.6 : 1}}>
                <Jogador nome={jogadoresTitulares[7].nome} posicao={jogadoresTitulares[7].posicao} nota={jogadoresTitulares[7].nota} preco={jogadoresTitulares[7].preco} />
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-around', gap: '12px', flexWrap: 'wrap'}}>
              <div onClick={() => setJogadorSelecionado(8)} style={{cursor: 'pointer', opacity: jogadorSelecionado === 8 ? 0.6 : 1}}>
                <Jogador nome={jogadoresTitulares[8].nome} posicao={jogadoresTitulares[8].posicao} nota={jogadoresTitulares[8].nota} preco={jogadoresTitulares[8].preco} />
              </div>
              <div onClick={() => setJogadorSelecionado(9)} style={{cursor: 'pointer', opacity: jogadorSelecionado === 9 ? 0.6 : 1}}>
                <Jogador nome={jogadoresTitulares[9].nome} posicao={jogadoresTitulares[9].posicao} nota={jogadoresTitulares[9].nota} preco={jogadoresTitulares[9].preco} />
              </div>
              <div onClick={() => setJogadorSelecionado(10)} style={{cursor: 'pointer', opacity: jogadorSelecionado === 10 ? 0.6 : 1}}>
                <Jogador nome={jogadoresTitulares[10].nome} posicao={jogadoresTitulares[10].posicao} nota={jogadoresTitulares[10].nota} preco={jogadoresTitulares[10].preco} />
              </div>
            </div>
          </Campo>
          <ListaJogadores jogadores={jogadoresTitulares} />
        </div>
        <Banco jogadores={jogadoresReservas} onTrocar={trocarJogador} />
        <section className="stats">
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
        
      </main>
      <Footer />
    </>
  )
}

export default App
