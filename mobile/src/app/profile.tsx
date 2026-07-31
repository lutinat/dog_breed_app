import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { API_URL } from "../lib/api";
import { useAuth } from "../lib/auth";

type Status = "loading" | "done" | "error";

export default function ProfileScreen() {
  const { user, token, logout } = useAuth();
  const [progress, setProgress] = useState<{ discovered: number; total: number } | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setStatus("loading");
      try {
        const [breedsResponse, collectionResponse] = await Promise.all([
          fetch(`${API_URL}/breeds`),
          fetch(`${API_URL}/collection`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!breedsResponse.ok || !collectionResponse.ok) {
          throw new Error("Failed to load progress");
        }

        const breedsData: { breeds: unknown[] } = await breedsResponse.json();
        const collectionData: { items: unknown[] } = await collectionResponse.json();
        setProgress({ discovered: collectionData.items.length, total: breedsData.breeds.length });
        setStatus("done");
      } catch {
        setStatus("error");
      }
    };

    load();
  }, [token]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Text style={styles.email}>{user?.email}</Text>

      {status === "loading" && <ActivityIndicator style={styles.spacing} />}
      {status === "error" && <Text style={styles.error}>Couldn't load your progress.</Text>}
      {status === "done" && progress && (
        <Text style={styles.progress}>
          {progress.discovered} / {progress.total} breeds discovered
        </Text>
      )}

      <Pressable style={styles.secondaryButton} onPress={() => router.push("/collection")}>
        <Text style={styles.secondaryButtonText}>View collection</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log out</Text>
      </Pressable>

      <Text style={styles.backLink} onPress={() => router.back()}>
        Back to Scan
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  email: {
    fontSize: 16,
    color: "#71807A",
  },
  spacing: {
    marginTop: 8,
  },
  progress: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C5F4F",
    marginTop: 4,
  },
  error: {
    color: "#C23B34",
    marginTop: 4,
  },
  secondaryButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: "#2C5F4F",
    marginTop: 16,
  },
  secondaryButtonText: {
    color: "#2C5F4F",
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#C23B34",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  backLink: {
    color: "#2C5F4F",
    fontWeight: "600",
    paddingVertical: 16,
  },
});
