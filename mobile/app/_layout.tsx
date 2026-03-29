import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthstore } from "../Store/authStore"
import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen"
SplashScreen.preventAutoHideAsync()
export default function RootLayout() {
    const router = useRouter()
    const segments = useSegments()
    const [isReady, setIsReady] = useState(false);
    const { checkAuth, token, user } = useAuthstore()
    const navigationState = useRootNavigationState()
    const [fontsLoaded] = useFonts({
        "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf")
    })
    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync()
    }, [fontsLoaded])
    useEffect(() => {
        checkAuth().finally(() => setIsReady(true));
    }, [])
    if (!isReady) return null;

    const inAuthScreen = segments[0] === "(auth)"
    const isSignedIn = user && token


    if (!isSignedIn && !inAuthScreen) {
        return <Redirect href="/(auth)/Index" />;
        //  router.replace("/(auth)")

    } else if (isSignedIn && inAuthScreen) {
        return <Redirect href="/(tabs)" />
        // router.replace("/(tabs)")
        // ;
    }
    // if (!isSignedIn && !inAuthScreen) {
    //     router.replace("/(auth)")
    // } else if (isSignedIn && inAuthScreen) {
    //     router.replace("/(tabs)")
    // }

    return (
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
            </Stack>
            {
                Platform.OS === "ios" && <StatusBar style="auto" />
            }
        </SafeAreaProvider>
    )
}
