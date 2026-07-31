import { Platform, StyleSheet, Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { border, color, radius, shadow, space, type } from "../theme/tokens";

type Props = {
  locked: boolean;
  breedName: string;
  lockedLabel: string;
};

// No breed reference photography exists yet (design/SCREENS.md flags this as
// unsupplied) — both variants show a dog-silhouette placeholder instead of a
// photo. No rarity chip either: rarity isn't part of this app's data model.
export function CollectionCard({ locked, breedName, lockedLabel }: Props) {
  if (locked) {
    return (
      <View style={styles.cardLocked}>
        <Feather name="lock" size={16} color={color.body} style={styles.lockIcon} />
        <View style={styles.artLocked}>
          <MaterialCommunityIcons name="dog" size={44} color={color.muted} />
        </View>
        <Text style={[type.bodyMdMedium, styles.nameLocked]}>{lockedLabel}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.art}>
        <MaterialCommunityIcons name="dog" size={44} color={color.mutedSoft} />
      </View>
      <Text style={[type.bodyMdMedium, styles.name]} numberOfLines={2}>
        {breedName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%",
    borderRadius: radius.xl,
    backgroundColor: color.surface,
    padding: space.sm,
    gap: space.xxs,
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
  cardLocked: {
    width: "100%",
    height: "100%",
    borderRadius: radius.xl,
    backgroundColor: color.surfaceSunken,
    borderWidth: border.hairline,
    borderColor: color.hairline,
    borderStyle: "dashed",
    padding: space.sm,
    justifyContent: "flex-end",
    gap: space.xxs,
  },
  lockIcon: {
    position: "absolute",
    top: space.xs,
    left: space.xs,
    opacity: 0.55,
  },
  art: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: color.surfaceSunken,
    alignItems: "center",
    justifyContent: "center",
  },
  artLocked: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.35,
  },
  name: {
    color: color.ink,
    textAlign: "center",
  },
  nameLocked: {
    color: color.muted,
    textAlign: "center",
  },
});
