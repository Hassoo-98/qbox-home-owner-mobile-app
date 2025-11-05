import { AuthContext } from "@/context";
import { useContext } from "react";
import { Button, Text, View } from "react-native";

export const Home = () => {
  const { logout } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>

      <Button title="Logout" onPress={() => logout()} />
    </View>
  );
};

export default Home;
