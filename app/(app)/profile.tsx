import { Button } from "@/components";
import { AuthContext } from "@/context";
import { useContext } from "react";
import { Text, View } from "react-native";

export const Profile = () => {
  const { logout } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Profile Screen</Text>
      <Button title="Logout" onPress={() => logout()} />
    </View>
  );
};

export default Profile;
