
import { useColorScheme } from "react-native";

import { ActivityIndicator } from "react-native";

import { Colors } from "@/constants/theme";
import { ThemedView } from "../themed-view";

const ThemedActivityIndicator = () => {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === "dark" ? "dark" : "light";
  const theme = Colors[scheme] ?? Colors.light;

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={theme.textColor} />
    </ThemedView>
  );
};

export default ThemedActivityIndicator;

