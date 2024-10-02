import { View, Text, ActivityIndicator } from "react-native";
import React, { memo, useEffect, useMemo, useState } from "react";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useDriverStore, userLocationStore } from "@/store";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { Driver, MarkerData } from "@/types/types";
import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";

interface MapProp {
  useFetch?: {
    data: Driver[] | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
  };
}

const Map = ({ useFetch }: MapProp) => {
  const { data: drivers, error, loading } = useFetch!;
  const {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  } = userLocationStore();
  const { selectedDriver } = useDriverStore();
  const { setUserLocation } = userLocationStore();

  const [markers, setMarkers] = useState<MarkerData[]>([]);
  console.log(userLatitude, userLongitude);

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });
  useEffect(() => {
    // console.log("hello");
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return;

      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLatitude]);

  // useEffect(() => {
  //   // console.log("really");
  //   if (markers.length > 0 && destinationLatitude && destinationLongitude) {
  //     calculateDriverTimes({
  //       markers,
  //       destinationLatitude,
  //       destinationLongitude,
  //       userLatitude,
  //       userLongitude,
  //     }).then((drivers) => {
  //       setDrivers(drivers as MarkerData[]);
  //     });
  //   }
  // }, [markers, destinationLatitude, destinationLongitude]);
  if (loading || !userLatitude || !userLongitude)
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size={"small"} color={"#000"} />
      </View>
    );
  if (error)
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );
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
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === marker.id ? icons.selectedMarker : icons.marker
          }
        />
      ))}
    </MapView>
  );
};

export default Map;
