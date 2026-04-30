import CardSlider from "@/components/CardSlider";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import { useFileUploadContext } from "@/context/FileUpload";
import useApi from "@/hooks/useApi";
import useScreenWidth from "@/hooks/useScreenWidth";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SectionList,
  Share,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CryptoJS from "react-native-crypto-js";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";
import postsAnimation from "../../assets/animations/posts.json";
import PostGrid from "../Profile/PostGrid";
import PostViewerModal from "../Profile/PostViewerModal";
import ProfilePageHeader from "../Profile/ProfilePageHeader";
import ResetPassword from "../Profile/ResetPassword";
import Settings from "../Profile/Settings";
import UploadPopUp from "../Profile/UploadPopUp";
import UserDetails from "../Profile/UserDetails";
import UserDetailsForm from "../SignUp/UserDetailsForm";
import FollowersModal from "../Profile/FollowersModal";

export default function Profile() {
  const {
    selectedMechanic,
    setSelectedMechanic,
    userId,
    startLoading,
    stopLoading,
  } = useAppContext();
  const { postJsonApi, patchApi, getJsonApi, deleteApi } = useApi();
  const { upload, media, setMedia } = useFileUploadContext();
  const { width, isDesktop, isMobile, height } = useScreenWidth();
  const [tempMech, setTempMech] = useState(selectedMechanic);
  const { id, type, post } = useLocalSearchParams();
  const [displayLoader, setDisplayLoader] = useState(true);
  const [follow, setFollow] = useState("Follow");
  const [followingList, setFollowingList] = useState(null);
  const [followingModal, setFollowingModal] = useState(false);

  const [uploadType, setUploadType] = useState("");
  const [description, setDescription] = useState("");
  const [modal, setModal] = useState("");
  const [postModal, setPostModal] = useState(null);
  const [comment, setComment] = useState({ comment: "", userId: null });

  let decrypted = null;
  if (type) {
    const bytes = CryptoJS.AES.decrypt(type, "f9b7nvctr72942chh39h9rc");
    decrypted = bytes.toString(CryptoJS.enc.Utf8);
  }

  useEffect(() => {
    setComment((prev) => ({ ...prev, userId: userId }));
  }, [userId]);

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

  const getMechanic = async () => {
    try {
      const user =
        Platform.OS === "web" ? id : decrypted === "user_visit" ? id : userId;
      const result = await getJsonApi(
        `api/getSelectedMechanic/${user}`,
        "application/json",
        { secure: true },
      );
      console.log('id :', id)
      if (result.status === 200) {
        setSelectedMechanic(result?.data);
        setTempMech(result?.data);
        console.log('tm :', tempMech)
        console.log('sm :', selectedMechanic)
        if (decrypted === "user_visit")
          setFollow(() =>
            result?.data?.following.includes(userId) ? "Following" : "Follow",
          );

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
    } finally {
      setDisplayLoader(false);
    }
  };

  // Refresh every time screen is focused
  useFocusEffect(
    useCallback(() => {
      getMechanic();
    }, [id, decrypted, userId]),
  );

  useFocusEffect(
    useCallback(() => {
      setDisplayLoader(true);
      // Optional: cleanup when screen loses focus
      return () => {
        setDisplayLoader(false);
      };
    }, []),
  );

  // media upload
  const handleMediaupload = async () => {
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
        
      }),
    );

    const res = await postJsonApi(
      "api/postUpload",
      formData,
      Platform.OS === "web" ? undefined : "multipart/form-data",
      { secure: true },
    );
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
        { secure: true },
      );
      if (result.status === 200) {
        setViewType("user");
        setModal("settings");
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchCoordinatesWeb = async (address) => {
    const res = await fetch(
      `https://api.machinestreets.com/api/geocode?address=${encodeURIComponent(
        address,
      )}`,
    );
    const data = await res.json();

    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
    return null;
  };

  // Main function
  const fetchGeocodes = useCallback(async (address) => {
    startLoading();

    try {
      if (Platform.OS === "web") {
        const webCoords = await fetchCoordinatesWeb(address);
        if (webCoords) {
          setSelectedMechanic((prev) => ({
            ...prev,
            lat: webCoords.latitude,
            lon: webCoords.longitude,
          }));
          return webCoords; // ✅ return so caller knows it's ready
        }
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access location was denied");
          return null;
        }
        const location = await Location.geocodeAsync(address);
        if (location.length > 0) {
          setSelectedMechanic((prev) => ({
            ...prev,
            lat: location[0].latitude,
            lon: location[0].longitude,
          }));
          return {
            latitude: location[0].latitude,
            longitude: location[0].longitude,
          };
        }
      }
    } catch (error) {
      console.error("Geocode fetch failed:", error);
    } finally {
      stopLoading();
    }
  }, []);

  // Validation check
  const checkEmptyFields = useCallback((userDetails) => {
    const { username } = userDetails;

    // Fields to skip (optional)
    const optionalFields = ["lat", "lon", "bio"];

    // Map nested keys to friendly labels
    const fieldLabels = {
      name: "category",
      services: "subcategory",
    };

    // Show toast error
    const showError = (field, parent = null) => {
      const label = field || fieldLabels[field];
      const message = parent
        ? `${parent} is required for ${label}`
        : `${label} is required`;

      Toast.error(message, {
        duration: 3000,
        position: "top",
      });
    };
    console.log("opt :", optionalFields);
    // Recursive check for empty values
    const isEmpty = (value, key, parent = null) => {
      if (optionalFields.includes(key)) return false; // skip optional fields
      console.log("lk :", value, key);
      if (typeof value === "string") {
        if (!value.trim()) {
          showError(key, parent);
          return true;
        }
        return false;
      }

      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          if (isEmpty(value[i], key, parent)) return true;
        }
      }

      if (typeof value === "object" && value !== null) {
        for (const innerKey in value) {
          if (isEmpty(value[innerKey], innerKey, key)) return true;
        }
      }

      return false;
    };

    // Iterate over top-level userDetails
    for (const key in userDetails) {
      if (optionalFields.includes(key)) continue;

      if (isEmpty(userDetails[key], key)) return false;
    }

    // Specific username validation
    if (username.trim().length > 0 && username.trim().length < 3) {
      Toast.error("Username must be at least 3 characters", {
        duration: 3000,
        position: "top",
      });
      return false;
    }

    return true;
  }, []);

  // userDetails updation
  const hanldeUpdate = useCallback(async (userDetails) => {
    if (!checkEmptyFields(userDetails)) {
      stopLoading();
      return;
    }
    try {
      const result = await patchApi(
        "api/userDetailsUpdate",
        { userDetails },
        "application/json",
        { secure: true },
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
  // const shareProfile = useCallback(async () => {
  //   try {
  //     const profileId = id;

  //     const url = `https://api.machinestreets.com/Profile?id=${profileId}&type=user_visit`;

  //     await Share.share({
  //       message: `Check out this profile in MachineStreets: ${url}`,
  //     });
  //   } catch (error) {
  //     console.log("Error sharing profile:", error.message);
  //   }
  // }, [id]);

  const share = useCallback(
    async (post) => {
      try {
        let productUrl;
        if (post) {
          productUrl = `https://machinestreets.com/E2?id=${userId}&type=user_visit&post=${post._id}`;
        } else {
          productUrl = `https://machinestreets.com/Profile?id=${id}&type=user_visit`;
        }

        const message = `Check this out: ${productUrl}`;

        if (Platform.OS === "web") {
          if (navigator.share) {
            await navigator.share({
              title: "Check this out!",
              text: message,
              url: productUrl,
            });
          } else {
            await navigator.clipboard.writeText(message);
            alert("🔗 URL copied to clipboard (Web Share not supported)");
          }
        } else {
          await Share.share({ message });
        }
      } catch (error) {
        Alert.alert("Error", "Unable to share.");
        console.log("Share error:", error);
      }
    },
    [id, userId],
  );

  const handleIconClick = useCallback(async (name) => {
    setViewType(name);
    if (name === "credit-card") setModal("credit-card");
    if (name === "plus-square") {
      setUploadType("posts");
      await upload("posts");
    }
    if (name === "share") {
      share();
    }
  }, []);

  // post likes and comments
  const handleLike = useCallback(async (postId, api) => {
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
        { secure: true },
      );
      console.log(result);
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

  // follow request api

  const followRequest = async (id) => {
    const mechId = id ? id : selectedMechanic?._id;
    try {
      const result = await postJsonApi(
        "api/followRequest",
        { mechId: mechId },
        "application/json",
        { secure: true },
      );
      console.log("result :", result);
      if (result.status === 200) {
        const isFollowing = result.data.mechanic.followers.includes(userId);

        if (decrypted === "user_visit") {
          setFollow(isFollowing ? "Following" : "Follow");
          return;
        }
        // ✅ update list item
        setFollowingList((prev) =>
          prev.map((user) =>
            user._id === mechId
              ? { ...user, follow: isFollowing } // toggle
              : user,
          ),
        );

        setSelectedMechanic((prev) => {
          const exists = prev.following.some(
            (item) => item.toString() === id.toString(),
          );

          return {
            ...prev,
            following: exists
              ? prev.following.filter(
                  (item) => item.toString() !== id.toString(),
                ) // 🔻 remove
              : [...prev.following, id], // 🔺 add
          };
        });
      }
    } catch (err) {
      console.error("Follow request failed:", err);
    }
  };
  console.log("sm :", selectedMechanic);
  // fetch followers
  const fetchFollwers = async () => {
    const result = await getJsonApi("api/getFollowers", "application/json", {
      secure: true,
    });
    if (result.status === 200 || 201) setFollowingList(result.data || []);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={["top", "left", "right"]} // ignore bottom to let tab bar handle it
    >
      {/* <Image
        source={{
          uri: `https://api.machinestreets.com/api/mediaDownload/${selectedMechanic?.businessCards[1]}`,
        }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      /> */}
      {displayLoader ? (
        <Loading />
      ) : (
        <>
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
            keyExtractor={(item, index) =>
              item._id?.toString() || index.toString()
            }
            stickySectionHeadersEnabled={true}
            ListHeaderComponent={
              <ProfilePageHeader
                setFollowingModal={setFollowingModal}
                media={media}
                selectedMechanic={selectedMechanic}
                type={decrypted}
                isMobile={isMobile}
                upload={upload}
                setUploadType={setUploadType}
                setModal={setModal}
                fetchFollwers={fetchFollwers}
              />
            }
            renderSectionHeader={() => {
              const icons = [
                "plus-square",
                "share",
                "grid",
                "user",
                "credit-card",
              ].filter(
                (name) =>
                  !(
                    decrypted === "user_visit" &&
                    (name === "plus-square" || name === "edit-2")
                  ),
              );

              return (
                <View
                  className="flex-row items-center px-4 py-4  bg-gray-100"
                  style={{ zIndex: Platform.OS === "web" ? 999 : 1 }}
                >
                  {/* Icons */}
                  {selectedMechanic?.role === "mechanic" && (
                    <View className="flex-row flex-1 justify-evenly items-center">
                      {icons.map((name) => (
                        <Pressable
                          key={name}
                          className={`flex-1 mx-1 py-2 items-center justify-center rounded-lg
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
                  )}

                  {/* Follow Button (Right Side + Highlighted) */}
                  {decrypted === "user_visit" && (
                    <Pressable
                      onPress={() => followRequest()}
                      className="ml-3 px-5 py-2 bg-TealGreen rounded-md shadow-sm"
                    >
                      <Text className="text-white font-bold text-base">
                        {follow}
                      </Text>
                    </Pressable>
                  )}
                </View>
              );
            }}
            renderItem={({ item }) => (
              <View className="mt-2 p-4 rounded-md -z-10">
                {selectedMechanic?.role === "mechanic" &&
                  viewType !== "grid" &&
                  viewType !== "plus-square" && (
                    <UserDetails
                      userDetails={selectedMechanic}
                      isMobile={isMobile}
                      isDesktop={isDesktop}
                    />
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
                        className={`${
                          isDesktop ? "w-[500px]" : "w-[90%]"
                        }  bg-gray`}
                      >
                        <LottieView
                          source={postsAnimation}
                          autoPlay
                          loop
                          style={{ width: "100%", height: "100%" }}
                        />
                      </View>
                    </View>
                  ))}
              </View>
            )}
          />
          <FollowersModal
            setSelectedMechanic={setSelectedMechanic}
            fetchFollwers={fetchFollwers}
            visible={followingModal}
            onClose={() => setFollowingModal(false)}
            followingList={followingList}
            followRequest={followRequest}
          />
          {/* settings and update form */}
          <Modal
            visible={
              viewType === "edit-2" ||
              modal === "settings" ||
              modal === "reset" ||
              modal === "credit-card"
            }
            animationType="slide"
            transparent={modal !== "edit-2"} // overlay for settings/reset, not edit
            presentationStyle={
              modal === "edit-2" ? "fullScreen" : "overFullScreen"
            }
            statusBarTranslucent
            onRequestClose={() => {
              setTempMech(selectedMechanic);
              setViewType("user");
              setModal("");
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "padding"}
              style={styles.fullScreen}
            >
              <SafeAreaView
                className="w-full h-full items-center justify-center "
                style={{
                  flex: 1,
                  paddingTop: Platform.OS === "ios" ? insets.top : 0,
                  paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
                }}
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
                    }}
                  />
                </TouchableWithoutFeedback>

                {/* Modal Content */}
                <View
                  style={{
                    width:
                      modal === "credit-card"
                        ? "100%"
                        : isDesktop
                          ? 600
                          : "90%",
                    backgroundColor:
                      modal === "credit-card" ? "#56515158" : "#fff",
                    borderRadius: viewType === "credit-card" ? 0 : 24,
                    padding: 20,
                    height:
                      Platform.OS === "web"
                        ? viewType === "edit-2"
                          ? "95%"
                          : viewType === "credit-card"
                            ? "100%"
                            : "auto"
                        : "auto",
                    alignItems: "center",
                    justifyContent: "center",

                    // ✅ Apply shadow only when not credit-card
                    ...(viewType !== "credit-card" && {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 10,
                    }),
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
                      handleSubmit={hanldeUpdate}
                      fetchGeocodes={fetchGeocodes}
                    />
                  )}

                  {modal === "settings" && (
                    <Settings setModal={setModal} setViewType={setViewType} />
                  )}

                  {modal === "reset" && (
                    <ResetPassword handlePasswordReset={handlePasswordReset} />
                  )}
                  {modal === "credit-card" && (
                    <CardSlider
                      userDetails={selectedMechanic}
                      onClose={() => setModal("")}
                    />
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
            transparent={Platform.OS === "web" && isDesktop} // never true on iOS
            animationType="slide"
            // presentationStyle={Platform.OS === "ios" ? "fullScreen" : "overFullScreen"}
          >
            <SafeAreaView
              style={{
                flex: 1,
                paddingTop: Platform.OS === "ios" ? insets.top : 0,
                paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
              }}
              edges={["top", "bottom"]}
            >
              {selectedMechanic?.posts?.length > 0 && (
                <PostViewerModal
                  setSelectedMechanic={setSelectedMechanic}
                  type={decrypted}
                  postDelete={postDelete}
                  comment={comment}
                  setComment={setComment}
                  userId={userId}
                  handleLike={handleLike}
                  user={selectedMechanic}
                  setPostModal={setPostModal}
                  setModal={setModal}
                  share={share}
                  modal={modal}
                  postModal={postModal}
                  height={height}
                  width={width * 0.8}
                  isDesktop={isDesktop}
                />
              )}
            </SafeAreaView>
          </Modal>
        </>
      )}
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
