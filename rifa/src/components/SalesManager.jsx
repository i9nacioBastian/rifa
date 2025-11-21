import { useState } from 'react';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';

export default function SalesManager({
    totalNumbers,
    soldNumbers,
    onSoldNumbersChange,
    winners,
    losers
}) {
    const [showModal, setShowModal] = useState(false);
    const [selectedNumbers, setSelectedNumbers] = useState([]);
    const [buyerName, setBuyerName] = useState('');
    const [buyerPhone, setBuyerPhone] = useState('');
    const [selectionMode, setSelectionMode] = useState(false);

    const isNumberAvailable = (num) => {
        return !soldNumbers[num] &&
            !winners.some(w => w.number === num) &&
            !losers.includes(num);
    };

    const handleNumberClick = (num) => {
        if (!selectionMode || !isNumberAvailable(num)) return;

        setSelectedNumbers(prev => {
            if (prev.includes(num)) {
                return prev.filter(n => n !== num);
            } else {
                return [...prev, num];
            }
        });
    };

    const handleAssignSale = () => {
        if (selectedNumbers.length === 0) {
            alert('Selecciona al menos un número');
            return;
        }
        if (!buyerName.trim()) {
            alert('Ingresa el nombre del comprador');
            return;
        }

        const newSoldNumbers = { ...soldNumbers };
        selectedNumbers.forEach(num => {
            newSoldNumbers[num] = {
                name: buyerName.trim(),
                phone: buyerPhone.trim(),
                date: new Date().toISOString()
            };
        });

        onSoldNumbersChange(newSoldNumbers);

        // Reset
        setSelectedNumbers([]);
        setBuyerName('');
        setBuyerPhone('');
        setShowModal(false);
        setSelectionMode(false);
    };

    const handleRemoveSale = (num) => {
        const newSoldNumbers = { ...soldNumbers };
        delete newSoldNumbers[num];
        onSoldNumbersChange(newSoldNumbers);
    };

    const toggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
        setSelectedNumbers([]);
    };

    const openAssignModal = () => {
        if (selectedNumbers.length === 0) {
            alert('Selecciona al menos un número primero');
            return;
        }
        setShowModal(true);
    };

    const soldNumbersList = Object.entries(soldNumbers).map(([num, buyer]) => ({
        number: parseInt(num),
        ...buyer
    })).sort((a, b) => a.number - b.number);

    const generateNumbers = () => {
        const numbers = [];
        for (let i = 1; i <= totalNumbers; i++) {
            numbers.push(i);
        }
        return numbers;
    };

    const numbers = generateNumbers();

    return (
        <div className="glass-card rounded-3xl p-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-center py-3 rounded-xl mb-4">
                <h6 className="font-bold text-sm uppercase tracking-wide">
                    <i className="fas fa-shopping-cart mr-2"></i>Gestión de Ventas
                </h6>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{soldNumbersList.length}</div>
                    <div className="text-xs text-gray-600">Vendidos</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg text-center border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">
                        {numbers.filter(n => isNumberAvailable(n)).length}
                    </div>
                    <div className="text-xs text-gray-600">Disponibles</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{selectedNumbers.length}</div>
                    <div className="text-xs text-gray-600">Seleccionados</div>
                </div>
            </div>

            {/* Selection Mode Toggle */}
            <div className="mb-4">
                <button
                    onClick={toggleSelectionMode}
                    className={`w-full px-4 py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 ${selectionMode
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                            : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white'
                        }`}
                >
                    <i className={`fas ${selectionMode ? 'fa-check-circle' : 'fa-hand-pointer'}`}></i>
                    {selectionMode ? 'Modo Selección Activo' : 'Activar Modo Selección'}
                </button>
            </div>

            {selectionMode && (
                <div className="mb-4 bg-teal-50 border-l-4 border-teal-500 p-3 rounded-lg animate-fadeIn">
                    <p className="text-sm text-gray-700">
                        <i className="fas fa-info-circle text-teal-500 mr-2"></i>
                        <strong>Selecciona números:</strong> Click en los números disponibles para seleccionarlos. Luego asigna al comprador.
                    </p>
                </div>
            )}

            {/* Assign Button */}
            {selectedNumbers.length > 0 && (
                <button
                    onClick={openAssignModal}
                    className="w-full mb-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 animate-fadeIn"
                >
                    <i className="fas fa-user-plus"></i>
                    Asignar {selectedNumbers.length} {selectedNumbers.length === 1 ? 'Número' : 'Números'}
                </button>
            )}

            {/* Numbers Grid */}
            {selectionMode && (
                <div className="mb-4 p-4 bg-gray-50 rounded-xl max-h-[300px] overflow-y-auto">
                    <div className="grid grid-cols-10 gap-2">
                        {numbers.map((num) => {
                            const isSold = soldNumbers[num];
                            const isSelected = selectedNumbers.includes(num);
                            const isAvailable = isNumberAvailable(num);
                            const isWinner = winners.some(w => w.number === num);
                            const isLoser = losers.includes(num);

                            let className = 'w-[30px] h-[30px] rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer';

                            if (isWinner) {
                                className += ' bg-gradient-to-br from-emerald-500 to-green-600 text-white';
                            } else if (isLoser) {
                                className += ' bg-gradient-to-br from-red-500 to-pink-600 text-white';
                            } else if (isSold) {
                                className += ' bg-gradient-to-br from-blue-500 to-indigo-600 text-white';
                            } else if (isSelected) {
                                className += ' bg-gradient-to-br from-orange-500 to-amber-500 text-white ring-2 ring-orange-300';
                            } else if (isAvailable) {
                                className += ' bg-white border-2 border-gray-300 text-gray-700 hover:border-teal-500';
                            } else {
                                className += ' bg-gray-300 text-gray-500 cursor-not-allowed';
                            }

                            return (
                                <div
                                    key={num}
                                    className={className}
                                    onClick={() => handleNumberClick(num)}
                                >
                                    {num}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Sold Numbers List */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
                        <tr>
                            <th className="py-2 px-3 text-xs font-bold">N°</th>
                            <th className="py-2 px-3 text-xs font-bold">COMPRADOR</th>
                            <th className="py-2 px-3 text-xs font-bold">TELÉFONO</th>
                            <th className="py-2 px-3 text-xs font-bold">ACCIÓN</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {soldNumbersList.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-3 text-gray-500">
                                    No hay números vendidos
                                </td>
                            </tr>
                        ) : (
                            soldNumbersList.map((sale) => (
                                <tr key={sale.number} className="border-b border-gray-100 last:border-0">
                                    <td className="py-2 px-3 font-bold text-teal-600">{sale.number}</td>
                                    <td className="py-2 px-3">{sale.name}</td>
                                    <td className="py-2 px-3 text-xs">{sale.phone || '-'}</td>
                                    <td className="py-2 px-3 text-center">
                                        <button
                                            onClick={() => handleRemoveSale(sale.number)}
                                            className="px-2 py-1 rounded text-white text-xs bg-red-500 hover:bg-red-600"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Assign Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <ModalHeader onClose={() => setShowModal(false)}>
                    Asignar Números a Comprador
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        <div className="bg-teal-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">
                                <strong>Números seleccionados:</strong> {selectedNumbers.sort((a, b) => a - b).join(', ')}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <i className="fas fa-user mr-2 text-teal-600"></i>Nombre del Comprador *
                            </label>
                            <input
                                type="text"
                                value={buyerName}
                                onChange={(e) => setBuyerName(e.target.value)}
                                placeholder="Ej: Juan Pérez"
                                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <i className="fas fa-phone mr-2 text-teal-600"></i>Teléfono (opcional)
                            </label>
                            <input
                                type="tel"
                                value={buyerPhone}
                                onChange={(e) => setBuyerPhone(e.target.value)}
                                placeholder="Ej: +56 9 1234 5678"
                                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition outline-none"
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleAssignSale}
                        className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                        Asignar
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
