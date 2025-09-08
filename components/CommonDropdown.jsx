import React from "react";
import { View, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const CommonDropdown = ({
  zIndex,
  open,
  setOpen,
  value,
  setValue,
  items,
  placeholder = "Select an option",
  label,
}) => {
  return (
    <View
      style={{
        marginTop: 32,
        width: "100%",
        zIndex: zIndex || 0,
        position: "relative", // Required for zIndex to apply
        
      }}
    >
      <Text
        className="mb-2 font-medium text-gray-700 "
        style={{ fontSize: 16 }}
      >
        {label}
      </Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={() => {}}
        placeholder={placeholder}
        listMode="SCROLLVIEW"
        autoScroll={true}
        style={{
          borderColor: "#D1D5DB",
          height: 50,
          borderRadius: 8,
          paddingHorizontal: 8,
          zIndex: zIndex || 0,
        }}
        dropDownContainerStyle={{
          borderColor: "#D1D5DB",
          backgroundColor: "#fff",
          maxHeight: 200,
          zIndex: zIndex || 0,
        }}
        textStyle={{ color: "#000" }}
        placeholderStyle={{ color: "#9CA3AF" }}
      />
    </View>
  );
};

export default CommonDropdown;
