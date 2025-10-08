import { View, Text, TextInput, Pressable } from "react-native";
import { useAppContext } from "@/context/AppContext";
import SuggestionList from "./SuggestionList";
import { useState, useMemo } from "react";


const InputWOL = ({
  ref,
  label,
  value,
  onChangeText,
  error,
  helperText,
  sugesstionData = [],
  placeholder,
  secureTextEntry,
  onDelete,
}) => {
  const { setFocusedLabel, focusedLabel } = useAppContext();
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // 🔎 Filter suggestions based on user input
  const filteredSuggestions = useMemo(() => {
    if (!value) return sugesstionData;
    return sugesstionData.filter((item) => {
      const text = item.label || item.name || item;
      return text?.toLowerCase().includes(value.toLowerCase());
    });
  }, [value, sugesstionData]);

  const handleKeyPress = ({ nativeEvent }) => {
    if (!filteredSuggestions || filteredSuggestions.length === 0) return;

    if (nativeEvent.key === "ArrowDown") {
      setHighlightIndex((prev) => (prev + 1) % filteredSuggestions.length);
    } else if (nativeEvent.key === "ArrowUp") {
      setHighlightIndex((prev) =>
        prev <= 0 ? filteredSuggestions.length - 1 : prev - 1
      );
    } else if (nativeEvent.key === "Enter" && highlightIndex >= 0) {
      const item = filteredSuggestions[highlightIndex];
      onChangeText(item.label || item.name || item);
      setFocusedLabel(""); // close suggestion
      setHighlightIndex(-1);
    }
  };

  return (
    <View
      style={{
        marginTop: 20,
        marginBottom: 16,
        zIndex: focusedLabel === label ? 4000 : 0,
        position: "relative",
      }}
    >
      {label && (
        <Text
          style={{
            marginBottom: 10,
            fontSize: 16,
            fontWeight: "500",
            color: focusedLabel === label ? "#0D9488" : "#374151",
          }}
        >
          {label}
        </Text>
      )}

      <View style={{ position: "relative", justifyContent: "center" }}>
        <TextInput
          ref={ref}
          className="outline-none"
          value={value}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocusedLabel(label)}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onChangeText={onChangeText}
          onKeyPress={handleKeyPress}
          style={{
            height: 44,
            borderWidth: 2,
            borderRadius: 6,
            paddingHorizontal: 12,
            paddingRight: onDelete ? 32 : 12,
            fontSize: 14,
            color: "#000", // ✅ add this
            backgroundColor: "#fff",
            borderColor: error
              ? "#DC2626"
              : focusedLabel === label
                ? "#0D9488"
                : "#9CA3AF",
          }}
        />
        {onDelete && (
          <Pressable
            onPress={onDelete}
            style={{
              position: "absolute",
              right: 10,
              top: 12,
              backgroundColor: "#f3f4f6",
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
            }}
          >
            <Text style={{ fontSize: 12, color: "#dc2626" }}>×</Text>
          </Pressable>
        )}
      </View>

      {helperText && (
        <Text
          style={{
            fontSize: 12,
            marginTop: 2,
            color: error ? "#DC2626" : "#6B7280",
          }}
        >
          {helperText}
        </Text>
      )}

      {focusedLabel === label && filteredSuggestions.length > 0 && (
        <SuggestionList
          data={filteredSuggestions}
          onSelect={onChangeText}
          label={label}
          setFocusedLabel={setFocusedLabel}
          highlightIndex={highlightIndex}
        />
      )}
    </View>
  );
};

export default InputWOL;
