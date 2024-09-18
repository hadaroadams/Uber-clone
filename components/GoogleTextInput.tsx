import { View, Text } from "react-native";
import React from "react";
import { GoogleInputProps } from "@/types/types";

const GoogleTextInput = ({
  icon,
  containerStyle,
  textInputBackgroundColor,
}: GoogleInputProps) => {
  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle} mb-5`}
    >
      <Text>GoogleTextInput</Text>
    </View>
  );
};

export default GoogleTextInput;
