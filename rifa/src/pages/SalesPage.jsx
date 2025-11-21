import SalesManager from '../components/SalesManager';

export default function SalesPage({ config, raffleData, onRaffleDataChange }) {
    // Calculate total revenue
    const soldCount = Object.keys(raffleData.soldNumbers || {}).length;
    const totalRevenue = soldCount * config.numberPrice;
    const potentialRevenue = config.totalNumbers * config.numberPrice;
    const remainingRevenue = potentialRevenue - totalRevenue;

    return (
        <div className="pb-20 px-2 md:px-4">
            <div className="glass-card rounded-3xl p-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    <i className="fas fa-shopping-cart mr-2 text-teal-600"></i>
                    Gestión de Ventas
                </h1>
                <p className="text-sm text-gray-600">
                    Selecciona números y asígnalos a compradores
                </p>
            </div>

            {/* Revenue Summary Card */}
            <div className="glass-card rounded-3xl p-6 mb-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                <div className="text-center mb-4">
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                        <i className="fas fa-dollar-sign mr-2 text-green-600"></i>
                        Total Ganancias
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <p className="text-4xl font-bold text-green-600">
                            ${totalRevenue.toLocaleString('es-CL')}
                        </p>
                        <p className="text-2xl font-semibold text-gray-400">Meta</p>
                        <p className="text-3xl font-bold text-gray-600">
                            ${potentialRevenue.toLocaleString('es-CL')}
                        </p>
                    </div>
                    <div className="mt-3">
                        <p className="text-sm text-orange-600 font-semibold">
                            <i className="fas fa-exclamation-circle mr-1"></i>
                            Falta por recaudar: ${remainingRevenue.toLocaleString('es-CL')}
                        </p>
                    </div>
                    <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${(soldCount / config.totalNumbers) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {((soldCount / config.totalNumbers) * 100).toFixed(1)}% vendido
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Números Vendidos</p>
                        <p className="text-2xl font-bold text-gray-800">{soldCount}</p>
                        <p className="text-xs text-gray-500">de {config.totalNumbers}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Disponibles</p>
                        <p className="text-2xl font-bold text-orange-600">{config.totalNumbers - soldCount}</p>
                        <p className="text-xs text-gray-500">Precio: ${config.numberPrice.toLocaleString('es-CL')}</p>
                    </div>
                </div>
            </div>

            <SalesManager
                totalNumbers={config.totalNumbers}
                soldNumbers={raffleData.soldNumbers}
                onSoldNumbersChange={(sold) => onRaffleDataChange({ ...raffleData, soldNumbers: sold })}
                winners={raffleData.winners}
                losers={raffleData.losers}
            />
        </div>
    );
}
