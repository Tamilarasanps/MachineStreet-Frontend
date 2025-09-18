import { FlatList, Image, Pressable, View } from "react-native";
import VideoGridItem from "./VideoGridItem";

const PostGrid = ({ isDesktop, selectedMechanic, page, setPostModal }) => {
  const numCols = isDesktop ? 4 : 3;

  // ✅ reverse safely (don’t mutate original)

  return (
    <FlatList
      key={numCols}
      data={selectedMechanic?.posts}
      numColumns={numCols}
      keyExtractor={(post, index) =>
        post?._id ? String(post._id) : `post-${index}`
      }
      extraData={selectedMechanic?.posts} // 👈 force FlatList to re-render on updates
      contentContainerStyle={{ padding: 16, marginBottom: 120 }}
      renderItem={({ item: post, index }) => {
        // const mediaUri = `http://10.255.87.158:5000/api/mediaDownload/${post?.media}`;
        const mediaUri = `https://api.machinestreets.com/api/mediaDownload/${post?.media}`;
        const modalIndex = index; // ✅ safe now because we already reversed

        return (
          <Pressable
            onPress={() => setPostModal(modalIndex)}
            style={{
              width: `${100 / numCols}%`,
              aspectRatio: 1,
              padding: 2,
              backgroundColor: "#ffffff",
              overflow: "hidden",
            }}
          >
            {post?.contentType === "video" ? (
              <VideoGridItem
                setPostModal={() => setPostModal(modalIndex)}
                source={mediaUri}
                page={page}
                isVisible={false}
              />
            ) : (
              <Image
                source={{ uri: mediaUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            )}
          </Pressable>
        );
      }}
    />
  );
};

export default PostGrid;
