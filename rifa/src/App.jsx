import { useState } from 'react';
import RaffleHeader from './components/RaffleHeader';
import RaffleControls from './components/RaffleControls';
import NumberGrid from './components/NumberGrid';
import PrizeManager from './components/PrizeManager';
import WinnersList from './components/WinnersList';
import LosersList from './components/LosersList';
import Footer from './components/Footer';
import PetImageUpload from './components/PetImageUpload';
import StoryPreview from './components/StoryPreview';
import SalesManager from './components/SalesManager';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './components/Modal';
import { shuffle, getAvailableNumbers, findParticipantName } from './utils/raffleUtils';

function App() {
  const [totalNumbers, setTotalNumbers] = useState(200);
  const [winners, setWinners] = useState([]);
  const [losers, setLosers] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [unsoldNumbers, setUnsoldNumbers] = useState(new Set());
  const [markingMode, setMarkingMode] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [petImage, setPetImage] = useState(null);
  const [soldNumbers, setSoldNumbers] = useState({});

  // Modal states
  const [loadingModal, setLoadingModal] = useState(false);
  const [winnerModal, setWinnerModal] = useState(null);
  const [loserModal, setLoserModal] = useState(null);
  const [successModal, setSuccessModal] = useState(null);
  const [errorModal, setErrorModal] = useState(null);

  const usedPrizes = winners.map(w => w.prize);
  const drawnNumbers = winners.map(w => w.number);

  const handleTotalNumbersChange = (newTotal) => {
    setTotalNumbers(newTotal);
    setWinners([]);
    setLosers([]);
    setUnsoldNumbers(new Set());
  };

  const handleFileLoad = (loadedParticipants) => {
    setParticipants(loadedParticipants);
    setSuccessModal({
      title: 'Archivo cargado',
      message: 'Los participantes se han cargado correctamente.'
    });
  };

  const handleToggleMarkingMode = () => {
    setMarkingMode(!markingMode);
  };

  const handleNumberClick = (number) => {
    if (!markingMode) return;

    const newUnsoldNumbers = new Set(unsoldNumbers);
    if (newUnsoldNumbers.has(number)) {
      newUnsoldNumbers.delete(number);
    } else {
      newUnsoldNumbers.add(number);
    }
    setUnsoldNumbers(newUnsoldNumbers);
  };

  const handleAddPrize = (prize) => {
    if (!prizes.includes(prize)) {
      setPrizes([...prizes, prize]);
    }
  };

  const handleRemovePrize = (prize) => {
    if (!usedPrizes.includes(prize)) {
      setPrizes(prizes.filter(p => p !== prize));
    }
  };

  const handleRunRaffle = () => {
    const availablePrizes = prizes.filter(p => !usedPrizes.includes(p));

    if (availablePrizes.length === 0) {
      setErrorModal({
        title: 'Error',
        message: 'No hay más premios disponibles.'
      });
      return;
    }

    const availableNumbers = getAvailableNumbers(totalNumbers, drawnNumbers, unsoldNumbers, losers);

    if (availableNumbers.length === 0) {
      setErrorModal({
        title: 'Error',
        message: 'No hay números disponibles para el sorteo.'
      });
      return;
    }

    // Show loading modal
    setLoadingModal(true);

    // Simulate raffle animation
    setTimeout(() => {
      const shuffledPrizes = shuffle(availablePrizes);
      const prize = shuffledPrizes[0];

      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const winnerNumber = availableNumbers[randomIndex];
      const winnerName = findParticipantName(winnerNumber, participants);

      const newWinner = {
        number: winnerNumber,
        name: winnerName,
        prize: prize
      };

      setWinners([...winners, newWinner]);
      setLoadingModal(false);
      setWinnerModal(newWinner);
    }, 2200);
  };

  const handleRunLosers = () => {
    const availableNumbers = getAvailableNumbers(totalNumbers, drawnNumbers, unsoldNumbers, losers);

    if (availableNumbers.length === 0) {
      setErrorModal({
        title: 'Error',
        message: 'No hay suficientes números disponibles para seleccionar perdedores.'
      });
      return;
    }

    // Show loading modal
    setLoadingModal(true);

    // Simulate selection animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const loserNumber = availableNumbers[randomIndex];
      const loserName = findParticipantName(loserNumber, participants);

      setLosers([...losers, loserNumber]);
      setLoadingModal(false);
      setLoserModal({
        number: loserNumber,
        name: loserName
      });
    }, 2200);
  };

  return (
    <div className="min-h-screen py-8 md:px-4 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400">
      <RaffleHeader />

      <div className="max-w-8xl mx-auto grid lg:grid-cols-3 gap-6 px-2 md:px-4">
        {/* Left Column - Main Raffle Section */}
        <div className="col-span-3 xl:col-span-2 glass-card rounded-3xl px-4 py-6 sm:p-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            🐾 SORTEO DE RIFA PARA MASCOTAS 🐾
          </h1>

          <PetImageUpload
            petImage={petImage}
            onImageChange={setPetImage}
          />

          <RaffleControls
            totalNumbers={totalNumbers}
            onTotalNumbersChange={handleTotalNumbersChange}
            onFileLoad={handleFileLoad}
            onRunRaffle={handleRunRaffle}
            onRunLosers={handleRunLosers}
            markingMode={markingMode}
            onToggleMarkingMode={handleToggleMarkingMode}
          />

          <hr className="my-6 border-gray-200" />

          <NumberGrid
            totalNumbers={totalNumbers}
            winners={winners}
            losers={losers}
            unsoldNumbers={unsoldNumbers}
            soldNumbers={soldNumbers}
            markingMode={markingMode}
            onNumberClick={handleNumberClick}
          />
        </div>

        {/* Right Column - Prizes and Winners */}
        <div className="space-y-6 col-span-3 xl:col-span-1">
          <StoryPreview
            petImage={petImage}
            totalNumbers={totalNumbers}
            prizes={prizes}
            winners={winners}
            unsoldNumbers={unsoldNumbers}
            soldNumbers={soldNumbers}
            losers={losers}
          />

          <PrizeManager
            prizes={prizes}
            onAddPrize={handleAddPrize}
            onRemovePrize={handleRemovePrize}
            usedPrizes={usedPrizes}
          />

          <WinnersList winners={winners} />

          <LosersList losers={losers} participants={participants} />

          <SalesManager
            totalNumbers={totalNumbers}
            soldNumbers={soldNumbers}
            onSoldNumbersChange={setSoldNumbers}
            winners={winners}
            losers={losers}
          />
        </div>
      </div>

      <Footer />

      {/* Loading Modal */}
      <Modal isOpen={loadingModal} className="text-center">
        <ModalBody className="py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <h3 className="text-2xl font-bold text-gray-900">Buscando ganador...</h3>
            <p className="text-gray-600">No cierre ni recargue la pantalla...</p>
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
              <div className="text-6xl">�</div>
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

      {/* Success Modal */}
      <Modal isOpen={!!successModal} onClose={() => setSuccessModal(null)}>
        <ModalHeader onClose={() => setSuccessModal(null)}>
          {successModal?.title}
        </ModalHeader>
        <ModalBody className="text-center py-6">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-gray-700">{successModal?.message}</p>
        </ModalBody>
        <ModalFooter>
          <button
            onClick={() => setSuccessModal(null)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            OK
          </button>
        </ModalFooter>
      </Modal>

      {/* Error Modal */}
      <Modal isOpen={!!errorModal} onClose={() => setErrorModal(null)}>
        <ModalHeader onClose={() => setErrorModal(null)}>
          {errorModal?.title}
        </ModalHeader>
        <ModalBody className="text-center py-6">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-gray-700">{errorModal?.message}</p>
        </ModalBody>
        <ModalFooter>
          <button
            onClick={() => setErrorModal(null)}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            OK
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
