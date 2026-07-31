import { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/language";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { color, space, type } from "../theme/tokens";

export default function RegisterScreen() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Kept separate: a too-short password is field-scoped, but a failed
  // registration (e.g. "Email already registered") isn't about the
  // password at all — attaching it to that field would misattribute it.
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const handleSubmit = async () => {
    // Ref check, not just `submitting` state: on web, a single Pressable tap
    // can invoke onPress twice before React commits the state update.
    if (submittingRef.current) return;
    setPasswordError(null);
    setFormError(null);
    if (password.length < 8) {
      // react-native-web's Alert.alert() is a no-op, so validation errors
      // must be shown inline to work on both web and native.
      setPasswordError(t.register.passwordTooShort);
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await register(email.trim(), password);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Please try again.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <View>
          <Text style={styles.title}>{t.register.title}</Text>
          <Text style={[type.bodyMd, styles.subtitle]}>{t.register.subtitle}</Text>
        </View>

        <TextField
          label={t.register.email}
          placeholder={t.register.emailPlaceholder}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          label={t.register.password}
          placeholder={t.register.passwordPlaceholder}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={passwordError}
        />

        {formError && <Text style={[type.bodySm, styles.formError]}>{formError}</Text>}

        <Button variant="primary" fullWidth disabled={submitting} onPress={handleSubmit} style={styles.spacing}>
          {submitting ? t.register.submitting : t.register.submit}
        </Button>

        <View style={styles.linkRow}>
          <Link href="/login">
            <Text style={styles.linkText}>{t.register.haveAccount}</Text>
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
  subtitle: {
    color: color.body,
    marginTop: space.xxs,
  },
  formError: {
    color: color.error,
    textAlign: "center",
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
