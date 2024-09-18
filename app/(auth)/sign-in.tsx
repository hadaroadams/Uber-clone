import { View, Text, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignIn } from "@clerk/clerk-expo";

const Signin = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [form, setForm] = useState({ email: "", password: "" });
  const [pendingVerification, setPendingVerification] = useState(false);

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, form.email, form.password]);
  return (
    <ScrollView className=" flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View>
          <Image
            source={images.signUpCar}
            className="w-full  h-[250px] border border-black"
          />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label={"Email"}
            labelStyle={""}
            placeholder="Enter your name"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => {
              setForm({ ...form, email: value });
            }}
          />
          <InputField
            label={"Password"}
            labelStyle={""}
            placeholder="Enter your name"
            icon={icons.lock}
            value={form.password}
            onChangeText={(value) => {
              setForm({ ...form, password: value });
            }}
            secureTextEntry
          />
          <CustomButton
            title="Sign in"
            onPress={onSignInPress}
            className="mt-6"
          />
          <OAuth />
          <Link
            href={"/sign-up"}
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Don't have an account?</Text>
            <Text className="text-primary-500">Sign up</Text>
          </Link>
        </View>
        {/* Verfication modal */}
      </View>
    </ScrollView>
  );
};

export default Signin;
