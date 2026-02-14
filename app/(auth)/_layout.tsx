import NotLoggedInUserOnly from "@/components/auth/NotLoggedInUserOnly";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthLayout() {
  return (
    <NotLoggedInUserOnly>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_bottom" }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>
    </NotLoggedInUserOnly>
    
  );
}
