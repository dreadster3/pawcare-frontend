import { useStorageState } from "@/hooks/useStorageState";
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";

interface IAuthContext {
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
});

export function useSession() {
  const value = useContext(AuthContext);

  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("SessionProvider is not wrapped");
    }
  }

  return value;
}

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [[isLoading, session], setSession] = useStorageState("session");

  const discovery = useAutoDiscovery("");

  const redirectUri = makeRedirectUri({});

  // Create and load an auth request
  const [request, result, promptAsync] = useAuthRequest(
    {
      clientId: "frontend",
      redirectUri,
      scopes: ["openid", "profile", "email"],
    },
    discovery,
  );

  useEffect(() => {
    if (result?.type === "success") {
      const { code } = result.params;

      const fetchToken = async () => {
        const tokenResponse = await exchangeCodeAsync(
          {
            clientId: request?.clientId!,
            code,
            redirectUri,
            extraParams: {
              code_verifier: request?.codeVerifier ?? "",
            },
          },
          discovery!,
        );

        setSession(tokenResponse.accessToken);
      };

      fetchToken();
    }
  }, [result]);

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          promptAsync();
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
        isAuthenticated: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
