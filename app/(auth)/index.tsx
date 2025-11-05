import { AuthContext } from "@/context";
import { useContext } from "react";
import { Button, Text, View } from "react-native";

export const Welcome = () => {
  const { login } = useContext(AuthContext);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{"Edit app/(auth)/index.tsx to edit this screen."}</Text>
      <Button title="Login" onPress={() => login("fake_token_123")} />
    </View>
  );
};

export default Welcome;
