export default function RaffleControls({
    totalNumbers,
    onTotalNumbersChange,
    onFileLoad,
    onRunRaffle,
    onRunLosers,
    markingMode,
    onToggleMarkingMode
}) {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const participants = JSON.parse(event.target.result);
                    onFileLoad(participants);
                } catch (error) {
                    alert('Error al cargar el archivo JSON. Verifica el formato.');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="space-y-6">
            {/* Info Alert */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-l-4 border-teal-500 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                    <i className="fas fa-info-circle text-teal-500 mr-2"></i>
                    Puedes utilizar la carga de participantes para que te muestre el nombre del ganador.{' '}
                    <a
                        href="/participantes-ejemplo.json"
                        download="participantes-ejemplo.json"
                        className="text-teal-600 hover:text-teal-800 font-semibold underline"
                    >
                        Descargar Formato JSON
                    </a>
                </p>
            </div>

            {/* Form Inputs */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="totalNumbers" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        <i className="fas fa-hashtag mr-2 text-orange-600"></i>Cantidad total de números
                    </label>
                    <input
                        type="number"
                        id="totalNumbers"
                        value={totalNumbers}
                        onChange={(e) => onTotalNumbersChange(parseInt(e.target.value) || 0)}
                        min="1"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-none"
                        placeholder="Ingrese cantidad total"
                    />
                </div>
                <div>
                    <label htmlFor="fileInput" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        <i className="fas fa-upload mr-2 text-orange-600"></i>Cargar Participantes
                    </label>
                    <input
                        type="file"
                        id="fileInput"
                        accept=".json"
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-none"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-end">
                <button
                    onClick={onRunRaffle}
                    className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2 transition transform hover:-translate-y-0.5"
                >
                    <i className="fas fa-trophy"></i>
                    Ejecutar Sorteo
                </button>
                <button
                    onClick={onRunLosers}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2 transition transform hover:-translate-y-0.5"
                >
                    <i className="fas fa-times-circle"></i>
                    Eliminar Número
                </button>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Marking Mode Toggle */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        <i className="fas fa-ban mr-2 text-gray-600"></i>Marcar números no vendidos
                    </label>
                    <button
                        onClick={onToggleMarkingMode}
                        className={`px-6 py-2 rounded-xl font-semibold shadow-lg flex items-center gap-2 transition transform hover:-translate-y-0.5 ${markingMode
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                                : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white'
                            }`}
                    >
                        <i className="fas fa-hand-pointer"></i>
                        <span>{markingMode ? 'Desactivar Modo Selección' : 'Activar Modo Selección'}</span>
                    </button>
                </div>

                {markingMode && (
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 p-4 rounded-lg animate-fadeIn">
                        <p className="text-sm text-gray-700">
                            <i className="fas fa-info-circle text-orange-500 mr-2"></i>
                            <strong>Modo de selección activado:</strong> Haz clic en los números para marcarlos/desmarcarlos como no vendidos. Los números marcados mostrarán un ✓.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
