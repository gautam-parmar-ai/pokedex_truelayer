import { Link } from "react-router-dom"

export const PokemonCards = ({ pokemonData }) => {
    // Pokemon type colors mapping
    const typeColors = {
        fire: "#FD7D24",
        water: "#4592C4",
        electric: "#F8D030",
        grass: "#9BCC50",
        ice: "#98D8D8",
        fighting: "#C03028",
        poison: "#B97FC9",
        ground: "#E0C068",
        flying: "#3DC7EF",
        psychic: "#F85888",
        bug: "#A8B820",
        rock: "#B8A038",
        ghost: "#705898",
        dragon: "#7038F8",
        steel: "#B8B8D0",
        fairy: "#EE99AC",
        dark: "#705848",
    };

    
    const blackTextTypes = ["grass", "flying"];

    // Format Pokemon number with leading zeros (e.g., #0001)
    const pokemonNumber = pokemonData.id ? `#${String(pokemonData.id).padStart(4, '0')}` : '#0001';

    return (
        <li className="pokemon-card">
            <Link to={`/pokemon/${pokemonData.id}`} className="pokemon-card-link">
                <figure className="pokemon-image-container">
                    <img 
                        src={pokemonData.sprites.other.dream_world.front_default} 
                        alt={pokemonData.name}
                        className="pokemon-image"
                    />
                </figure> 
                <div className="pokemon-content">
                    <span className="pokemon-number">{pokemonNumber}</span>
                    <h1 className="pokemon-name">{pokemonData.name}</h1>
                    <div className="pokemon-info pokemon-highlight">
                        {pokemonData.types.map((curType) => (
                            <span 
                                key={curType.type.name} 
                                className="type-badge"
                                style={{ 
                                    backgroundColor: typeColors[curType.type.name] || '#888888',
                                    color: blackTextTypes.includes(curType.type.name) ? '#000000' : '#ffffff'
                                }}
                            >
                                {curType.type.name}
                            </span>
                        ))}
                    </div>
                </div>
            </Link>
        </li>
    );
};

