import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Fraunces_600SemiBold } from "@expo-google-fonts/fraunces";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { IBMPlexMono_500Medium } from "@expo-google-fonts/ibm-plex-mono";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider, useAuth } from "../lib/auth";
import { LanguageProvider, useLanguage } from "../lib/language";
import { BottomNav } from "../components/BottomNav";
import { color } from "../theme/tokens";

// Held until fonts resolve — every `type.*` style in tokens.ts names one of
// these families, and silently falls back to the OS default until it's loaded.
SplashScreen.preventAutoHideAsync();

// Collection and Profile are the two tab-root screens the BottomNav switches
// between. Scan (the camera) matches the prototype's full-bleed viewfinder —
// no bottom nav there — and every other route (crop, result, login,
// register, settings) is reached by a forward action, not a nav tab.
const NAV_BAR_PATHS = new Set(["/collection", "/profile"]);

function RootNavigator() {
  const { token, isLoading } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: color.canvas }}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!token}>
          {/* index/collection/profile switch laterally via BottomNav (or the
              Scan screen's Album pill), not a forward/back flow — a
              directional push (always right-to-left) reads as wrong. Fade instead. */}
          <Stack.Screen name="index" options={{ title: t.scan.title, animation: "fade" }} />
          <Stack.Screen name="crop" options={{ title: t.crop.title }} />
          <Stack.Screen name="result" options={{ title: t.result.predictions }} />
          <Stack.Screen name="collection" options={{ title: t.collection.title, animation: "fade" }} />
          <Stack.Screen name="profile" options={{ title: t.profile.title, animation: "fade" }} />
          <Stack.Screen name="breed/[id]" />
        </Stack.Protected>
        <Stack.Protected guard={!token}>
          <Stack.Screen name="login" options={{ title: t.login.title }} />
          <Stack.Screen name="register" options={{ title: t.register.title }} />
        </Stack.Protected>
        {/* Not auth-gated: language preference is independent of login state,
            and it's most useful to a non-English speaker before they log in. */}
        <Stack.Screen name="settings" options={{ title: t.settings.title }} />
      </Stack>
      {!!token && NAV_BAR_PATHS.has(pathname) && <BottomNav />}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    IBMPlexMono_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}
