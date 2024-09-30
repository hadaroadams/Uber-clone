import { Alert, Text } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import { PaymentSheetError, useStripe } from "@stripe/stripe-react-native";
import { fetchAPI } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";
import { PaymentProps } from "@/types/types";

const Payment = ({
  fullName,
  amount,
  driverId,
  email,
  rideTime,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [success, setSuccess] = useState(false);
  const [publishableKey, setPublishableKey] = useState("");

  const confirmHandler = async (paymentMethod, _, intentCreationCallback) => {
    // Make a request to your own server.
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

    if (paymentIntent.client_secret) {
      const { result } = await fetchAPI("/(api)/(stripe)/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          payment_Intent_id: paymentIntent.id,
          customer_id: customer,
        }),
      });
      if (result.client_secret) {
      // ride/create
      }
    }
    // Call the `intentCreationCallback` with your server response's client secret or error
    // const { client_secret, error } = await response.json()();
    // if (client_secret) {
    //   intentCreationCallback({ clientSecret: client_secret });
    // } else {
    //   intentCreationCallback({ error });
    // }
  };

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      intentConfiguration: {
        mode: {
          amount: 1099,
          currencyCode: "USD",
        },
        confirmHandler: confirmHandler,
      },
    });
    if (error) {
      // handle error
    }
  };

  const openPaymentStatus = async () => {};
  // useEffect(() => {
  //   initializePaymentSheet();
  // }, []);

  const didTapCheckoutButton = async () => {
    // implement later
    console.log("tapp");
    try {
      await initializePaymentSheet();
      console.log("tapped");
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
    </>
  );
};

export default Payment;
