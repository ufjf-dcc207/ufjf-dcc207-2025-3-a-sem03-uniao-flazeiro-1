import "../styles/Banco.css";
import Jogador from "./Jogador";

interface JogadorType {
    posicao: string;
    nome: string;
    nota: number;
    preco: number;
}

interface BancoProps {
    jogadores: JogadorType[];
    onTrocar: (index: number) => void;
}

export default function Banco({ jogadores, onTrocar }: BancoProps) {
    return (
        <div className="banco">
            <h3>BANCO DE RESERVAS</h3>
            <div className="banco-lista">
                {jogadores.map((jogador, index) => (
                    <div key={index} onClick={() => onTrocar(index)} style={{cursor: 'pointer'}}>
                        <Jogador nome={jogador.nome} posicao={jogador.posicao} nota={jogador.nota} preco={jogador.preco} />
                    </div>
                ))}
            </div>
        </div>
    );
}