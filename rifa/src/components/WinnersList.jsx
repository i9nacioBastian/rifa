export default function WinnersList({ winners, onRemoveWinner }) {
    return (
        <div className="glass-card rounded-3xl p-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-center py-3 rounded-xl mb-4">
                <h6 className="font-bold text-sm uppercase tracking-wide">
                    <i className="fas fa-trophy mr-2"></i>Ganadores y Premios
                </h6>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
                        <tr>
                            <th className="py-2 px-3 text-xs font-bold">GANADOR</th>
                            <th className="py-2 px-3 text-xs font-bold">PREMIO</th>
                            {onRemoveWinner && <th className="py-2 px-3 text-xs font-bold">ACCIÓN</th>}
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {winners.length === 0 ? (
                            <tr>
                                <td colSpan={onRemoveWinner ? "3" : "2"} className="text-center py-3 text-gray-500">
                                    No existen registros
                                </td>
                            </tr>
                        ) : (
                            winners.map((winner, index) => (
                                <tr key={index} className="border-b border-gray-100 last:border-0">
                                    <td className="py-2 px-3">
                                        <div className="flex items-center gap-2">
                                            <i className="fas fa-trophy text-yellow-500"></i>
                                            <div>
                                                <div className="font-semibold">{winner.name}</div>
                                                <div className="text-xs text-gray-500">N° {winner.number}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-3 font-medium">{winner.prize}</td>
                                    {onRemoveWinner && (
                                        <td className="py-2 px-3 text-center">
                                            <button
                                                onClick={() => onRemoveWinner(winner)}
                                                className="text-red-500 hover:text-red-700 transition"
                                                title="Eliminar Ganador"
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
