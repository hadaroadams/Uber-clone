import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacityBase,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "@/constants";
import { useClerk } from "@clerk/clerk-expo";
import { router } from "expo-router";

const Chat = () => {
  const { user, signOut } = useClerk();
  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };
  return (
    <SafeAreaView className="">
      <ScrollView className="mx-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-JakartaBold my-5">Chat List</Text>
          <TouchableOpacity
            onPress={handleSignOut}
            className=" justify-center items-center w-10 h-10 rounded-full bg-white"
          >
            <Image source={icons.out} className="w-4 h-4" />
          </TouchableOpacity>
        </View>
        <View className="items-center h-[600px] justify-center">
          <Image
            source={images.message}
            resizeMode="contain"
            className="w-80 h-40"
          />
          <View className="justify-center w-full space-y-3">
            <Text className="font-JakartaBold text-4xl text-center">
              No Message, yet
            </Text>
            <Text className="text-gray-400 text-center">
              No message in your inbox, yet.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chat;
