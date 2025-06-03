import {
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import { FlatList } from "react-native";
import { useEffect, useState, useRef } from "react";
import React from "react";

function IndustyLineup({
  data,
  label,
  value,
  onChange,
  getCategory,
  getMakes,
  getSubCategory,
  handleChange,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [delayedFocus, setDelayedFocus] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const flatListRef = useRef(null);
  const filteredData =
    data?.length > 0
      ? data.filter((item) => item.toLowerCase().includes(value.toLowerCase()))
      : data;

  useEffect(() => {
    if (isFocused) {
      const timer = setTimeout(() => setDelayedFocus(true), 300);
      return () => clearTimeout(timer);
    } else {
      setDelayedFocus(false);
    }
  }, [isFocused]);

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < filteredData.length - 1 ? prev + 1 : prev
      );
    } else if (nativeEvent.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (nativeEvent.key === "Enter") {
      if (selectedIndex >= 0 && filteredData[selectedIndex]) {
        const selectedItem = filteredData[selectedIndex];
        handleChange(label.toLowerCase(), selectedItem);
        setIsFocused(false);
        setSelectedIndex(-1);
      }
    }
  };

  useEffect(() => {
    if (flatListRef.current && selectedIndex >= 0) {
      flatListRef.current.scrollToIndex({
        index: selectedIndex,
        animated: true,
      });
    }
  }, [selectedIndex]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="relative">
        <Text className="text-lg font-semibold text-teal-600 mt-6">
          {label}
        </Text>

        <View className="flex items-center">
          <TextInput
            className="border outline-teal-600 rounded-lg h-12 w-full mt-4 p-3 text-gray-500 focus:border-teal-600"
            placeholder={`Search ${label}...`}
            value={value.charAt(0).toUpperCase() + value.slice(1)}
            onFocus={() => {
              setIsFocused(true);
              if (label === "Category") getCategory();
              if (label === "SubCategory") getSubCategory();
              if (label === "Make") getMakes();
            }}
            onChangeText={(text) => {
              onChange(text);
              setSelectedIndex(-1);
            }}
            onKeyPress={handleKeyPress}
            style={{ borderWidth: 1, padding: 10, margin: 10, borderRadius: 5 }}
          />
          {delayedFocus && (
            <View
              className="absolute mt-16 left-0 right-0 bg-gray-100 border border-teal-500 rounded-md shadow-md"
              style={{ maxHeight: 200 }}
            >
              <FlatList
                ref={flatListRef}
                data={filteredData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <Pressable
                    onPress={() => {
                      handleChange(label.toLowerCase(), item);
                      setTimeout(() => setIsFocused(false), 200);
                      setSelectedIndex(-1);
                    }}
                  >
                    <Text
                      className="p-3 text-gray-700"
                      style={{
                        backgroundColor:
                          selectedIndex === index ? "#gray" : "#fff",
                      }}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Text>
                  </Pressable>
                )}
                style={{ maxHeight: 200 }}
                nestedScrollEnabled
              />
            </View>
          )}
        </View>
      </View>
      {/* <EditProfile isFocused={isFocused} setIsFocused={setIsFocused} /> */}
    </KeyboardAvoidingView>
  );
}

export default IndustyLineup;
