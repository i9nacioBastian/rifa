import { useTheme } from '../context/ThemeContext';

export default function NumberBadge({
    number,
    isWinner,
    isLoser,
    isUnavailable,
    isSold,
    markingMode,
    onClick,
    isFinalized = false
}) {
    const { theme } = useTheme();
    const getClassName = () => {
        let baseClass = 'number flex items-center justify-center w-[30px] h-[35px] sm:w-[35px] sm:h-[35px] lg:w-[40px] lg:h-[40px] 2xl:w-[45px] 2xl:h-[45px] font-bold text-white rounded-full text-m d transition-all duration-300 shadow-md relative';

        if (isWinner) {
            return `${baseClass} winner bg-gradient-to-br ${theme.colors.winner.start} ${theme.colors.winner.end} animate-pulse`;
        }
        if (isLoser) {
            return `${baseClass} loser bg-gradient-to-br ${theme.colors.loser.start} ${theme.colors.loser.end}`;
        }
        if (isSold) {
            // Si la rifa está finalizada, los números vendidos que no ganaron usan colores del tema
            if (isFinalized) {
                return `${baseClass} bg-gradient-to-br ${theme.colors.soldFinalized.start} ${theme.colors.soldFinalized.end} ${theme.colors.soldFinalized.opacity}`;
            }
            return `${baseClass} bg-gradient-to-br ${theme.colors.sold.start} ${theme.colors.sold.end}`;
        }
        if (isUnavailable) {
            return `${baseClass} unavailable bg-gradient-to-br from-gray-300 to-gray-300 shadow-lg opacity-60 text-gray-500`;
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
            {isWinner && <i className={`${theme.colors.winner.icon === '🏆' ? 'fas fa-trophy' : 'fas fa-crown'} text-yellow-300 text-[9px] lg:text-[12px] absolute top-1`}></i>}
            {isLoser && <i className={`${theme.colors.loser.icon === '💧' ? 'fas fa-tint' : theme.colors.loser.icon === '💔' ? 'fas fa-heart-broken' : 'fas fa-wind'} text-blue-300 text-[8px] lg:text-[12px] absolute top-1`}></i>}
            {isSold && !isWinner && !isLoser && !isFinalized && <i className="fas fa-check-circle text-white0 text-[8px] lg:text-[12px] absolute top-1"></i>}


            <span className={'pt-1 text-[13px] lg:text-md 2xl:text-lg'}>
                {number}
            </span>
        </div>
    );
}
