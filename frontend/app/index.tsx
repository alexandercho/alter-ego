import { useState } from 'react';
import HelloWorldScreen from 'screens/HelloWorldScreen';
import LoginScreen from 'screens/LoginScreen';
import type { AuthSession } from 'lib/api';

export default function HomeScreen() {
    const [session, setSession] = useState<AuthSession | null>(null);

    if (!session) {
        return (
            <LoginScreen onAuthenticated={setSession} />
        );
    }

    return (
        <HelloWorldScreen />
    );
}
