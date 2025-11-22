import { useTheme } from '../context/ThemeContext';

export default function ThemeSelector() {
    const { theme, themeName, changeTheme, availableThemes } = useTheme();

    return (
        <div className="glass-card rounded-xl p-4 mb-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                <i className="fas fa-palette mr-2 text-purple-600"></i>
                TEMA DE COLORES
            </h3>
            <div className="grid grid-cols-1 gap-2">
                {availableThemes.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => changeTheme(t.key)}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            themeName === t.key
                                ? 'bg-gradient-to-r ' + (
                                    t.key === 'normal' ? 'from-orange-500 to-amber-500' :
                                    t.key === 'female' ? 'from-pink-500 to-rose-500' :
                                    'from-sky-500 to-blue-600'
                                ) + ' text-white shadow-lg scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <span className="text-2xl">{t.icon}</span>
                        <div className="flex-1 text-left">
                            <div className="font-semibold text-sm">{t.name}</div>
                            <div className={`text-xs ${themeName === t.key ? 'text-white/80' : 'text-gray-500'}`}>
                                {t.key === 'normal' && 'Naranja/Amarillo'}
                                {t.key === 'female' && 'Rosado/Fucsia'}
                                {t.key === 'male' && 'Azul/Celeste'}
                            </div>
                        </div>
                        {themeName === t.key && (
                            <i className="fas fa-check-circle text-xl"></i>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
