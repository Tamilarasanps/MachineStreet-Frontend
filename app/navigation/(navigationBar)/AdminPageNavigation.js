import AdminHomePage from "@/app/AdminFolder/AdminHomePage";
import BannerUpload from "@/app/AdminFolder/BannerUpload";
import CategoryManager from "@/app/AdminFolder/CategoryManager";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function AdminPageNavigation() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="AdminHomePage"
        component={AdminHomePage}
        options={{ title: "AdminHomePage" }}
      />
      <Stack.Screen
        name="CategoryManager"
        component={CategoryManager}
        options={{ title: "CategoryManager" }}
      />
      <Stack.Screen
        name="BannerUpload"
        component={BannerUpload}
        options={{ title: "BannerUpload" }}
      />
    </Stack.Navigator>
  );
}
