import { Card, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StyleSheet, Switch, View } from "react-native";
import { QBoxAlarmCardProps } from "./prpos";

export const QBoxAlarmCard = ({ isEnabled, onToggle }: QBoxAlarmCardProps) => {
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
        {isEnabled && <Text style={styles.timer}>00:00:00</Text>}
        <Switch
          value={isEnabled}
          onValueChange={onToggle}
          thumbColor={isEnabled ? Colors.danger : Colors.primary}
          trackColor={{ false: Colors.white, true: Colors.white }}
          ios_backgroundColor={Colors.white}
        />
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
  },
  title: {
    fontWeight: "bold",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: mvs(20),
  },
  timer: {
    color: Colors.danger,
  },
});
