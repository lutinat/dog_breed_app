import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";

import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/language";

export default function RegisterScreen() {
  const { register } = useAuth();
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
    setErrorMessage(null);
    if (password.length < 8) {
      // react-native-web's Alert.alert() is a no-op, so validation errors
      // must be shown inline to work on both web and native.
      setErrorMessage(t.register.passwordTooShort);
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await register(email.trim(), password);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Please try again.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Link href="/settings" style={styles.settingsLink}>
        <Text style={styles.settingsLinkText}>{t.settings.title}</Text>
      </Link>

      <Text style={styles.title}>{t.register.title}</Text>

      <TextInput
        style={styles.input}
        placeholder={t.register.email}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={t.register.passwordHint}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Pressable style={styles.button} onPress={handleSubmit} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>{t.register.submit}</Text>
        )}
      </Pressable>

      <Link href="/login" style={styles.link}>
        <Text style={styles.linkText}>{t.register.haveAccount}</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    width: "100%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2C5F4F",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 140,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    color: "#2C5F4F",
    fontWeight: "600",
  },
  error: {
    color: "#C23B34",
    textAlign: "center",
    maxWidth: 320,
  },
  settingsLink: {
    position: "absolute",
    top: 56,
    right: 20,
    padding: 4,
  },
  settingsLinkText: {
    color: "#2C5F4F",
    fontWeight: "600",
  },
});
