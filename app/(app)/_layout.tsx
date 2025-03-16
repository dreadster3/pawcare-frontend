import { useSession } from "@/providers/auth-provider";
import { Redirect, Slot } from "expo-router";
import { Text } from "react-native";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  return <Slot />;
}
