import "../styles/ListaJogadores.css";

interface Jogador {
    posicao: string;
    nome: string;
    nota: number;
}

interface ListaJogadoresProps {
    jogadores: Jogador[];
}

export default function ListaJogadores({ jogadores }: ListaJogadoresProps) {
    // Filtrar apenas jogadores que existem (não são undefined/null)
    const jogadoresValidos = jogadores.filter(j => j);

    return (
        <div className="lista-jogadores">
            <h3>SUAS PARCIAIS</h3>
            <div className="jogadores-lista">
                {jogadoresValidos.map((jogador, index) => (
                    <div key={index} className="jogador-item">
                        <span className="jogador-posicao">{jogador.posicao}</span>
                        <span className="jogador-nome">{jogador.nome}</span>
                        <span className={`jogador-nota ${jogador.nota >= 0 ? 'positiva' : 'negativa'}`}>
                            {jogador.nota > 0 ? '+' : ''}{jogador.nota.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
