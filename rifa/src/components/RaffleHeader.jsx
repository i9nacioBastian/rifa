export default function RaffleHeader() {
    return (
        <div className="max-w-8xl mx-auto mb-8 animate-fadeIn px-4">
            <div className="text-center py-6 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700">
                <a
                    href="https://designwebirg.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block transform transition hover:scale-105"
                >
                    <img
                        src="https://designwebirg.com/assets/img/irglogo.png"
                        alt="DesignWEBIRG"
                        className="w-64 mx-auto"
                    />
                </a>
            </div>
        </div>
    );
}
