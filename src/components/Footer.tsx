import "../styles/Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>Chapéu FC</h3>
                    <p>Onde seus palpites viram tem muito valor! (pra gente)</p>
                </div>
                <div className="footer-section">
                    <h4>Links Rápidos</h4>
                    <a href="#">Termos de Uso (Leia com atenção)</a>
                    <a href="#">Perguntas Frequentes (É isso mesmo, eu te avisei pra ler com atenção)</a>
                    <a href="#">Contato do nosso time jurídico</a>
                </div>
                <div className="footer-section">
                    <h4>Redes Sociais</h4>
                    <a href="#">Instagram </a>
                    <a href="#">Twitter</a>
                    <a href="#">Facebook</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 Chapéu FC. Entre Cruzeiro e Flamengo o menor sempre será o Atlético Mineiro.</p>
            </div>
        </footer>
    );
}
