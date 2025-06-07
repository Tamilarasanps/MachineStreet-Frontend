import React, { useCallback, useState } from "react";
import { View, Text, Modal, TouchableOpacity, Pressable } from "react-native";
import Mobile from "../(auth)/(SignIn)/Mobile";
import { allCountries } from "country-telephone-data";
import { TextInput } from "react-native-paper";
import Password from "../(auth)/(SignIn)/Password";

const ModalScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCode, setSelectedCode] = useState("+91");
  const [searchQuery, setSearchQuery] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [resetPass, setResetPass] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmPass] = useState("");

  const cleanCountryName = (name) => name.replace(/\s*\(.*?\)/g, "").trim();

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
      const response = await postJsonApi(
        `profile/update`,
        {
          username: username,
          mobile: phoneNumber,
          email: email,
        },
        token
      );
      setUserProfile(response.data);
    } catch (error) {
      console.error(error.message, "error");
    }
  };

  const passwordReset = async () => {
    if (password !== confirmpass) alert("password should not match");
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await postJsonApi(
        `profile/passwordReset`,
        { password: password },
        token
      );
    } catch (error) {
      console.error(error.message, "error");
    }
  };

  // const handleLogout = useCallback(async () => {
  //   Alert.alert("Logout", "Are you sure you want to logout?");

  //   console.log("Logout initiated");

  //   try {
  //     await AsyncStorage.removeItem("userToken");
  //     await AsyncStorage.removeItem("username");
  //     await AsyncStorage.removeItem("email");

  //     setUsername("");
  //     setEmail("");
  //     setUserProfile(null);

  //     // Navigation
  //     if (Platform.OS === "web") {
  //       router.push("/"); // For web
  //     } else {
  //       navigation.navigate("HomePage"); // For mobile
  //     }
  //   } catch (error) {
  //     console.error("Error during logout:", error);
  //   }
  // }, [navigation]);

  return (
    <View className="flex-1 justify-center items-center bg-white px-4">
      {/* Open Modal Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-blue-500 px-4 py-2 rounded"
      >
        <Text className="text-white font-semibold">Open Modal</Text>
      </TouchableOpacity>

      {/* Modal Component */}
      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-1/3 shadow-lg">
            <Text className="text-lg font-bold mb-4">Modal Title</Text>
            <Text className="mb-4 text-gray-600">
              This is the content inside the modal.
            </Text>

            <View className="items-center mt-8 ">
              <TextInput
                label="UserName"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                theme={{ colors: { primary: "teal" } }}
                style={{
                  height: "50px",
                  width: 300,
                  backgroundColor: "white",
                  marginBottom: 10,
                }}
              />
              <TextInput
                label="Bio"
                value={bio}
                onChangeText={setBio}
                mode="outlined"
                theme={{ colors: { primary: "teal" } }}
                style={{
                  height: "50px",
                  width: 300,
                  backgroundColor: "white",
                  marginBottom: 10,
                }}
              />
              <TextInput
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                theme={{ colors: { primary: "teal" } }}
                style={{
                  height: "50px",
                  width: 300,
                  backgroundColor: "white",
                  marginBottom: 10,
                  marginTop: 20,
                }}
              />
              <Mobile
                dropdownVisible={dropdownVisible}
                setDropdownVisible={setDropdownVisible}
                selectedCode={selectedCode}
                setSelectedCode={setSelectedCode}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredCountries={filteredCountries}
              />

              <View className="flex flex-row gap-4">
                <Pressable
                  onPress={() => setResetPass(true)}
                  className="my-5 bg-TealGreen h-10 items-center justify-center w-[150px] mt-12 rounded-sm"
                >
                  <Text className="text-lg font-bold text-white">
                    Reset Password
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => update()}
                  className="my-5 bg-TealGreen h-10 items-center justify-center w-[150px] mt-12 rounded-sm"
                >
                  <Text className="text-lg font-bold text-white">Update</Text>
                </Pressable>
              </View>
            </View>

            {resetPass && (
              <View className="items-center justify-center flex z-50">
                <View
                  className="bg-white flex-1 w-[370px] p-5 items-center justify-center relative"
                  style={{ marginTop: -400 }}
                >
                  {/* Close Button */}
                  <Pressable
                    onPress={() => setResetPass(false)}
                    className="absolute h-10 w-10 justify-center items-center top-2 right-2 bg-gray-200 p-2 rounded-full"
                  >
                    <Text className="text-lg font-bold text-gray-600">✕</Text>
                  </Pressable>

                  {/* Password Reset Form */}
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
            )}

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-red-500 px-4 py-2 rounded"
            >
              <Text className="text-white font-medium text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalScreen;
