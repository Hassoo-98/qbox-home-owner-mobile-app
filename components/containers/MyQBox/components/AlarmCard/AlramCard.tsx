import { Card, CustomSwitch, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet, View } from "react-native";
import { QBoxAlarmCardProps } from "./prpos";

export const QBoxAlarmCard = ({ isEnabled, onToggle, timerText, isLoading }: QBoxAlarmCardProps) => {
  return (
    <Card
      style={[
        styles.container,
        { backgroundColor: isEnabled ? Colors.lightRed : Colors.darkGray },
      ]}
      variant="filled"
      contentStyle={styles.content}
    >
        <Text style={styles.title} size="md">
          QBox Alarm
        </Text>
      <View style={styles.controlsContainer}>
        {isEnabled && <Text style={styles.timer}>{timerText || "00:00:00"}</Text>}
        <View style={styles.subControlsContainer}>
          <CustomSwitch value={isEnabled} onValueChange={onToggle} disabled={isLoading} />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: mvs(Spacing.lg),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: mvs(12),
    gap: mvs(10),
  },
  title: {
    fontWeight: "bold",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: mvs(10),
  },
  subControlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timer: {
    color: Colors.danger,
  },
});
