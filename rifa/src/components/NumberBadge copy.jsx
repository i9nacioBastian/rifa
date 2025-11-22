import React from 'react';

export default function NumberBadge({
    number,
    isWinner,
    isLoser,
    isUnavailable,
    isSold,
    markingMode,
    onClick
}) {
    const getColors = () => {
        if (isWinner) {
            return { primary: '#10b981', secondary: '#059669', glow: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))' };
        }
        if (isLoser) {
            return { primary: '#ef4444', secondary: '#ec4899', glow: '' };
        }
        if (isSold) {
            return { primary: '#10b981', secondary: '#059669', glow: '' };
        }
        if (isUnavailable) {
            return { primary: '#9ca3af', secondary: '#6b7280', glow: '' };
        }
        return { primary: '#9ca3af', secondary: '#9ca3af', glow: '' };
    };

    const colors = getColors();
    const canClick = markingMode && !isWinner && !isLoser && !isSold;

    const handleClick = () => {
        if (canClick) {
            onClick?.(number);
        }
    };

    return (
        <div
            className={`relative w-[30px] h-[30px] sm:w-[42px] sm:h-[42px] transition-all duration-300 ${canClick ? 'cursor-pointer hover:scale-110' : ''} ${isWinner ? 'animate-pulse' : ''}`}
            onClick={handleClick}
            style={{ filter: colors.glow }}
        >
            {/* SVG Huella de pata realista */}
            <svg
                viewBox="0 0 100 110"
                className="w-full h-full drop-shadow-md"
                style={{ filter: isUnavailable ? 'opacity(0.6)' : '' }}
            >
                <defs>
                    <linearGradient id={`gradient-${number}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={colors.primary} />
                        <stop offset="100%" stopColor={colors.secondary} />
                    </linearGradient>
                </defs>

                {/* Almohadilla principal (grande, ovalada) */}
                <ellipse
                    cx="50"
                    cy="70"
                    rx="30"
                    ry="30"
                    fill={`url(#gradient-${number})`}
                    className={canClick ? 'transition-all hover:stroke-teal-400' : ''}
                    stroke={canClick ? 'transparent' : 'none'}
                    strokeWidth="2"
                />

                {/* Dedito 1 (izquierda superior) - más pequeño y redondeado */}
                <circle
                    cx="17"
                    cy="42"
                    r="10"
                    fill={`url(#gradient-${number})`}
                />

                {/* Dedito 2 (centro-izquierda) - ligeramente más grande */}
                <ellipse
                    cx="38"
                    cy="20"
                    rx="11"
                    ry="13"
                    fill={`url(#gradient-${number})`}
                />

                {/* Dedito 3 (centro-derecha) - ligeramente más grande */}
                <ellipse
                    cx="62"
                    cy="20"
                    rx="11"
                    ry="13"
                    fill={`url(#gradient-${number})`}
                />

                {/* Dedito 4 (derecha superior) - más pequeño y redondeado */}
                <circle
                    cx="85"
                    cy="41"
                    r="10"
                    fill={`url(#gradient-${number})`}
                />
            </svg>

            {/* Contenido superpuesto */}
            <div className="absolute inset-0 flex items-center justify-center">
                {isWinner && (
                    <i className="fas fa-trophy text-yellow-300 text-[10px] absolute top-1 left-1"></i>
                )}
                {isLoser && (
                    <i className="fas fa-tint text-blue-300 text-[10px] absolute top-1 left-1"></i>
                )}
                {/* {isSold && (
                    <i className="fas fa-check-circle text-white text-[6px] absolute top-3 left-3.8"></i>
                )} */}
                {isUnavailable && !isWinner && !isLoser && !isSold && (
                    <span className="absolute text-lg font-bold text-gray-700">✕</span>
                )}
                <span
                    className={`font-bold text-white text-[9px] pt-[10px] ${isUnavailable && !isWinner && !isLoser && !isSold ? 'opacity-0' : ''
                        }`}
                >
                    {number}
                </span>
            </div>
        </div>
    );
}

// Componente de demostración
function Demo() {
    const [selected, setSelected] = React.useState([]);
    const [markingMode, setMarkingMode] = React.useState(true);

    const handleClick = (num) => {
        setSelected(prev =>
            prev.includes(num)
                ? prev.filter(n => n !== num)
                : [...prev, num]
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-6 text-center">
                        🐾 Number Badges - Huella de Pata Realista
                    </h1>

                    <div className="mb-6 flex justify-center">
                        <button
                            onClick={() => setMarkingMode(!markingMode)}
                            className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition-colors"
                        >
                            {markingMode ? '✓ Modo Marcar Activo' : '✕ Modo Marcar Inactivo'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-white/5 rounded-xl p-4">
                            <h3 className="text-white font-semibold mb-3">Estados Especiales:</h3>
                            <div className="flex gap-3 flex-wrap items-center">
                                <div className="text-center">
                                    <NumberBadge number={1} isWinner />
                                    <p className="text-xs text-white/70 mt-1">Ganador</p>
                                </div>
                                <div className="text-center">
                                    <NumberBadge number={2} isLoser />
                                    <p className="text-xs text-white/70 mt-1">Perdedor</p>
                                </div>
                                <div className="text-center">
                                    <NumberBadge number={3} isSold />
                                    <p className="text-xs text-white/70 mt-1">Vendido</p>
                                </div>
                                <div className="text-center">
                                    <NumberBadge number={4} isUnavailable />
                                    <p className="text-xs text-white/70 mt-1">No disponible</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4">
                            <h3 className="text-white font-semibold mb-3">Interactivos (haz click):</h3>
                            <div className="flex gap-3 flex-wrap">
                                {[10, 11, 12, 13, 14, 15].map(num => (
                                    <NumberBadge
                                        key={num}
                                        number={num}
                                        markingMode={markingMode}
                                        onClick={handleClick}
                                        isSold={selected.includes(num)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6">
                        <h3 className="text-white font-semibold mb-4">Cuadrícula Completa (1-50):</h3>
                        <div className="grid grid-cols-10 gap-2">
                            {Array.from({ length: 50 }, (_, i) => i + 1).map(num => {
                                const isWinner = num === 7 || num === 23;
                                const isLoser = num === 15 || num === 42;
                                const isUnavailable = num % 13 === 0;

                                return (
                                    <NumberBadge
                                        key={num}
                                        number={num}
                                        isWinner={isWinner}
                                        isLoser={isLoser}
                                        isUnavailable={isUnavailable}
                                        isSold={selected.includes(num)}
                                        markingMode={markingMode}
                                        onClick={handleClick}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-6 text-center text-white/70 text-sm">
                        <p>🐾 Haz click en las huellas para marcarlas como vendidas</p>
                        <p className="mt-2">
                            Seleccionados: {selected.length > 0 ? selected.join(', ') : 'Ninguno'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}