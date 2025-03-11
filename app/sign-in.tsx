import { useSession } from "@/providers/auth-provider";
import { Redirect, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Button, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const { signIn, isAuthenticated } = useSession();

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        title="Login"
        onPress={() => {
          signIn();
          router.replace("/");
        }}
      />
    </View>
  );
}
