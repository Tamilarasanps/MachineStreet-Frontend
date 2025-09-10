import {
  SectionList,
  Platform,
  Share,
  Modal,
  Pressable,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import * as Linking from "expo-linking";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "@/context/AppContext";
import { useFileUploadContext } from "@/context/FileUpload";
import useApi from "@/hooks/useApi";
import useScreenWidth from "@/hooks/useScreenWidth";
import { Feather } from "@expo/vector-icons";
import postsAnimation from "../../assets/animations/posts.json";
import LottieView from "lottie-react-native";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import PostGrid from "../Profile/PostGrid";
import PostViewerModal from "../Profile/PostViewerModal";
import ResetPassword from "../Profile/ResetPassword";
import Settings from "../Profile/Settings";
import UserDetails from "../Profile/UserDetails";
import UserDetailsForm from "../SignUp/UserDetailsForm";
import ProfilePageHeader from "../Profile/ProfilePageHeader";
import UploadPopUp from "../Profile/UploadPopUp";

export default function Profile() {
  const { selectedMechanic, setSelectedMechanic, userId } = useAppContext();
  const { postJsonApi, patchApi, getJsonApi, deleteApi } = useApi();
  const { upload, media, setMedia } = useFileUploadContext();
  const { width, isDesktop, isMobile, height } = useScreenWidth();
  const [tempMech, setTempMech] = useState(selectedMechanic);
  const { id, type, post } = useLocalSearchParams();
  const [uploadType, setUploadType] = useState("");

  const [description, setDescription] = useState("");
  const [modal, setModal] = useState("");
  const [postModal, setPostModal] = useState(null);
  const [comment, setComment] = useState({ comment: "", userId: null });

  useEffect(()=>{
    setComment((prev)=>({...prev,userId : userId}))
  },[userId])


  const insets = useSafeAreaInsets();

  const [viewType, setViewType] = useState("user"); // "posts" | "blogs"
  const sections = [
    {
      title: "profile",
      data:
        viewType === "posts"
          ? selectedMechanic?.posts || []
          : [{ id: "placeholder" }],
    },
  ];

  // get selectedMechnic details

  const getMechanic = useCallback(async () => {
    try {
      const user = Platform.OS === "web" ? id : userId;

      const result = await getJsonApi(
        `api/getSelectedMechanic/${user}`,
        "application/json",
        { secure: true }
      );
      if (result.status === 200) {
        setSelectedMechanic(result?.data);
        setTempMech(result?.data);

        if (post) {
          const po = result?.data?.posts || [];
          const index = po.findIndex((p) => p._id === post); // ✅ find the index
          if (index !== -1) {
            setPostModal(index); // ✅ set index if found
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  useEffect(() => {
    getMechanic();
  }, [id]);

  // media upload
  const handleMediaupload = async () => {
    console.log("media inside function :", media, "uploadType:", uploadType);

    if (!media || media.length === 0 || media?.canceled) return;

    const formData = new FormData();
    if (uploadType === "posts") formData.append("description", description);
    formData.append("type", uploadType);

    await Promise.all(
      media.map(async (asset) => {
        let file;
        if (Platform.OS === "web") {
          const blob = await (await fetch(asset.uri)).blob();
          file = new File([blob], asset.fileName || "file.jpg", {
            type: asset.mimeType || blob.type || "image/jpeg",
          });
        } else {
          file = {
            uri: asset.uri,
            name: asset.fileName || asset.uri.split("/").pop(),
            type:
              asset.mimeType ||
              `${asset.type}/${asset.uri.split(".").pop() || "jpeg"}`,
          };
        }
        formData.append("media", file);
      })
    );

    const res = await postJsonApi(
      "api/postUpload",
      formData,
      Platform.OS === "web" ? undefined : "multipart/form-data",
      { secure: true }
    );
    console.log("res :", res);
    if (res?.status === 200) {
      setDescription("");
      setMedia([]);
      setViewType(viewType === "plus-square" ? "grid" : "user");
    }
  };

  useEffect(() => {
    if (media.length > 0 && uploadType !== "posts") {
      handleMediaupload();
    }
  }, [media]);

  // password reset
  const handlePasswordReset = useCallback(async (password) => {
    try {
      const result = await patchApi(
        "api/passwordReset",
        { password, page: "profile" },
        "application/json",
        { secure: true }
      );
      if (result.status === 200) {
        setViewType("user");
        setModal("");
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  // userDetails updation
  const hanldeUpdate = useCallback(async (userDetails) => {
    try {
      const result = await patchApi(
        "api/userDetailsUpdate",
        { userDetails },
        "application/json",
        { secure: true }
      );
      if (result.status === 200) {
        setSelectedMechanic(result?.data?.userDetails);
        setViewType("user");
        setModal("");
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  // share user
  const shareProfile = useCallback(async () => {
    try {
      const profileId = id;

      let url;

      if (Platform.OS === "web") {
        // Use localhost or your dev server URL for web
        url = `https://api.machinestreets.com/Profile?id=${profileId}&type=user_visit`;
      } else {
        // Use Expo Linking for native deep link
        url = Linking.createURL("Profile", {
          queryParams: { id: profileId, type: "user_visit" },
        });
      }

      await Share.share({
        message: `Check out my profile: ${url}`,
      });

      console.log("Profile shared via deep link:", url);
    } catch (error) {
      console.log("Error sharing profile:", error.message);
    }
  }, [id]);

  const handleIconClick = useCallback(async (name) => {
    setViewType(name);
    if (name === "plus-square") {
      setUploadType("posts");
      await upload();
    }
    if (name === "share") {
      shareProfile();
    }
  }, []);

  // post likes and comments
  const handleLike = useCallback(async (postId, api) => {
    console.log("inside function", postId, api);
    try {
      const result = await postJsonApi(api, postId, "application/json", {
        secure: true,
      });

      if (result.status === 200) {
        setComment((prev) => ({ ...prev, comment: "" }));
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  // delete api

  const postDelete = useCallback(async (postId) => {
    try {
      const result = await deleteApi(
        "api/deletePost",
        { postId },
        "application/json",
        { secure: true }
      );
      if (result?.status === 200) {
        setSelectedMechanic((prev) => {
          const newPosts = prev.posts.filter((post) => post._id !== postId);
          return { ...prev, posts: newPosts };
        });

        // ✅ Adjust postModal safely
        setPostModal((prev) => {
          const newLength = result?.data?.updatedUser?.posts?.length || 0;
          if (newLength === 0) return null; // no posts left
          return Math.min(prev, newLength - 1); // clamp
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={["top", "left", "right"]} // ignore bottom to let tab bar handle it
    >
      {/* upload popup */}
      {media?.length > 0 && viewType === "plus-square" && (
        <UploadPopUp
          onRequestClose={() => {
            setViewType("user");
            setMedia([]);
          }}
          isDesktop={isDesktop}
          media={media}
          setMedia={setMedia}
          description={description}
          setDescription={setDescription}
          handleMediaupload={handleMediaupload}
        />
      )}

      <SectionList
        style={{ flex: 1 }}
        sections={sections}
        keyExtractor={(item, index) => item._id?.toString() || index.toString()}
        stickySectionHeadersEnabled={true}
        ListHeaderComponent={
          <ProfilePageHeader
            media={media}
            selectedMechanic={selectedMechanic}
            type={type}
            isMobile={isMobile}
            upload={upload}
            setUploadType={setUploadType}
            setModal={setModal}
          />
        }
        renderSectionHeader={() =>
          selectedMechanic?.role === "mechanic" && (
            <View
              className="flex-row justify-between h-fit items-center px-4 py-2 bg-gray-100"
              style={{ zIndex: Platform.OS === "web" ? 999 : 1 }}
            >
              {["plus-square", "share", "grid", "user", "edit-2"]
                .filter(
                  (name) =>
                    !(
                      type === "user_visit" &&
                      (name === "plus-square" || name === "edit-2")
                    )
                )
                .map((name) => (
                  <Pressable
                    key={name}
                    className={`flex-1 mr-1 h-fit py-2 items-center justify-center rounded
                  ${viewType === name ? "bg-TealGreen" : "bg-white"}`}
                    onPress={() => handleIconClick(name)}
                  >
                    <Feather
                      name={name}
                      size={22}
                      color={viewType === name ? "white" : "#2095A2"}
                    />
                  </Pressable>
                ))}
            </View>
          )
        }
        renderItem={({ item }) => (
          <View className="mt-2 p-4 rounded-md -z-10">
            {selectedMechanic?.role === "mechanic" && (viewType === "user" || viewType === "share") && (
              <UserDetails userDetails={selectedMechanic} isMobile={isMobile} />
            )}
            {(viewType === "grid" || viewType === "plus-square") &&
              (selectedMechanic?.posts.length > 0 ? (
                <PostGrid
                  setPostModal={setPostModal}
                  isDesktop={isDesktop}
                  selectedMechanic={selectedMechanic}
                  page="pro"
                />
              ) : (
                <View className="h-screen w-full  items-center justify-center">
                  <View
                    className={`${isDesktop ? "w-[500px]" : "w-[90%]"}  bg-gray`}
                  >
                    <LottieView
                      source={postsAnimation}
                      autoPlay
                      loop
                      style={{ width: "100%", height: "100%" }}
                    />
                  </View>
                  <Text>No posts Yet</Text>
                </View>
              ))}
          </View>
        )}
      />

      {/* settings and update form */}
      <Modal
        visible={
          viewType === "edit-2" || modal === "settings" || modal === "reset"
        }
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        presentationStyle="fullScreen"
        onRequestClose={() => {
          setTempMech(selectedMechanic);
          setViewType("user");
          setModal("");
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.fullScreen}
        >
          <SafeAreaView
            className="w-full items-center justify-center"
            style={{ flex: 1 }}
            edges={["top", "bottom"]}
          >
            {/* Background close */}
            <TouchableWithoutFeedback
              onPress={() => {
                setTempMech(selectedMechanic);
                setViewType("user");
                setModal("");
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  // backgroundColor: "rgba(0,0,0,0.5)",
                }}
              />
            </TouchableWithoutFeedback>

            {/* Modal Content */}
            <View
              style={{
                width: isDesktop ? 600 : "90%",
                backgroundColor: "#fff",
                borderRadius: 24,
                padding: 20,
                // shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {viewType === "edit-2" && (
                <UserDetailsForm
                  onRequestClose={() => {
                    setTempMech(selectedMechanic);
                    setViewType("user");
                    setModal("");
                  }}
                  userDetails={tempMech}
                  setUserDetails={setTempMech}
                  page="profile"
                  isLoading={false}
                  handleSubmit={hanldeUpdate}
                />
              )}

              {modal === "settings" && (
                <Settings setModal={setModal} setViewType={setViewType} />
              )}

              {modal === "reset" && (
                <ResetPassword handlePasswordReset={handlePasswordReset} />
              )}
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>

      {/* posts modal */}
      <Modal
        visible={postModal !== null}
        onRequestClose={() => setPostModal(null)}
        statusBarTranslucent={true}
        transparent={Platform.OS === "web" && isDesktop}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView
          style={{
            flex: 1,
            paddingTop: Platform.OS === "ios" ? insets.top : 0,
            paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
          }}
          edges={["top", "left", "right"]}
        >
          {selectedMechanic?.posts?.length > 0 ? (
            <PostViewerModal
              type={type}
              postDelete={postDelete}
              comment={comment}
              setComment={setComment}
              userId={userId}
              handleLike={handleLike}
              user={selectedMechanic}
              setPostModal={setPostModal}
              setModal={setModal}
              modal={modal}
              postModal={postModal}
              height={height}
              width={width * 0.8}
              isDesktop={isDesktop}
            />
          ) : (
            <View className="flex-1 items-center justify-center bg-red-200">
              <Text>No Posts Yet</Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = {
  fullScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
};
