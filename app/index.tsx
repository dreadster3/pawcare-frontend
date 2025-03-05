import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";
import { Button, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const discovery = useAutoDiscovery("");

  // Create and load an auth request
  const [request, result, promptAsync] = useAuthRequest(
    {
      clientId: "frontend",
      redirectUri: makeRedirectUri({
        path: "/",
        isTripleSlashed: true,
      }),
      scopes: ["openid", "profile", "email"],
    },
    discovery,
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="Login" disabled={!request} onPress={() => promptAsync()} />
      {result && <Text>{JSON.stringify(result, null, 2)}</Text>}
    </View>
  );
}
