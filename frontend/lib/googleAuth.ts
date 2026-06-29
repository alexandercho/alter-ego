import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

type GoogleAuthResult = {
    idToken: string;
    source: 'google' | 'placeholder';
};

const googleAuthBaseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
const redirectPath = 'auth/google';

const getConfiguredClientId = () => {
    if (Platform.OS === 'ios') {
        return process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? null;
    }

    if (Platform.OS === 'android') {
        return process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? null;
    }

    return process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? null;
};

const readTokenFromUrl = (url: string) => {
    const [, fragment = ''] = url.split('#');
    const query = url.includes('?') ? url.slice(url.indexOf('?') + 1).split('#')[0] : '';
    const params = new URLSearchParams(fragment || query);

    return params.get('id_token');
};

export const getGoogleSignInStatus = () => ({
    canUseGoogleOAuth: Boolean(getConfiguredClientId()),
    hasPlaceholderToken: Boolean(process.env.EXPO_PUBLIC_GOOGLE_ID_TOKEN_PLACEHOLDER)
});

export const signInWithGoogle = async (): Promise<GoogleAuthResult> => {
    const clientId = getConfiguredClientId();
    const placeholderToken = process.env.EXPO_PUBLIC_GOOGLE_ID_TOKEN_PLACEHOLDER;

    if (!clientId) {
        if (placeholderToken) {
            return {
                idToken: placeholderToken,
                source: 'placeholder'
            };
        }

        throw new Error('Set an Expo public Google client ID before signing in.');
    }

    const redirectUri = Linking.createURL(redirectPath, {
        scheme: process.env.EXPO_PUBLIC_GOOGLE_AUTH_SCHEME
    });
    const authUrl = new URL(googleAuthBaseUrl);

    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'id_token');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('nonce', `${Date.now()}`);

    const result = await WebBrowser.openAuthSessionAsync(authUrl.toString(), redirectUri);

    if (result.type !== 'success') {
        throw new Error('Google sign-in was cancelled.');
    }

    const idToken = readTokenFromUrl(result.url);

    if (!idToken) {
        throw new Error('Google did not return an ID token.');
    }

    return {
        idToken,
        source: 'google'
    };
};
