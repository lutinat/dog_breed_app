import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, usePathname, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { border, color, hitSlop, radius, shadow, space, type } from "../theme/tokens";

type Tab = {
  key: string;
  href: Href;
  label: string;
  icon: keyof typeof Feather.glyphMap;
};

// Map post-MVP: prototype ships a 4th "Map" tab (S26) with no MVP screen behind it.
// Scan sits centered — it's the raised, marigold-glow tab — with Collection
// and Profile flanking it left and right.
const TABS: Tab[] = [
  { key: "collection", href: "/collection", label: "Collection", icon: "grid" },
  { key: "scan", href: "/", label: "Scan", icon: "camera" },
  { key: "profile", href: "/profile", label: "Profile", icon: "user" },
];

export function BottomNav() {
  const pathname = usePathname();
  // On Android, the gesture/nav bar sits in this same screen region — pad
  // the tab bar out by the safe-area inset so it doesn't get overlapped.
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.barOuter, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          const isScan = tab.key === "scan";
          const inactiveColor = color.muted;
          const activeColor = color.primary;

          return (
            <Pressable
              key={tab.key}
              onPress={() => !isActive && router.push(tab.href)}
              hitSlop={hitSlop}
              style={styles.tab}
            >
              <View style={isScan ? styles.iconWrapScan : styles.iconWrap}>
                <Feather
                  name={tab.icon}
                  size={isScan ? 22 : 20}
                  color={isScan ? color.onAccent : isActive ? activeColor : inactiveColor}
                />
              </View>
              <Text style={[type.caption, { color: isActive ? activeColor : inactiveColor }]}>{tab.label}</Text>
              {isActive && !isScan && <View style={[styles.dot, { backgroundColor: activeColor }]} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barOuter: {
    backgroundColor: color.surface,
    borderTopWidth: border.hairline,
    borderTopColor: color.hairline,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    height: space.section,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: space.xxs,
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapScan: {
    width: hitSlop,
    height: hitSlop,
    borderRadius: radius.full,
    backgroundColor: color.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -space.sm,
    ...Platform.select({
      ios: {
        shadowColor: shadow.fieldGlow.color,
        shadowOpacity: 1,
        shadowRadius: shadow.fieldGlow.radius,
        shadowOffset: { width: 0, height: 0 },
      },
      android: { elevation: 6 },
    }),
  },
  dot: {
    width: space.xxs,
    height: space.xxs,
    borderRadius: radius.full,
  },
});
