import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useUser } from "@/hooks/useUser";

export default function RegisterScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const { register } = useUser();
  const router = useRouter();

  const handleRegister = async () => {
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      await register(email, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          Create Account
        </Text>
        <Text style={styles.subtitle} variant="bodyLarge">
          Sign up to start tracking your habits
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.textInput}
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Enter your email"
          mode="outlined"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.textInput}
          label="Password"
          autoCapitalize="none"
          secureTextEntry
          placeholder="Enter your password"
          mode="outlined"
        />

        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.textInput}
          label="Confirm Password"
          autoCapitalize="none"
          secureTextEntry
          placeholder="Confirm your password"
          mode="outlined"
        />

        {error && (
          <Text style={{ color: theme.colors.error, marginBottom: 16 }}>
            {error}
          </Text>
        )}

        <Button onPress={handleRegister} style={styles.button} mode="contained">
          Create Account
        </Button>

        <Button
          onPress={() => router.push("/(auth)/login")}
          style={styles.switchButton}
          mode="text"
        >
          Already have an account? Sign In
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
  },
  textInput: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  switchButton: {
    marginTop: 16,
  },
});
