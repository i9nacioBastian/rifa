import { useState } from 'react';

export default function PrizeConfig({ initialPrizes, onBack, onFinish }) {
    const [prizes, setPrizes] = useState(initialPrizes || []);
    const [newPrize, setNewPrize] = useState('');
    const [error, setError] = useState('');

    const handleAddPrize = () => {
        if (!newPrize.trim()) {
            setError('Ingresa un nombre para el premio');
            return;
        }

        setPrizes([...prizes, newPrize.trim()]);
        setNewPrize('');
        setError('');
    };

    const handleRemovePrize = (index) => {
        setPrizes(prizes.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddPrize();
        }
    };

    const handleFinish = () => {
        if (prizes.length === 0) {
            setError('Debes agregar al menos un premio');
            return;
        }
        onFinish(prizes);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    🎁 Premios de la Rifa
                </h2>
                <p className="text-gray-600">Paso 2 de 2: Configura los Premios</p>
            </div>

            <div className="space-y-6">
                {/* Add Prize Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <i className="fas fa-gift mr-2 text-teal-600"></i>Agregar Premio
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
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>

                {/* Prizes List */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
                        Premios Agregados ({prizes.length})
                    </h3>

                    {prizes.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <i className="fas fa-gift text-4xl mb-3"></i>
                            <p>No hay premios agregados</p>
                            <p className="text-sm">Agrega al menos un premio para continuar</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {prizes.map((prize, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="bg-teal-100 text-teal-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </span>
                                        <span className="text-gray-700">{prize}</span>
                                    </div>
                                    <button
                                        onClick={() => handleRemovePrize(index)}
                                        className="text-red-500 hover:text-red-700 transition"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onBack}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition"
                    >
                        <i className="fas fa-arrow-left"></i>
                        Atrás
                    </button>
                    <button
                        onClick={handleFinish}
                        disabled={prizes.length === 0}
                        className={`flex-1 px-6 py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 ${prizes.length === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                            }`}
                    >
                        Finalizar Configuración
                        <i className="fas fa-check"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
