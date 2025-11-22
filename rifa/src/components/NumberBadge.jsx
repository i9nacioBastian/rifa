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
        let baseClass = 'number flex items-center justify-center w-[30px] h-[35px] sm:w-[35px] sm:h-[35px] lg:w-[40px] lg:h-[40px] 2xl:w-[55px] 2xl:h-[55px] font-bold text-white rounded-full text-m d transition-all duration-300 shadow-md relative';

        if (isWinner) {
            return `${baseClass} winner bg-gradient-to-br from-emerald-500 to-green-600 animate-pulse`;
        }
        if (isLoser) {
            return `${baseClass} loser bg-gradient-to-br from-red-500 to-pink-600`;
        }
        if (isSold) {
            return `${baseClass} bg-gradient-to-br from-green-500 to-green-600`;
        }
        if (isUnavailable) {
            return `${baseClass} unavailable bg-gradient-to-br from-red-300 to-red-300 shadow-lg opacity-60 text-gray-500`;
        }

        let className = `${baseClass} bg-gradient-to-br from-gray-400 to-gray-400 hover:scale-105 hover:shadow-lg`;

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
            {isWinner && <i className="fas fa-trophy text-yellow-300  text-[9px] absolute top-1"></i>}
            {isLoser && <i className="fas fa-tint text-blue-300  text-[8px] absolute top-1 left-1"></i>}
            {isSold && !isWinner && <i className="fas fa-check-circle text-white0 text-[8px] absolute top-1"></i>}


            <span className={'pt-1 text-[13px] lg:text-md 2xl:text-lg'}>
                {number}
            </span>
        </div>
    );
}
