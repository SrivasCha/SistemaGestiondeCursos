import { useEffect, useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';

const TrailersPage = () => {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
  const IMAGE_PATH = "https://image.tmoviedb.org/t/p/original";
  const URL_IMAGE = "https://image.tmdb.org/t/p/original";

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async (searchKey) => {
    setLoading(true);
    try {
      const type = searchKey ? "search" : "discover";
      const { data: { results } } = await axios.get(`${API_URL}/${type}/movie`, {
        params: {
          api_key: API_KEY,
          query: searchKey,
        },
      });

      setMovies(results);
      setMovie(results[0]);

      if (results.length) {
        await fetchMovie(results[0].id);
      }
    } catch (error) {
      console.error("Error al cargar películas:", error);
      alert("Error al cargar películas de TMDB");
    } finally {
      setLoading(false);
    }
  };

  const fetchMovie = async (id) => {
    try {
      const { data } = await axios.get(`${API_URL}/movie/${id}`, {
        params: {
          api_key: API_KEY,
          append_to_response: "videos",
        },
      });

      if (data.videos && data.videos.results) {
        const trailer = data.videos.results.find(
          (vid) => vid.name === "Official Trailer"
        );
        setTrailer(trailer ? trailer : data.videos.results[0]);
      }
      setMovie(data);
    } catch (error) {
      console.error("Error al cargar película:", error);
    }
  };

  const selectMovie = async (movie) => {
    setPlaying(false);
    await fetchMovie(movie.id);
    setMovie(movie);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid p-4" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="fs-5" style={{ color: '#94a3b8' }}>Cargando Tráilers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0" style={{ background: 'transparent' }}>
      {/* Header con búsqueda */}
      <div className="container-fluid px-4 py-4" style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
        borderBottom: '1px solid rgba(100, 116, 139, 0.3)'
      }}>
        <div className="row align-items-center g-3" style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <div className="col-md-6">
            <h2 className="mb-2" style={{ 
              fontSize: '2rem', 
              fontWeight: '700',
              color: 'white'
            }}>
              <i className="fas fa-play-circle me-3" style={{ color: '#3b82f6' }}></i>
              Nuevos Lanzamientos y Tráilers
            </h2>
            <p className="mb-0" style={{ color: '#94a3b8' }}>
              Descubre los últimos estrenos y sus tráilers oficiales
            </p>
          </div>
          <div className="col-md-6">
            <form onSubmit={searchMovies}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar películas en TMDB..."
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(100, 116, 139, 0.3)',
                    color: 'black',
                    padding: '0.75rem 1rem'
                  }}
                />
                <button 
                  className="btn btn-warning" 
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    fontWeight: '600'
                  }}
                >
                  <i className="fas fa-search me-2"></i>
                  Buscar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Contenedor del reproductor/previsualización */}
      {movie && (
        <div
          className="viewtrailer"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.95) 10%, rgba(15, 23, 42, 0.3) 50%, rgba(15, 23, 42, 0.8)), url("${IMAGE_PATH}${movie.backdrop_path}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'flex-end',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {playing ? (
            <div className="w-100 h-100 position-relative" style={{ background: '#000' }}>
              <YouTube
                videoId={trailer?.key}
                className="reproductor"
                containerClassName={"youtube-container"}
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: {
                    autoplay: 1,
                    controls: 1,
                    modestbranding: 1
                  },
                }}
              />
              <button 
                onClick={() => setPlaying(false)} 
                className="btn btn-danger position-absolute m-3"
                style={{
                  top: '10px',
                  right: '10px',
                  zIndex: 100,
                  padding: '0.75rem 1.5rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                }}
              >
                <i className="fas fa-times"></i>
                Cerrar Tráiler
              </button>
            </div>
          ) : (
            <div className="container p-5" style={{ position: 'relative', zIndex: 2 }}>
              <div className="row">
                <div className="col-lg-8">
                  {/* Título de la película */}
                  <h1 className="display-3 fw-bold mb-3" style={{
                    color: 'white',
                    textShadow: '0 4px 10px rgba(0, 0, 0, 0.5)'
                  }}>
                    {movie.title}
                  </h1>

                  {/* Información adicional */}
                  <div className="d-flex flex-wrap gap-3 mb-4">
                    {movie.release_date && (
                      <span className="badge" style={{
                        background: 'rgba(37, 99, 235, 0.3)',
                        border: '1px solid rgba(37, 99, 235, 0.5)',
                        color: '#60a5fa',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        <i className="fas fa-calendar me-2"></i>
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                    )}
                    {movie.vote_average && (
                      <span className="badge" style={{
                        background: 'rgba(245, 158, 11, 0.3)',
                        border: '1px solid rgba(245, 158, 11, 0.5)',
                        color: '#fbbf24',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        <i className="fas fa-star me-2"></i>
                        {movie.vote_average.toFixed(1)}/10
                      </span>
                    )}
                  </div>

                  {/* Descripción */}
                  <p className="lead mb-4" style={{
                    color: '#cbd5e1',
                    fontSize: '1.1rem',
                    lineHeight: '1.8',
                    textShadow: '0 2px 5px rgba(0, 0, 0, 0.5)',
                    maxWidth: '800px'
                  }}>
                    {movie.overview || "Sin descripción disponible"}
                  </p>

                  {/* Botón de tráiler */}
                  <div className="d-flex gap-3 flex-wrap">
                    {trailer ? (
                      <button
                        className="btn btn-lg"
                        onClick={() => setPlaying(true)}
                        style={{
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '1rem 2rem',
                          fontWeight: '700',
                          fontSize: '1.1rem',
                          borderRadius: '12px',
                          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.4)';
                        }}
                      >
                        <i className="fas fa-play-circle" style={{ fontSize: '1.5rem' }}></i>
                        Ver Tráiler
                      </button>
                    ) : (
                      <div className="alert alert-warning d-inline-flex align-items-center" style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        border: '1px solid rgba(245, 158, 11, 0.5)',
                        color: '#fbbf24',
                        padding: '1rem 1.5rem',
                        borderRadius: '12px'
                      }}>
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        No hay tráiler disponible
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Galería de películas */}
      <div className="container-fluid px-4 py-5" style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div className="mb-4">
          <h3 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '0.5rem'
          }}>
            <i className="fas fa-film me-2" style={{ color: '#3b82f6' }}></i>
            Catálogo Disponible
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: 0 }}>
            {movies.length} películas encontradas
          </p>
        </div>

        <div className="row g-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
              onClick={() => selectMovie(movie)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card h-100" style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                border: '1px solid rgba(100, 116, 139, 0.3)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.3)';
                e.currentTarget.style.borderColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.3)';
              }}
              >
                {/* Poster de la película */}
                <div style={{ 
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {movie.poster_path ? (
                    <img
                      src={`${URL_IMAGE}${movie.poster_path}`}
                      alt={movie.title}
                      className="card-img-top"
                      style={{ 
                        height: '400px', 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <div style={{
                      height: '400px',
                      background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-film" style={{ fontSize: '4rem', color: 'white', opacity: 0.5 }}></i>
                    </div>
                  )}
                  
                  {/* Rating badge */}
                  {movie.vote_average > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(10px)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <i className="fas fa-star" style={{ color: '#fbbf24', fontSize: '0.875rem' }}></i>
                      <span style={{ color: 'white', fontWeight: '700', fontSize: '0.875rem' }}>
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info de la película */}
                <div className="card-body" style={{ padding: '1rem' }}>
                  <h5 className="card-title" style={{
                    color: 'white',
                    marginBottom: '0.5rem',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    height: '2.8em',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.4em'
                  }}>
                    {movie.title}
                  </h5>
                  
                  {movie.release_date && (
                    <p style={{
                      color: '#94a3b8',
                      fontSize: '0.875rem',
                      marginBottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <i className="fas fa-calendar" style={{ fontSize: '0.75rem' }}></i>
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  )}
                </div>

                {/* Hover effect overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to top, rgba(37, 99, 235, 0.9) 0%, transparent 50%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: '1.5rem',
                  pointerEvents: 'none'
                }}
                className="hover-overlay"
                >
                  <button className="btn btn-light btn-sm" style={{
                    fontWeight: '600',
                    pointerEvents: 'all'
                  }}>
                    <i className="fas fa-play me-2"></i>
                    Ver Detalles
                  </button>
                </div>

                <style>{`
                  .card:hover .hover-overlay {
                    opacity: 1;
                  }
                `}</style>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay resultados */}
        {movies.length === 0 && (
          <div className="text-center py-5">
            <i className="fas fa-search mb-3" style={{ fontSize: '4rem', color: '#475569' }}></i>
            <p style={{ color: '#94a3b8', fontSize: '1.25rem', marginBottom: 0 }}>
              No se encontraron películas. Intenta con otra búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrailersPage;