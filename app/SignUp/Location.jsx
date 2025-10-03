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
      {/* Other than India checkbox */}
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "100%",
          marginTop: 20,
        }}
      >
        <Checkbox
          value={otherThanIndia}
          onValueChange={() => {
            setUserDetails((prev) => ({
              ...prev,
              city: "",
              region: "",
              country: otherThanIndia ? "India" : "", // when true, set empty; else set "India"
            }));
            setOtherThanIndia(!otherThanIndia);
          }}
          style={{
            width: 20,
            height: 20,
            borderColor: "#9CA3AF",
            cursor: "pointer",
          }}
          color={otherThanIndia ? "#008080" : undefined}
        />
        <Text style={{ marginLeft: 8, color: "#374151" }}>
          Other than India
        </Text>
      </View> */}

      {!otherThanIndia ? (
        <View>
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
        </View>
      ) : (
        // Other than India inputs
        // <View className="mt-4">
        //   {[
        //     { key: "country", label: "Country" },
        //     { key: "region", label: "Region" },
        //   ].map((field) => (
        //     <InputWOL
        //       key={field.key}
        //       label={field.label}
        //       value={userDetails[field.key] || ""}
        //       onChangeText={(value) => {
        //         setUserDetails((prev) => ({
        //           ...prev,
        //           [field.key]: value,
        //         }));
        //       }}
        //     />
        //   ))}
        // </View>
        <></>
      )}
    </View>
  );
};

export default Location;
