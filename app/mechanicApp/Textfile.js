import React, { useState, useRef } from "react";
import { View, TextInput, FlatList, Text, Pressable } from "react-native";

const suggestions = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

export default function DropdownWithKeyboard() {
  const [inputValue, setInputValue] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const flatListRef = useRef(null);

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < filteredList.length - 1 ? prev + 1 : prev
      );
    } else if (nativeEvent.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (nativeEvent.key === "Enter") {
      if (selectedIndex >= 0) {
        setInputValue(filteredList[selectedIndex]);
        setFilteredList([]);
        setSelectedIndex(-1);
      }
    }
  };

  const handleChangeText = (text) => {
    setInputValue(text);
    const filtered = suggestions.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredList(filtered);
    setSelectedIndex(-1);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 10,
          borderRadius: 5,
        }}
        value={inputValue}
        onChangeText={handleChangeText}
        onKeyPress={handleKeyPress}
        placeholder="Type a fruit..."
      />

      {filteredList.length > 0 && (
        <FlatList
          ref={flatListRef}
          data={filteredList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => {
                setInputValue(item);
                setFilteredList([]);
              }}
            >
              <Text
                style={{
                  padding: 10,
                  backgroundColor: selectedIndex === index ? "#d3d3d3" : "#fff",
                }}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
