// components/InputWithLabel.js
import React from "react";
import { View } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { useAppContext } from "@/context/AppContext";
import SuggestionList from "./SuggestionList";

const InputWithLabel = ({
  label,
  value,
  onChangeText,
  error,
  helperText,
  sugesstionData,
}) => {
  const { setFocusedLabel, focusedLabel } =
    useAppContext();

  return (
    <View
      className="mb-4 w-full"
      style={{
        zIndex: focusedLabel === label ? 4000 : 3000,
      }}
    >
      <TextInput
        label={label}
        value={value}
        onFocus={() => {
          setFocusedLabel(label);
          // setIsFocused(true);
        }}
        style={{
          backgroundColor: "transparent",
          fontSize: 16,
          height: 44,
        }}
        onChangeText={onChangeText}
        error={!!error}
        mode="outlined"
        theme={{
          colors: {
            primary: "#0d9488", // Active/focused border color
            outline: "#9CA3AF", // Default outline border color
            error: "#DC2626", // Error border color
          },
        }}
      />
      {helperText && (
        <HelperText type={error ? "error" : "info"} visible={true}>
          {helperText}
        </HelperText>
      )}
      {(focusedLabel === label && sugesstionData) && (
        <SuggestionList
          data={sugesstionData}
          onSelect={onChangeText}
          label={label}
          setFocusedLabel={setFocusedLabel}
        />
      )}
    </View>
  );
};

export default InputWithLabel;
