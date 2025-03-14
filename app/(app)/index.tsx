import { useSession } from "@/providers/auth-provider";
import { Button, View } from "react-native";

export default function Index() {
  const { signOut } = useSession();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="Sign Out"
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      />
    </View>
  );
}
