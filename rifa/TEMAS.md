# 🎨 Sistema de Temas - Rifa de Mascotas

## Descripción

La aplicación ahora cuenta con un sistema de temas configurables que adapta los colores de la interfaz según el tipo de rifa. Los temas están inspirados en el logo de "Amigos Peludos" y permiten personalizar la experiencia visual.

## 🐶 Temas Disponibles

### 1. **Amigos Peludos** (Tema Normal)
- **Colores**: Naranja/Amarillo
- **Ideal para**: Rifas generales, campañas mixtas
- **Paleta**:
  - Principal: Naranja (#f97316) a Ámbar (#f59e0b)
  - Ganadores: Verde con trofeo 🏆
  - Números al agua: Rojo a Naranja-Rojo con gota 💧
  - Vendidos (finalizada): Naranja claro con transparencia

### 2. **Princesa Peluda** (Tema Femenino)
- **Colores**: Rosado/Fucsia
- **Ideal para**: Rifas de mascotas hembra
- **Paleta**:
  - Principal: Rosa (#f472b6) a Rosa (#fb7185)
  - Ganadores: Esmeralda con corona 👑
  - Números al agua: Rojo a Rosa con corazón roto 💔
  - Vendidos (finalizada): Rosa claro con transparencia

### 3. **Campeón Peludo** (Tema Masculino)
- **Colores**: Azul/Celeste
- **Ideal para**: Rifas de mascotas macho
- **Paleta**:
  - Principal: Celeste (#38bdf8) a Azul (#3b82f6)
  - Ganadores: Verde con rayo ⚡
  - Números al agua: Rojo intenso con viento 💨
  - Vendidos (finalizada): Celeste claro con transparencia

## 📁 Estructura de Archivos

```
src/
├── config/
│   └── themes.js          # Configuración de todos los temas
├── context/
│   └── ThemeContext.jsx   # Contexto React para manejar temas
└── components/
    └── ThemeSelector.jsx  # Selector visual de temas
```

## ⚙️ Cómo Personalizar un Tema

### Paso 1: Abrir el archivo de configuración
Abre `src/config/themes.js`

### Paso 2: Modificar colores
Cada tema tiene esta estructura:

```javascript
normal: {
    name: 'Amigos Peludos',
    icon: '🐶',
    colors: {
        primary: {
            start: 'from-orange-500',      // Color inicial del gradiente
            end: 'to-amber-500',           // Color final del gradiente
            bg: 'bg-orange-500',           // Color de fondo sólido
            text: 'text-orange-600',       // Color de texto
            border: 'border-orange-500',   // Color de borde
            hover: 'hover:from-orange-600' // Color al pasar el mouse
        },
        winner: {
            start: 'from-green-500',
            end: 'to-green-600',
            icon: '🏆'                     // Ícono para ganadores
        },
        loser: {
            start: 'from-red-500',
            end: 'to-pink-600',
            icon: '💧'                     // Ícono para números al agua
        },
        sold: {
            start: 'from-green-500',
            end: 'to-green-600'
        },
        soldFinalized: {
            start: 'from-orange-300',      // Color vendido cuando está finalizada
            end: 'to-amber-400',
            opacity: 'opacity-80'          // Transparencia
        },
        // ... más configuraciones
    }
}
```

### Paso 3: Guardar y recargar
Guarda el archivo y recarga la aplicación. Los cambios se aplicarán inmediatamente.

## 🎨 Guía de Colores Tailwind

Puedes usar cualquier color de Tailwind CSS. Aquí algunos ejemplos:

### Colores principales:
- **Rojos**: `red-400`, `red-500`, `red-600`, `rose-500`, `pink-500`
- **Naranjas**: `orange-400`, `orange-500`, `amber-500`
- **Amarillos**: `yellow-400`, `yellow-500`, `amber-400`
- **Verdes**: `green-400`, `green-500`, `emerald-500`, `teal-500`
- **Azules**: `blue-400`, `blue-500`, `sky-500`, `cyan-500`
- **Púrpuras**: `purple-400`, `purple-500`, `violet-500`, `fuchsia-500`
- **Rosas**: `pink-400`, `pink-500`, `rose-500`

### Tonos:
- **50**: Muy claro (backgrounds)
- **100-300**: Claro
- **400-500**: Medio (recomendado para principal)
- **600-700**: Oscuro
- **800-900**: Muy oscuro

## 🔧 Crear un Tema Nuevo

Para crear un tema completamente nuevo:

1. Abre `src/config/themes.js`
2. Copia uno de los temas existentes
3. Cambia el nombre de la clave (ej: `halloween`, `navidad`, etc.)
4. Personaliza todos los colores e íconos
5. El tema aparecerá automáticamente en el selector

Ejemplo de tema nuevo:

```javascript
halloween: {
    name: 'Halloween Peludo',
    icon: '🎃',
    colors: {
        primary: {
            start: 'from-purple-600',
            end: 'to-orange-500',
            bg: 'bg-purple-600',
            text: 'text-purple-600',
            border: 'border-purple-500',
            hover: 'hover:from-purple-700 hover:to-orange-600'
        },
        // ... resto de la configuración
    }
}
```

## 💾 Persistencia

El tema seleccionado se guarda automáticamente en `localStorage`, por lo que se mantendrá incluso después de cerrar el navegador.

## 📍 Ubicación del Selector

El selector de temas se encuentra en el menú lateral izquierdo, debajo de las opciones de navegación y antes del botón "Nueva Rifa".

## 🎯 Componentes que Usan Temas

Los siguientes componentes están adaptados para usar el sistema de temas:

- ✅ **RaffleHeader**: Header con logo
- ✅ **SideNav**: Navegación lateral y selector de tema
- ✅ **HomePage**: Página principal con botones de sorteo
- ✅ **NumberBadge**: Badges de números (ganadores, perdedores, vendidos)
- ✅ **ThemeSelector**: Selector visual de temas

## 💡 Tips de Diseño

1. **Contraste**: Asegúrate de que los colores de texto sean legibles sobre los fondos
2. **Coherencia**: Mantén una paleta de colores coherente dentro de cada tema
3. **Accesibilidad**: Usa colores que sean distinguibles para personas con daltonismo
4. **Pruebas**: Prueba el tema en todos los estados (normal, hover, activo, disabled)

## 🐛 Solución de Problemas

### Los colores no se aplican
- Verifica que estés usando clases válidas de Tailwind CSS
- Asegúrate de que el navegador no tenga caché activo (Ctrl+Shift+R)

### El tema no aparece en el selector
- Verifica que el tema esté correctamente agregado al objeto `themes` en `themes.js`
- Asegúrate de que tenga la estructura correcta

### Los gradientes no se ven bien
- Usa colores de tonos similares para gradientes suaves
- Prueba con diferentes combinaciones de `start` y `end`

## 📞 Soporte

Si tienes dudas sobre cómo personalizar los temas, revisa la documentación de Tailwind CSS:
https://tailwindcss.com/docs/customizing-colors

---

**Desarrollado con ❤️ por DesignWebIRG.com**
