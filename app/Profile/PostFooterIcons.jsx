import { View, Pressable, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

const PostFooterIcons = ({ item, userId, isDesktop, handleLike, setModal, share }) => {
  return (
    <View className="flex-row">
      <Pressable
        onPress={() => handleLike({ postId: item._id }, "api/postLikes")}
        style={{
          marginRight: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {item?.likes?.includes(userId) ? (
          <FontAwesome name="heart" size={24} color="red" />
        ) : (
          <Feather name="heart" size={24} color="black" />
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
          <Icon name="message-circle" size={24} color="black" />
        </Pressable>
      )}

      <Pressable onPress={()=>share(item)}>
        <Icon name="send" size={24} color="black" />
      </Pressable>
      {item?.likes?.length > 0 && (
        <Text className="text-base ml-8 ">
          {`${item?.likes?.length} ${item?.likes?.length===1 ? 'like...' : 'likes...'}`}
        </Text>
      )}
    </View>
  );
};

export default PostFooterIcons;
