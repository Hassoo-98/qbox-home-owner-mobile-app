import { useContext } from "react";
import { Button, Text, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";

export const Login = () => {
  const { login } = useContext(AuthContext);

  return (
    <View style={{ flex: 1 }}>
      <Text>Login Screen</Text>
      <Button title="Login" onPress={() => login("fake_token_123")} />
    </View>
  );
};

export default Login;
