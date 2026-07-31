import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLanguage } from "../../lib/language";
import { color, hitSlop, radius, shadow, space, type } from "../../theme/tokens";

export default function BreedDetailScreen() {
  const { t, language } = useLanguage();
  const params = useLocalSearchParams<{
    name?: string;
    name_fr?: string;
    discoveredAt?: string;
    fun_fact_en?: string;
    fun_fact_fr?: string;
  }>();

  const name = (language === "fr" && params.name_fr) || params.name;
  const funFact = (language === "fr" && params.fun_fact_fr) || params.fun_fact_en;
  const discoveredDate = params.discoveredAt ? new Date(params.discoveredAt) : null;

  if (!name) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={type.bodyMd}>{t.breed.notFound}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={hitSlop} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color={color.body} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.art}>
          <MaterialCommunityIcons name="dog" size={96} color={color.primary} />
        </View>

        <Text style={styles.name}>{name}</Text>

        {discoveredDate && (
          <Text style={[type.bodySm, styles.discoveredAt]}>
            {t.breed.discoveredOn}{" "}
            {discoveredDate.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        )}

        {funFact && (
          <View style={styles.factCard}>
            <Feather name="star" size={20} color={color.secondary} style={styles.factIcon} />
            <View style={styles.factTextWrap}>
              <Text style={styles.factLabel}>{t.breed.didYouKnow}</Text>
              <Text style={[type.bodyMd, styles.factBody]}>{funFact}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: space.sm,
    paddingTop: space.xxs,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flexGrow: 1,
    paddingHorizontal: space.md,
    paddingBottom: space.xl,
    gap: space.md,
  },
  art: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: radius.xl,
    backgroundColor: color.surfaceSunken,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    ...type.displayLg,
    color: color.ink,
  },
  discoveredAt: {
    color: color.muted,
    marginTop: -space.sm,
  },
  factCard: {
    flexDirection: "row",
    gap: space.sm,
    backgroundColor: color.secondarySoft,
    borderRadius: radius.xl,
    padding: space.md,
    width: "100%",
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
});
