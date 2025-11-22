import StoryPreview from '../components/StoryPreview';

export default function PreviewPage({ config, raffleData }) {
    return (
        <div className="pb-20 px-2 md:px-4">
            <div className="glass-card rounded-3xl p-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    <i className="fas fa-mobile-alt mr-2 text-purple-600"></i>
                    Vista Previa
                </h1>
                <p className="text-sm text-gray-600">
                    Descarga imágenes optimizadas para historias
                </p>
            </div>

            <StoryPreview
                petImage={config.image}
                totalNumbers={config.totalNumbers}
                prizes={raffleData.prizes}
                winners={raffleData.winners}
                unsoldNumbers={raffleData.unsoldNumbers}
                soldNumbers={raffleData.soldNumbers}
                losers={raffleData.losers}
                raffleName={config.name}
                numberPrice={config.numberPrice}
            />
        </div>
    );
}
