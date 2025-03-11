import { SessionProvider } from "@/providers/auth-provider";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
