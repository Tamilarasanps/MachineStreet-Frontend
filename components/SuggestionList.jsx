import React, { useRef, useEffect } from "react";
import { Pressable, Text, View, ScrollView } from "react-native";

const ITEM_HEIGHT = 40; // 👈 adjust if your row is taller/shorter

const SuggestionList = ({
  data,
  onSelect,
  containerStyle,
  setFocusedLabel,
  highlightIndex,
}) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (highlightIndex >= 0 && scrollRef.current) {
      scrollRef.current.scrollTo({
        y: highlightIndex * ITEM_HEIGHT,
        animated: true,
      });
    }
  }, [highlightIndex]);

  return (
    <View
      className={`absolute top-full w-full bg-white shadow-md rounded-md pt-2 max-h-60 ${containerStyle} z-999`}
    >
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {data?.map((item, index) => {
          const isHighlighted = index === highlightIndex;
          return (
            <Pressable
              key={item?.id?.toString() || index.toString()}
              onPress={() => {
                onSelect(item.label || item.name || item);
                setFocusedLabel("");
              }}
              style={{
                height: ITEM_HEIGHT, // 👈 fixed height ensures correct scroll
                justifyContent: "center",
                paddingHorizontal: 16,
                backgroundColor: isHighlighted ? "#2095A2" : "white", // teal
                borderBottomWidth: 1,
                borderBottomColor: "#e5e7eb",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: isHighlighted ? "white" : "#374151",
                }}
              >
                {item.label || item.name || item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SuggestionList;
