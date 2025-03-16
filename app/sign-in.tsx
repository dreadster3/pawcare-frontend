import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSession } from "@/providers/auth-provider";
import { Redirect, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Platform, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const { signIn, isAuthenticated } = useSession();

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  useEffect(() => {
    if (Platform.OS !== "web") {
      WebBrowser.warmUpAsync();
    }
    return () => {
      if (Platform.OS !== "web") {
        WebBrowser.coolDownAsync();
      }
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        onPress={() => {
          signIn();
          router.replace("/");
        }}
      >
        <Text>Sign in</Text>
      </Button>
    </View>
  );
}
