import { SafeAreaView } from "react-native-safe-area-context";
import Profile from "./(tabs)/Profile";

const E2 = () => {
  return (
    <SafeAreaView className="flex-1" edges={['bottom']}>
      <Profile />
    </SafeAreaView>
  );
};

export default E2;
