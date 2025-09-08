import { useState, useCallback } from "react";
import { View, Text, Platform, Pressable } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import InputWOL from "@/components/InputWOL";

const ResetPassword = ({handlePasswordReset}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passDisplay, setPassDisplay] = useState(false);

  const handleChange = useCallback((key, value) => {
    if (key === "password") setPassword(value);
    else if (key === "confirmPassword") setConfirmPassword(value);
  }, []);

  return (
    <View className="h-fit w-full">
      <Text className="lg:text-2xl text-xl font-bold mx-auto text-TealGreen mb-10">
        Create Your Password
      </Text>

      {[
        {
          key: "password",
          label: "Password",
          placeholder: "Enter Your Password",
          value: password,
          error:
            password.length > 0 &&
            (password.length < 8 || password !== confirmPassword),
        },
        {
          key: "confirmPassword",
          label: "Confirm Password",
          placeholder: "Confirm Your Password",
          value: confirmPassword,
          error:
            confirmPassword.length > 0 &&
            (confirmPassword.length < 8 || confirmPassword !== password),
        },
      ].map((field) => (
        <View key={field.key} className="relative mb-4">
          <InputWOL
            placeholder={field.placeholder}
            label={field.label}
            error={field.error}
            value={field.value}
            onChangeText={(value) => handleChange(field.key, value)}
            secureTextEntry={!passDisplay}
          />
          <FontAwesome
            onPress={() => setPassDisplay(!passDisplay)}
            name={passDisplay ? "eye" : "eye-slash"}
            size={18}
            color="black"
            className="absolute right-4 bottom-7"
            style={{ zIndex: 9999 }}
          />
        </View>
      ))}

      <Pressable
        disabled={password !== confirmPassword || password.length < 8}
        onPress={() => {
          handlePasswordReset(password)
        }}
        className={`bg-TealGreen mb-8 py-4 px-4 h-max mt-10 w-48 mx-auto rounded-md ${
          password !== confirmPassword || password.length < 8
            ? "opacity-50"
            : "opacity-100"
        }`}
      >
        <Text className="text-white m-auto">Reset</Text>
      </Pressable>
    </View>
  );
};

export default ResetPassword;
