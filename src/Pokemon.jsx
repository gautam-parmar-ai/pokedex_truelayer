import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { PokemonCards } from "./PokemonCards";
export const Pokemon = () => {

    const [pokemon, setPokemon] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(null);
    const [search, setsearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
    const [sortBy, setSortBy] = useState("default"); // "default", "asc", "desc"
    const [randomPokemon, setRandomPokemon] = useState(null);
    const itemsPerPage = 8;
    
        const API = "https://pokeapi.co/api/v2/pokemon?limit=151";
        const fetchPokemon = async() => {
            try {
                const res = await fetch(API);
                const data = await res.json();
                // console.log(data);

                const detailedPokemonData = data.results.map( async (curPokemon) => {
                    // console.log(curPokemon.url);

                    const res = await fetch(curPokemon.url)
                    const data = await res.json();
                    // console.log(data);
                    return data;
                    
                    
                });
                const detailedResponseData = await Promise.all(detailedPokemonData);
                    console.log(detailedResponseData);
                    setPokemon(detailedResponseData);
                    setloading(false);
            } catch (error) {
                console.log(error);
                setloading(false);
                seterror(error);
            }
        }
        useEffect(() => {
        fetchPokemon()
    },[])

    //search functionality

    const searchData = pokemon.filter((curPokemon) => curPokemon.name.toLowerCase().includes(search.toLowerCase()));

    // Sort functionality
    const sortedData = [...searchData].sort((a, b) => {
        if (sortBy === "asc") {
            return a.id - b.id;
        } else if (sortBy === "desc") {
            return b.id - a.id;
        }
        return 0; // default order
    });

    // Pagination logic
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const indexOfLastPokemon = currentPage * itemsPerPage;
    const indexOfFirstPokemon = indexOfLastPokemon - itemsPerPage;
    const currentPokemon = sortedData.slice(indexOfFirstPokemon, indexOfLastPokemon);

    // Pagination functions
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Random Pokemon generator
    const handleRandomPokemon = () => {
        const randomIndex = Math.floor(Math.random() * pokemon.length);
        setRandomPokemon(pokemon[randomIndex]);
        setCurrentPage(Math.floor(randomIndex / itemsPerPage) + 1);
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);
            
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
            
            if (startPage > 1) {
                pageNumbers.unshift('...');
            }
            if (endPage < totalPages) {
                pageNumbers.push('...');
            }
        }
        
        return pageNumbers;
    };

    if(loading){
        return(
            <div>
                <h1> Loading... </h1>
            </div>
        );
    }

    if(error){
        return(
            <div>
                <h1> {error.message}</h1>
            </div>
        );
    }

    return <>
    <section className="container">
        <header className="pokedex-header">
            <div className="header-content">
                <Link to="/" className="header-title">Pokedex</Link>
                <div className="search-container">
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Search Pokemon..." 
                            value={search} 
                            onChange={(e) => setsearch(e.target.value)}
                            className="search-input"
                        />
                        <button className="search-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </div>
                    <button className="surprise-btn" onClick={handleRandomPokemon}>
                        Surprise Me!
                    </button>
                </div>
            </div>
        </header>
        
        {/* View Toggle and Sort */}
        <div className="controls-bar">
            <div className="view-toggle">
                <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                </button>
                <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <div className="sort-control">
                <select 
                    className="sort-select" 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="default">Sort by</option>
                    <option value="asc">Number: Low to High</option>
                    <option value="desc">Number: High to Low</option>
                </select>
            </div>
        </div>
        
        <div>
            <ul className={`cards ${viewMode}`}>
                {currentPokemon.map((curPokemon) =>{
                    return <PokemonCards key={curPokemon.id} pokemonData={curPokemon}/>
                })}
            </ul>
        </div>
        
        {/* Pagination UI */}
        {totalPages > 1 && (
            <div className="pagination">
                <button 
                    className="pagination-btn" 
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                
                {getPageNumbers().map((pageNumber, index) => (
                    <button
                        key={index}
                        className={`pagination-btn ${pageNumber === currentPage ? 'active' : ''}`}
                        onClick={() => pageNumber !== '...' && handlePageChange(pageNumber)}
                        disabled={pageNumber === '...'}
                    >
                        {pageNumber}
                    </button>
                ))}
                
                <button 
                    className="pagination-btn" 
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        )}
    </section>
    </>
}
