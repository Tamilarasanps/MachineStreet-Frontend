import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const EditIcon = ({ isMobile, upload,setUploadType,type}) => {
  return (
    <Pressable
      className="absolute bottom-2 right-2 bg-white items-center justify-center"
      style={{
        width: isMobile ? 40 : 50,
        height: isMobile ? 40 : 50,
        borderRadius: 25,
        elevation: 5,
      }}
      onPress={async () => {
        setUploadType(type)
        await upload(type);
      }}
    >
      <MaterialIcons name="edit" size={24} color="#2095A2" />
    </Pressable>
  );
};

export default EditIcon;
