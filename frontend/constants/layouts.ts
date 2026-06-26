const spacing = {
    none: 0,
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48
} as const;

const radius = {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    pill: 999
} as const;

const shadow = {
    none: {
        elevation: 0,
        shadowOpacity: 0,
        shadowRadius: 0
    },
    sm: {
        elevation: 1,
        shadowOffset: {
            height: 1,
            width: 0
        },
        shadowOpacity: 0.12,
        shadowRadius: 2
    },
    md: {
        elevation: 3,
        shadowOffset: {
            height: 3,
            width: 0
        },
        shadowOpacity: 0.16,
        shadowRadius: 6
    },
    lg: {
        elevation: 6,
        shadowOffset: {
            height: 8,
            width: 0
        },
        shadowOpacity: 0.2,
        shadowRadius: 16
    }
} as const;

const mobile = {
    card: {
        borderRadius: radius.md,
        gap: spacing.md,
        padding: spacing.lg
    },
    contentMaxWidth: 640,
    gutter: spacing.lg,
    hitSlop: spacing.sm,
    margin: {
        screen: spacing.lg,
        section: spacing.xl
    },
    padding: {
        buttonHorizontal: spacing.lg,
        buttonVertical: spacing.md,
        screenHorizontal: spacing.lg,
        screenVertical: spacing.xl
    },
    radius,
    shadow,
    spacing
} as const;

const web = {
    card: {
        borderRadius: radius.md,
        gap: spacing.lg,
        padding: spacing.xl
    },
    contentMaxWidth: 1120,
    gutter: spacing.xl,
    margin: {
        page: spacing.xxl,
        section: spacing.xxxl
    },
    padding: {
        buttonHorizontal: spacing.xl,
        buttonVertical: spacing.md,
        pageHorizontal: spacing.xxl,
        pageVertical: spacing.xxxl
    },
    radius,
    shadow,
    spacing
} as const;

export const layouts = {
    mobile,
    radius,
    shadow,
    spacing,
    web
} as const;

export type LayoutPlatform = 'mobile' | 'web';
export type RadiusSize = keyof typeof radius;
export type ShadowSize = keyof typeof shadow;
export type SpacingSize = keyof typeof spacing;
