import { View, Text } from "react-native";
import React from "react";

const SearchComponent = ({
  data,
  label,
  value,
  onChange,
  getCategory,
  getMakes,
  handleChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [delayedFocus, setDelayedFocus] = useState(false);

  const filteredData =
    data?.length > 0
      ? data.filter((item) => item.toLowerCase().includes(value.toLowerCase()))
      : data;

  useEffect(() => {
    if (isFocused) {
      const timer = setTimeout(() => setDelayedFocus(true), 1000); // 1-second delay
      return () => clearTimeout(timer); // Clear timeout on unmount
    } else {
      setDelayedFocus(false);
    }
  }, [isFocused]);

  return (
    <View>
      <Text className="text-lg font-semibold text-teal-600 mt-6">{label}</Text>
      <TextInput
        className="border outline-teal-600 rounded-lg h-12 w-full mt-4 p-3 text-gray-500 focus:border-teal-600"
        placeholder={`Search ${label}...`}
        value={value}
        onFocus={() => {
          setIsFocused(true);
          if (label === "Category") getCategory();
          if (label === "Make") getMakes();
        }}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Hide FlatList with delay
        onChangeText={onChange}
        style={{ borderWidth: 1, padding: 10, margin: 10, borderRadius: 5 }}
      />
      {delayedFocus && (
        <View className="w-full bg-white border border-gray-300 rounded-md shadow-md mt-2 z-10">
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  handleChange(label.toLowerCase(), item);
                  setTimeout(() => setIsFocused(false), 200);
                }}
              >
                <Text style={{ padding: 5 }}>{item}</Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
};
export { SearchComponent };
