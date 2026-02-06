import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useAuth } from "../lib/auth-context";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>("");
  const theme = useTheme();
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };

  const handleAuth = async () => {
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (isSignUp) {
      var error = await signUp(email, password);
      if (error) {
        setError(error);
        return;
      }
    } else {
      var error = await signIn(email, password);
      if (error) {
        setError(error);
        return;
      }
      router.replace("/");
    }
  };

  console.log({ error });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp
            ? "Create HabitTracker Account "
            : "Welcome Back to HabitTracker"}
        </Text>
        <TextInput
          onChangeText={setEmail}
          style={styles.textInput}
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example@gmail.com"
          mode="outlined"
        />
        <TextInput
          onChangeText={setPassword}
          style={styles.textInput}
          label="Password"
          autoCapitalize="none"
          keyboardType="email-address"
          secureTextEntry
          mode="outlined"
        />

        {(error || error !== undefined) && (
          <Text style={{ color: theme.colors.error }}>{error}</Text>
        )}

        <Button onPress={handleAuth} style={styles.button} mode="contained">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
        <Button
          style={styles.switchModeButton}
          onPress={handleSwitchMode}
          mode="text">
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  textInput: {
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  switchModeButton: {
    marginTop: 16,
  },
});
