import React from "react";
import { View, Text, Pressable, Platform } from "react-native";

const OperationSwitcher = ({
  setSelected,
  selected,
  setSelectedCategory,
  setIndustry,
  setCategory,
  setSubCategories,
}) => {
  return (
    <View
      className={`flex flex-row justify-around h-full w-[90%] mx-auto mt-4`}
    >
      <Pressable
        className="w-[50%] flex justify-center items-center py-4 relative"
        onPress={() => {
          setIndustry("");
          setCategory("");
          setSubCategories([{ name: "", services: [""] }]);
          setSelectedCategory("");
          setSelected("add");
        }}
      >
        <Text
          className={`md:text-xl text-md font-bold text-center px-2 ${
            selected === "add" ? "text-teal-600" : "text-gray-600"
          }`}
        >
          Add Category
        </Text>
        {selected === "add" && (
          <View
            className={`absolute bottom-0  h-[4px] bg-teal-600 ${
              Platform.OS !== "web" ? "w-full" : "w-[50%] "
            } rounded-full`}
          />
        )}
      </Pressable>
      <Pressable
        className="w-[50%] flex justify-center items-center py-4 relative"
        onPress={() => {
          setSelected("edit");
        }}
      >
        <Text
          className={`md:text-xl text-md font-bold text-center px-2 ${
            selected === "edit" ? "text-teal-600" : "text-gray-600"
          }`}
        >
          Edit Category
        </Text>
        {selected === "edit" && (
          <View
            className={`absolute bottom-0  h-[4px] bg-teal-600 ${
              Platform.OS !== "web" ? "w-full" : "w-[50%] "
            } rounded-full`}
          />
        )}
      </Pressable>
    </View>
  );
};

export default OperationSwitcher;
