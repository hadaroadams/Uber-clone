import * as SecureStore from "expo-secure-store";
import * as Linking from "expo-linking";
import { fetchAPI } from "./fetch";
import Signin from "@/app/(auth)/sign-in";
import { SignIn } from "@clerk/clerk-react";
export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}

export const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export const googleOAuth = async (startOAuthFlow: any) => {
  try {
    const { createdSessionId, signIn, signUp, setActive } =
      await startOAuthFlow({
        redirectUrl: Linking.createURL("/home", {
          scheme: "myapp",
        }),
      });

    if (createdSessionId) {
      if (setActive) {
        await setActive({ session: createdSessionId });
        console.log(1);
        console.log("signUp", signUp);
        console.log("signIn", signIn);
        if (signUp.createdUserId) {
          console.log(2);
          await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              name: `${signUp.firstName} ${signUp.lastName}`,
              email: signUp.emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
        }
        return {
          success: true,
          code: "success",
          message: "You have successfully authenticated",
        };
      }
    }
    return {
      success: false,
      code: "Succes",
      message: "An error occurred",
      // Use signIn or signUp for next steps such as MFA
    };
  } catch (erro: any) {
    console.log(erro);
    return {
      success: false,
      code: erro.code,
      message: erro?.errors[0]?.longMessage,
    };
  }
};
