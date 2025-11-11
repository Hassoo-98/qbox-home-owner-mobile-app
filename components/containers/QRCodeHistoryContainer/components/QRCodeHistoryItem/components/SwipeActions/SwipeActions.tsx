import { HapticPressable, Text } from "@/components";
import { TouchableOpacity } from "react-native";
import Reanimated from "react-native-reanimated";
import { SwipeActionsProps } from "./props";
import { styles } from "./styles";

export const SwipeActions = ({
  handleShare,
  handleMarkAsExpire,
}: SwipeActionsProps) => {
  return (
    <Reanimated.View style={[styles.actionsContainer]}>
      <HapticPressable
        onPress={handleShare}
        style={[styles.actionButton, styles.shareButton]}
      >
        <Text
          variant="primary"
          size="xs"
          style={{
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Share
        </Text>
      </HapticPressable>
      <TouchableOpacity
        onPress={handleMarkAsExpire}
        style={[styles.actionButton, styles.expireButton]}
      >
        <Text
          size="xs"
          style={{
            color: "#E2464A",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Mark as expire
        </Text>
      </TouchableOpacity>
    </Reanimated.View>
  );
};

export default SwipeActions;
