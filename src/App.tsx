import './styles/App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Campo from './components/Campo'
import Jogador from './components/Jogador'
import ListaJogadores from './components/ListaJogadores'

function App() {
  const jogadores = [
    { posicao: 'GOL', nome: 'Cássio', nota: 7.2 },
    { posicao: 'LAT', nome: 'Wesley', nota: 6.5 },
    { posicao: 'ZAG', nome: 'Léo Ortiz', nota: 7.2 },
    { posicao: 'ZAG', nome: 'João Marcelo', nota: 6.8 },
    { posicao: 'LAT', nome: 'Alex Sandro', nota: 6.3 },
    { posicao: 'VOL', nome: 'Matheus Henrique', nota: 7.1 },
    { posicao: 'MEI', nome: 'De la Cruz', nota: 8.1 },
    { posicao: 'MEI', nome: 'Matheus Pereira', nota: 8.3 },
    { posicao: 'ATA', nome: 'Gabriel Veron', nota: 6.7 },
    { posicao: 'ATA', nome: 'Pedro', nota: 8.5 },
    { posicao: 'ATA', nome: 'Lautaro Díaz', nota: 7.0 }
  ];

  return (
    <>
      <Header />
      <main className="main-content">
        <section className="hero">
          <h2>Meu Time</h2>
          <p>Escale seus jogadores e dispute a liderança!</p>
        </section>
        <div className="campo-container">
          <Campo>
            <div style={{display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap'}}>
              <Jogador nome="Cássio" posicao="GOL" nota={7.2} preco={6.8} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-around', gap: '12px', flexWrap: 'wrap'}}>
              <Jogador nome="Wesley" posicao="LAT" nota={6.5} preco={5.2} />
              <Jogador nome="Léo Ortiz" posicao="ZAG" nota={7.2} preco={7.8} />
              <Jogador nome="João Marcelo" posicao="ZAG" nota={6.8} preco={5.5} />
              <Jogador nome="Alex Sandro" posicao="LAT" nota={6.3} preco={4.2} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-around', gap: '12px', flexWrap: 'wrap'}}>
              <Jogador nome="Matheus Henrique" posicao="VOL" nota={7.1} preco={7.5} />
              <Jogador nome="De la Cruz" posicao="MEI" nota={8.1} preco={12.4} />
              <Jogador nome="Matheus Pereira" posicao="MEI" nota={8.3} preco={13.2} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-around', gap: '12px', flexWrap: 'wrap'}}>
              <Jogador nome="Gabriel Veron" posicao="ATA" nota={6.7} preco={6.9} />
              <Jogador nome="Pedro" posicao="ATA" nota={8.5} preco={15.8} />
              <Jogador nome="Lautaro Díaz" posicao="ATA" nota={7.0} preco={8.3} />
            </div>
          </Campo>
          <ListaJogadores jogadores={jogadores} />
        </div>
        <section className="stats">
          <div className="stat-card">
            <h3>Pontuação Total</h3>
            <p className="stat-value">78.9</p>
          </div>
          <div className="stat-card">
            <h3>Valor do Time</h3>
            <p className="stat-value">R$ 88,50</p>
          </div>
          <div className="stat-card">
            <h3>Patrimônio</h3>
            <p className="stat-value">R$ 100,00</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default App
