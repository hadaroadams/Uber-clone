import { View, Text, Image, ActivityIndicator, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/types";
import { useClerk } from "@clerk/clerk-expo";
import RideCard from "@/components/RideCard";
import { images } from "@/constants";

const History = () => {
  const { user } = useClerk();
  const { data: recentRide, loading } = useFetch<Ride[]>(
    `/(api)/ride/${user?.id}`
  );
  return (
    <SafeAreaView>
      <FlatList
        data={recentRide}
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
            <Text className="text-2xl font-JakartaBold my-5">All Ride</Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default History;
