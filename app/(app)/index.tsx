import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSession } from "@/providers/auth-provider";
import { View } from "react-native";

export default function Index() {
  const { signOut } = useSession();

  return (
    <View>
      <Button
        onPress={() => {
          signOut();
        }}
      >
        <Text>Sign out</Text>
      </Button>
    </View>
  );
}
