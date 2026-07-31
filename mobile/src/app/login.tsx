import { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/language";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { color, space, type } from "../theme/tokens";

export default function LoginScreen() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const handleSubmit = async () => {
    // Ref check, not just `submitting` state: on web, a single Pressable tap
    // can invoke onPress twice before React commits the state update.
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await login(email.trim(), password);
    } catch (error) {
      // react-native-web's Alert.alert() is a no-op, so errors must be
      // shown inline to work on both web and native.
      setErrorMessage(error instanceof Error ? error.message : "Please try again.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>{t.login.title}</Text>

        <TextField
          label={t.login.email}
          placeholder={t.login.emailPlaceholder}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          label={t.login.password}
          placeholder={t.login.passwordPlaceholder}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errorMessage}
        />

        <Button variant="primary" fullWidth disabled={submitting} onPress={handleSubmit} style={styles.spacing}>
          {submitting ? t.login.submitting : t.login.submit}
        </Button>

        <View style={styles.linkRow}>
          <Link href="/register">
            <Text style={styles.linkText}>{t.login.needAccount}</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.canvas,
    justifyContent: "center",
    paddingHorizontal: space.md,
  },
  form: {
    gap: space.md,
  },
  title: {
    ...type.displayLg,
    color: color.ink,
  },
  spacing: {
    marginTop: space.xs,
  },
  linkRow: {
    alignItems: "center",
  },
  linkText: {
    ...type.button,
    color: color.primary,
  },
});
