import { Alert, Image, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import { PaymentSheetError, useStripe } from "@stripe/stripe-react-native";
import { fetchAPI } from "@/lib/fetch";
import { useAuth, useClerk, useUser } from "@clerk/clerk-expo";
import { PaymentProps } from "@/types/types";
import { userLocationStore } from "@/store";
import ReactNativeModal from "react-native-modal";
import { images } from "@/constants";
import { router } from "expo-router";

const Payment = ({
  fullName,
  amount,
  driverId,
  email,
  rideTime,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [success, setSuccess] = useState(false);
  const {
    destinationAddress,
    destinationLatitude,
    destinationLongitude,
    userAddress,
    userLatitude,
    userLongitude,
  } = userLocationStore();
  const { userId } = useAuth();

  const initializePaymentSheet = async () => {
    // console.log("first");
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Ryde Inc.",
      intentConfiguration: {
        mode: {
          amount: parseInt(amount) * 100,
          currencyCode: "USD",
        },
        confirmHandler: async (paymentMethod, _, intentCreationCallback) => {
          // Make a request to your own server.
          // console.log("second");

          const { paymentIntent, customer } = await fetchAPI(
            "/(api)/(stripe)/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: fullName || email.split("@")[0],
                email,
                amount,
                paymentMethodId: paymentMethod.id,
              }),
            }
          );
          // console.log("Third");
          // console.log(paymentIntent,customer);

          if (paymentIntent.client_secret) {
            const { result } = await fetchAPI("/(api)/(stripe)/pay", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                payment_method_id: paymentMethod.id,
                payment_intent_id: paymentIntent.id,
                customer_id: customer,
                client_secret: paymentIntent.client_secret,
              }),
            });
            // console.log(result);
            // console.log("four");
            if (result.client_secret) {
              // console.log("five");
              await fetchAPI("/(api)/ride/create", {
                method: "POST",
                headers: {
                  "content-Type": "application/json",
                },
                body: JSON.stringify({
                  origin_address: userAddress,
                  destination_address: destinationAddress,
                  origin_longitude: userLongitude,
                  origin_latitude: userLatitude,
                  destination_latitude: destinationLatitude,
                  destination_longitude: destinationLongitude,
                  ride_time: rideTime.toFixed(0),
                  fare_price: parseInt(amount) * 100,
                  payment_status: "paid",
                  driver_id: driverId,
                  user_id: userId,
                }),
              });
              // console.log("five");

              intentCreationCallback({
                clientSecret: result.client_secret,
              });
              // console.log("six");
              setSuccess(true);
            }
          }
          // Call the `intentCreationCallback` with your server response's client secret or error
          // const { client_secret, error } = await response.json()();
          // if (client_secret) {
          //   intentCreationCallback({ clientSecret: client_secret });
          // } else {
          //   intentCreationCallback({ error });
          // }
        },
      },
      returnURL: "myapp://book-ride",
    });
    // console.log("seven");
    if (error) {
      console.log(error);
      // handle error
    }
  };

  const openPaymentStatus = async () => {};
  // useEffect(() => {
  //   initializePaymentSheet();
  // }, []);

  const didTapCheckoutButton = async () => {
    // implement later
    // console.log("tapp");
    try {
      await initializePaymentSheet();
      // console.log("tapped");
      const { error } = await presentPaymentSheet();

      if (error) {
        if (error.code === PaymentSheetError.Canceled) {
          Alert.alert(`Error code: ${error.code}`, error.message);
          // Customer canceled - you should probably do nothing.
        } else {
          setSuccess(true);
          // PaymentSheet encountered an unrecoverable error. You can display the error to the user, log it, etc.
        }
      } else {
        // Payment completed - show a confirmation screen.
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <CustomButton
        title="Confirm Ride"
        className="my-10"
        onPress={didTapCheckoutButton}
      />
      <ReactNativeModal
        isVisible={success}
        onBackdropPress={() => setSuccess(false)}
      >
        <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
          <Image source={images.check} className="w-28 h-28 mt-5" />
          <Text className="text-2xl text-center font-JakartaBold mt-5 ">
            Ride Booked
          </Text>
          <Text className="text-md text-general-200 font-JakartaMedium text-center mt-3">
            Thank you for your booking. Your reservation has been placed. Please
            proceed with the trip
          </Text>
          <CustomButton
            title="Back Home"
            onPress={() => {
              setSuccess(false);
              router.push("/(root)/(tabs)/home");
            }}
            className="mt-5"
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default Payment;
