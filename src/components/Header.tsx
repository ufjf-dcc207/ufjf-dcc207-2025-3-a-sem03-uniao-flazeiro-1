import "../styles/Header.css";

export default function Header() {
    return (
        <header className="header">
            <div className="container">
                <h1 className="logo">Chapéu FC</h1>
                <nav className="nav">
                    <a href="#" className="nav-link">Meu Time</a>
                    <a href="#" className="nav-link">Mercado</a>
                    <a href="#" className="nav-link">Ranking</a>
                    <a href="#" className="nav-link">Como Jogar</a>
                </nav>
            </div>
        </header>
    );
}
