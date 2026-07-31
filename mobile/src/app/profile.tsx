import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_URL } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/language";
import { ProgressBar } from "../components/ProgressBar";
import { border, color, font, hitSlop, radius, space, type } from "../theme/tokens";

type Status = "loading" | "done" | "error";

export default function ProfileScreen() {
  const { user, token, logout } = useAuth();
  const { t } = useLanguage();
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.profile.title}</Text>
        <Pressable
          onPress={() => router.push("/settings")}
          hitSlop={hitSlop}
          style={styles.settingsButton}
          accessibilityLabel={t.settings.title}
        >
          <Feather name="settings" size={19} color={color.body} />
        </Pressable>
      </View>

      {status === "loading" && <ActivityIndicator style={styles.spacing} size="large" color={color.primary} />}
      {status === "error" && <Text style={[type.bodyMd, styles.error]}>{t.profile.progressError}</Text>}

      {status === "done" && progress && (
        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>{t.profile.breedsDiscovered}</Text>
          <View style={styles.progressCountRow}>
            <Text style={styles.progressCount}>{progress.discovered}</Text>
            <Text style={styles.progressTotal}>/{progress.total}</Text>
          </View>
          <View style={styles.spacing}>
            <ProgressBar value={progress.discovered} max={progress.total} />
          </View>
          <Text style={[type.bodySm, styles.email]}>{user?.email}</Text>
        </View>
      )}

      <View style={styles.rows}>
        <Pressable style={styles.row} onPress={() => router.push("/settings")}>
          <Feather name="settings" size={19} color={color.muted} />
          <Text style={[type.bodyMdMedium, styles.rowLabel]}>{t.settings.title}</Text>
          <Feather name="chevron-right" size={18} color={color.mutedSoft} />
        </Pressable>
        <Pressable style={styles.row} onPress={handleLogout}>
          <Feather name="log-out" size={19} color={color.error} />
          <Text style={[type.bodyMdMedium, styles.rowLabelDestructive]}>{t.profile.logOut}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.canvas,
    paddingHorizontal: space.md,
    paddingTop: space.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.md,
  },
  headerTitle: {
    ...type.displayMd,
    color: color.ink,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: color.surface,
    borderWidth: border.hairline,
    borderColor: color.hairline,
    alignItems: "center",
    justifyContent: "center",
  },
  spacing: {
    marginTop: space.sm,
  },
  error: {
    color: color.error,
  },
  progressCard: {
    backgroundColor: color.surface,
    borderRadius: radius.xl,
    padding: space.md,
  },
  progressLabel: {
    ...type.labelUppercase,
    color: color.muted,
    textAlign: "center",
  },
  progressCountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginTop: space.xxs,
  },
  progressCount: {
    fontFamily: font.mono,
    fontSize: 44,
    color: color.ink,
  },
  progressTotal: {
    fontFamily: font.mono,
    fontSize: 22,
    color: color.muted,
  },
  email: {
    color: color.muted,
    marginTop: space.sm,
    textAlign: "center",
  },
  rows: {
    marginTop: space.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: space.sm + space.xxs,
    borderBottomWidth: border.hairline,
    borderBottomColor: color.hairlineSoft,
  },
  rowLabel: {
    flex: 1,
    color: color.ink,
  },
  rowLabelDestructive: {
    flex: 1,
    color: color.error,
  },
});
