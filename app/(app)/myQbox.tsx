import { Card, Text } from "@/components";
import { Colors } from "@/constants";
import { mvs } from "@/utils/metrices";
import { useState } from "react";
import { Switch, View } from "react-native";

export const MyQBox = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Card
        contentStyle={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "90%",
          backgroundColor: isEnabled ? Colors.lightRed : Colors.darkGray,
          margin: mvs(20),
          borderRadius: mvs(12),
        }}
      >
        <Text>QBox Alram</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: mvs(20),
          }}
        >
          {isEnabled && <Text style={{ color: Colors.danger }}>00:00:00</Text>}
          <Switch
            value={isEnabled}
            onValueChange={() => setIsEnabled(!isEnabled)}
            thumbColor={isEnabled ? Colors.danger : Colors.primary}
            trackColor={{ false: Colors.white, true: Colors.white }}
            ios_backgroundColor={Colors.white}
          />
        </View>
      </Card>
    </View>
  );
};

export default MyQBox;
