import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// expo-secure-store has no web implementation (its native module resolves to
// `{}` there) — fall back to localStorage on web, matching the Platform.OS
// branch already used elsewhere for the same native/web split.
export function createStorage(key: string) {
  return {
    async get(): Promise<string | null> {
      if (Platform.OS === "web") {
        return localStorage.getItem(key);
      }
      return SecureStore.getItemAsync(key);
    },
    async set(value: string): Promise<void> {
      if (Platform.OS === "web") {
        localStorage.setItem(key, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    },
    async clear(): Promise<void> {
      if (Platform.OS === "web") {
        localStorage.removeItem(key);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    },
  };
}
