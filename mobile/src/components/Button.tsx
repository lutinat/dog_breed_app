import { useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";

import { border, color, hitSlop, motion, radius, shadow, space, type } from "../theme/tokens";

type Variant = "primary" | "accent" | "secondary" | "ghost";

type Props = {
  children: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  /** Overrides the variant's default text/icon colour — ghost links move between rooms (Field vs Album) that need different tones. */
  color?: string;
  style?: StyleProp<ViewStyle>;
};

// Uniform press feedback for every tappable element in the app: scale to
// motion.pressScale over motion.duration.instant, release on a spring.
export function Button({ children, onPress, variant = "primary", disabled, fullWidth, icon, color: colorOverride, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.timing(scale, {
      toValue: motion.pressScale,
      duration: motion.duration.instant,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  const variantStyle = variantStyles[variant];
  const textColor = colorOverride ?? variantStyle.textColor;

  return (
    <Animated.View style={[fullWidth && styles.fullWidth, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled}
        hitSlop={variant === "ghost" ? undefined : hitSlop}
        style={[styles.base, variantStyle.container, disabled && styles.disabled, style]}
      >
        {icon && <Feather name={icon} size={17} color={textColor} />}
        <Text style={[type.button, { color: textColor }]}>{children}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.45,
  },
});

const glow = Platform.select({
  ios: {
    shadowColor: shadow.fieldGlow.color,
    shadowOpacity: 1,
    shadowRadius: shadow.fieldGlow.radius,
    shadowOffset: { width: 0, height: 0 },
  },
  android: { elevation: 6 },
});

const variantStyles: Record<Variant, { container: StyleProp<ViewStyle>; textColor: string }> = {
  primary: {
    container: { height: 52, borderRadius: radius.md, paddingHorizontal: space.lg, backgroundColor: color.primary },
    textColor: color.onPrimary,
  },
  accent: {
    container: {
      height: 52,
      borderRadius: radius.md,
      paddingHorizontal: space.lg,
      backgroundColor: color.accent,
      ...glow,
    },
    textColor: color.onAccent,
  },
  secondary: {
    container: {
      height: 52,
      borderRadius: radius.md,
      paddingHorizontal: space.lg,
      backgroundColor: "transparent",
      borderWidth: border.emphasis,
      borderColor: color.primary,
    },
    textColor: color.primary,
  },
  ghost: {
    container: { minHeight: hitSlop, paddingHorizontal: space.sm, paddingVertical: space.xs, backgroundColor: "transparent" },
    textColor: color.body,
  },
};
