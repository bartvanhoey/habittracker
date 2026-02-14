import { useUser } from "@/hooks/useUser";
import { useRouter } from "expo-router";
// import { useUser } from "../../hooks/useUser";
import { useEffect } from "react";
import ThemedActivityIndicator from "../themed/ThemedActivityIndicator";


const LoggedInUserOnly: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, authChecked } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (authChecked && user === null) {
      console.log("User not authenticated, redirecting to login");
      router.replace("/(auth)/login");
    } else {
      console.log("User authenticated, rendering children");
    }
  }, [user, authChecked]);

  if (!authChecked || !user) {
        return <ThemedActivityIndicator />;
  }

  return children;
};

export default LoggedInUserOnly;
