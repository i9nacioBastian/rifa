// Configuración de temas para la aplicación
export const themes = {
    // Tema basado en el logo de Amigos Peludos (Naranja/Amarillo)
    normal: {
        name: 'Amigos Peludos',
        icon: '🐶',
        colors: {
            // Colores principales del logo
            primary: {
                start: 'from-orange-500',
                end: 'to-amber-500',
                bg: 'bg-orange-500',
                text: 'text-orange-600',
                border: 'border-orange-500',
                hover: 'hover:from-orange-600 hover:to-amber-600'
            },
            secondary: {
                start: 'from-amber-600',
                end: 'to-yellow-500',
                bg: 'bg-amber-500',
                text: 'text-amber-600',
                border: 'border-amber-500'
            },
            // Colores de estado
            winner: {
                start: 'from-green-500',
                end: 'to-green-600',
                bg: 'bg-green-500',
                text: 'text-green-600',
                icon: '🏆'
            },
            loser: {
                start: 'from-red-500',
                end: 'to-orange-600',
                bg: 'bg-red-500',
                text: 'text-red-600',
                icon: '💧'
            },
            sold: {
                start: 'from-green-500',
                end: 'to-green-600',
                bg: 'bg-green-500',
                text: 'text-green-600'
            },
            soldFinalized: {
                start: 'from-orange-300',
                end: 'to-amber-400',
                opacity: 'opacity-80'
            },
            // Headers y títulos
            header: {
                start: 'from-orange-600',
                end: 'to-amber-600',
                text: 'text-orange-600'
            },
            // Botones
            button: {
                primary: 'from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700',
                secondary: 'from-gray-800 to-gray-700 hover:from-orange-600 hover:to-amber-600',
                success: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
                danger: 'from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
            }
        }
    },

    // Tema para rifas de mascotas hembra (Rosado/Fucsia)
    female: {
        name: 'Princesa Peluda',
        icon: '🐩',
        colors: {
            primary: {
                start: 'from-pink-400',
                end: 'to-rose-400',
                bg: 'bg-pink-400',
                text: 'text-pink-600',
                border: 'border-pink-500',
                hover: 'hover:from-pink-500 hover:to-rose-500'
            },
            secondary: {
                start: 'from-rose-500',
                end: 'to-pink-600',
                bg: 'bg-rose-500',
                text: 'text-rose-600',
                border: 'border-rose-500'
            },
            winner: {
                start: 'from-emerald-400',
                end: 'to-green-500',
                bg: 'bg-emerald-400',
                text: 'text-emerald-600',
                icon: '👑'
            },
            loser: {
                start: 'from-red-400',
                end: 'to-rose-500',
                bg: 'bg-red-400',
                text: 'text-red-600',
                icon: '💔'
            },
            sold: {
                start: 'from-emerald-400',
                end: 'to-green-500',
                bg: 'bg-emerald-400',
                text: 'text-emerald-600'
            },
            soldFinalized: {
                start: 'from-pink-300',
                end: 'to-rose-300',
                opacity: 'opacity-80'
            },
            header: {
                start: 'from-pink-500',
                end: 'to-rose-500',
                text: 'text-pink-600'
            },
            button: {
                primary: 'from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
                secondary: 'from-gray-800 to-gray-700 hover:from-pink-500 hover:to-rose-500',
                success: 'from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600',
                danger: 'from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600'
            }
        }
    },

    // Tema para rifas de mascotas macho (Azul/Celeste)
    male: {
        name: 'Campeón Peludo',
        icon: '🐕',
        colors: {
            primary: {
                start: 'from-sky-400',
                end: 'to-blue-500',
                bg: 'bg-sky-400',
                text: 'text-sky-600',
                border: 'border-sky-500',
                hover: 'hover:from-sky-500 hover:to-blue-600'
            },
            secondary: {
                start: 'from-blue-500',
                end: 'to-indigo-500',
                bg: 'bg-blue-500',
                text: 'text-blue-600',
                border: 'border-blue-500'
            },
            winner: {
                start: 'from-green-500',
                end: 'to-emerald-600',
                bg: 'bg-green-500',
                text: 'text-green-600',
                icon: '⚡'
            },
            loser: {
                start: 'from-red-500',
                end: 'to-red-600',
                bg: 'bg-red-500',
                text: 'text-red-600',
                icon: '💨'
            },
            sold: {
                start: 'from-green-500',
                end: 'to-emerald-600',
                bg: 'bg-green-500',
                text: 'text-green-600'
            },
            soldFinalized: {
                start: 'from-sky-300',
                end: 'to-blue-400',
                opacity: 'opacity-80'
            },
            header: {
                start: 'from-sky-500',
                end: 'to-blue-600',
                text: 'text-sky-600'
            },
            button: {
                primary: 'from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700',
                secondary: 'from-gray-800 to-gray-700 hover:from-sky-500 hover:to-blue-600',
                success: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
                danger: 'from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700'
            }
        }
    }
};

export const defaultTheme = 'normal';
