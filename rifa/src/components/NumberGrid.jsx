import { generateNumberSections } from '../utils/raffleUtils';
import NumberBadge from './NumberBadge';

export default function NumberGrid({
    totalNumbers,
    winners,
    losers,
    unsoldNumbers,
    soldNumbers,
    markingMode,
    onNumberClick
}) {
    const sections = generateNumberSections(totalNumbers);

    const isWinner = (num) => winners.some(w => w.number === num);
    const isLoser = (num) => losers.includes(num);
    const isUnavailable = (num) => unsoldNumbers.has(num);
    const isSold = (num) => soldNumbers && soldNumbers[num];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sections.map((section) => (
                <div key={section.id} className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-600">
                        Números {section.startNumber} - {section.endNumber}
                    </h3>
                    <div className="overflow-x-auto pb-2">
                        <div className="grid grid-cols-10 gap-2 min-w-max">
                            {section.numbers.map((num) => (
                                <NumberBadge
                                    key={num}
                                    number={num}
                                    isWinner={isWinner(num)}
                                    isLoser={isLoser(num)}
                                    isUnavailable={isUnavailable(num)}
                                    isSold={isSold(num)}
                                    markingMode={markingMode}
                                    onClick={onNumberClick}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
