import { useUser } from "@/hooks/useUser";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, authChecked } = useUser();
  const segments = useSegments();

  useEffect(() => {
    if (!authChecked) return;

    const isInAuthPage = segments[0] === "(auth)";

    if (!user && !isInAuthPage) {
      router.replace("/(auth)/login");
    } else if (user && isInAuthPage) {
      router.replace("/(tabs)/streaks");
    }
  }, [user, authChecked, segments]);

  return <>{children}</>;
}
