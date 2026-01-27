import { Routes, Route } from "react-router-dom"
import { Pokemon } from "./Pokemon"
import { PokemonDetail } from "./PokemonDetail"

export const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Pokemon />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
    )
}
