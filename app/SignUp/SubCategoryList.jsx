import React from "react";
import { View, Text, Pressable } from "react-native";
import InputWOL from "@/components/InputWOL";
import FadeSlideView from "@/components/FadeSlideView";

const SubCategoryList = ({
  userDetails,
  setUserDetails,
  industrySuggestion,
  handleChange,
}) => {
  // add category

  const handleAddCategory = () => {
    setUserDetails((prev) => ({
      ...prev,
      subcategory: [...prev.subcategory, { name: "", services: [""] }],
    }));
  };

  // add subcategory

  const handleAddSubcategory = (index) => {
    const updated = [...userDetails.subcategory];
    updated[index].services.push("");
    setUserDetails({ ...userDetails, subcategory: updated });
  };

  // delete category

  const handleDeleteCategory = (catIndex) => {
    const updated = [...userDetails.subcategory];
    updated.splice(catIndex, 1);
    setUserDetails({ ...userDetails, subcategory: updated });
  };

  // delete subcategory

  const handleDeleteSubcategory = (catIndex, subIndex) => {
    const updated = [...userDetails.subcategory];
    updated[catIndex].services.splice(subIndex, 1);
    setUserDetails({ ...userDetails, subcategory: updated });
  };
  return (
    <>
      {/* industry input tag */}

      <InputWOL
        placeholder="Automobile"
        label="Industry"
        value={userDetails.industry || ""}
        onChangeText={(value) => handleChange("industry", value)}
        sugesstionData={industrySuggestion.industry}
      />

      {/* add category button */}

      {userDetails.industry.length > 0 && (
        <FadeSlideView
        delay={100}
        initialVisible={userDetails.industry && userDetails.industry.length > 0}
      >
          <View className="p-4 border-2 border-gray-300 rounded-md ">
            <Pressable
              onPress={handleAddCategory}
              style={{
                backgroundColor: "#4B0082",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                alignSelf: "flex-end",
                marginBottom: 20,
                marginTop: 6,
              }}
            >
              <Text style={{ color: "white", fontWeight: "500", fontSize: 12 }}>
                Add category
              </Text>
            </Pressable>

            {[...userDetails.subcategory]?.reverse().map((cat, i) => {
              const index = userDetails.subcategory.length - 1 - i;
              const catSug = industrySuggestion?.category?.find(
                (c) =>
                  c?.value?.toLowerCase() ===
                  userDetails?.industry?.toLowerCase()
              );
              const subSug = industrySuggestion?.subcategory?.find(
                (c) => c?.value?.toLowerCase() === cat?.name?.toLowerCase()
              );

              return (
                <View key={index} style={{ marginBottom: 20 }}>
                  {/* category input tag */}

                  <InputWOL
                    placeholder="Vehicle Repair & Maintenance"
                    value={cat.name}
                    onChangeText={(value) =>
                      handleChange("category", value, index)
                    }
                    sugesstionData={catSug && catSug?.items}
                    onDelete={() => handleDeleteCategory(index)}
                    label={`Category ${index + 1}`}
                  />

                  {/* add subcategory button */}

                  <Pressable
                    onPress={() => handleAddSubcategory(index)}
                    style={{
                      backgroundColor: "#9400D3",
                      borderRadius: 6,
                      paddingHorizontal: 10,
                      marginBottom: 20,
                      paddingVertical: 6,
                      alignSelf: "flex-end",
                      marginTop: 6,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 12 }}>
                      Add subcategory
                    </Text>
                  </Pressable>

                  {[...cat.services].reverse().map((service, i) => {
                    const subIndex = cat.services.length - 1 - i;
                    return (
                      <View key={subIndex}>
                        {/* sub category input tag */}

                        <InputWOL
                          placeholder="Car Engine Repair"
                          value={service}
                          onChangeText={(value) =>
                            handleChange("subcategory", value, index, subIndex)
                          }
                          label={`Sub Category ${subIndex + 1}`}
                          sugesstionData={subSug && subSug?.items}
                          onDelete={() =>
                            handleDeleteSubcategory(index, subIndex)
                          }
                        />
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </FadeSlideView>
      )}
    </>
  );
};

export default SubCategoryList;
