import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider, useAuth } from "../lib/auth";
import { LanguageProvider, useLanguage } from "../lib/language";

function RootNavigator() {
  const { token, isLoading } = useAuth();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Protected guard={!!token}>
        <Stack.Screen name="index" options={{ title: t.scan.title }} />
        <Stack.Screen name="crop" options={{ title: t.crop.title }} />
        <Stack.Screen name="result" options={{ title: t.result.predictions }} />
        <Stack.Screen name="collection" options={{ title: t.collection.title }} />
        <Stack.Screen name="profile" options={{ title: t.profile.title }} />
      </Stack.Protected>
      <Stack.Protected guard={!token}>
        <Stack.Screen name="login" options={{ title: t.login.title }} />
        <Stack.Screen name="register" options={{ title: t.register.title }} />
      </Stack.Protected>
      {/* Not auth-gated: language preference is independent of login state,
          and it's most useful to a non-English speaker before they log in. */}
      <Stack.Screen name="settings" options={{ title: t.settings.title }} />
    </Stack>
  );
}

export default function RootLayout() {
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
