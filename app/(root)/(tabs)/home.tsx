import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useClerk } from "@clerk/clerk-expo";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { useDriverStore, userLocationStore } from "@/store";
import * as Location from "expo-location";
import { router } from "expo-router";
import { Driver, MarkerData, Ride } from "@/types/types";
import { useFetch } from "@/lib/fetch";

const Home = () => {
  const { setUserLocation, setDestinationLocation } = userLocationStore();
  const { user, signOut } = useClerk();
  console.log(user?.id);

  const { data: recentRide, loading } = useFetch<Ride[]>(
    `/(api)/ride/${user?.id}`
  );
  const [hasPermission, setHasPermission] = useState(false);

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };
  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        // latitude: 37.78825,
        // longitude: -122.4324,
        address: `${address[0].name},${address[0].region}`,
      });
    };
    requestLocation();
  }, []);
console.log(user)
  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRide?.slice(0, 5)}
        // data={[]}
        renderItem={({ item }) => <RideCard ride={item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40 "
                  alt="No recent ride found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size={"large"} color={"#000"} />
              // <Text>Loading</Text>
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className=" flex flex-row items-center justify-between my-5">
              <Text
                className="text-lg capitalize font-JakartaExtraBold flex-[1]"
                numberOfLines={1}
              >
                Welcome{", "}
                {user?.firstName ||
                  user?.emailAddresses[0].emailAddress.split("@")[0]}{" "}
                👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className=" justify-center items-center w-10 h-10 rounded-full bg-white"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>
            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
              textInputBackgroundColor="white"
            />
            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Your Current Location
            </Text>
            <View className="flex flex-row items-center bg-transparent h-[300px]">
              <Map />
            </View>
            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Recent Rides
            </Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
