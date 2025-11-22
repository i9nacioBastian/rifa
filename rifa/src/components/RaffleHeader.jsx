import { useTheme } from '../context/ThemeContext';

export default function RaffleHeader({ onMobileMenuToggle, isMobileMenuOpen }) {
    const { theme } = useTheme();

    return (
        <div className="max-w-8xl mx-auto mb-2 animate-fadeIn px-3 relative">
            {/* Mobile Menu Button */}
            <button
                onClick={onMobileMenuToggle}
                className={`mobile-menu-btn absolute left-4 top-1/2 -translate-y-1/2 z-50 ml-4 md:hidden bg-gradient-to-r ${theme.colors.button.primary} text-white rounded-lg p-2 shadow-lg transition`}
                title="Menú"
            >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>

            <div className={`text-center rounded-md bg-gradient-to-r py-2 ${theme.colors.header.start} ${theme.colors.header.end}`}>
                <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-full inline-block transform transition hover:scale-105"
                >
                    <img
                        src="./logo_rifa.png"
                        alt="Logo"
                        className="w-16 mx-auto  p-2"
                    />
                </a>
            </div>
        </div>
    );
}

