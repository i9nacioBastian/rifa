export default function NumberBadge({
    number,
    isWinner,
    isLoser,
    isUnavailable,
    isSold,
    markingMode,
    onClick
}) {
    const getClassName = () => {
        let baseClass = 'number flex items-center justify-center w-[30px] sm:w-[35px] h-[30px] sm:h-[35px] font-bold text-white rounded-xl text-sm transition-all duration-300 shadow-md relative';

        if (isWinner) {
            return `${baseClass} winner bg-gradient-to-br from-emerald-500 to-green-600 animate-pulse`;
        }
        if (isLoser) {
            return `${baseClass} loser bg-gradient-to-br from-red-500 to-pink-600`;
        }
        if (isSold) {
            return `${baseClass} bg-gradient-to-br from-blue-500 to-indigo-600`;
        }
        if (isUnavailable) {
            return `${baseClass} unavailable bg-gradient-to-br from-gray-400 to-gray-500 opacity-60`;
        }

        let className = `${baseClass} bg-gradient-to-br from-orange-500 to-amber-500 hover:scale-105 hover:shadow-lg`;

        if (markingMode && !isWinner && !isLoser && !isSold) {
            className += ' cursor-pointer border-2 border-transparent hover:border-teal-400';
        }

        return className;
    };

    const handleClick = () => {
        if (markingMode && !isWinner && !isLoser && !isSold) {
            onClick?.(number);
        }
    };

    return (
        <div className={getClassName()} onClick={handleClick}>
            {isWinner && <i className="fas fa-trophy text-yellow-300 text-xs absolute top-1 left-1"></i>}
            {isLoser && <i className="fas fa-tint text-blue-300 text-xs absolute top-1 left-1"></i>}
            {isSold && <i className="fas fa-check text-white text-xs absolute top-1 left-1"></i>}
            {isUnavailable && !isWinner && !isLoser && !isSold && (
                <span className="absolute text-xl font-bold text-gray-700">✕</span>
            )}
            <span className={isUnavailable && !isWinner && !isLoser && !isSold ? 'opacity-0' : ''}>
                {number}
            </span>
        </div>
    );
}
