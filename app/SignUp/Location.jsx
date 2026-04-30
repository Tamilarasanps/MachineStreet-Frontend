import React, { useState } from "react";
import Checkbox from "expo-checkbox";
import { View, Text } from "react-native";
import InputWOL from "@/components/InputWOL";
import FadeSlideView from "@/components/FadeSlideView";

const Location = ({ states, userDetails, setUserDetails }) => {
  const [otherThanIndia, setOtherThanIndia] = useState(false);

  // Convert array of objects to key array for state list
  const stateList = states.map((s) => Object.keys(s)[0]);

  // Get citys based on selectedState
  const selectedStateObj = states.find(
    (s) => Object.keys(s)[0] === userDetails.region
  );
  const cityList = selectedStateObj ? Object.values(selectedStateObj)[0] : [];

  return (
    <View>
      {/* State Input with suggestions */}
      <InputWOL
        placeholder="Select State"
        label="State"
        value={userDetails?.region || ""}
        onChangeText={(value) => {
          setUserDetails((prev) => ({
            ...prev,
            region: value,
            city: "", // reset city if state changes
          }));
        }}
        sugesstionData={stateList.map((state) => ({
          label: state,
          value: state,
        }))}
      />
      {/* city Input with suggestions */}
      <InputWOL
        placeholder="Select city"
        label="city"
        value={userDetails?.city || ""}
        onChangeText={(value) => {
          setUserDetails((prev) => ({
            ...prev,
            city: value,
          }));
        }}
        sugesstionData={cityList.map((city, index) => ({
          label: city,
          value: city,
        }))}
      />
    </View>
  );
};

export default Location;
