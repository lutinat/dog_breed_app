import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { API_URL } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/language";

type Breed = {
  id: number;
  name: string;
  name_fr: string | null;
};

type CollectionItem = {
  breed_id: number;
  name: string;
  discovered_at: string;
};

type GridEntry = {
  breed: Breed;
  discovered: boolean;
};

type Status = "loading" | "done" | "error";

export default function CollectionScreen() {
  const { token } = useAuth();
  const { t, language } = useLanguage();
  const [entries, setEntries] = useState<GridEntry[]>([]);
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
          throw new Error("Failed to load collection");
        }

        const breedsData: { breeds: Breed[] } = await breedsResponse.json();
        const collectionData: { items: CollectionItem[] } = await collectionResponse.json();
        const discoveredIds = new Set(collectionData.items.map((item) => item.breed_id));

        setEntries(
          breedsData.breeds.map((breed) => ({
            breed,
            discovered: discoveredIds.has(breed.id),
          }))
        );
        setStatus("done");
      } catch {
        setStatus("error");
      }
    };

    load();
  }, [token]);

  const discoveredCount = entries.filter((entry) => entry.discovered).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.collection.title}</Text>

      {status === "loading" && <ActivityIndicator style={styles.spacing} size="large" />}

      {status === "error" && <Text style={styles.error}>{t.collection.loadError}</Text>}

      {status === "done" && (
        <>
          <Text style={styles.progress}>
            {discoveredCount} / {entries.length} {t.collection.breedsDiscovered}
          </Text>
          <FlatList
            data={entries}
            keyExtractor={(entry) => String(entry.breed.id)}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <View style={[styles.card, item.discovered ? styles.cardDiscovered : styles.cardLocked]}>
                <Text style={styles.cardIcon}>{item.discovered ? "🐾" : "🔒"}</Text>
                <Text style={item.discovered ? styles.cardName : styles.cardNameLocked} numberOfLines={2}>
                  {item.discovered
                    ? (language === "fr" && item.breed.name_fr) || item.breed.name
                    : t.collection.locked}
                </Text>
              </View>
            )}
          />
        </>
      )}

      <Text style={styles.backLink} onPress={() => router.back()}>
        {t.collection.backToScan}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  progress: {
    fontSize: 16,
    color: "#71807A",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  spacing: {
    marginTop: 24,
  },
  error: {
    color: "#C23B34",
    textAlign: "center",
    marginTop: 24,
  },
  grid: {
    paddingBottom: 24,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    gap: 6,
  },
  cardDiscovered: {
    backgroundColor: "#E4EFEA",
    borderWidth: 1.5,
    borderColor: "#2C5F4F",
  },
  cardLocked: {
    backgroundColor: "#EFEFEF",
    borderWidth: 1.5,
    borderColor: "#DADADA",
  },
  cardIcon: {
    fontSize: 28,
  },
  cardName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2C5F4F",
    textAlign: "center",
  },
  cardNameLocked: {
    fontSize: 13,
    color: "#9AA39D",
    textAlign: "center",
  },
  backLink: {
    color: "#2C5F4F",
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 16,
  },
});
