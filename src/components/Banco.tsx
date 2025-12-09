import type { ReactNode } from "react"
import "../styles/banco.css"

interface BancoProps {
    children?: ReactNode;
}
export default function Banco({children}: BancoProps) {
    return (
        <div className="banco">
            {children}
        </div>
    )
}