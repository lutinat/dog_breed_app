import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { API_URL } from "../lib/api";
import { useAuth } from "../lib/auth";

type Prediction = {
  breed: string;
  score: number;
};

type Status = "uploading" | "done" | "error";
type CollectionStatus = "idle" | "saving" | "new" | "already-owned" | "error";

export default function ResultScreen() {
  const { token } = useAuth();
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [status, setStatus] = useState<Status>("uploading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [collectionStatus, setCollectionStatus] = useState<CollectionStatus>("idle");

  useEffect(() => {
    if (!uri) return;

    const upload = async () => {
      setStatus("uploading");
      setErrorMessage(null);

      try {
        const formData = new FormData();
        if (Platform.OS === "web") {
          // On web, RN's {uri, name, type} shorthand isn't understood by the
          // browser's native FormData — it gets stringified instead of sent
          // as a file. We need an actual Blob there. Note: `uri` here is a
          // blob: URL tied to this page's JS context — if the page reloaded
          // since the crop was made (e.g. dev Fast Refresh), it's orphaned
          // and this fetch fails; the catch below reports that clearly.
          const fileResponse = await fetch(uri);
          const blob = await fileResponse.blob();
          formData.append("file", blob, "photo.jpg");
        } else {
          formData.append("file", {
            uri,
            name: "photo.jpg",
            type: "image/jpeg",
          } as unknown as Blob);
        }

        const response = await fetch(`${API_URL}/predict`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data: { predictions: Prediction[] } = await response.json();
        setPredictions(data.predictions);
        setStatus("done");
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Could not reach the backend. Is it running and reachable on your network?"
        );
      }
    };

    upload();
  }, [uri]);

  const savingRef = useRef(false);

  const addToCollection = async () => {
    if (!predictions || predictions.length === 0 || !token) return;
    // Guards against a Pressable-on-web quirk where a single tap can invoke
    // onPress twice before React re-renders — a ref check is synchronous,
    // unlike the `collectionStatus` state check, which both invocations can
    // race past before either commits.
    if (savingRef.current) return;
    savingRef.current = true;

    setCollectionStatus("saving");
    try {
      const response = await fetch(`${API_URL}/collection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ breed: predictions[0].breed }),
      });

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      const data: { is_new_discovery: boolean } = await response.json();
      setCollectionStatus(data.is_new_discovery ? "new" : "already-owned");
    } catch {
      setCollectionStatus("error");
    }
  };

  if (!uri) {
    return (
      <View style={styles.center}>
        <Text>No image to classify.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri }} style={styles.preview} resizeMode="cover" />

      {status === "uploading" && <ActivityIndicator style={styles.spacing} size="large" />}

      {status === "error" && errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      {status === "done" && predictions && (
        <View style={styles.spacing}>
          <Text style={styles.resultsTitle}>Predictions</Text>
          {predictions.map((prediction) => (
            <Text key={prediction.breed} style={styles.resultRow}>
              {prediction.breed} — {Math.round(prediction.score * 100)}% match
            </Text>
          ))}

          {collectionStatus === "idle" && (
            <Pressable style={styles.secondaryButton} onPress={addToCollection}>
              <Text style={styles.secondaryButtonText}>Add to collection</Text>
            </Pressable>
          )}
          {collectionStatus === "saving" && <ActivityIndicator style={styles.spacing} />}
          {collectionStatus === "new" && <Text style={styles.discovery}>New breed discovered!</Text>}
          {collectionStatus === "already-owned" && (
            <Text style={styles.discoveryMuted}>Already in your collection.</Text>
          )}
          {collectionStatus === "error" && (
            <Text style={styles.error}>Couldn't save to your collection. Try again.</Text>
          )}
        </View>
      )}

      <Pressable style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>Scan another dog</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    paddingTop: 80,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    width: 260,
    height: 260,
    borderRadius: 8,
  },
  spacing: {
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },
  error: {
    color: "#C23B34",
    marginTop: 16,
    textAlign: "center",
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  resultRow: {
    fontSize: 16,
    paddingVertical: 4,
  },
  button: {
    backgroundColor: "#2C5F4F",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondaryButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "#2C5F4F",
    marginTop: 12,
  },
  secondaryButtonText: {
    color: "#2C5F4F",
    fontWeight: "600",
  },
  discovery: {
    marginTop: 12,
    color: "#2C5F4F",
    fontWeight: "600",
  },
  discoveryMuted: {
    marginTop: 12,
    color: "#71807A",
  },
});
