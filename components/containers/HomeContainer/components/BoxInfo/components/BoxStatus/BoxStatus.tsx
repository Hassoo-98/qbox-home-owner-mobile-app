import { Chip } from "@/components";
import { Spacing } from "@/constants";
import { Image } from "expo-image";
import { Dimensions, View } from "react-native";
import { BoxStatusProps } from "./props";

const { width: screenWidth } = Dimensions.get("window");

export const BoxStatus = ({ status }: BoxStatusProps) => {
  const imageWidth = screenWidth * 0.35;

  return (
    <View
      style={{
        marginLeft: Spacing.sm,
        position: "relative",
        justifyContent: "flex-end",
        alignItems: "flex-end",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Chip label={status} variant="success" size="medium" />
      </View>

      <Image
        source={require("@/assets/images/home-locker.png")}
        style={{
          width: imageWidth,
          height: imageWidth,
          top: 15,
          right: -15,
        }}
        contentFit="cover"
      />
    </View>
  );
};
