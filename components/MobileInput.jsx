import React, { useState } from "react";
import { View, Pressable, TextInput, Text, ScrollView } from "react-native";
import { allCountries } from "country-telephone-data";

const MobileInput = ({ setFocusedLabel, focusedLabel, userDetails, onChangeText }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const cleanCountryName = (name) => name.replace(/\s*\(.*?\)/g, "").trim();

  const filteredCountries = allCountries
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .map((c) => ({
      name: cleanCountryName(c.name),
      dialCode: c.dialCode,
      iso2: c.iso2,
    }));

  return (
    <View className="mt-4 ">
      <Text className=" font-medium text-gray-700" style={{ fontSize: 16 }}>
        Mobile
      </Text>
      <View
        className={`w-full rounded-md mx-auto mt-2 mb-2 relative ${isFocused ? "border-2 border-teal-600" : "border-2 border-gray-300"
          }`}
      >
        <View className="flex-row items-center bg-white rounded-md px-3 py-2 space-x-2">
          <Pressable
            className="p-2"
            onPress={() => {
              setFocusedLabel('mobile')
              setDropdownVisible(!dropdownVisible);
            }}
          >
            <Text className="font-bold text-gray-500 whitespace-nowrap">
              {userDetails.mobile.countryCode} ▼
            </Text>
          </Pressable>

          <TextInput
            className="flex-1 min-w-0 text-gray-700 text-md px-2 py-1 outline-none"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={userDetails.mobile.number}
            onChangeText={(text) => onChangeText('number', text)}
            returnKeyType="done"
            onFocus={() => {
              setFocusedLabel('mobile')
              setIsFocused(true)
            }}
            onBlur={() => setIsFocused(false)}
          />
        </View>

        {dropdownVisible && (
          <View
            style={{
              position: "absolute",
              top: 60, // adjust based on input height
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              borderColor: "#14b8a6", // teal-600
              borderWidth: 1,
              borderRadius: 8,
              zIndex: 9999,
              elevation: 10, // for Android
            }}
          >
            <TextInput
              className="border-b border-teal-500 p-3"
              placeholder="Search country..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <ScrollView className="max-h-[200px] w-full">
              {filteredCountries.map((item) => (
                <Pressable
                  key={item.iso2}
                  className="p-3"
                  onPress={() => {
                    onChangeText('countryCode', item.dialCode)
                    setDropdownVisible(false);
                  }}
                >
                  <Text className="text-[16px] text-gray-600">
                    {item.name} ({item.dialCode})
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

export default MobileInput;
