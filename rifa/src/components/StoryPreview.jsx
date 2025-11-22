import { useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import html2canvas from 'html2canvas';

export default function StoryPreview({
    petImage,
    totalNumbers,
    prizes,
    winners,
    unsoldNumbers,
    soldNumbers,
    losers,
    raffleName = 'RIFA SOFIA',
    numberPrice = 2000
}) {
    const { theme } = useTheme();
    const [isDownloading, setIsDownloading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
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
                return `bg-gradient-to-br ${theme.colors.winner.start} ${theme.colors.winner.end}`;
            case 'loser':
                return `bg-gradient-to-br ${theme.colors.loser.start} ${theme.colors.loser.end}`;
            case 'sold':
                return `bg-gradient-to-br ${theme.colors.sold.start} ${theme.colors.sold.end}`;
            case 'unavailable':
                return 'bg-gray-400';
            default:
                return `bg-gradient-to-br ${theme.colors.primary.start} ${theme.colors.primary.end}`;
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

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % sections.length);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + sections.length) % sections.length);
    };

    const goToPage = (index) => {
        setCurrentPage(index);
    };

    return (
        <div className="glass-card rounded-3xl px-3 py-2 animate-fadeIn">
            {/* Page Info */}
            <div className="text-center mb-3">
                <p className="text-sm font-bold text-gray-700">
                    Vista Previa - Página {currentPage + 1} de {sections.length}
                </p>
                <p className="text-xs text-gray-500">
                    Números {sections[currentPage]?.startNumber} al {sections[currentPage]?.endNumber}
                </p>
            </div>

            {/* Story Preview Container */}
            <div className="relative mb-4 overflow-visible">
                {/* Navigation Buttons */}
                {sections.length > 1 && (
                    <>
                        <button
                            onClick={prevPage}
                            className="absolute left-0 md:-left-2 top-1/2 -translate-y-1/2 z-50 bg-white/90 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition transform hover:scale-110"
                            title="Anterior"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                            onClick={nextPage}
                            className="absolute right-0 md:-right-2 top-1/2 -translate-y-1/2 z-50 bg-white/90 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition transform hover:scale-110"
                            title="Siguiente"
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </>
                )}

                {/* Story Preview - Only show current page */}
                <div className="relative flex flex-col items-center" style={{ minHeight: '670px' }}>
                    {sections.map((section, index) => (
                        <div
                            key={section.id}
                            className={`absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center transition-opacity duration-300 ${
                                index === currentPage ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                            }`}
                        >
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
                                        <h2 className="text-lg font-bold text-gray-800 uppercase">
                                            {raffleName}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            {/* Price/Info Section */}
                            <div className={`bg-gradient-to-r ${theme.colors.header.start} ${theme.colors.header.end} py-3 text-center`}>
                                <p className="text-white font-bold text-md uppercase">
                                    VALOR POR NÚMERO ${numberPrice.toLocaleString('es-CL')}
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
                                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r ${theme.colors.header.start} ${theme.colors.header.end} p-3`}>
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
            </div>

            {/* Page Indicators (Dots) */}
            {sections.length > 1 && (
                <div className="flex justify-center gap-2 mb-4">
                    {sections.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index)}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentPage
                                    ? `w-8 h-2 bg-gradient-to-r ${theme.colors.header.start} ${theme.colors.header.end}`
                                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                            }`}
                            title={`Ir a página ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            <p className="text-sm text-gray-600 mb-4 text-center">
                {sections.length} {sections.length === 1 ? 'imagen' : 'imágenes'} de 100 números cada una
            </p>
            {/* Download Button */}
            <button
                onClick={handleDownloadAll}
                disabled={isDownloading}
                className={`w-full bg-gradient-to-r ${theme.colors.button.primary} text-white px-4 py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''
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
