import { View, Pressable, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const PostFooterIcons = ({
  item,
  userId,
  isDesktop,
  handleLike,
  setModal,
  share,
  setSelectedMechanic,
  user,
}) => {
  return (
    <View className="flex-row">
      <Pressable
        onPress={() => {
          if (!user || !user._id) return;

          setSelectedMechanic((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              posts: prev.posts.map((post) => {
                if (post._id === item._id) {
                  const alreadyLiked = post.likes?.includes(userId);

                  return {
                    ...post,
                    likes: alreadyLiked
                      ? post.likes.filter((id) => id !== userId) // remove if exists
                      : [...(post.likes || []), user._id], // add if not exists
                  };
                }
                return post;
              }),
            };
          });
          handleLike({ postId: item._id }, "api/postLikes");
        }}
        style={{
          marginRight: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {item?.likes?.includes(userId) ? (
          // <FontAwesome name="heart" size={24} color="red" />
          <AntDesign name="heart" size={24} color="red" />
        ) : (
          <FontAwesome6 name="heart" size={24} color="black" />
        )}
        {/* */}
      </Pressable>

      {!isDesktop && (
        <Pressable
          onPress={() => setModal("comment")}
          style={{
            marginRight: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome6 name="comment" size={24} color="black" />
        </Pressable>
      )}

      <Pressable onPress={() => share(item)}>
        <Feather name="send" size={24} color="black" />
      </Pressable>
      {item?.likes?.length > 0 && (
        <Text className="text-base ml-8 ">
          {`${item?.likes?.length} ${
            item?.likes?.length === 1 ? "like..." : "likes..."
          }`}
        </Text>
      )}
    </View>
  );
};

export default PostFooterIcons;
