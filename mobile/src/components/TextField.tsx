import type { ComponentProps } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { border, color, radius, space, type } from "../theme/tokens";

type Props = ComponentProps<typeof TextInput> & {
  label: string;
  error?: string | null;
};

export function TextField({ label, error, style, ...inputProps }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={color.mutedSoft}
        style={[styles.input, error && styles.inputError, style]}
        {...inputProps}
      />
      {error && (
        <View style={styles.errorRow}>
          <Feather name="alert-circle" size={14} color={color.error} />
          <Text style={[type.bodySm, styles.errorText]}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space.xxs,
  },
  label: {
    ...type.labelUppercase,
    color: color.muted,
  },
  input: {
    ...type.bodyMd,
    height: 52,
    borderRadius: radius.md,
    borderWidth: border.hairline,
    borderColor: color.hairline,
    backgroundColor: color.surface,
    color: color.ink,
    paddingHorizontal: space.md,
  },
  inputError: {
    borderColor: color.error,
    borderWidth: border.emphasis,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xxs,
  },
  errorText: {
    color: color.error,
  },
});
