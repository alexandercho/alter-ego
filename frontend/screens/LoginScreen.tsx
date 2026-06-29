import { FontAwesome } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, useColorScheme, View, type PressableStateCallbackType } from 'react-native';
import { colors } from 'constants/colors';
import { layouts } from 'constants/layouts';
import { typography } from 'constants/typography';
import { loginWithGoogle, type AuthSession } from 'lib/api';
import { getGoogleSignInStatus, signInWithGoogle } from 'lib/googleAuth';

type LoginScreenProps = {
    onAuthenticated: (_session: AuthSession) => void;
};

type Theme = typeof colors.modes[keyof typeof colors.modes];

export default function LoginScreen({ onAuthenticated }: LoginScreenProps) {
    const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
    const theme = colors.modes[colorScheme];
    const styles = useMemo(() => createStyles(theme), [theme]);
    const googleStatus = getGoogleSignInStatus();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleGoogleSignIn = async () => {
        setErrorMessage(null);
        setIsSigningIn(true);

        try {
            const googleResult = await signInWithGoogle();
            const session = await loginWithGoogle(googleResult.idToken);

            onAuthenticated(session);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in.');
        } finally {
            setIsSigningIn(false);
        }
    };

    return (
        <View style={styles.screen}>
            <View style={styles.panel}>
                <View style={styles.copy}>
                    <Text style={styles.eyebrow}>Alter Ego</Text>
                    <Text style={styles.title}>Sign in</Text>
                    <Text style={styles.subtitle}>Use your Google account to continue.</Text>
                </View>

                <Pressable
                    accessibilityRole='button'
                    disabled={isSigningIn}
                    onPress={handleGoogleSignIn}
                    style={({ pressed }: PressableStateCallbackType) => [
                        styles.googleButton,
                        pressed && styles.googleButtonPressed,
                        isSigningIn && styles.googleButtonDisabled
                    ]}
                >
                    {isSigningIn ? (
                        <ActivityIndicator color={theme.textPrimary} />
                    ) : (
                        <FontAwesome color={colors.palette.color1} name='google' size={20} />
                    )}
                    <Text style={styles.googleButtonText}>
                        {isSigningIn ? 'Signing in' : 'Continue with Google'}
                    </Text>
                </Pressable>

                {!googleStatus.canUseGoogleOAuth && googleStatus.hasPlaceholderToken ? (
                    <Text style={styles.helperText}>Using placeholder Google token from environment.</Text>
                ) : null}

                {errorMessage ? (
                    <Text accessibilityRole='alert' style={styles.errorText}>
                        {errorMessage}
                    </Text>
                ) : null}
            </View>
        </View>
    );
}

const createStyles = (theme: Theme) => StyleSheet.create({
    copy: {
        gap: layouts.spacing.sm
    },
    errorText: {
        color: colors.palette.color4,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.mobile.bodySmall,
        lineHeight: typography.lineHeight.mobile.bodySmall
    },
    eyebrow: {
        color: colors.palette.color2,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.mobile.caption,
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.lineHeight.mobile.caption,
        textTransform: 'uppercase'
    },
    googleButton: {
        alignItems: 'center',
        backgroundColor: theme.surface,
        borderColor: theme.border,
        borderRadius: layouts.radius.md,
        borderWidth: 1,
        flexDirection: 'row',
        gap: layouts.spacing.md,
        justifyContent: 'center',
        minHeight: 52,
        paddingHorizontal: layouts.mobile.padding.buttonHorizontal,
        paddingVertical: layouts.mobile.padding.buttonVertical
    },
    googleButtonDisabled: {
        opacity: 0.68
    },
    googleButtonPressed: {
        opacity: 0.78
    },
    googleButtonText: {
        color: theme.textPrimary,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.mobile.button,
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.mobile.button
    },
    helperText: {
        color: theme.textSecondary,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.mobile.caption,
        lineHeight: typography.lineHeight.mobile.caption
    },
    panel: {
        backgroundColor: theme.surface,
        borderColor: theme.border,
        borderRadius: layouts.radius.md,
        borderWidth: 1,
        gap: layouts.spacing.xl,
        maxWidth: 440,
        padding: layouts.mobile.card.padding,
        width: '100%'
    },
    screen: {
        alignItems: 'center',
        backgroundColor: theme.background,
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: layouts.mobile.padding.screenHorizontal,
        paddingVertical: layouts.mobile.padding.screenVertical
    },
    subtitle: {
        color: theme.textSecondary,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.mobile.body,
        lineHeight: typography.lineHeight.mobile.body
    },
    title: {
        color: theme.textPrimary,
        fontFamily: typography.fontFamily.display,
        fontSize: typography.fontSize.mobile.title,
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.lineHeight.mobile.title
    }
});
