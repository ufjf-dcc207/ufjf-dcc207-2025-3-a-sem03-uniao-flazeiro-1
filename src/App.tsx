import './styles/App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Campo from './components/Campo'
import Jogador from './components/Jogador'
import ListaJogadores from './components/ListaJogadores'


function App() {
  const jogadores = [
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
    { posicao: 'ATA', nome: 'Juninho Xé', nota: 7.0, preco: 8.3 }
  ];

  const pontuacaoTotal = jogadores.reduce((total, jogador) => total + jogador.nota, 0);
  const valorTotal = jogadores.reduce((total, jogador) => total + jogador.preco, 0);
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
              <Jogador nome="Cássio" posicao="GOL" nota={7.2} preco={6.8} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-around', gap: '12px', flexWrap: 'wrap'}}>
              <Jogador nome="Kaiki" posicao="LAT" nota={6.5} preco={5.2} />
              <Jogador nome="Leo Ortiz" posicao="ZAG" nota={7.2} preco={5.8} />
              <Jogador nome="Fabrício Bruno" posicao="ZAG" nota={6.8} preco={7.5} />
              <Jogador nome="Alex Sandro" posicao="LAT" nota={6.3} preco={4.2} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-around', gap: '12px', flexWrap: 'wrap'}}>
              <Jogador nome="Matheus Henrique" posicao="VOL" nota={7.1} preco={7.5} />
              <Jogador nome="Arrascaeta" posicao="MEI" nota={8.1} preco={18.4} />
              <Jogador nome="Matheus Pereira" posicao="MEI" nota={8.3} preco={19.2} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-around', gap: '12px', flexWrap: 'wrap'}}>
              <Jogador nome="Kaio Jorge" posicao="ATA" nota={6.7} preco={17.9} />
              <Jogador nome="Pedro" posicao="ATA" nota={8.5} preco={16.8} />
              <Jogador nome="Juninho Xé" posicao="ATA" nota={7.0} preco={8.3} />
            </div>
          </Campo>
          <ListaJogadores jogadores={jogadores} />
        </div>
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
