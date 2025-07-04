import React, { useState } from "react";
import { View, Platform, Pressable, TextInput, Text } from "react-native";
import { FlatList } from "react-native";
import { allCountries } from "country-telephone-data";

const Mobile = ({
  phoneNumber,
  setPhoneNumber,
  formSubmit,
  username,
  selectedCode,
  setSelectedCode,
}) => {
  // const [selectedCode, setSelectedCode] = useState("+91");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cleanCountryName = (name) => name.replace(/\s*\(.*?\)/g, "").trim();

  const filteredCountries = allCountries
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .map((c) => ({
      name: cleanCountryName(c.name),
      dialCode: c.dialCode,
      iso2: c.iso2,
    }));
  return (
    <View
      className={`border-2 border-TealGreen ${
        Platform.OS === "web" ? "w-full" : "w-[90%]"
      } rounded-md mx-auto mt-4 z-50`}
    >
      <View className="flex-row items-center bg-white rounded-md px-3 py-2 space-x-2">
        <Pressable
          className="p-2"
          onPress={() => {
            setDropdownVisible(!dropdownVisible);
          }}
        >
          <Text className="font-bold text-gray-500 whitespace-nowrap">
            {selectedCode} ▼
          </Text>
        </Pressable>

        <TextInput
          className="flex-1 min-w-0 text-gray-700 text-md px-2 py-1 outline-none"
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          returnKeyType="done"
          // onSubmitEditing={() => formSubmit()}
        />
      </View>

      {/* Dropdown Country List */}
      {dropdownVisible && (
        <View className="border border-teal-500 bg-white mt-2 rounded-md max-h-[250px] top-[50] right-0 left-0 absolute overflow-hidden shadow-lg z-50">
          <TextInput
            className="border-b border-teal-500 p-3"
            placeholder="Search country..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.iso2}
            renderItem={({ item }) => (
              <Pressable
                className="p-3"
                onPress={() => {
                  setSelectedCode(`+${item.dialCode}`);
                  setDropdownVisible(false);
                }}
              >
                <Text className="text-[16px] text-gray-600">
                  {item.name} ({item.dialCode})
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Mobile;
