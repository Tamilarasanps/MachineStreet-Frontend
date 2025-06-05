import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Pressable,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
} from "react-native";
import PostGrid from "@/app/mechanicApp/PostGrids";
import Icon from "react-native-vector-icons/Feather";
import { useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import GetMechanic from "@/app/hooks/GetMechanic";
import { useEffect, useState, useCallback } from "react";
import EditProfile from "@/app/mechanicApp/EditProfile";
import { FileUpload } from "@/app/context/FileUpload";
import { useContext } from "react";
import UploadPopUp from "@/app/mechanicApp/UploadPopUp";
import useApi from "@/app/hooks/useApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostViewerModal from "@/app/mechanicApp/PostViewerModal";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FontAwesome } from "@expo/vector-icons";
import Mobile from "../(auth)/(SignIn)/Mobile";
import { allCountries } from "country-telephone-data";
import { TextInput } from "react-native-paper";
import Password from "../(auth)/(SignIn)/Password";
import { BlurView } from "expo-blur";
import { useNavigation } from "expo-router";
// import { useSocketContext } from "./context/SocketContext";

const { width } = Dimensions.get("window");

const ProfilePage = ({}) => {
  const [editModal, setEditModal] = useState(false);
  const { width } = useWindowDimensions();
  const { id, page } = useLocalSearchParams();
  const { pickMedia, selectedMedia, setSelectedMedia } = useContext(FileUpload);
  const [userProfile, setUserProfile] = useState(null);
  const [fileUpload, setFileUpload] = useState(false);
  const [posts, setPosts] = useState(false);
  const { getJsonApi, postJsonApi, deleteApi } = useApi();
  const [activePostIndex, setActivePostIndex] = useState(null);
  const [subCategories, setSubCategories] = useState([]);

  const { setUserId, mechanics } = GetMechanic();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCode, setSelectedCode] = useState("+91");
  const [searchQuery, setSearchQuery] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [resetPass, setResetPass] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmPass] = useState("");

  const cleanCountryName = (name) => name.replace(/\s*\(.*?\)/g, "").trim();

  // const { isLoading } = useContext(LoadingContext);
  // console.log("isLoading:", isLoading);

  const filteredCountries = allCountries
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .map((c) => ({
      name: cleanCountryName(c.name),
      dialCode: c.dialCode,
      iso2: c.iso2,
    }));

  const update = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const role = await AsyncStorage.getItem("role");
      const response = await postJsonApi(
        `profile/update`,
        {
          username: userProfile.username,
          bio: userProfile.bio,
          mobile: phoneNumber,
          countryCode: selectedCode,
          email: userProfile.email,
          role: role,
        },
        token
      );
      const updated = userProfile;
      updated.username = response.data.userProfile.username;
      updated.email = response.data.userProfile.email;
      setPhoneNumber(response.data.userProfile.mobile.number);
      setSelectedCode(response.data.userProfile.mobile.countryCode);
    } catch (error) {
      console.error(error.message, "error");
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("role");
      // Navigation
      if (Platform.OS === "web") {
        router.push("/");
      } else {
        navigation.navigate("HomePage");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const passwordReset = useCallback(async () => {
  if (password !== confirmpass) {
    alert("password should not match");
    return;
  }

  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await postJsonApi(
      "profile/passwordReset",
      { password },
      token
    );
    // handle response if needed
  } catch (error) {
    console.error(error.message, "error");
  }
}, [password, confirmpass]);

  const handleLogout = useCallback(() => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) {
        logout();
      }
    } else {
      Alert.alert(
        "Logout",
        "Are you sure want to Logout?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Logout",
            onPress: logout,
          },
        ],
        { cancelable: false }
      );
    }
  }, [navigation]);

  async function fetchPosts(mechId) {
    try {
      const token = await AsyncStorage.getItem("userToken");

      const result = await getJsonApi(`mechanicList/getposts/${mechId}`, token);

      if (result.status === 200) {
        setPosts(result.data);
      } else if (result.status === 401) {
        console.warn("Token expired or unauthorized.");
        // Optionally clear token and redirect to login
        await AsyncStorage.removeItem("userToken");
        // navigation.navigate("Login"); // Uncomment if using navigation
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.warn("Token expired. Redirecting to login...");
        await AsyncStorage.removeItem("userToken");
        // navigation.navigate("Login"); // optional
      } else {
        console.error("API error:", err);
      }
    }
  }

  // post likes

  
const handleLike = useCallback(async (post) => {
  const token = await AsyncStorage.getItem("userToken");

  try {
    const result = await postJsonApi(
      "mechanicList/postLikes",
      { post },
      token
    );
    setComments(result.data);
  } catch (err) {
    console.log(err);
  }
}, []);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState("");

  async function handlePostComment(post, comment) {
    const token = await AsyncStorage.getItem("userToken");

    try {
      const result = await postJsonApi(
        "mechanicList/postComment",
        { post: post, comment: comment },
        token
      );
      if (result.status === 200) setComment("");
    } catch (err) {
      console.log(err);
    }
  }

  // fetch comments

  async function fetchComments(postId) {
    const token = await AsyncStorage.getItem("userToken");

    try {
      const result = await getJsonApi(
        `mechanicList/getComments/${postId}`,
        token
      );
      // console.log("comments :", result);
      if (result.status === 200) setComments(result.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        const role = await AsyncStorage.getItem("role");
        // console.log("stroed token", storedToken);

        // If not logged in, redirect to login (only on web)
        if (!storedToken) {
          if (Platform.OS === "web") {
            router.replace("/screens/Login");
          }
          return;
        }

        // CASE 1: Visiting another mechanic's profile
        if (page === "uservisit" && id) {
          const selectedMechanic = mechanics.find((mech) => mech._id === id);
          if (selectedMechanic) {
            setUserProfile(selectedMechanic);
            setPhoneNumber(selectedMechanic.contact?.number || "");
            setSelectedCode(selectedMechanic.contact?.countryCode || "+91");
            setSubCategories(selectedMechanic.subcategory || []);
            fetchPosts(id); // fetch that user's posts
          }
          return;
        }

        // CASE 2: Logged-in user's own profile
        const response = await getJsonApi("profile", storedToken);
        const data = response.data;

        setUserProfile(data);
        setPhoneNumber(data.mobile?.number || "");
        setSelectedCode(data.mobile?.countryCode || "+91");
        setSubCategories(data.subcategory || []);

        if (role === "mechanic") {
          fetchPosts(); // fetch your own posts
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error.message);
      }
    };

    checkProfile();
  }, [id, mechanics]);

  // async function handleImages() {}
  // async function handleVideo() {}

  // async function handleUpload() {
  //   const result = await pickMedia();
  //   if (!result.canceled && result.assets && result.assets.length > 0) {
  //     const type = result.assets[0].mimeType.split("/")[0];

  //     type === "image"
  //       ? handleImages(result.assets)
  //       : handleVideo(result.assets[0]);
  //   }
  // }
  async function handleImageUpload(result, imagetype) {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const formdata = new FormData();
      if (Platform.OS === "web") {
        result.assets.forEach((asset) => {
          formdata.append("images", asset.file);
        });
      } else {
        result.assets.forEach((asset) => {
          formdata.append("images", {
            uri: asset.uri,
            type: asset.mimeType || "image/jpeg", // use default if mimeType is missing
            name: asset.fileName || `upload_${Date.now()}.jpg`, // fallback name
          });
        });
      }

      const response = await postJsonApi(
        `profile/updateProfileImage/${imagetype}`,
        formdata,
        token
      );
      if (response.status === 200) {
        if (imagetype === "profile") {
          setUserProfile((prev) => ({
            ...prev,
            profileImage: result.assets[0].uri.split(",")[1], // or modify as needed
          }));
        } else if (imagetype === "banner") {
          setUserProfile((prev) => ({
            ...prev,
            banner: result.assets[0].uri.split(",")[1], // or modify as needed
          }));
        }
      }
    } catch (error) {
      console.error(error.message, "error");
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="flex-1 ">
        {/* Back Icon */}
        <View
          className="   z-50 flex justify-center"
          style={{ width: "100%", height: "48" }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            className="flex-row items-center h-12 px-4"
          >
            <Icon name="arrow-left" size={24} color="grey" />
            {/* <Text className="text-white font-semibold ml-2">Back</Text> */}
          </Pressable>
        </View>
        {/* Banner Section */}

        <View className="relative h-64 w-full bg-TealGreen ">
          <View className="w-full h-full ">
            {/* <Icon
              name="arrow-left"
              size={24}
              color="#000"
              onPress={() => navigation.goBack()}
            /> */}
            <Image
              source={{
                uri: `data:image/jpeg;base64,${userProfile?.banner}`,
              }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
            />
            {page !== "uservisit" && (
              <View
                className="bg-white items-center justify-center"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  elevation: 5, // Shadow effect for better visibility
                }}
              >
                <Pressable
                  onPress={async () => {
                    const result = await pickMedia("image", "banner");
                    if (!result.canceled) {
                      handleImageUpload(result, "banner");
                    }
                  }}
                >
                  <MaterialIcons name="edit" size={24} color="teal" />
                </Pressable>
              </View>
            )}
          </View>
          <Pressable
            style={{ borderWidth: 2, borderColor: "#ffffff" }}
            className={` ${
              width < 480
                ? "max-w-48 max-h-48 -bottom-24"
                : "max-h-64 max-w-64 -bottom-24"
            } absolute  left-1/2 -translate-x-1/2 overflow-hidden rounded-full`}
          >
            {/* {userProfileImage ? ( */}
            <View
              className="bg-TealGreen items-center justify-center"
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                // overflow: "hidden", // Ensures circular shape
              }}
            >
              <View
                className="justify-center items-center"
                style={{ width: "100%", height: "100%" }}
              >
                {userProfile?.profileImage ? (
                  <Image
                    source={{
                      uri: `data:image/jpeg;base64,${userProfile?.profileImage}`,
                    }}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <FontAwesome name="user" size={100} color="white" />
                )}
              </View>
            </View>

            {/* Edit Icon */}
            {page !== "uservisit" && (
              <View
                className="bg-white items-center justify-center"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  elevation: 5, // Shadow effect for better visibility
                }}
              >
                <Pressable
                  onPress={async () => {
                    const result = await pickMedia("image", "profile");
                    if (!result.canceled) {
                      // const updateProfileImage = async () => {
                      handleImageUpload(result, "profile");
                      // };
                    }
                  }}
                >
                  <MaterialIcons name="edit" size={24} color="teal" />
                </Pressable>
              </View>
            )}
          </Pressable>
        </View>

        {page !== "uservisit" && (
          <View className="relative w-full flex justify-end mt-4">
            {/* Settings Button */}
            <TouchableOpacity
              className="absolute right-0 top-4 w-24 items-center"
              onPress={() => setModalVisible(true)}
            >
              <Icon name="settings" size={22} />
            </TouchableOpacity>
            {/* Modal */}
            {/* MAIN MODAL */}

            <Modal
              transparent
              animationType="slide"
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <BlurView
                intensity={50}
                tint="light"
                style={styles.blurContainer}
              >
                <View className="bg-white p-6 rounded-lg w-full max-w-[500px] shadow-lg relative">
                  <Text className="text-lg font-bold mb-4">Settings</Text>

                  <View className=" flex gap-4">
                    {/* account-circle-outline */}

                    <TouchableOpacity
                      className="flex-row gap-4 border-2 border-gray-200 rounded-md p-3"
                      onPress={() => setUpdateModal(true)}
                    >
                      <Icon name="user-plus" size={30} color="#2095A2" />
                      <Text className="text-lg font-semibold mt-1 ">
                        Update Your Details
                      </Text>
                    </TouchableOpacity>

                    <Pressable className="flex-row gap-4 border-2 border-gray-200 rounded-md p-3">
                      <Icon name="log-out" size={30} color="#2095A2" />
                      <Pressable
                        onPress={() => {
                          setModalVisible(false);
                          handleLogout();
                        }}
                      >
                        <Text className="text-lg font-semibold mt-1 ">
                          Logout
                        </Text>
                      </Pressable>
                    </Pressable>

                    {/* Action Buttons */}
                    {/* <View className="flex-row mt-8 space-x-4">
                    <Pressable
                      onPress={() => setResetPass(true)}
                      className="bg-TealGreen h-10 items-center justify-center w-[140px] rounded-sm"
                    >
                      <Text className="text-white font-bold text-base">
                        Logout
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={update}
                      className="bg-TealGreen h-10 items-center justify-center w-[140px] rounded-sm"
                    >
                      <Text className="text-white font-bold text-base">
                        Update
                      </Text>
                    </Pressable>
                  </View> */}
                  </View>

                  {/* Close Main Modal */}
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="absolute h-10 w-10 justify-center items-center top-2 right-2 bg-red-500 p-2 rounded-full"
                  >
                    <Text className="text-white font-medium">X</Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </Modal>
            {/* RESET PASSWORD - Separate Modal */}
            <Modal
              transparent
              animationType="fade"
              visible={resetPass}
              onRequestClose={() => setResetPass(false)}
            >
              <View style={styles.overlay}>
                <View style={styles.popupContainer}>
                  <Pressable
                    // onPress={() => onRequestClose(false)}
                    className="absolute h-10 w-10 justify-center items-center top-2 right-2 bg-gray-200 p-2 rounded-full z-999 "
                  >
                    <Text className="text-lg font-bold text-gray-600">✕</Text>
                  </Pressable>

                  <Password
                    password={password}
                    confirmpass={confirmpass}
                    setPassword={setPassword}
                    setConfirmPass={setConfirmPass}
                    formSubmit={passwordReset}
                    buttonLabel="Reset Password"
                    headerLabel="Reset Password"
                  />
                </View>
              </View>
            </Modal>

            <Modal
              transparent
              animationType="slide"
              // visible={modalVisible}
              visible={updateModal}
              onRequestClose={() => setUpdateModal(true)}
            >
              <BlurView
                intensity={50}
                tint="light"
                style={styles.blurContainer}
              >
                <View className="bg-white p-6 rounded-lg w-full max-w-[500px] shadow-lg relative">
                  <Text className="text-lg font-bold mb-4">
                    Update Your Details
                  </Text>

                  <View className="items-center flex gap-4">
                    <TextInput
                      label="UserName"
                      value={userProfile?.username}
                      onChangeText={(text) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          username: text, // update only username inside userProfile
                        }))
                      }
                      mode="outlined"
                      theme={{ colors: { primary: "teal" } }}
                      style={{
                        height: 50,
                        width: "100%",
                        maxWidth: "75%",
                        backgroundColor: "white",
                      }}
                    />

                    <TextInput
                      label="Bio"
                      value={userProfile?.bio}
                      onChangeText={(text) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          bio: text, // update only username inside userProfile
                        }))
                      }
                      mode="outlined"
                      theme={{ colors: { primary: "teal" } }}
                      style={{
                        height: 50,
                        width: "100%",
                        maxWidth: "75%",
                        backgroundColor: "white",
                      }}
                    />

                    <TextInput
                      label="E-mail"
                      value={userProfile?.email}
                      onChangeText={(text) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          email: text, // update only the email inside userProfile
                        }))
                      }
                      mode="outlined"
                      keyboardType="email-address"
                      theme={{ colors: { primary: "teal" } }}
                      style={{
                        height: 50,
                        width: "100%",
                        maxWidth: "75%",
                        backgroundColor: "white",
                      }}
                    />

                    <Mobile
                      dropdownVisible={dropdownVisible}
                      setDropdownVisible={setDropdownVisible}
                      selectedCode={selectedCode}
                      setSelectedCode={setSelectedCode}
                      phoneNumber={phoneNumber || ""}
                      setPhoneNumber={setPhoneNumber}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      filteredCountries={filteredCountries}
                    />

                    <View className="flex-row mt-8 space-x-4">
                      <Pressable
                        onPress={() => setResetPass(true)}
                        className="bg-TealGreen h-10 items-center justify-center w-[140px] rounded-sm"
                      >
                        <Text className="text-white font-bold text-base">
                          Reset Password
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={update}
                        className="bg-TealGreen h-10 items-center justify-center w-[140px] rounded-sm"
                      >
                        <Text className="text-white font-bold text-base">
                          Update
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => setUpdateModal(false)}
                    className="absolute h-10 w-10 justify-center items-center top-2 right-2 bg-red-500 p-2 rounded-full"
                  >
                    <Text className="text-white font-medium">X</Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </Modal>
          </View>
        )}

        {/* Profile Details */}
        <View className="w-full mt-24 flex items-center justify-center p-4 gap-2">
          {/* Name */}
          <Text className="text-lg font-bold">
            {userProfile?.username.charAt(0).toUpperCase() +
              userProfile?.username.slice(1)}
          </Text>

          {/* Bio */}
          {(userProfile?.role === "mechanic" || page === "uservist") && (
            // (userProfile.role === "mechanic" && (
            <Text
              className="text-md font-semibold text-gray-500"
              style={{
                width: "80%", // Make the text width responsive
                maxWidth: 400, // Max width for larger screens like tablets/desktops
                textAlign: "center",
              }}
            >
              {userProfile?.bio || "bio  "}
            </Text>
          )}
        </View>

        {/* Buttons */}

        {(page !== "uservisit" && userProfile?.role !== "mechanic") ||
          (page !== "uservisit" && (
            <View className="flex-row justify-between items-center px-4 mt-2">
              <TouchableOpacity
                onPress={() => setEditModal(true)}
                className="flex-1 mr-1 py-2 bg-gray-200 rounded"
              >
                <Text className="text-center font-medium text-sm">
                  Edit Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  const result = await pickMedia();
                  if (
                    !result.canceled &&
                    result.assets &&
                    result.assets.length > 0
                  )
                    setFileUpload(true);
                }}
                className="flex-1 p-2 bg-gray-200 rounded"
              >
                <Text className="text-center font-semibold">Create Post</Text>
              </TouchableOpacity>
            </View>
          ))}

        {/* edit modal */}

        {editModal && (
          <EditProfile
            subCategories={subCategories}
            setSubCategories={setSubCategories}
            mechanicDetails={userProfile}
            setMechanicDetails={setUserProfile}
            setModalVisible={setEditModal}
            page={"profile"}
          />
        )}

        {fileUpload && (
          <UploadPopUp
            fetchPosts={fetchPosts}
            selectedMedia={selectedMedia}
            setFileUpload={setFileUpload}
            fileUpload={fileUpload}
            setSelectedMedia={setSelectedMedia}
          />
        )}

        {/* Posts Grid */}
        {/* <View className="mt-4 flex-1"> */}

        <PostGrid
          posts={posts}
          onPostPress={(index) => {
            setActivePostIndex(index);
            console.log("index :", index);
          }}
          width={width}
          // loading={isLoading}
        />
        {/* </View> */}
        {activePostIndex !== null && (
          <PostViewerModal
            posts={posts}
            activeIndex={activePostIndex}
            userProfile={userProfile}
            onClose={() => setActivePostIndex(null)}
            width={width}
            handleLike={handleLike}
            setPosts={setPosts}
            handlePostComment={handlePostComment}
            comments={comments}
            setComments={setComments}
            comment={comment}
            page={page}
            setComment={setComment}
            fetchComments={fetchComments}
            deleteApi={deleteApi}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  popupContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    width: width >= 768 ? 500 : "90%",
    alignSelf: "center",
    alignItems: "center",
    // backgroundColor:"red"
  },
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfilePage;
