import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RaffleWizard from './components/RaffleWizard';
import RaffleHeader from './components/RaffleHeader';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import SalesPage from './pages/SalesPage';
import PreviewPage from './pages/PreviewPage';
import PrizesPage from './pages/PrizesPage';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './components/Modal';
import { loadRaffleConfig, saveRaffleConfig, loadRaffleData, saveRaffleData, clearRaffleData } from './utils/localStorage';
import './index.css';

function RaffleApp() {
  const [raffleConfig, setRaffleConfig] = useState(null);
  const [raffleData, setRaffleData] = useState({
    winners: [],
    losers: [],
    prizes: [],
    unsoldNumbers: new Set(),
    soldNumbers: {},
    participants: [],
    markingMode: false
  });
  const [showWizard, setShowWizard] = useState(true);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const config = loadRaffleConfig();
    const data = loadRaffleData();

    if (config) {
      setRaffleConfig(config);
      setShowWizard(false);

      if (data) {
        setRaffleData({
          ...data,
          prizes: config.prizes
        });
      } else {
        setRaffleData(prev => ({
          ...prev,
          prizes: config.prizes
        }));
      }
    }
  }, []);

  // Save raffle data whenever it changes
  useEffect(() => {
    if (raffleConfig && !showWizard) {
      saveRaffleData(raffleData);
      // Also update config prizes
      const updatedConfig = {
        ...raffleConfig,
        prizes: raffleData.prizes
      };
      saveRaffleConfig(updatedConfig);
    }
  }, [raffleData, raffleConfig, showWizard]);

  const handleWizardComplete = (config) => {
    setRaffleConfig(config);
    setRaffleData(prev => ({
      ...prev,
      prizes: config.prizes
    }));
    setShowWizard(false);
  };

  const handleFinalize = () => {
    setShowFinalizeModal(true);
  };

  const confirmFinalize = () => {
    // Calculate unsold numbers (all numbers that are not sold)
    const totalNumbers = raffleConfig.totalNumbers;
    const allNumbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
    const soldNumbersSet = new Set(Object.keys(raffleData.soldNumbers).map(Number));

    const unsoldNumbers = new Set(
      allNumbers.filter(num => !soldNumbersSet.has(num))
    );

    const updatedData = {
      ...raffleData,
      unsoldNumbers: unsoldNumbers,
      markingMode: false // Disable marking mode
    };

    const updatedConfig = {
      ...raffleConfig,
      status: 'finalized'
    };

    setRaffleData(updatedData);
    setRaffleConfig(updatedConfig);

    saveRaffleData(updatedData);
    saveRaffleConfig(updatedConfig);

    setShowFinalizeModal(false);
  };

  const handleRaffleDataChange = (newData) => {
    setRaffleData(newData);
  };

  const handleNewRaffle = () => {
    if (window.confirm('¿Estás seguro? Esto eliminará la rifa actual y todos sus datos.')) {
      clearRaffleData();
      setRaffleConfig(null);
      setRaffleData({
        winners: [],
        losers: [],
        prizes: [],
        unsoldNumbers: new Set(),
        soldNumbers: {},
        participants: [],
        markingMode: false
      });
      setShowWizard(true);
    }
  };

  if (showWizard || !raffleConfig) {
    return <RaffleWizard onComplete={handleWizardComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400">
      <RaffleHeader />

      {/* New Raffle Button */}
      <button
        onClick={handleNewRaffle}
        className="fixed top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-lg z-50 transition text-sm"
        title="Nueva Rifa"
      >
        <i className="fas fa-plus mr-2"></i>Nueva
      </button>

      {/* Main Content */}
      <div className="pt-4">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                config={raffleConfig}
                raffleData={raffleData}
                onRaffleDataChange={handleRaffleDataChange}
                onFinalize={handleFinalize}
              />
            }
          />
          <Route
            path="/sales"
            element={
              <SalesPage
                config={raffleConfig}
                raffleData={raffleData}
                onRaffleDataChange={handleRaffleDataChange}
              />
            }
          />
          <Route
            path="/preview"
            element={
              <PreviewPage
                config={raffleConfig}
                raffleData={raffleData}
              />
            }
          />
          <Route
            path="/prizes"
            element={
              <PrizesPage
                config={raffleConfig}
                raffleData={raffleData}
                onRaffleDataChange={handleRaffleDataChange}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />

      {/* Bottom Navigation */}
      <BottomNav isFinalized={raffleConfig.status === 'finalized'} />

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
              <li><i className="fas fa-times text-red-500 mr-2"></i>Editar premios</li>
              <li><i className="fas fa-times text-red-500 mr-2"></i>Marcar números no vendidos</li>
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
            onClick={confirmFinalize}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Sí, Finalizar
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RaffleApp />
    </BrowserRouter>
  );
}
