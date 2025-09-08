import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Loading from "@/components/Loading";

const roles = [
  {
    id: "recruiter",
    title: "Recruiter",
    description: "Hire verified mechanics for your business needs.",
    icon: "account-tie-outline",
  },
  {
    id: "mechanic",
    title: "Mechanic",
    description: "Grow your business by reaching more recruiters.",
    icon: "wrench-outline",
  },
];

const RoleSelection = ({
  userDetails,
  setUserDetails,
  setStep,
  isLoading = true,
}) => {
  const handleSelect = (value) => {
    setUserDetails((prev) => ({ ...prev, role: value }));
  };

  const handleNext = () => {
    if (userDetails.role) setStep(1);
  };
  return (
    <View className={`  w-full py-6 items-center rounded-md bg-white`}>
      <Text className="md:text-2xl text-xl text-TealGreen font-bold tracking-wide mb-8">
        What describes you best
      </Text>

      <View className="items-center w-full gap-8 justify-center " >
        {roles.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => handleSelect(item.id)}
            className={`w-[90%] p-3 py-4 rounded-xl border shadow-sm flex gap-1 items-center relative  ${
              userDetails.role === item.id
                ? "bg-TealGreen border-TealGreen"
                : "bg-white border-gray-300"
            }`}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={36}
              color={userDetails.role === item.id ? "#ffffff" : "#4B5563"}
              className="mb-1"
            />
            <Text
              className={`text-lg font-semibold ${
                userDetails.role === item.id ? "text-white" : "text-gray-800"
              }`}
            >
              {item.title}
            </Text>
            <Text
              className={`text-sm text-center mt-1 leading-tight ${
                userDetails.role === item.id ? "text-white" : "text-gray-500"
              }`}
            >
              {item.description}
            </Text>

            {userDetails.role === item.id && (
              <View className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full" />
            )}
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleNext}
        disabled={!userDetails.role || isLoading}
        className={`w-[90%]  bg-TealGreen px-6 py-3 rounded-lg mt-12 ${isLoading ? "opacity-50 cursor-not-allowed" : userDetails.role ? "opacity-100" : "opacity-50 cursor-not-allowed"} h-12`}
      >
        {isLoading ? (
          <Loading
            bgColor="#2095A2"
            gearColor="#ffffffff" // red gear
          />
        ) : (
          <Text className="text-white font-bold text-base text-center">
            Next
          </Text>
        )}
      </Pressable>
      <Pressable onPress={() => router.replace("/Login")}>
        <Text className="font-semibold text-center mt-12 mb-2 underline">
          Already have an account? Login
        </Text>
      </Pressable>

      {/* <Pressable
        onPress={() => router.replace("/Login")}
        className="bg-TealGreen w-[90%] md:w-[60%] bg-TealGreen mt-6 px-6 py-3 rounded-lg mt-12 h-12"
      >
        <Text className="text-white m-auto font-bold">Log In</Text>
      </Pressable> */}
    </View>
  );
};

export default RoleSelection;
