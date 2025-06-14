import React from "react";
import { View, useWindowDimensions } from "react-native";
import { TextInput } from "react-native-paper";

const Email = ({ setMailOrphone, mailOrphone, Enterkey }) => {
  const { width } = useWindowDimensions();
  const isScreenSmall = width < 768;

  return (
    <View style={{ width: "100%", marginTop: 16 }}>
      <TextInput
        label={"Email / Mobile"}
        value={mailOrphone}
        onChangeText={setMailOrphone}
        onKeyPress={Enterkey}
        mode="outlined"
        placeholderTextColor="#aaa"
        outlineColor="#2095A2"
        activeOutlineColor="#2095A2"
        returnKeyType="next"
        style={[
          {
            backgroundColor: "white",
            alignSelf: "center",
            borderRadius: 8,
            paddingHorizontal: 4,

            borderColor: "#2095A2",
          },
          isScreenSmall ? { width: "100%" } : { width: "75%" },
        ]}
      />
    </View>
  );
};

export default Email;
