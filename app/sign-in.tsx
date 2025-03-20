import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSession } from "@/providers/auth-provider";
import { Redirect, useNavigation } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { BackHandler, Platform, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const { signInAsync, isAuthenticated } = useSession();
  const navigation = useNavigation();

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

  useEffect(() => {
    const listener = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      navigation.dispatch(e.data.action);
    });

    const backHandlerListener = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        console.log("TEST");
        return true;
      },
    );

    return () => {
      navigation.removeListener("beforeRemove", listener);
      backHandlerListener.remove();
    };
  }, []);

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
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
        onPress={() => {
          signInAsync();
        }}
      >
        <Text>Sign in</Text>
      </Button>
    </View>
  );
}
