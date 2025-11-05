import { AuthContext } from "@/context/AuthContext";
import { Slot, useRouter, useSegments } from "expo-router";
import { useContext, useEffect } from "react";

export const AppNavigation = () => {
  const { userToken } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!segments?.[0]) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!userToken && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (userToken && inAuthGroup) {
      router.replace("/(app)/home");
    }
  }, [userToken, segments, router]);

  return <Slot />;
};

export default AppNavigation;
