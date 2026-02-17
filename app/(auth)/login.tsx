import { Button, ButtonText } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text as RNText, View } from "react-native";
import { Button as RNPButton, Text, TextInput, useTheme } from "react-native-paper";
// import { useAuth } from "../../lib/auth-context";

export default function LoginScreen() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const { login } = useUser();
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      await login(username, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login went wrong")
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <RNText className="text-6xl font-bold text-yellow-500">Hello</RNText>
        <Text style={styles.title} variant="headlineMedium">
          Welcome Back!
        </Text>
        <Text style={styles.subtitle} variant="bodyLarge">
          Sign in to HabitTracker
        </Text>

        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.textInput}
          label="Username"
          autoCapitalize="none"
          placeholder="Enter your username"
          mode="outlined"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.textInput}
          label="Password"
          autoCapitalize="none"
          // secureTextEntry
          placeholder="Enter your password"
          mode="outlined"
        />

        {error && (
          <Text style={{ color: theme.colors.error, marginBottom: 16 }}>
            {error}
          </Text>
        )}

        {/* <Button onPress={handleLogin} style={styles.button} mode="contained">
          Login
        </Button>

        <Button
          onPress={() => router.push("/(auth)/register")}
          style={styles.switchButton}
          mode="text"
        >
          Don't have an account? Sign Up
        </Button> */}

  <Button variant="solid" size="md" action="primary">
      <ButtonText>Click me</ButtonText>
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
