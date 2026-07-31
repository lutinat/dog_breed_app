import { StyleSheet, Switch, Text, View } from "react-native";
import { router } from "expo-router";

import { useLanguage } from "../lib/language";

export default function SettingsScreen() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.settings.title}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>{t.settings.english}</Text>
        <Switch
          value={language === "fr"}
          onValueChange={(isFrench) => setLanguage(isFrench ? "fr" : "en")}
          trackColor={{ false: "#CCCCCC", true: "#2C5F4F" }}
        />
        <Text style={styles.label}>{t.settings.french}</Text>
      </View>

      <Text style={styles.backLink} onPress={() => router.back()}>
        {t.settings.backToScan}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    color: "#2C5F4F",
    fontWeight: "600",
  },
  backLink: {
    color: "#2C5F4F",
    fontWeight: "600",
    paddingVertical: 16,
  },
});
