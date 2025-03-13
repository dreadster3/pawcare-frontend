import { SessionProvider } from "@/providers/auth-provider";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <SessionProvider
      config={{
        url: "https://keycloak.dreadster.dev/realms/pawcare",
        clientId: "frontend",
      }}
    >
      <Slot />
    </SessionProvider>
  );
}
