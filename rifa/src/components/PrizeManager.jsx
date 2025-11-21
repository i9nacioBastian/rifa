import { useState } from 'react';

export default function PrizeManager({ prizes, onAddPrize, onRemovePrize, usedPrizes }) {
    const [newPrize, setNewPrize] = useState('');

    const handleAdd = () => {
        if (newPrize.trim()) {
            onAddPrize(newPrize.trim());
            setNewPrize('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    };

    return (
        <div className=" glass-card rounded-3xl p-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-center py-3 rounded-xl mb-4">
                <h6 className="font-bold text-sm uppercase tracking-wide">
                    <i className="fas fa-gift mr-2"></i>Listado de Premios
                </h6>
            </div>

            <div className="mb-4">
                <label htmlFor="newPrize" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de premio
                </label>
                <input
                    type="text"
                    id="newPrize"
                    value={newPrize}
                    onChange={(e) => setNewPrize(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Agregar nuevo premio"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-none"
                />
            </div>

            <button
                onClick={handleAdd}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2 mb-4 transition transform hover:-translate-y-0.5"
            >
                <i className="fas fa-plus-circle"></i>
                Agregar Premio
            </button>

            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
                        <tr>
                            <th className="py-2 px-3 text-xs font-bold">PREMIO</th>
                            <th className="py-2 px-3 text-xs font-bold">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {prizes.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="text-center py-3 text-gray-500">
                                    No existen registros
                                </td>
                            </tr>
                        ) : (
                            prizes.map((prize, index) => {
                                const isUsed = usedPrizes.includes(prize);
                                return (
                                    <tr key={index} className={isUsed ? 'bg-gray-50' : ''}>
                                        <td className={`py-2 px-3 ${isUsed ? 'line-through text-gray-400' : ''}`}>
                                            {prize}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            <button
                                                onClick={() => onRemovePrize(prize)}
                                                disabled={isUsed}
                                                className={`px-3 py-1 rounded text-white text-xs ${isUsed
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-red-500 hover:bg-red-600'
                                                    }`}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
