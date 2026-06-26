const fontFamily = {
    body: 'System',
    display: 'System',
    mono: 'SpaceMono'
} as const;

const fontSize = {
    mobile: {
        caption: 12,
        body: 16,
        bodySmall: 14,
        button: 16,
        title: 24,
        subtitle: 20,
        display: 32
    },
    web: {
        caption: 12,
        body: 16,
        bodySmall: 14,
        button: 15,
        title: 32,
        subtitle: 24,
        display: 48
    }
} as const;

const fontWeight = {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800'
} as const;

const lineHeight = {
    mobile: {
        caption: 16,
        body: 24,
        bodySmall: 20,
        button: 20,
        title: 32,
        subtitle: 28,
        display: 40
    },
    web: {
        caption: 16,
        body: 24,
        bodySmall: 20,
        button: 20,
        title: 40,
        subtitle: 32,
        display: 56
    }
} as const;

const textRole = {
    body: {
        weight: fontWeight.regular
    },
    button: {
        weight: fontWeight.semibold
    },
    caption: {
        weight: fontWeight.medium
    },
    display: {
        weight: fontWeight.bold
    },
    label: {
        weight: fontWeight.semibold
    },
    title: {
        weight: fontWeight.bold
    }
} as const;

export const typography = {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    textRole
} as const;

export type FontSizeName = keyof typeof fontSize.mobile;
export type FontWeightName = keyof typeof fontWeight;
export type TypographyPlatform = keyof typeof fontSize;
