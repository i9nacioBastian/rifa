import { useState } from 'react';
import NumberGrid from '../components/NumberGrid';
import WinnersList from '../components/WinnersList';
import LosersList from '../components/LosersList';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../components/Modal';
import { shuffle, getAvailableNumbers, findParticipantName } from '../utils/raffleUtils';

export default function HomePage({ config, raffleData, onRaffleDataChange, onFinalize }) {
    const isFinalized = config.status === 'finalized';

    // Raffle execution states
    const [loadingModal, setLoadingModal] = useState(false);
    const [winnerModal, setWinnerModal] = useState(null);
    const [loserModal, setLoserModal] = useState(null);
    const [errorModal, setErrorModal] = useState('');

    // Add Prize State
    const [showAddPrizeModal, setShowAddPrizeModal] = useState(false);
    const [newPrizeName, setNewPrizeName] = useState('');

    const handleRunRaffle = () => {
        if (raffleData.prizes.length === 0) {
            setErrorModal('No hay premios disponibles');
            return;
        }

        const availableNumbers = getAvailableNumbers(
            config.totalNumbers,
            raffleData.winners.map(w => w.number),
            raffleData.unsoldNumbers,
            raffleData.losers,
            raffleData.soldNumbers,
            isFinalized
        );

        if (availableNumbers.length === 0) {
            setErrorModal('No hay números disponibles para sortear');
            return;
        }

        setLoadingModal(true);

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            const winnerNumber = availableNumbers[randomIndex];

            const availablePrizes = raffleData.prizes.filter(
                prize => !raffleData.winners.some(w => w.prize === prize)
            );
            const shuffledPrizes = shuffle([...availablePrizes]);
            const prize = shuffledPrizes[0];

            const participantName = findParticipantName(winnerNumber, raffleData.soldNumbers);

            const newWinner = {
                number: winnerNumber,
                name: participantName,
                prize: prize
            };

            onRaffleDataChange({
                ...raffleData,
                winners: [...raffleData.winners, newWinner]
            });

            setLoadingModal(false);
            setWinnerModal(newWinner);
        }, 2200);
    };

    const handleRunLosers = () => {
        const availableNumbers = getAvailableNumbers(
            config.totalNumbers,
            raffleData.winners.map(w => w.number),
            raffleData.unsoldNumbers,
            raffleData.losers,
            raffleData.soldNumbers,
            isFinalized
        );

        if (availableNumbers.length === 0) {
            setErrorModal('No hay números disponibles (de los vendidos)');
            return;
        }

        setLoadingModal(true);

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            const loserNumber = availableNumbers[randomIndex];
            const participantName = findParticipantName(loserNumber, raffleData.soldNumbers);

            onRaffleDataChange({
                ...raffleData,
                losers: [...raffleData.losers, loserNumber]
            });

            setLoadingModal(false);
            setLoserModal({
                number: loserNumber,
                name: participantName
            });
        }, 2200);
    };

    const handleAddPrize = () => {
        if (!newPrizeName.trim()) return;
        onRaffleDataChange({
            ...raffleData,
            prizes: [...raffleData.prizes, newPrizeName.trim()]
        });
        setNewPrizeName('');
        setShowAddPrizeModal(false);
    };

    const handleRemoveWinner = (winnerToRemove) => {
        if (window.confirm(`¿Estás seguro de eliminar al ganador ${winnerToRemove.name}? El premio "${winnerToRemove.prize}" volverá a estar disponible.`)) {
            onRaffleDataChange({
                ...raffleData,
                winners: raffleData.winners.filter(w => w.number !== winnerToRemove.number)
            });
        }
    };

    const handleRemoveLoser = (loserNumber) => {
        const loserName = findParticipantName(loserNumber, raffleData.soldNumbers);
        if (window.confirm(`¿Estás seguro de eliminar al perdedor ${loserName} (N° ${loserNumber})?`)) {
            onRaffleDataChange({
                ...raffleData,
                losers: raffleData.losers.filter(l => l !== loserNumber)
            });
        }
    };

    // Calculate available prizes for UI state
    const availablePrizes = raffleData.prizes.filter(
        prize => !raffleData.winners.some(w => w.prize === prize)
    );
    const noPrizesLeft = availablePrizes.length === 0;

    return (
        <div className="pb-20 px-2 md:px-4">
            {/* Header Info */}
            <div className="glass-card rounded-3xl p-6 mb-6 animate-fadeIn relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500"></div>

                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">{config.raffleName}</h2>
                        <p className="text-gray-500 text-sm flex items-center">
                            <i className="fas fa-ticket-alt mr-2 text-orange-500"></i>
                            {config.totalNumbers} Números
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-orange-600">${config.numberPrice}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Valor Ticket</div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-orange-50 rounded-xl p-3 text-center border border-orange-100">
                        <div className="text-2xl font-bold text-orange-600">{Object.keys(raffleData.soldNumbers || {}).length}</div>
                        <div className="text-xs text-gray-500 font-medium">Vendidos</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                        <div className="text-2xl font-bold text-green-600">
                            {config.totalNumbers - Object.keys(raffleData.soldNumbers || {}).length}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Disponibles</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
                        <div className="text-2xl font-bold text-purple-600">{raffleData.winners.length}</div>
                        <div className="text-xs text-gray-500 font-medium">Ganadores</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    {!isFinalized ? (
                        <button
                            onClick={onFinalize}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-flag-checkered"></i>
                            Finalizar Rifa
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleRunRaffle}
                                disabled={noPrizesLeft}
                                className={`flex-1 py-3 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${noPrizesLeft
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-purple-200'
                                    }`}
                            >
                                <i className="fas fa-trophy"></i>
                                {noPrizesLeft ? 'Sin Premios' : 'Sorteo'}
                            </button>
                            <button
                                onClick={handleRunLosers}
                                disabled={noPrizesLeft}
                                className={`flex-1 py-3 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${noPrizesLeft
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-red-200'
                                    }`}
                            >
                                <i className="fas fa-trash-alt"></i>
                                Eliminar
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Prizes - Read Only */}
            <div className="glass-card rounded-3xl p-4 mb-4">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center justify-between">
                    <span><i className="fas fa-gift mr-2 text-teal-600"></i>PREMIOS</span>
                    {isFinalized && (
                        <button
                            onClick={() => setShowAddPrizeModal(true)}
                            className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200 transition"
                        >
                            <i className="fas fa-plus mr-1"></i>Agregar
                        </button>
                    )}
                    {!isFinalized && (
                        <span className="text-xs text-gray-500">
                            <i className="fas fa-info-circle mr-1"></i>Edita en la pestaña Premios
                        </span>
                    )}
                </h3>
                <div className="space-y-2">
                    {raffleData.prizes.map((prize, index) => {
                        const isUsed = raffleData.winners.some(w => w.prize === prize);
                        return (
                            <div
                                key={index}
                                className={`flex items-center gap-2 p-2 rounded-lg ${isUsed ? 'bg-gray-100 opacity-60' : 'bg-teal-50'
                                    }`}
                            >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isUsed ? 'bg-gray-400 text-white' : 'bg-teal-500 text-white'
                                    }`}>
                                    {index + 1}
                                </span>
                                <span className={`flex-1 text-sm ${isUsed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                    {prize}
                                </span>
                                {isUsed && <i className="fas fa-check text-green-600"></i>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Number Grid */}
            <div className="glass-card rounded-3xl p-4">
                <h3 className="text-sm font-bold text-gray-700 mb-3">
                    <i className="fas fa-th mr-2 text-orange-600"></i>NÚMEROS DE LA RIFA
                </h3>

                {/* Marking Mode Toggle */}
                {!isFinalized && (
                    <div className="mb-4">
                        <button
                            onClick={() => onRaffleDataChange({ ...raffleData, markingMode: !raffleData.markingMode })}
                            className={`w-full px-4 py-2 rounded-xl font-semibold shadow-lg transition text-sm ${raffleData.markingMode
                                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                                : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700'
                                }`}
                        >
                            <i className={`fas ${raffleData.markingMode ? 'fa-times-circle' : 'fa-ban'} mr-2`}></i>
                            {raffleData.markingMode ? 'Desactivar' : 'Marcar'} No Vendidos
                        </button>
                    </div>
                )}

                {/* Number Grid Component */}
                <NumberGrid
                    totalNumbers={config.totalNumbers}
                    winners={raffleData.winners}
                    losers={raffleData.losers}
                    unsoldNumbers={raffleData.unsoldNumbers}
                    soldNumbers={raffleData.soldNumbers}
                    markingMode={raffleData.markingMode}
                    onNumberClick={(num) => {
                        if (!isFinalized && raffleData.markingMode) {
                            const newUnsold = new Set(raffleData.unsoldNumbers);
                            if (newUnsold.has(num)) {
                                newUnsold.delete(num);
                            } else {
                                newUnsold.add(num);
                            }
                            onRaffleDataChange({ ...raffleData, unsoldNumbers: newUnsold });
                        }
                    }}
                />
            </div>

            {/* Winners List */}
            {raffleData.winners.length > 0 && (
                <div className="mt-4">
                    <WinnersList winners={raffleData.winners} onRemoveWinner={handleRemoveWinner} />
                </div>
            )}

            {/* Losers List */}
            {raffleData.losers.length > 0 && (
                <div className="mt-4">
                    <LosersList losers={raffleData.losers} soldNumbers={raffleData.soldNumbers} onRemoveLoser={handleRemoveLoser} />
                </div>
            )}

            {/* Loading Modal */}
            <Modal isOpen={loadingModal} onClose={() => { }}>
                <ModalBody className="text-center py-8">
                    <i className="fas fa-spinner fa-spin text-6xl text-orange-600 mb-4"></i>
                    <p className="text-lg font-semibold text-gray-700">Sorteando...</p>
                </ModalBody>
            </Modal>

            {/* Winner Modal */}
            <Modal isOpen={!!winnerModal} onClose={() => setWinnerModal(null)}>
                <ModalHeader onClose={() => setWinnerModal(null)}>
                    ¡Tenemos un ganador! 🐶🎉
                </ModalHeader>
                <ModalBody className="text-center py-8">
                    {winnerModal && (
                        <>
                            <div className="mb-4">
                                <p className="text-lg font-semibold text-gray-700">{winnerModal.name}</p>
                                <p className="text-sm text-gray-500">con el número</p>
                                <p className="text-6xl font-bold text-orange-600 my-4">{winnerModal.number}</p>
                                <p className="text-lg text-gray-700">ha ganado:</p>
                                <p className="text-3xl font-bold text-amber-600 mt-2">{winnerModal.prize?.toUpperCase()}</p>
                            </div>
                            <div className="text-6xl animate-bounce">🐾</div>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <button
                        onClick={() => setWinnerModal(null)}
                        className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                        OK
                    </button>
                </ModalFooter>
            </Modal>

            {/* Loser Modal */}
            <Modal isOpen={!!loserModal} onClose={() => setLoserModal(null)}>
                <ModalHeader onClose={() => setLoserModal(null)}>
                    Número eliminado 🐕
                </ModalHeader>
                <ModalBody className="text-center py-8">
                    {loserModal && (
                        <>
                            <div className="mb-4">
                                <p className="text-lg font-semibold text-gray-700">{loserModal.name}</p>
                                <p className="text-sm text-gray-500">con el número</p>
                                <p className="text-6xl font-bold text-red-600 my-4">{loserModal.number}</p>
                                <p className="text-lg text-gray-700">no ha sido seleccionado</p>
                            </div>
                            <div className="text-6xl">🐾</div>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <button
                        onClick={() => setLoserModal(null)}
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                        OK
                    </button>
                </ModalFooter>
            </Modal>

            {/* Add Prize Modal */}
            <Modal isOpen={showAddPrizeModal} onClose={() => setShowAddPrizeModal(false)}>
                <ModalHeader onClose={() => setShowAddPrizeModal(false)}>
                    Agregar Nuevo Premio
                </ModalHeader>
                <ModalBody>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre del Premio
                        </label>
                        <input
                            type="text"
                            value={newPrizeName}
                            onChange={(e) => setNewPrizeName(e.target.value)}
                            placeholder="Ej: Gift Card $50.000"
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition outline-none"
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button
                        onClick={() => setShowAddPrizeModal(false)}
                        className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleAddPrize}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                        Agregar
                    </button>
                </ModalFooter>
            </Modal>

            {/* Error Modal */}
            <Modal isOpen={!!errorModal} onClose={() => setErrorModal('')}>
                <ModalHeader onClose={() => setErrorModal('')}>
                    Error
                </ModalHeader>
                <ModalBody className="text-center py-8">
                    <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
                    <p className="text-lg text-gray-700">{errorModal}</p>
                </ModalBody>
                <ModalFooter>
                    <button
                        onClick={() => setErrorModal('')}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                        Cerrar
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
