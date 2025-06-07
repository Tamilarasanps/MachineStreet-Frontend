import React from "react";
import { Pressable, View, Text } from "react-native";

const SubCategoryList = ({ cat, setPopUp, popUp, setSelectedSub }) => {
  return (
    <View>
      {cat[1].length > 0 && (
        <Text className="mt-4 font-bold text-lg text-gray-600">
          {" "}
          Sub Categories
        </Text>
      )}
      {cat[1].length > 0 &&
        cat[1]
          .slice()
          .reverse()
          .map((sub, index) => (
            <>
              <Pressable
                key={index}
                className="mt-4 bg-blue-500 p-4 rounded-md"
                onPress={() => {
                  // console.log(index);
                  setSelectedSub(index);
                  setPopUp(!popUp);
                }}
              >
                <Text className="text-white text-lg mx-auto font-bold">
                  {Object.keys(sub)[0]}
                </Text>
              </Pressable>
            </>
          ))}
    </View>
  );
};

export default SubCategoryList;