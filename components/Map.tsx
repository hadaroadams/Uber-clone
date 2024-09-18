import { View, Text } from "react-native";
import React from "react";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import { userLocationStore } from "@/store";
import { calculateRegion } from "@/lib/map";

const Map = () => {
  const {
    // userAddress,
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  } = userLocationStore();
  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
        initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      <Text>Map</Text>
    </MapView>
  );
};

export default Map;
