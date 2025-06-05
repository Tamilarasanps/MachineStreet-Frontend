import React from "react";
import {
  View,
  Text,
  Platform,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { TextInput } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

const SubCategoryDisplayer = ({
  cat,
  setTempMake,
  tempMake,
  setCat,
  showToast,
  selectedSub,
  setSelectedSub,
  popUp,
  setPopUp,
}) => {
  const { width } = useWindowDimensions();

  return (
    <View
      className={`${
        Platform.OS === "web" && width >= 1024
          ? "overflow-y-auto max-h-full bg-white"
          : ` ${
              cat[1].length > 0 && popUp
                ? "flex-1 visible h-screen background-blur-md bg-gray-500/50 absolute right-0 left-0 top-0 bottom-0"
                : "hidden"
            }`
      } shadow-sm rounded-md px-4 py-8  flex-1`}
    >
      <Text
        className={`text-lg font-bold text-yellow-600 mb-4 ${
          Platform.OS === "web" && width >= 1024 ? "visible" : "hidden"
        } `}
      >
        Category: {cat[0]}
      </Text>
      {cat[1].length > 0 &&
        cat[1]
          .slice()
          .reverse()
          .map((sub, index) => (
            <View
              key={index}
              className={`relative w-[95%] mx-auto mt-2 bg-blue-300 bg-white shadow-md rounded-lg p-4 mb-4 ${
                (Platform.OS !== "web" &&
                  popUp &&
                  index === selectedSub ) ||
                (Platform.OS === "web" && width >= 1024)
                  ? "visible"
                  : "hidden"
              }`}
            >
              <Text className="text-lg font-semibold text-gray-700">
                {Object.keys(sub)}
              </Text>
              <View className="absolute h-12 w-max right-4 top-4 flex flex-row gap-6 justify-right">
                <Pressable
                  className="  bg-red-500 rounded-full w-5 h-5 flex items-center justify-start "
                  onPress={() => {
                    setPopUp(!popUp);
                    setSelectedSub(0)
                  }}
                >
                  <View className="h-[10%] w-[50%] bg-white m-auto"></View>
                </Pressable>

                <Pressable
                  className=" bg-red-500 rounded-full w-5 h-5 flex items-center justify-center "
                  onPress={() => {
                    setCat(() => {
                      const updated = [...cat];
                      updated[1] = updated[1].filter(
                        (_, ind) => ind !== updated[1].length - 1
                      );
                      return updated;
                    });
                    setPopUp(!popUp);
                  }}
                >
                  <MaterialIcons name="close" size={14} color="white" />
                </Pressable>
              </View>

              <TextInput
                label="Enter Maker Name"
                mode="outlined"
                value={tempMake[index] || ""}
                onChangeText={(text) =>
                  setTempMake(() => {
                    const updated = [...tempMake];
                    updated[index] = text;
                    return updated;
                  })
                }
                style={{
                  marginTop: 32,
                  marginBottom: 16,
                  backgroundColor: "white",
                }}
              />
              <Pressable
                onPress={() => {
                  if (!tempMake[index]) {
                    showToast("Maker name cannot be empty!");
                  } else {
                    setCat(() => {
                      const updated = [...cat];
                      updated[1][updated[1].length - (index + 1)][
                        Object.keys(sub)[0]
                      ].push(tempMake[index]);
                      return updated;
                    });
                    setTempMake("");
                  }
                }}
                className="bg-yellow-500 p-4 rounded-md"
              >
                <Text className="text-white text-center">Add Maker</Text>
              </Pressable>

              {/* Make Section */}
              <View className="mt-4">
                <ScrollView
                  className="max-h-[200px]"
                  showsVerticalScrollIndicator={true}
                >
                  <View className="flex flex-row flex-wrap gap-2 p-2 ">
                    {Object.values(sub)[0].length > 0 ? (
                      Object.values(sub)[0]
                        .slice()
                        .reverse()
                        .map((maker, ind) => (
                          <View
                            key={ind}
                            className="bg-blue-500 flex flex-row items-center h-12 px-4 py-2 gap-4 rounded-md"
                          >
                            <Text className="text-white">{maker}</Text>
                            <Pressable
                              onPress={() => {
                                setCat(() => {
                                  const updated = [...cat];
                                  updated[1][updated[1].length - (index + 1)][
                                    Object.keys(sub)
                                  ] = updated[1][
                                    updated[1].length - (index + 1)
                                  ][Object.keys(sub)].filter(
                                    (_, i) =>
                                      i !==
                                      updated[1][
                                        updated[1].length - (index + 1)
                                      ][Object.keys(sub)].length -
                                        (ind + 1)
                                  );
                                  return updated;
                                });
                              }}
                            >
                              <MaterialIcons
                                name="delete"
                                size={20}
                                color="red"
                              />
                            </Pressable>
                          </View>
                        ))
                    ) : (
                      <Text className="text-gray-500 ml-2">No makers</Text>
                    )}
                  </View>
                </ScrollView>

                <Pressable
                  className={`bg-blue-500 p-4 mt-4 rounded-md ${
                    Platform.OS !== "web" ? "visible" : "hidden"
                  }`}
                  onPress={() => {
                    setPopUp(false);
                  }}
                >
                  <Text className="text-white text-lg font-bold text-center">
                    Submit
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
    </View>
  );
};

export default SubCategoryDisplayer;