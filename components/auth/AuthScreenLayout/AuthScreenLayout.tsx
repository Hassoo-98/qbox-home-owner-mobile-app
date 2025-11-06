import { Text } from "@/components";
import { Spacing } from "@/constants";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthScreenLayoutProps } from "./props";

export const AuthScreenLayout = ({
  title,
  description,
  children,
  headerContent,
  style,
}: AuthScreenLayoutProps) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: Spacing.xl }}>
        <Text size="xl" style={{ fontWeight: "bold" }}>
          {title}
        </Text>
        <Text size="md" variant="secondary">
          {description}
        </Text>
        {headerContent}
      </View>
      {children}
    </SafeAreaView>
  );
};

export default AuthScreenLayout;
