import "./Jogador.css";

interface JogadorProps {
    nome?: string;
    posicao?: string;
    nota?: number;
    preco?: number;
}
export default function Jogador ({nome, posicao, nota, preco}: JogadorProps) {
    return (
        <div className="jogador">
            <div className="topo">
                <div className="nome">{nome}</div>
                <div className="posicao">{posicao}</div>
            </div>
            <div className="meio">
                <img src="imagens/uniforme.png" alt="Unifrome" className="uniforme"></img>
            </div>
            <div className="base">
                <div className={`nota ${nota! >= 0 ? "alta" :  "baixa"}`}>
                    {nota?.toFixed(2)}
                </div>
            </div>
            <div className="precoJogador">{preco?.toLocaleString("pt-br", {style: "currency", currency: "BRL"})}</div>
        </div>
    )
}