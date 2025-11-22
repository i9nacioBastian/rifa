import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function SideNav({ isFinalized, isMobileOpen, setIsMobileOpen, onNewRaffle }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Update parent container margin when collapsed state changes (desktop only)
    useEffect(() => {
        const mainContent = document.querySelector('.main-content-wrapper');
        if (mainContent && window.innerWidth >= 768) {
            if (isCollapsed) {
                mainContent.style.marginLeft = '4rem';
            } else {
                mainContent.style.marginLeft = '16rem';
            }
        }
    }, [isCollapsed]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isMobileOpen && !e.target.closest('nav') && !e.target.closest('.mobile-menu-btn')) {
                setIsMobileOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobileOpen, setIsMobileOpen]);

    const navItems = [
        { path: '/', icon: 'fa-th', label: 'Mi Rifa' },
        { path: '/sales', icon: 'fa-shopping-cart', label: 'Venta de números' },
        { path: '/preview', icon: 'fa-eye', label: 'Vista previa' },
        { path: '/prizes', icon: 'fa-gift', label: 'Gestión de Premios' }
    ];

    const handleNavClick = () => {
        // Close mobile menu when clicking a nav item
        if (window.innerWidth < 768) {
            setIsMobileOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                ></div>
            )}

            {/* Side Navigation */}
            <nav
                className={`fixed left-0 top-0 h-full bg-white border-r-2 border-gray-200 shadow-lg z-40 transition-all duration-300
                    ${isCollapsed ? 'w-16' : 'w-64'}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Toggle Button (Desktop only) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3 top-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-6 h-6 items-center justify-center shadow-md transition z-50"
                    title={isCollapsed ? 'Expandir' : 'Colapsar'}
                >
                    <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-xs`}></i>
                </button>

                {/* Logo/Title Section */}
                <div className="p-4 border-b-2 border-gray-200 mt-12 md:mt-0">
                    <div className="flex items-center justify-center">
                        {isCollapsed ? (
                              <img
                                    src="./logo_rifa.png"
                                    alt="DesignWEBIRG"
                                    className="w-32 mx-auto -mt-10 md:mt-1"
                                />
                        ) : (
                            <div className="text-center">
                                <img
                                    src="./logo_rifa.png"
                                    alt="DesignWEBIRG"
                                    className="w-32 mx-auto -mt-10 md:mt-1"
                                />
                            </div>
                        )}
                    </div>
                </div>
                {/* Footer Info */}
                {!isCollapsed && (
                    <div className="absolute right-0 left-0  px-4">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500">
                                {isFinalized ? (
                                    <>
                                        <i className="fas fa-check-circle text-green-500 mr-1"></i>
                                        Rifa Finalizada
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-clock text-orange-500 mr-1"></i>
                                        Rifa Activa
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                )}
                {/* Navigation Items */}
                <div className="flex flex-col py-4 mt-7">

                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 transition ${item.disabled
                                    ? 'opacity-50 cursor-not-allowed pointer-events-none'
                                    : isActive
                                        ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-orange-500'
                                }`
                            }
                            title={isCollapsed ? item.label : ''}
                        >
                            <i className={`fas ${item.icon} text-xl ${isCollapsed ? '' : 'mr-4'}`}></i>
                            {!isCollapsed && (
                                <span className="text-sm font-semibold">{item.label}</span>
                            )}
                        </NavLink>
                    ))}

                    {/* Nueva Rifa Button */}
                    <div className="px-4 mt-4">
                        <button
                            onClick={() => {
                                onNewRaffle();
                                if (window.innerWidth < 768) {
                                    setIsMobileOpen(false);
                                }
                            }}
                            className={`w-full bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition flex items-center justify-center ${isCollapsed ? 'p-2' : 'px-4 py-2'
                                }`}
                            title="Nueva Rifa"
                        >
                            <i className={`fas fa-plus ${isCollapsed ? '' : 'mr-2'}`}></i>
                            {!isCollapsed && <span className="text-sm font-semibold">Nueva Rifa</span>}
                        </button>
                    </div>
                </div>

                {/* Footer Info */}
                {!isCollapsed && (
                    <div className="absolute bottom-4 left-0 right-0 px-4">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500">
                                <>
                                    Desarrollado con <i className="fa fa-heart text-red-500 animate-pulse"></i> por{' '}
                                    <a
                                        href="https://designwebirg.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-black font-bold hover:text-purple-300 transition"
                                    >
                                        DesignWebIRG.com
                                    </a>
                                </>
                            </p>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
