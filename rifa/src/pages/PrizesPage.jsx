import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrizesPage({ config, raffleData, onRaffleDataChange }) {
    const [newPrize, setNewPrize] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const isFinalized = config.status === 'finalized';

    if (isFinalized) {
        return (
            <div className="pb-20 px-2 md:px-4">
                <div className="glass-card rounded-3xl p-8 text-center">
                    <i className="fas fa-lock text-6xl text-gray-400 mb-4"></i>
                    <h2 className="text-xl font-bold text-gray-700 mb-2">Premios Bloqueados</h2>
                    <p className="text-gray-600 mb-4">
                        La rifa está finalizada. No puedes modificar los premios.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                        Volver a Inicio
                    </button>
                </div>
            </div>
        );
    }

    const handleAddPrize = () => {
        if (!newPrize.trim()) {
            setError('Ingresa un nombre para el premio');
            return;
        }

        onRaffleDataChange({
            ...raffleData,
            prizes: [...raffleData.prizes, newPrize.trim()]
        });
        setNewPrize('');
        setError('');
    };

    const handleRemovePrize = (prize) => {
        onRaffleDataChange({
            ...raffleData,
            prizes: raffleData.prizes.filter(p => p !== prize)
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddPrize();
        }
    };

    return (
        <div className="pb-20 px-2 md:px-4">
            <div className="glass-card rounded-3xl p-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    <i className="fas fa-gift mr-2 text-teal-600"></i>
                    Gestión de Premios
                </h1>
                <p className="text-sm text-gray-600">
                    Agrega o elimina premios de la rifa
                </p>
            </div>

            {/* Add Prize */}
            <div className="glass-card rounded-3xl p-4 mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-plus-circle mr-2 text-teal-600"></i>Agregar Premio
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newPrize}
                        onChange={(e) => setNewPrize(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ej: Consulta veterinaria"
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition outline-none"
                    />
                    <button
                        onClick={handleAddPrize}
                        className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {/* Prizes List */}
            <div className="glass-card rounded-3xl p-4">
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">
                    Premios ({raffleData.prizes.length})
                </h3>

                {raffleData.prizes.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <i className="fas fa-gift text-4xl mb-3"></i>
                        <p>No hay premios agregados</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {raffleData.prizes.map((prize, index) => {
                            const isUsed = raffleData.winners.some(w => w.prize === prize);
                            return (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between p-3 rounded-lg ${isUsed ? 'bg-gray-100' : 'bg-white shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isUsed ? 'bg-gray-400 text-white' : 'bg-teal-100 text-teal-600'
                                            }`}>
                                            {index + 1}
                                        </span>
                                        <span className={`${isUsed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                            {prize}
                                        </span>
                                        {isUsed && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                Usado
                                            </span>
                                        )}
                                    </div>
                                    {!isUsed && (
                                        <button
                                            onClick={() => handleRemovePrize(prize)}
                                            className="text-red-500 hover:text-red-700 transition px-3"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
