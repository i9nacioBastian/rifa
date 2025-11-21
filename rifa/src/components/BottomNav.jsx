import { NavLink } from 'react-router-dom';

export default function BottomNav({ isFinalized }) {
    const navItems = [
        { path: '/', icon: 'fa-th', label: 'Números' },
        { path: '/sales', icon: 'fa-shopping-cart', label: 'Ventas' },
        { path: '/preview', icon: 'fa-eye', label: 'Preview' },
        { path: '/prizes', icon: 'fa-gift', label: 'Premios', disabled: isFinalized }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50">
            <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center flex-1 h-full transition ${item.disabled
                                ? 'opacity-50 cursor-not-allowed pointer-events-none'
                                : isActive
                                    ? 'text-orange-600'
                                    : 'text-gray-600 hover:text-orange-500'
                            }`
                        }
                    >
                        <i className={`fas ${item.icon} text-xl mb-1`}></i>
                        <span className="text-xs font-semibold">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
