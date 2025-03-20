import { useStorageState } from "@/hooks/useStorageState";
import {
  AuthSessionResult,
  exchangeCodeAsync,
  makeRedirectUri,
  Prompt,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";

interface IAuthContext {
  signInAsync: () => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext>({
  signInAsync: () => Promise.resolve(),
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

export interface IAuthenticationConfiguration {
  url: string;
  clientId: string;
}

export interface ISessionProviderProps extends PropsWithChildren {
  config: IAuthenticationConfiguration;
}

export const SessionProvider = ({
  children,
  config,
}: ISessionProviderProps) => {
  const [[isLoading, session], setSession] = useStorageState("session");

  const discovery = useAutoDiscovery(config.url);

  const redirectUri = makeRedirectUri({
    isTripleSlashed: true,
    path: "/",
  });

  // Create and load an auth request
  const [request, result, promptAsync] = useAuthRequest(
    {
      clientId: "frontend",
      redirectUri,
      scopes: ["openid", "profile", "email", "offline_access"],
      usePKCE: true,
      prompt: Prompt.Login,
    },
    discovery,
  );

  const fetchTokenAsync = async (result: AuthSessionResult | null) => {
    if (result?.type === "success") {
      const tokenResponse = await exchangeCodeAsync(
        {
          clientId: config.clientId,
          code: result.params.code,
          redirectUri,
          extraParams: {
            code_verifier: request?.codeVerifier ?? "",
          },
        },
        discovery!,
      );

      setSession(tokenResponse.accessToken);
    }
  };

  useEffect(() => {
    fetchTokenAsync(result);
  }, [result]);

  return (
    <AuthContext.Provider
      value={{
        signInAsync: async () => {
          await promptAsync();
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
