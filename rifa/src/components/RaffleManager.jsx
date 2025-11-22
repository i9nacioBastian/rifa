import { useState } from 'react';
import RaffleHeader from './RaffleHeader';
import NumberGrid from './NumberGrid';
import SalesManager from './SalesManager';
import PrizeManager from './PrizeManager';
import WinnersList from './WinnersList';
import LosersList from './LosersList';
import StoryPreview from './StoryPreview';
import Footer from './Footer';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';
import { shuffle, getAvailableNumbers, findParticipantName } from '../utils/raffleUtils';

export default function RaffleManager({
    config,
    onEditConfig,
    onFinalize,
    raffleData,
    onRaffleDataChange
}) {
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);

    // Raffle execution states
    const [loadingModal, setLoadingModal] = useState(false);
    const [winnerModal, setWinnerModal] = useState(null);
    const [loserModal, setLoserModal] = useState(null);
    const [errorModal, setErrorModal] = useState('');

    const isFinalized = config.status === 'finalized';
    const hasSales = Object.keys(raffleData.soldNumbers || {}).length > 0;

    const handleRunRaffle = () => {
        if (raffleData.prizes.length === 0) {
            setErrorModal('No hay premios disponibles');
            return;
        }

        const availableNumbers = getAvailableNumbers(
            config.totalNumbers,
            raffleData.winners,
            raffleData.losers,
            raffleData.unsoldNumbers
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

            const participantName = findParticipantName(winnerNumber, raffleData.participants);

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
            raffleData.winners,
            raffleData.losers,
            raffleData.unsoldNumbers
        );

        if (availableNumbers.length === 0) {
            setErrorModal('No hay números disponibles');
            return;
        }

        setLoadingModal(true);

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            const loserNumber = availableNumbers[randomIndex];
            const participantName = findParticipantName(loserNumber, raffleData.participants);

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

    const handleFinalize = () => {
        onFinalize();
        setShowFinalizeModal(false);
    };

    return (
        <div className="min-h-screen py-8 md:px-4 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400">
            <RaffleHeader />

            {/* Raffle Info Banner */}
            <div className="max-w-8xl mx-auto px-2 md:px-4 mb-6">
                <div className="glass-card rounded-3xl p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">{config.name}</h1>
                            <p className="text-gray-600">
                                <i className="fas fa-hashtag mr-1"></i>{config.totalNumbers} números •
                                <i className="fas fa-dollar-sign ml-2 mr-1"></i>${config.numberPrice} c/u
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {!isFinalized && (
                                <>
                                    <button
                                        onClick={onEditConfig}
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg transition"
                                    >
                                        <i className="fas fa-edit mr-2"></i>Editar
                                    </button>
                                    <button
                                        onClick={() => setShowFinalizeModal(true)}
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg transition"
                                    >
                                        <i className="fas fa-flag-checkered mr-2"></i>Finalizar Rifa
                                    </button>
                                </>
                            )}
                            {isFinalized && (
                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold">
                                    <i className="fas fa-check-circle mr-2"></i>Rifa Finalizada
                                </span>
                            )}
                            <button
                                onClick={() => setShowPreviewModal(true)}
                                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg transition"
                            >
                                <i className="fas fa-eye mr-2"></i>Vista Previa
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-8xl mx-auto grid lg:grid-cols-3 gap-6 px-2 md:px-4">
                {/* Left Column - Main Section */}
                <div className="col-span-3 xl:col-span-2 space-y-6">
                    {/* Number Grid */}
                    <div className="glass-card rounded-3xl px-4 py-6 sm:p-8 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                            Números de la Rifa
                        </h2>

                        <NumberGrid
                            totalNumbers={config.totalNumbers}
                            winners={raffleData.winners}
                            losers={raffleData.losers}
                            unsoldNumbers={raffleData.unsoldNumbers}
                            soldNumbers={raffleData.soldNumbers}
                            markingMode={raffleData.markingMode}
                            isFinalized={isFinalized}
                            onNumberClick={(num) => {
                                const newUnsold = new Set(raffleData.unsoldNumbers);
                                if (newUnsold.has(num)) {
                                    newUnsold.delete(num);
                                } else {
                                    newUnsold.add(num);
                                }
                                onRaffleDataChange({ ...raffleData, unsoldNumbers: newUnsold });
                            }}
                        />
                    </div>

                    {/* Raffle Controls - Only if finalized */}
                    {isFinalized && (
                        <div className="glass-card rounded-3xl p-6 animate-fadeIn">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">
                                <i className="fas fa-dice mr-2 text-orange-600"></i>Controles del Sorteo
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleRunRaffle}
                                    className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
                                >
                                    <i className="fas fa-trophy"></i>
                                    Ejecutar Sorteo
                                </button>
                                <button
                                    onClick={handleRunLosers}
                                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
                                >
                                    <i className="fas fa-times-circle"></i>
                                    Eliminar Número
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Winners and Losers */}
                    <WinnersList winners={raffleData.winners} />
                    <LosersList losers={raffleData.losers} participants={raffleData.participants} />
                </div>

                {/* Right Column */}
                <div className="space-y-6 col-span-3 xl:col-span-1">
                    <SalesManager
                        totalNumbers={config.totalNumbers}
                        soldNumbers={raffleData.soldNumbers}
                        onSoldNumbersChange={(sold) => onRaffleDataChange({ ...raffleData, soldNumbers: sold })}
                        winners={raffleData.winners}
                        losers={raffleData.losers}
                    />

                    <PrizeManager
                        prizes={raffleData.prizes}
                        onAddPrize={(prize) => onRaffleDataChange({ ...raffleData, prizes: [...raffleData.prizes, prize] })}
                        onRemovePrize={(prize) => onRaffleDataChange({ ...raffleData, prizes: raffleData.prizes.filter(p => p !== prize) })}
                        usedPrizes={raffleData.winners.map(w => w.prize)}
                    />
                </div>
            </div>

            <Footer />

            {/* Preview Modal */}
            <Modal isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)}>
                <ModalHeader onClose={() => setShowPreviewModal(false)}>
                    Vista Previa para Historias
                </ModalHeader>
                <ModalBody>
                    <StoryPreview
                        petImage={config.image}
                        totalNumbers={config.totalNumbers}
                        prizes={raffleData.prizes}
                        winners={raffleData.winners}
                        unsoldNumbers={raffleData.unsoldNumbers}
                        soldNumbers={raffleData.soldNumbers}
                        losers={raffleData.losers}
                        raffleName={config.name}
                        numberPrice={config.numberPrice}
                    />
                </ModalBody>
            </Modal>

            {/* Finalize Confirmation Modal */}
            <Modal isOpen={showFinalizeModal} onClose={() => setShowFinalizeModal(false)}>
                <ModalHeader onClose={() => setShowFinalizeModal(false)}>
                    Finalizar Rifa
                </ModalHeader>
                <ModalBody>
                    <div className="text-center py-4">
                        <i className="fas fa-flag-checkered text-6xl text-green-500 mb-4"></i>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">¿Finalizar la rifa?</h3>
                        <p className="text-gray-600 mb-4">
                            Una vez finalizada, podrás ejecutar sorteos pero NO podrás:
                        </p>
                        <ul className="text-left text-gray-600 space-y-2 mb-4">
                            <li><i className="fas fa-times text-red-500 mr-2"></i>Editar la configuración</li>
                            <li><i className="fas fa-times text-red-500 mr-2"></i>Modificar ventas</li>
                            <li><i className="fas fa-times text-red-500 mr-2"></i>Cambiar premios</li>
                        </ul>
                        <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button
                        onClick={() => setShowFinalizeModal(false)}
                        className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleFinalize}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                        Sí, Finalizar
                    </button>
                </ModalFooter>
            </Modal>

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
                                <p className="text-3xl font-bold text-amber-600 mt-2">{winnerModal.prize.toUpperCase()}</p>
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
