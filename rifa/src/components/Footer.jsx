export default function Footer() {
    return (
        <footer className="mt-12 py-6 rounded-2xl max-w-8xl px-4 mx-auto bg-gradient-to-r from-gray-800 to-gray-700">
            <div className="text-center">
                <p className="text-white text-sm">
                    Desarrollado con <i className="fa fa-heart text-red-500 animate-pulse"></i> por{' '}
                    <a
                        href="https://designwebirg.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-bold hover:text-purple-300 transition"
                    >
                        DesignWebIRG.com
                    </a>
                </p>
            </div>
        </footer>
    );
}
