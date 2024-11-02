import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
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
import MapViewDirections from "react-native-maps-directions";

const Map = () => {
  const { data: drivers, error, loading } = useFetch<Driver[]>("/(api)/driver");

  const {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  } = userLocationStore();

  const { selectedDriver, setDrivers } = useDriverStore();

  const { setUserLocation } = userLocationStore();

  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  useEffect(() => {
    console.log(drivers);
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return;
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      console.log(newMarkers, 1);
      setMarkers(newMarkers);
      console.log(markers);
    }
  }, [userLatitude, userLatitude, drivers]);

  useEffect(() => {
    console.log(1, markers);
    if (markers.length > 0 && destinationLatitude && destinationLongitude) {
      console.log("run1");
      calculateDriverTimes({
        markers,
        destinationLatitude,
        destinationLongitude,
        userLatitude,
        userLongitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

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
      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key={"description"}
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="destination"
            image={icons.pin}
          />
          <MapViewDirections
            origin={{ latitude: userLatitude, longitude: userLongitude }}
            destination={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY}
            strokeColor="#0286FF"
            strokeWidth={3}
          />
        </>
      )}
    </MapView>
  );
};

export default Map;
