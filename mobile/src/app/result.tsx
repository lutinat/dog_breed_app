import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_URL } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/language";
import { Button } from "../components/Button";
import { ConfidenceRing } from "../components/ConfidenceRing";
import { CroppedPhoto, type ImageSize } from "../components/CroppedPhoto";
import { border, color, hitSlop, motion, radius, shadow, space, type } from "../theme/tokens";

// The long edge of the uploaded photo is downscaled to roughly this before
// it's sent to /predict — full-res phone photos are unnecessarily large for
// a 224px classifier input, and the crop rect is scaled to match.
const UPLOAD_MAX_EDGE = 1600;

const RING_SIZE = 196;
const RING_THICKNESS = 11;
const RING_INNER = RING_SIZE - RING_THICKNESS * 2;
const ANALYZING_PREVIEW_SIZE = 190;
const HEADER_THUMB_SIZE = 44;

type Prediction = {
  breed: string;
  score: number;
};

type Status = "uploading" | "done" | "error";
type CollectionStatus = "idle" | "saving" | "new" | "already-owned" | "error";
type ViewMode = "confident" | "candidates";

// Empirical placeholder — docs/plan.md lists the real threshold as an open
// decision, to be tuned once the model is wired up against real usage.
const CONFIDENT_THRESHOLD = 0.6;

export default function ResultScreen() {
  const { token } = useAuth();
  const { t, language } = useLanguage();
  const params = useLocalSearchParams<{ uri: string; originX: string; originY: string; width: string; height: string }>();
  const { uri } = params;
  const rect = {
    originX: Number(params.originX),
    originY: Number(params.originY),
    width: Number(params.width),
    height: Number(params.height),
  };
  const hasValidRect = Object.values(rect).every((n) => Number.isFinite(n)) && rect.width > 0 && rect.height > 0;

  const [naturalSize, setNaturalSize] = useState<ImageSize | null>(null);
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [status, setStatus] = useState<Status>("uploading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [collectionStatus, setCollectionStatus] = useState<CollectionStatus>("idle");
  const [funFacts, setFunFacts] = useState<{ en: string | null; fr: string | null } | null>(null);
  const funFact = funFacts ? (language === "fr" ? funFacts.fr : funFacts.en) : null;
  const [breedNamesFr, setBreedNamesFr] = useState<Record<string, string | null>>({});
  const [viewMode, setViewMode] = useState<ViewMode>("confident");
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    if (!uri) return;
    Image.getSize(
      uri,
      (width, height) => setNaturalSize({ width, height }),
      () => setNaturalSize(null)
    );
  }, [uri]);

  useEffect(() => {
    // /predict returns raw ML class labels (always English) — fetch the
    // breeds list once to translate them for display without touching the
    // value actually sent to POST /collection, which must stay the exact
    // English string the model/DB use as the join key.
    fetch(`${API_URL}/breeds`)
      .then((response) => response.json())
      .then((data: { breeds: { name: string; name_fr: string | null }[] }) => {
        setBreedNamesFr(Object.fromEntries(data.breeds.map((b) => [b.name, b.name_fr])));
      })
      .catch(() => {
        // Non-critical: predictions just fall back to the English name.
      });
  }, []);

  const displayBreedName = (name: string) => (language === "fr" && breedNamesFr[name]) || name;

  const upload = async () => {
    if (!uri || !naturalSize || !hasValidRect) return;
    setStatus("uploading");
    setErrorMessage(null);

    try {
      const longEdge = Math.max(naturalSize.width, naturalSize.height);
      const downscale = longEdge > UPLOAD_MAX_EDGE ? UPLOAD_MAX_EDGE / longEdge : 1;

      const uploadUri =
        downscale === 1
          ? uri
          : (
              await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: Math.round(naturalSize.width * downscale) } }],
                { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
              )
            ).uri;

      const scaledRect = {
        origin_x: Math.round(rect.originX * downscale),
        origin_y: Math.round(rect.originY * downscale),
        width: Math.round(rect.width * downscale),
        height: Math.round(rect.height * downscale),
      };

      const formData = new FormData();
      if (Platform.OS === "web") {
        // On web, RN's {uri, name, type} shorthand isn't understood by the
        // browser's native FormData — it gets stringified instead of sent
        // as a file. We need an actual Blob there. Note: `uploadUri` here
        // can be a blob: URL tied to this page's JS context — if the page
        // reloaded since the crop was made (e.g. dev Fast Refresh), it's
        // orphaned and this fetch fails; the catch below reports that
        // clearly.
        const fileResponse = await fetch(uploadUri);
        const blob = await fileResponse.blob();
        formData.append("file", blob, "photo.jpg");
      } else {
        formData.append("file", {
          uri: uploadUri,
          name: "photo.jpg",
          type: "image/jpeg",
        } as unknown as Blob);
      }
      formData.append("origin_x", String(scaledRect.origin_x));
      formData.append("origin_y", String(scaledRect.origin_y));
      formData.append("width", String(scaledRect.width));
      formData.append("height", String(scaledRect.height));

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data: { predictions: Prediction[] } = await response.json();
      setPredictions(data.predictions);
      setViewMode(data.predictions[0] && data.predictions[0].score >= CONFIDENT_THRESHOLD ? "confident" : "candidates");
      setFocusedIndex(0);
      setStatus("done");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : t.result.uploadError);
    }
  };

  useEffect(() => {
    upload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri, naturalSize]);

  const savingRef = useRef(false);

  const addToCollection = async (breed: string) => {
    if (!token) return;
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
        body: JSON.stringify({ breed }),
      });

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      const data: { is_new_discovery: boolean; fun_fact_en: string | null; fun_fact_fr: string | null } =
        await response.json();
      setCollectionStatus(data.is_new_discovery ? "new" : "already-owned");
      setFunFacts({ en: data.fun_fact_en, fr: data.fun_fact_fr });
    } catch {
      setCollectionStatus("error");
    } finally {
      savingRef.current = false;
    }
  };

  const pickCandidate = (index: number) => {
    if (!predictions) return;
    setFocusedIndex(index);
    setViewMode("confident");
    addToCollection(predictions[index].breed);
  };

  const close = () => router.replace("/");

  if (!uri || !hasValidRect) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={type.bodyMd}>{t.result.noImage}</Text>
      </SafeAreaView>
    );
  }

  const focused = predictions?.[focusedIndex];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={close} hitSlop={hitSlop} style={styles.closeButton} accessibilityLabel={t.result.close}>
          <Feather name="x" size={24} color={color.body} />
        </Pressable>
        {status === "done" && viewMode === "candidates" && naturalSize && (
          <CroppedPhoto
            uri={uri}
            rect={rect}
            naturalSize={naturalSize}
            containerWidth={HEADER_THUMB_SIZE}
            containerHeight={HEADER_THUMB_SIZE}
            style={styles.headerThumb}
          />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {status === "uploading" && (
          <View style={styles.centerBlock}>
            {naturalSize && (
              <CroppedPhoto
                uri={uri}
                rect={rect}
                naturalSize={naturalSize}
                containerWidth={ANALYZING_PREVIEW_SIZE}
                containerHeight={ANALYZING_PREVIEW_SIZE}
                style={styles.analyzingPreview}
              />
            )}
            <ActivityIndicator size="large" color={color.primary} style={styles.spacing} />
            <Text style={[type.bodySm, styles.muted]}>{t.result.analyzing}</Text>
          </View>
        )}

        {status === "error" && (
          <View style={styles.centerBlock}>
            <Text style={[type.displayMd, styles.spacing]}>{t.result.collectionError}</Text>
            {errorMessage && <Text style={[type.bodySm, styles.errorText]}>{errorMessage}</Text>}
            <Button variant="primary" onPress={upload} style={styles.spacing}>
              {t.result.tryAgain}
            </Button>
          </View>
        )}

        {status === "done" && predictions && focused && viewMode === "confident" && (
          <View style={styles.confidentBlock}>
            <View style={styles.ringWrap}>
              <ConfidenceRing
                size={RING_SIZE}
                thickness={RING_THICKNESS}
                segments={
                  focusedIndex === 0 && predictions[1]
                    ? [
                        { pct: Math.round(focused.score * 100), color: color.primary },
                        { pct: Math.round(predictions[1].score * 100), color: color.secondary },
                      ]
                    : [{ pct: Math.round(focused.score * 100), color: color.primary }]
                }
              >
                {naturalSize && (
                  <CroppedPhoto
                    uri={uri}
                    rect={rect}
                    naturalSize={naturalSize}
                    containerWidth={RING_INNER}
                    containerHeight={RING_INNER}
                  />
                )}
              </ConfidenceRing>
              <View style={styles.surePill}>
                <View style={styles.surePillBadge}>
                  <Text style={type.dataSm}>
                    {Math.round(focused.score * 100)}% {t.result.sure}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.nameBlock}>
              {collectionStatus === "new" && <Text style={styles.newBreedLabel}>{t.result.newBreedLabel}</Text>}
              <Text style={styles.breedName}>{displayBreedName(focused.breed)}</Text>
            </View>

            {funFact && collectionStatus !== "idle" && collectionStatus !== "saving" && (
              <View style={styles.factCard}>
                <Feather name="star" size={20} color={color.secondary} style={styles.factIcon} />
                <View style={styles.factTextWrap}>
                  <Text style={styles.factLabel}>{t.result.didYouKnow}</Text>
                  <Text style={[type.bodyMd, styles.factBody]}>{funFact}</Text>
                </View>
              </View>
            )}

            {collectionStatus === "idle" && (
              <View style={styles.footer}>
                <Button variant="accent" fullWidth onPress={() => addToCollection(focused.breed)}>
                  {t.result.addToCollection}
                </Button>
                {predictions.length > 1 && (
                  <Button variant="ghost" icon="list" color={color.muted} onPress={() => setViewMode("candidates")}>
                    {t.result.seeOtherGuesses}
                  </Button>
                )}
              </View>
            )}
            {collectionStatus === "saving" && <ActivityIndicator style={styles.spacing} color={color.primary} />}
            {collectionStatus === "already-owned" && (
              <Text style={[type.bodyMd, styles.muted, styles.spacing]}>{t.result.alreadyOwned}</Text>
            )}
            {collectionStatus === "error" && (
              <View style={styles.footer}>
                <Text style={[type.bodySm, styles.errorText]}>{t.result.collectionError}</Text>
                <Button variant="secondary" fullWidth onPress={() => addToCollection(focused.breed)}>
                  {t.result.tryAgain}
                </Button>
              </View>
            )}
            {(collectionStatus === "new" || collectionStatus === "already-owned") && (
              <Button variant="primary" fullWidth onPress={close} style={styles.spacing}>
                {t.result.scanAnother}
              </Button>
            )}
          </View>
        )}

        {status === "done" && predictions && viewMode === "candidates" && (
          <View style={styles.candidatesBlock}>
            <Text style={type.displayMd}>{t.result.whichOne}</Text>
            <Text style={[type.bodyMd, styles.candidatesSubtitle]}>{t.result.narrowedIt}</Text>

            <View style={styles.candidateList}>
              {predictions.map((prediction, index) => (
                <Pressable
                  key={prediction.breed}
                  onPress={() => pickCandidate(index)}
                  style={[styles.candidateRow, index === 0 && styles.candidateRowTop]}
                >
                  <View style={styles.candidateThumb}>
                    <Feather name="image" size={28} color={color.mutedSoft} />
                  </View>
                  <View style={styles.candidateInfo}>
                    <Text style={type.headingSm}>{displayBreedName(prediction.breed)}</Text>
                  </View>
                  <Text style={[type.dataSm, styles.muted]}>{Math.round(prediction.score * 100)}%</Text>
                  <Feather name="chevron-right" size={20} color={color.mutedSoft} />
                </Pressable>
              ))}
            </View>

            <View style={styles.escapeRow}>
              <Button variant="ghost" color={color.muted} onPress={close}>
                {t.result.noneOfThese}
              </Button>
              <Button
                variant="ghost"
                color={color.muted}
                onPress={() => router.push({ pathname: "/crop", params: { uri } })}
              >
                {t.result.reframePhoto}
              </Button>
            </View>
          </View>
        )}
      </ScrollView>

      {collectionStatus === "new" && <CelebrationOverlay breedName={displayBreedName(focused?.breed ?? "")} fact={funFact} title={t.result.celebrationTitle} />}
    </SafeAreaView>
  );
}

function CelebrationOverlay({ breedName, fact, title }: { breedName: string; fact: string | null; title: string }) {
  const { t } = useLanguage();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const [dismissed, setDismissed] = useState(false);

  const dismiss = () => {
    setDismissed((already) => {
      if (already) return already;
      Animated.timing(opacity, { toValue: 0, duration: motion.duration.fast, useNativeDriver: true }).start();
      return true;
    });
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: motion.duration.fast, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, [opacity, scale]);

  // No auto-dismiss timer — this is read-and-tap, not a toast. A fact worth
  // showing is worth letting the user finish reading at their own pace.
  // `dismissed` flips pointerEvents off immediately (not just opacity to 0)
  // — otherwise this full-screen Pressable stays mounted and keeps
  // swallowing every tap underneath it, including "Scan another dog".
  return (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, styles.scrim, { opacity }]}
      pointerEvents={dismissed ? "none" : "auto"}
    >
      <Pressable style={styles.scrimPressable} onPress={dismiss}>
        <Animated.View style={[styles.celebrationCard, { transform: [{ scale }] }]}>
          <Text style={styles.celebrationTitle}>{title}</Text>
          <Text style={styles.breedName}>{breedName}</Text>
          {fact && <Text style={[type.bodyMd, styles.celebrationFact]}>{fact}</Text>}
          <Text style={[type.caption, styles.celebrationTapHint]}>{t.result.tapToContinue}</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.canvas,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.canvas,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.sm,
    paddingTop: space.xxs,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerThumb: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
  },
  body: {
    flexGrow: 1,
    paddingHorizontal: space.md,
    paddingBottom: space.xl,
  },
  centerBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: space.xxl,
  },
  spacing: {
    marginTop: space.md,
  },
  muted: {
    color: color.muted,
  },
  errorText: {
    color: color.error,
    marginTop: space.sm,
    textAlign: "center",
  },
  analyzingPreview: {
    width: 190,
    height: 190,
    borderRadius: radius.xl,
    opacity: 0.9,
  },
  confidentBlock: {
    alignItems: "center",
    gap: space.md,
    paddingTop: space.xs,
  },
  ringWrap: {
    marginTop: space.xxs,
  },
  surePill: {
    position: "absolute",
    bottom: -6,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  surePillBadge: {
    backgroundColor: color.surface,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 14,
    ...Platform.select({
      ios: {
        shadowColor: shadow.card.shadowColor,
        shadowOpacity: shadow.card.shadowOpacity,
        shadowOffset: shadow.card.shadowOffset,
        shadowRadius: shadow.card.shadowRadius,
      },
      android: { elevation: shadow.card.elevation },
    }),
  },
  nameBlock: {
    alignItems: "center",
    marginTop: space.xs,
  },
  newBreedLabel: {
    ...type.labelUppercase,
    color: color.accentDeep,
  },
  breedName: {
    ...type.displayLg,
    color: color.ink,
    marginTop: space.xxs,
    textAlign: "center",
  },
  factCard: {
    flexDirection: "row",
    gap: space.sm,
    backgroundColor: color.secondarySoft,
    borderRadius: radius.xl,
    padding: space.md,
    width: "100%",
  },
  factIcon: {
    marginTop: 2,
  },
  factTextWrap: {
    flex: 1,
  },
  factLabel: {
    ...type.labelUppercase,
    color: color.secondary,
  },
  factBody: {
    color: color.ink,
    marginTop: space.xxs,
  },
  footer: {
    width: "100%",
    gap: space.xxs,
    alignItems: "center",
  },
  candidatesBlock: {
    paddingTop: space.sm,
    gap: space.sm,
  },
  candidatesSubtitle: {
    color: color.body,
  },
  candidateList: {
    gap: space.sm,
    marginTop: space.xxs,
  },
  candidateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    backgroundColor: color.surface,
    borderRadius: radius.xl,
    borderWidth: border.hairline,
    borderColor: color.hairline,
    padding: space.sm,
    ...Platform.select({
      ios: {
        shadowColor: shadow.card.shadowColor,
        shadowOpacity: shadow.card.shadowOpacity,
        shadowOffset: shadow.card.shadowOffset,
        shadowRadius: shadow.card.shadowRadius,
      },
      android: { elevation: shadow.card.elevation },
    }),
  },
  candidateRowTop: {
    borderColor: color.primary,
    borderWidth: border.emphasis,
  },
  candidateThumb: {
    width: 78,
    height: 78,
    borderRadius: radius.md,
    backgroundColor: color.surfaceSunken,
    alignItems: "center",
    justifyContent: "center",
  },
  candidateInfo: {
    flex: 1,
  },
  escapeRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: space.sm,
  },
  scrim: {
    backgroundColor: color.scrim,
  },
  scrimPressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  celebrationCard: {
    backgroundColor: color.surface,
    borderRadius: radius.xl,
    padding: space.xl,
    maxWidth: 320,
    alignItems: "center",
    gap: space.sm,
    ...Platform.select({
      ios: {
        shadowColor: shadow.elevated.shadowColor,
        shadowOpacity: shadow.elevated.shadowOpacity,
        shadowOffset: shadow.elevated.shadowOffset,
        shadowRadius: shadow.elevated.shadowRadius,
      },
      android: { elevation: shadow.elevated.elevation },
    }),
  },
  celebrationTitle: {
    ...type.labelUppercase,
    color: color.accentDeep,
  },
  celebrationFact: {
    color: color.body,
    backgroundColor: color.accentSoft,
    borderRadius: radius.md,
    padding: space.sm,
    textAlign: "center",
  },
  celebrationTapHint: {
    color: color.muted,
    marginTop: -space.xxs,
  },
});
