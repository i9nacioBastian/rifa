import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

export default function StoryPreview({
    petImage,
    totalNumbers,
    prizes,
    winners,
    unsoldNumbers,
    soldNumbers,
    losers
}) {
    const [isDownloading, setIsDownloading] = useState(false);
    const storyRefs = useRef([]);

    // Generate sections of 100 numbers
    const generateSections = () => {
        const sections = [];
        const numbersPerSection = 100;
        const totalSections = Math.ceil(totalNumbers / numbersPerSection);

        for (let i = 0; i < totalSections; i++) {
            const startNumber = i * numbersPerSection + 1;
            const endNumber = Math.min((i + 1) * numbersPerSection, totalNumbers);
            const numbers = [];

            for (let num = startNumber; num <= endNumber; num++) {
                numbers.push(num);
            }

            sections.push({
                id: i,
                startNumber,
                endNumber,
                numbers
            });
        }

        return sections;
    };

    const getNumberStatus = (num) => {
        if (winners.some(w => w.number === num)) return 'winner';
        if (losers.includes(num)) return 'loser';
        if (soldNumbers && soldNumbers[num]) return 'sold';
        if (unsoldNumbers.has(num)) return 'unavailable';
        return 'available';
    };

    const getNumberColor = (status) => {
        switch (status) {
            case 'winner':
                return 'bg-gradient-to-br from-emerald-500 to-green-600';
            case 'loser':
                return 'bg-gradient-to-br from-red-500 to-pink-600';
            case 'sold':
                return 'bg-gradient-to-br from-blue-500 to-indigo-600';
            case 'unavailable':
                return 'bg-gray-400';
            default:
                return 'bg-gradient-to-br from-orange-500 to-amber-500';
        }
    };

    const handleDownloadAll = async () => {
        setIsDownloading(true);

        try {
            for (let i = 0; i < storyRefs.current.length; i++) {
                if (storyRefs.current[i]) {
                    const canvas = await html2canvas(storyRefs.current[i], {
                        backgroundColor: '#ffffff',
                        scale: 2,
                        logging: false,
                        useCORS: true,
                    });

                    const link = document.createElement('a');
                    const sectionNumber = i + 1;
                    link.download = `rifa-mascota-parte-${sectionNumber}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();

                    // Small delay between downloads
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        } finally {
            setIsDownloading(false);
        }
    };

    const sections = generateSections();

    return (
        <div className="glass-card rounded-3xl px-3 py-2 animate-fadeIn">



            {/* Story Previews */}
            <div className="mb-4 space-y-4 max-h-[700px] overflow-y-auto">
                {sections.map((section, index) => (
                    <div key={section.id} className="flex flex-col items-center">
                        <p className="text-xs text-gray-500 mb-2 font-semibold">
                            Imagen {index + 1} - Números {section.startNumber} al {section.endNumber}
                        </p>
                        <div
                            ref={(el) => (storyRefs.current[index] = el)}
                            className="relative w-[370px] h-[670px] bg-white overflow-hidden shadow-lg"
                            style={{ aspectRatio: '9/16' }}
                        >
                            {/* Header with Pet Image */}
                            <div className="relative h-[230px] bg-gradient-to-br from-pink-300 via-purple-300 to-yellow-200 overflow-hidden">
                                {petImage && (
                                    <img
                                        src={petImage}
                                        alt="Mascota"
                                        className="absolute inset-0 w-full h-full object-contain"
                                    />
                                )}

                                {/* Overlay with Title */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 flex items-end justify-center pb-4">
                                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg">
                                        <h2 className="text-lg font-bold text-gray-800">
                                            RIFA SOFIA
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            {/* Price/Info Section */}
                            <div className="bg-gradient-to-r from-pink-400 to-purple-400 py-3 text-center">
                                <p className="text-white font-bold text-md uppercase">
                                    VALOR POR NÚMERO $2000
                                </p>
                            </div>

                            {/* Numbers Grid */}
                            <div className="p-3 bg-white">
                                <div className="grid grid-cols-10 gap-1">
                                    {section.numbers.map((num) => {
                                        const status = getNumberStatus(num);
                                        return (
                                            <div
                                                key={num}
                                                className={`${getNumberColor(status)} text-white font-bold text-[11px] w-[28px] h-[28px] rounded-full flex items-center justify-center shadow-sm relative`}
                                            >
                                                {status === 'winner' && (
                                                    <i className="fas fa-heart absolute text-[6px] text-pink-300 top-0 left-0"></i>
                                                )}
                                                {status === 'sold' && (
                                                    <i className="fas fa-check absolute text-[6px] text-white top-0 left-0"></i>
                                                )}
                                                {status === 'unavailable' && (
                                                    <span className="absolute text-[12px] font-bold text-gray-700">✕</span>
                                                )}
                                                <span className={status === 'unavailable' ? 'opacity-0' : ''}>
                                                    {num}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Footer with Prizes */}
                            {prizes.length > 0 && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-pink-400 to-purple-400 p-3">
                                    <div className="text-center">
                                        <p className="text-white text-[10px] font-bold mb-1">PREMIOS:</p>
                                        <div className="space-y-0.5">
                                            {prizes.slice(0, 2).map((prize, idx) => (
                                                <p key={idx} className="text-white text-[9px] font-semibold">
                                                    🎁 {prize}
                                                </p>
                                            ))}
                                            {prizes.length > 2 && (
                                                <p className="text-white text-[8px]">+{prizes.length - 2} más...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-sm text-gray-600 mb-4 text-center">
                {sections.length} {sections.length === 1 ? 'imagen' : 'imágenes'} de 100 números cada una
            </p>
            {/* Download Button */}
            <button
                onClick={handleDownloadAll}
                disabled={isDownloading}
                className={`w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {isDownloading ? (
                    <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Descargando...
                    </>
                ) : (
                    <>
                        <i className="fas fa-download"></i>
                        Descargar {sections.length} {sections.length === 1 ? 'Imagen' : 'Imágenes'}
                    </>
                )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
                Formato optimizado 9:16 para Instagram, Facebook y WhatsApp Stories
            </p>

            <div className="mt-3 p-3 bg-teal-50 rounded-lg border-l-4 border-teal-500">
                <p className="text-xs text-gray-700">
                    <i className="fas fa-info-circle text-teal-500 mr-1"></i>
                    <strong>Leyenda:</strong> 🟠 Disponible • 🔵 Vendido • 🟢 Ganador • 🔴 Eliminado • ⚪ No vendido
                </p>
            </div>
        </div>
    );
}
