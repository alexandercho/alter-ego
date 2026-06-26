const neutral = {
    black: '#121316',
    darkGray: '#4b5563',
    darkOverlay: '#111827e6',
    darkShadow: '#00000066',
    darkSurface: '#1c1f24',
    lightGray: '#d8dde5',
    lightOverlay: '#18181bcc',
    lightShadow: '#18181b1f',
    lightSurface: '#ffffff',
    mediumGray: '#8a93a3',
    white: '#f8f7f2'
} as const;

// Calm editorial tech: clear blue, grounded teal, warm amber, and restrained rose for focused modern app accents.
const palette = {
    color1: '#2f6fed',
    color2: '#0f8a7a',
    color3: '#d69a2d',
    color4: '#c45b7c'
} as const;

const modes = {
    dark: {
        background: neutral.black,
        border: neutral.darkGray,
        overlay: neutral.darkOverlay,
        shadow: neutral.darkShadow,
        surface: neutral.darkSurface,
        textPrimary: neutral.white,
        textSecondary: neutral.lightGray
    },
    light: {
        background: neutral.white,
        border: neutral.lightGray,
        overlay: neutral.lightOverlay,
        shadow: neutral.lightShadow,
        surface: neutral.lightSurface,
        textPrimary: neutral.black,
        textSecondary: neutral.darkGray
    }
} as const;

export const colors = {
    modes,
    neutral,
    palette
} as const;

export type ColorMode = keyof typeof colors.modes;
export type NeutralColorName = keyof typeof colors.neutral;
export type PaletteColorName = keyof typeof colors.palette;
