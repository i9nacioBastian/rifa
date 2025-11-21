export default function LosersList({ losers, soldNumbers, onRemoveLoser }) {
    const getParticipantName = (number) => {
        if (!soldNumbers || !soldNumbers[number]) return 'Desconocido';
        return soldNumbers[number].name;
    };

    return (
        <div className="glass-card rounded-3xl p-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-center py-3 rounded-xl mb-4">
                <h6 className="font-bold text-sm uppercase tracking-wide">
                    <i className="fas fa-times-circle mr-2"></i>Listado de Perdedores
                </h6>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
                        <tr>
                            <th className="py-2 px-3 text-xs font-bold">PERDEDOR NÚMERO</th>
                            {onRemoveLoser && <th className="py-2 px-3 text-xs font-bold">ACCIÓN</th>}
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {losers.length === 0 ? (
                            <tr>
                                <td colSpan={onRemoveLoser ? "2" : "1"} className="text-center py-3 text-gray-500">
                                    No existen registros
                                </td>
                            </tr>
                        ) : (
                            losers.map((loser, index) => (
                                <tr key={index} className="border-b border-gray-100 last:border-0">
                                    <td className="py-2 px-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">😭</span>
                                            <div>
                                                <div className="font-semibold">{getParticipantName(loser)}</div>
                                                <div className="text-xs text-gray-500">N° {loser}</div>
                                            </div>
                                        </div>
                                    </td>
                                    {onRemoveLoser && (
                                        <td className="py-2 px-3 text-center">
                                            <button
                                                onClick={() => onRemoveLoser(loser)}
                                                className="text-red-500 hover:text-red-700 transition"
                                                title="Eliminar Perdedor"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
