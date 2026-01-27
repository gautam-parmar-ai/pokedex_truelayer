import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./index.css";

export const PokemonDetail = () => {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [species, setSpecies] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        normal: "#A8A878",
    };

    // Types that need black text
    const blackTextTypes = ["grass", "flying", "electric", "normal", "ground"];

    useEffect(() => {
        const fetchPokemonDetail = async () => {
            try {
                setLoading(true);
                
                // Fetch Pokemon data
                const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                const pokemonData = await pokemonRes.json();
                setPokemon(pokemonData);

                // Fetch species data for description and genus
                const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
                const speciesData = await speciesRes.json();
                setSpecies(speciesData);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPokemonDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="detail-loading">
                <h1>Loading...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="detail-error">
                <h1>Error: {error}</h1>
                <Link to="/" className="back-link">Back to Pokedex</Link>
            </div>
        );
    }

    // Get Pokemon number
    const pokemonNumber = `#${String(pokemon.id).padStart(4, '0')}`;

    // Get Pokemon name (capitalized)
    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    // Get genus from species data
    const genus = species?.genera?.find(g => g.language.name === "en")?.genus || "Unknown";

    // Get description from species data
    const description = species?.flavor_text_entries?.find(f => f.language.name === "en")?.flavor_text?.replace(/\f/g, ' ') || "No description available.";

    // Get types
    const types = pokemon.types.map(t => t.type.name);

    // Get Pokemon image (official artwork for better quality)
    const imageUrl = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.other.dream_world.front_default || pokemon.sprites.front_default;

    // Get abilities
    const abilities = pokemon.abilities.map(a => a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1));

    // Get stats
    const stats = pokemon.stats.map(s => ({
        name: s.stat.name,
        value: s.base_stat
    }));

    return (
        <div className="pokemon-detail">
            <div className="detail-content">
                <Link to="/" className="back-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Pokedex
                </Link>

                <div className="detail-card">
                    <div className="detail-image-section">
                        <img src={imageUrl} alt={pokemonName} className="detail-image" />
                        <div className="detail-types">
                            {types.map(type => (
                                <span 
                                    key={type}
                                    className="detail-type-badge"
                                    style={{ 
                                        backgroundColor: typeColors[type] || '#888888',
                                        color: blackTextTypes.includes(type) ? '#000000' : '#ffffff'
                                    }}
                                >
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="detail-info-section">
                        <span className="detail-number">{pokemonNumber}</span>
                        <h1 className="detail-name">{pokemonName}</h1>
                        <p className="detail-genus">{genus}</p>
                        
                        <div className="detail-description">
                            <p>{description}</p>
                        </div>

                        <div className="detail-meta">
                            <div className="meta-item">
                                <span className="meta-label">Height</span>
                                <span className="meta-value">{pokemon.height / 10} m</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Weight</span>
                                <span className="meta-value">{pokemon.weight / 10} kg</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Base Exp</span>
                                <span className="meta-value">{pokemon.base_experience || "N/A"}</span>
                            </div>
                        </div>

                        <div className="detail-abilities">
                            <h3>Abilities</h3>
                            <div className="abilities-list">
                                {abilities.map(ability => (
                                    <span key={ability} className="ability-badge">{ability}</span>
                                ))}
                            </div>
                        </div>

                        <div className="detail-stats">
                            <h3>Base Stats</h3>
                            <div className="stats-list">
                                {stats.map(stat => (
                                    <div key={stat.name} className="stat-item">
                                        <span className="stat-name">{stat.name}</span>
                                        <div className="stat-bar-container">
                                            <div 
                                                className="stat-bar" 
                                                style={{ width: `${Math.min(stat.value, 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className="stat-value">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

