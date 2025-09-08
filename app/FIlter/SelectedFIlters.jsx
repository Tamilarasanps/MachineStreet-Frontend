import { ScrollView, View, Text, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated from "react-native-reanimated";

const SelectedFilter = ({ filterItems, setFilterItems }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ alignItems: "center" }} // align all to center
    >
      {/* Rating Tag */}
      {filterItems?.selectedRating && (
        <View className="h-12 flex-row items-center bg-yellow-100 border border-yellow-400 px-3 py-1 rounded-lg mr-2 shadow-sm">
          <Text className="text-yellow-800 font-medium text-sm mr-1">
            {filterItems?.selectedRating}
          </Text>
          <Icon name="star-rate" size={16} color="#F59E0B" />
          <MaterialIcons
            name="cancel"
            size={18}
            color="#CA8A04"
            style={{ marginLeft: 6 }}
            onPress={() =>
              setFilterItems((prev) => ({ ...prev, selectedRating: "" }))
            }
          />
        </View>
      )}

      {/* Industry Tag */}
      {filterItems?.selectedIndustry && (
        <View className="flex-row items-center bg-indigo-100 border border-indigo-400 px-3 py-2 rounded-full mr-2 shadow-sm flex-wrap h-auto min-h-[48px]">
          {/* Industry */}
          <View className="flex-row items-center mr-2">
            <Text className="text-indigo-800 font-semibold text-sm">
              {filterItems?.selectedIndustry.charAt(0).toUpperCase() +
                filterItems?.selectedIndustry.slice(1)}
            </Text>
            {filterItems?.selectedCategory && (
              <Text className="text-indigo-800 font-semibold text-sm"> ➝ </Text>
            )}
          </View>

          {/* Category */}
          {filterItems?.selectedCategory && (
            <View className="flex-row items-center mr-2">
              <Text className="text-indigo-800 font-semibold text-sm">
                {filterItems?.selectedCategory}
              </Text>
              {filterItems?.selectedSubCategory?.length > 0 && (
                <Text className="text-indigo-800 font-semibold text-sm">
                  ➝
                </Text>
              )}
            </View>
          )}

          {/* Subcategories with individual X */}
          {filterItems?.selectedSubCategory?.length > 0 &&
            filterItems?.selectedSubCategory.map((sub, index) => (
              <View
                key={index}
                className="flex-row items-center bg-white border border-indigo-400 px-3 py-1 rounded-full mr-2 mb-1 shadow-sm"
              >
                <Text className="text-indigo-800 text-sm font-medium">
                  {sub}
                </Text>
                <MaterialIcons
                  name="cancel"
                  size={16}
                  color="#4F46E5"
                  style={{ marginLeft: 4 }}
                  onPress={() =>
                    setFilterItems((prev) => ({
                      ...prev,
                      selectedSubCategory: prev.selectedSubCategory.filter(
                        (val) => val !== sub
                      ),
                    }))
                  }
                />
              </View>
            ))}

          {/* Common X button */}
          <Pressable
            className="ml-1"
            onPress={() => {
              setFilterItems((prev) => ({
                ...prev,
                selectedIndustry: "",
                selectedCategory: "",
                selectedSubCategory: [],
              }));
            }}
          >
            <MaterialIcons name="cancel" size={20} color="#4F46E5" />
          </Pressable>
        </View>
      )}

      {/* District + State */}
      {filterItems?.selectedState && (
        <View className="h-12 flex-row items-center bg-green-100 border border-green-400 rounded-xl px-3 shadow-sm">
          <View className="flex-row items-center mr-2">
            <MaterialIcons name="place" size={18} color="#15803D" />
            <Text className="text-green-800 font-semibold text-sm ml-1">
              {filterItems?.selectedState}
            </Text>
            <MaterialIcons
              name="cancel"
              size={18}
              color="#16A34A"
              style={{ marginLeft: 6 }}
              onPress={() => {
                setFilterItems((prev) => ({
                  ...prev,
                  selectedState: "",
                  selectedDistrict: [],
                }));
              }}
            />
            {filterItems?.selectedDistrict?.length > 0 && (
              <Text className="text-green-700 font-medium ml-1">➝</Text>
            )}
          </View>

          {filterItems?.selectedDistrict?.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filterItems?.selectedDistrict.map((district, index) => (
                <View
                  key={index}
                  className="flex-row items-center bg-white border border-green-400 px-3 py-1 rounded-full mr-2"
                >
                  <Text className="text-green-800 font-medium text-sm">
                    {district}
                  </Text>
                  <MaterialIcons
                    name="cancel"
                    size={18}
                    color="#16A34A"
                    style={{ marginLeft: 6 }}
                    onPress={() => {
                      setFilterItems((prev) => ({
                        ...prev,
                        selectedDistrict: prev.selectedDistrict.filter(
                          (val) => val !== district
                        ),
                      }));
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default SelectedFilter;
