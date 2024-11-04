import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import { useClerk } from "@clerk/clerk-expo";

const Profile = () => {
  const { user } = useClerk();
  return (
    <SafeAreaView className="m-5">
      <ScrollView>
        <View>
          <Text className="font-JakartaBold text-2xl">Your profile</Text>
        </View>
        <View className=" gap-8 mt-2">
          <View className="items-center">
            <View className="w-32 h-32 rounded-full bg-white  justify-center items-center p-3 ">
              <Image
                source={{
                  uri: user?.imageUrl || icons.profile,
                }}
                className=" w-28 h-28 font-JakartaMedium rounded-full"
                resizeMode="cover"
              />
              <Image
                source={icons.ImageEdit}
                className=" w-7 h-7 absolute -bottom-2 right-7"
              />
            </View>
          </View>
          <View>
            <InputField
              label="Username"
              labelStyle="font-JakartaMedium text-gray-400"
              iconStyle=""
              icon={icons.edit}
              value={
                user?.firstName ||
                user?.emailAddresses[0].emailAddress.split("@")[0]
              }
            />

            <InputField
              label="Last name"
              labelStyle="font-JakartaMedium text-gray-400"
              iconStyle=""
              icon={icons.edit}
              value={
                user?.lastName ||
                user?.emailAddresses[0].emailAddress.split("@")[0]
              }
            />

            <InputField
              label="Email"
              labelStyle="font-JakartaMedium text-gray-400"
              iconStyle=""
              icon={icons.edit}
              value={user?.emailAddresses[0].emailAddress}
            />

            <InputField
              label="Email status"
              labelStyle="font-JakartaMedium text-gray-400"
              iconStyle=""
              icon={images.check}
              value={"verified"}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
