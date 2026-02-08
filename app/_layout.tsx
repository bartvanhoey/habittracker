import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../lib/auth-context";
import { BumpVersionProvider } from "@/lib/bump-version-provider";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoadingUser } = useAuth();

  const segments = useSegments();

  useEffect(() => {
    setTimeout(() => {
      const isInAuthPage = segments[0] === "auth";
      if (!user && !isInAuthPage && !isLoadingUser) {
        router.replace("/auth");
      } else if (user && isInAuthPage && !isLoadingUser) {
        router.replace("/");
      }
    }, 1500);
  }, [user, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PaperProvider>
          <SafeAreaProvider>
            <BumpVersionProvider>
              <RouteGuard>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                </Stack>
              </RouteGuard>
            </BumpVersionProvider>
          </SafeAreaProvider>
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
