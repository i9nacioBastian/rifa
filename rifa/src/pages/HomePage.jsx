import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import NumberGrid from '../components/NumberGrid';
import WinnersList from '../components/WinnersList';
import LosersList from '../components/LosersList';
import EditConfigModal from '../components/EditConfigModal';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../components/Modal';
import { shuffle, getAvailableNumbers, findParticipantName } from '../utils/raffleUtils';

export default function HomePage({ config, raffleData, onRaffleDataChange, onFinalize, onEditConfig }) {
    const { theme } = useTheme();
    const isFinalized = config.status === 'finalized';

    // Raffle execution states
    const [loadingModal, setLoadingModal] = useState(false);
    const [winnerModal, setWinnerModal] = useState(null);
    const [loserModal, setLoserModal] = useState(null);
    const [spinningNumber, setSpinningNumber] = useState(null);
    const [errorModal, setErrorModal] = useState('');

    // Add Prize State
    const [showAddPrizeModal, setShowAddPrizeModal] = useState(false);
    const [newPrizeName, setNewPrizeName] = useState('');

    // Edit Config State
    const [showEditConfigModal, setShowEditConfigModal] = useState(false);

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

        // Tombola animation - spin through random numbers
        let spinCount = 0;
        const spinInterval = setInterval(() => {
            const randomNum = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
            setSpinningNumber(randomNum);
            spinCount++;
            if (spinCount >= 20) {
                clearInterval(spinInterval);
            }
        }, 100);

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

            setSpinningNumber(winnerNumber);

            setTimeout(() => {
                onRaffleDataChange({
                    ...raffleData,
                    winners: [...raffleData.winners, newWinner]
                });

                setLoadingModal(false);
                setSpinningNumber(null);
                setWinnerModal(newWinner);
            }, 500);
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

        // Tombola animation - spin through random numbers
        let spinCount = 0;
        const spinInterval = setInterval(() => {
            const randomNum = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
            setSpinningNumber(randomNum);
            spinCount++;
            if (spinCount >= 20) {
                clearInterval(spinInterval);
            }
        }, 100);

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            const loserNumber = availableNumbers[randomIndex];
            const participantName = findParticipantName(loserNumber, raffleData.soldNumbers);

            setSpinningNumber(loserNumber);

            setTimeout(() => {
                onRaffleDataChange({
                    ...raffleData,
                    losers: [...raffleData.losers, loserNumber]
                });

                setLoadingModal(false);
                setSpinningNumber(null);
                setLoserModal({
                    number: loserNumber,
                    name: participantName
                });
            }, 500);
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
        <div className="pb-20 px-3 md:px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Header Info */}
                <div className="glass-card rounded-2xl p-6 mb-6 animate-fadeIn relative overflow-hidden">

                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-bold text-gray-800">{config.name}</h2>
                                <button
                                    onClick={() => setShowEditConfigModal(true)}
                                    className="text-gray-400 hover:text-blue-600 transition"
                                    title="Editar configuración"
                                >
                                    <i className="fas fa-edit text-sm"></i>
                                </button>
                            </div>
                            <p className="text-gray-500 text-sm flex items-center">
                                <i className="fas fa-ticket-alt mr-2 text-orange-500"></i>
                                {config.totalNumbers} Números
                            </p>
                        </div>
                        <div className="text-right">
                            <div className={`text-3xl font-bold ${theme.colors.primary.text}`}>${config.numberPrice.toLocaleString('es-CL')}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">VALOR NÚMERO</div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className={`bg-${theme.colors.primary.text.split('-')[1]}-50 rounded-xl p-3 text-center border border-${theme.colors.primary.text.split('-')[1]}-100`}>
                            <div className={`text-2xl font-bold ${theme.colors.primary.text}`}>{Object.keys(raffleData.soldNumbers || {}).length}</div>
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
                                className={`flex-1 bg-gradient-to-r ${theme.colors.button.success} text-white py-3 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2`}
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
                                        : `bg-gradient-to-r ${theme.colors.button.primary} text-white`
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
                                        : `bg-gradient-to-r ${theme.colors.button.danger} text-white`
                                        }`}
                                >
                                    <i className="fas fa-refresh"></i>
                                    Número al agua
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
            </div>


            {/* Number Grid */}
            <div className="glass-card rounded-3xl p-4">
                <h3 className="text-sm font-bold text-gray-700 mb-3">
                    <i className="fas fa-th mr-2 text-orange-600"></i>NÚMEROS DE LA RIFA
                </h3>

                {/* Marking Mode Toggle */}

                {/* Number Grid Component */}
                <NumberGrid
                    totalNumbers={config.totalNumbers}
                    winners={raffleData.winners}
                    losers={raffleData.losers}
                    unsoldNumbers={raffleData.unsoldNumbers}
                    soldNumbers={raffleData.soldNumbers}
                    markingMode={raffleData.markingMode}
                    isFinalized={isFinalized}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="mt-4">
                    <WinnersList winners={raffleData.winners} onRemoveWinner={handleRemoveWinner} />
                </div>

                {/* Losers List */}
                <div className="mt-4">
                    <LosersList losers={raffleData.losers} soldNumbers={raffleData.soldNumbers} onRemoveLoser={handleRemoveLoser} />
                </div>
            </div>

            {/* Loading Modal - Animal Tombola Animation */}
            <Modal isOpen={loadingModal} onClose={() => { }}>
                <ModalBody className="text-center py-12 bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
                    {/* Animal Tombola Drum Container */}
                    <div className="relative mx-auto" style={{ width: '300px', height: '300px' }}>
                        {/* Drum Shadow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full blur-xl opacity-30 transform translate-y-4"></div>

                        {/* Main Drum with Paw Prints */}
                        <div className="relative w-full h-full">
                            {/* Drum Body - Rotating Effect with Animal Pattern */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-400 to-purple-600 rounded-full shadow-2xl border-8 border-yellow-300 animate-spin" style={{ animationDuration: '4s' }}>
                                {/* Paw Print Decorations */}
                                <div className="absolute top-12 left-16 text-4xl opacity-40 transform -rotate-12">🐾</div>
                                <div className="absolute top-20 right-12 text-3xl opacity-30 transform rotate-45">🐾</div>
                                <div className="absolute bottom-16 left-20 text-3xl opacity-35 transform rotate-12">🐾</div>
                                <div className="absolute bottom-20 right-16 text-4xl opacity-25 transform -rotate-45">🐾</div>

                                {/* Drum Highlights */}
                                <div className="absolute top-8 left-12 w-20 h-20 bg-white opacity-20 rounded-full blur-lg"></div>
                                <div className="absolute bottom-12 right-16 w-16 h-16 bg-purple-900 opacity-15 rounded-full blur-md"></div>
                            </div>

                            {/* Center Window - Shows Number with Pet Theme */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-400 z-10 transform hover:scale-105 transition-transform">
                                    <div className="text-7xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
                                        {spinningNumber || '?'}
                                    </div>
                                    {/* Small paw print under number */}
                                    <div className="text-2xl mt-2 opacity-50">🐾</div>
                                </div>
                            </div>

                            {/* Drum Rim Decoration */}
                            <div className="absolute inset-0 rounded-full border-4 border-yellow-200 opacity-60"></div>
                        </div>

                        {/* Floating Animals */}
                        <div className="absolute -top-6 -right-6 text-5xl animate-bounce">🐶</div>
                        <div className="absolute -top-6 -left-6 text-5xl animate-bounce" style={{ animationDelay: '0.3s' }}>🐱</div>
                        <div className="absolute -bottom-6 -right-6 text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>🐰</div>
                        <div className="absolute -bottom-6 -left-6 text-4xl animate-bounce" style={{ animationDelay: '0.9s' }}>🐹</div>
                    </div>

                    {/* Text */}
                    <div className="mt-8">
                        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-pulse">
                            🎰 ¡Girando la Tómbola de Sofía!
                        </p>
                        <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                            <span>🐾</span>
                            <span>Esperando el número ganador...</span>
                            <span>🐾</span>
                        </p>
                    </div>
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

            {/* Edit Config Modal */}
            <EditConfigModal
                isOpen={showEditConfigModal}
                onClose={() => setShowEditConfigModal(false)}
                config={config}
                onSave={onEditConfig}
                soldNumbers={raffleData.soldNumbers}
            />
        </div>
    );
}
