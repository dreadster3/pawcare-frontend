import { SessionProvider } from "@/providers/auth-provider";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <SessionProvider
      config={{
        url: process.env.EXPO_PUBLIC_IDP_URL || "",
        clientId: process.env.EXPO_PUBLIC_IDP_CLIENT_ID || "",
      }}
    >
      <Slot />
    </SessionProvider>
  );
}
