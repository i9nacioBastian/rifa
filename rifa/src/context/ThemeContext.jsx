import { createContext, useContext, useState, useEffect } from 'react';
import { themes, defaultTheme } from '../config/themes';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [currentTheme, setCurrentTheme] = useState(() => {
        // Cargar tema guardado de localStorage
        const savedTheme = localStorage.getItem('raffleTheme');
        return savedTheme || defaultTheme;
    });

    useEffect(() => {
        // Guardar tema en localStorage cuando cambia
        localStorage.setItem('raffleTheme', currentTheme);
    }, [currentTheme]);

    const theme = themes[currentTheme];

    const changeTheme = (themeName) => {
        if (themes[themeName]) {
            setCurrentTheme(themeName);
        }
    };

    const value = {
        theme,
        themeName: currentTheme,
        changeTheme,
        availableThemes: Object.keys(themes).map(key => ({
            key,
            name: themes[key].name,
            icon: themes[key].icon
        }))
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
