import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_URL } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/language";
import { CollectionCard } from "../components/CollectionCard";
import { ProgressBar } from "../components/ProgressBar";
import { color, radius, space, type } from "../theme/tokens";

type Breed = {
  id: number;
  name: string;
  name_fr: string | null;
};

type CollectionItem = {
  breed_id: number;
  name: string;
  discovered_at: string;
  fun_fact_en: string | null;
  fun_fact_fr: string | null;
};

type GridEntry = {
  breed: Breed;
  discovered: boolean;
  collectionItem: CollectionItem | null;
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
        const itemsByBreedId = new Map(collectionData.items.map((item) => [item.breed_id, item]));

        setEntries(
          breedsData.breeds.map((breed) => ({
            breed,
            discovered: itemsByBreedId.has(breed.id),
            collectionItem: itemsByBreedId.get(breed.id) ?? null,
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>{t.collection.title}</Text>

      {status === "loading" && <ActivityIndicator style={styles.spacing} size="large" color={color.primary} />}

      {status === "error" && <Text style={[type.bodyMd, styles.error]}>{t.collection.loadError}</Text>}

      {status === "done" && (
        <>
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <Text style={styles.progressCount}>
                {discoveredCount}/{entries.length}
              </Text>
              <Text style={[type.bodySm, styles.muted]}>{t.collection.breedsDiscovered}</Text>
            </View>
            <ProgressBar value={discoveredCount} max={entries.length} />
          </View>

          <FlatList
            data={entries}
            keyExtractor={(entry) => String(entry.breed.id)}
            numColumns={3}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => {
              const entry = item.collectionItem;
              return (
                <Pressable
                  style={styles.cardPress}
                  disabled={!item.discovered || !entry}
                  onPress={
                    entry
                      ? () =>
                          router.push({
                            pathname: "/breed/[id]",
                            params: {
                              id: String(item.breed.id),
                              name: item.breed.name,
                              name_fr: item.breed.name_fr ?? "",
                              discoveredAt: entry.discovered_at,
                              fun_fact_en: entry.fun_fact_en ?? "",
                              fun_fact_fr: entry.fun_fact_fr ?? "",
                            },
                          })
                      : undefined
                  }
                >
                  <CollectionCard
                    locked={!item.discovered}
                    breedName={(language === "fr" && item.breed.name_fr) || item.breed.name}
                    lockedLabel={t.collection.locked}
                  />
                </Pressable>
              );
            }}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.canvas,
    paddingTop: space.xs,
    paddingHorizontal: space.md,
  },
  title: {
    ...type.displayMd,
    color: color.ink,
    marginBottom: space.md,
  },
  spacing: {
    marginTop: space.lg,
  },
  muted: {
    color: color.muted,
  },
  error: {
    color: color.error,
    textAlign: "center",
    marginTop: space.lg,
  },
  progressCard: {
    backgroundColor: color.surface,
    borderRadius: radius.xl,
    padding: space.md,
    gap: space.sm,
    marginBottom: space.md,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: space.xs,
  },
  progressCount: {
    ...type.dataLg,
    color: color.primary,
  },
  grid: {
    paddingBottom: space.xl,
  },
  row: {
    gap: space.sm,
    marginBottom: space.sm,
  },
  cardPress: {
    flex: 1,
    aspectRatio: 3 / 4,
  },
});
