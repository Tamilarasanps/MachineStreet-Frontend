import { FlatList, Image, Pressable, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FormatTime } from "@/context/FormatTime";
import { useContext } from "react";
import LottieView from "lottie-react-native";
import noreviews from "../../assets/animations/no_reviews.json";

const ReviewModal = ({ selectedMechanic, setReviewModal }) => {
  const { formatTime } = useContext(FormatTime);

  const reviews = selectedMechanic?.reviews || [];

  return (
    <View className="flex-1 mt-2">
      {reviews.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <LottieView
            source={noreviews}
            autoPlay
            loop
            style={{ height : "100%", width : "100%" }}
          />
          {/* <Text className="text-gray-500 mt-2">No reviews yet</Text> */}
        </View>
      ) : (
        <FlatList
          data={[...reviews].reverse()}
          keyExtractor={(item) => item._id}
          className="flex-1 mb-3"
          renderItem={({ item }) => (
            <View className="mb-6">
              {/* User Row */}
              <View className="flex-row items-center mb-1">
                {item.userId?.profileImage ? (
                  <Image
                    source={{
                      uri: `data:image/jpeg;base64,${item?.user?.profileImage}`,
                    }}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                ) : (
                  <MaterialIcons
                    name="account-circle"
                    size={32}
                    color="#9ca3af"
                    style={{ marginRight: 8 }}
                  />
                )}
                <View className="flex-row items-center space-x-4">
                  <Text className="font-semibold text-gray-900">
                    {item?.userId?.username}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-[2px]">
                    {formatTime(item.createdAt)}
                  </Text>
                </View>
              </View>

              {/* Stars */}
              <View className="flex-row mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Text
                    key={i}
                    className={
                      i < item.star
                        ? "text-yellow-400 text-base"
                        : "text-gray-300 text-base"
                    }
                  >
                    ★
                  </Text>
                ))}
              </View>

              {/* Review Text */}
              <Text className="text-gray-700">{item?.reviewText}</Text>
            </View>
          )}
        />
      )}

      {/* Add Review Button */}
      <Pressable
        onPress={() => setReviewModal("write")}
        className="w-full h-12 bg-gray-100 rounded-lg justify-center items-center mb-2"
      >
        <Text className="text-center font-semibold text-base">Add Review</Text>
      </Pressable>
    </View>
  );
};

export default ReviewModal;
