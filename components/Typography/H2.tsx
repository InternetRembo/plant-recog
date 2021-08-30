import * as React from "react";
import { Text } from "react-native";

export const H2TextFormatter = (text: string) => {
  const firstLetter = text.split("")[0].toUpperCase();
  const formatted = firstLetter + text.slice(1, text.length);
  return formatted;
};

export type H2Params = {
  text: string;
  style?: any;
};

const H2 = ({ text, style }: H2Params) => {
  return (
    <Text
      style={[
        {
          fontSize: 18,
          fontWeight: "bold",
          color: "#373D3F",
        },
        style,
      ]}
    >
      {H2TextFormatter(text)}
    </Text>
  );
};

export default H2;
