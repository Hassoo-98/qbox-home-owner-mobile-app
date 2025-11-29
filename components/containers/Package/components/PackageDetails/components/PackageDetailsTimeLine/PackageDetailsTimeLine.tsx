import { Text } from "@/components/ui";
import { Colors } from "@/constants";
import { View } from "react-native";
import { Row, Table } from "react-native-table-component";
import { styles } from "./style";

export const PackageDetailsTimeLine = ({
  timelineData,
}: {
  timelineData: string[][];
}) => {
  const TABLE_HEADERS = ["Date & Time", "Status", "City"];
  const TABLE_FLEX = [1.2, 1.5, 0.8];

  return (
    <View style={styles.timelineContainer}>
      <Text bold color={Colors.dark} style={styles.timelineTitle}>
        Timeline
      </Text>
      {timelineData && timelineData?.length > 0 ? (
        <View style={styles.tableContainer}>
          <Table borderStyle={styles.tableBorder}>
            <Row
              data={TABLE_HEADERS}
              style={styles.headerRow}
              textStyle={styles.headerText}
              flexArr={TABLE_FLEX}
            />
            {timelineData.map((rowData, index) => (
              <Row
                key={`timeline-${index}`}
                data={rowData}
                textStyle={styles.rowText}
                style={[
                  styles.dataRow,
                  { backgroundColor: index % 2 === 0 ? "#fff" : "#F4F5F6" },
                ]}
                flexArr={TABLE_FLEX}
              />
            ))}
          </Table>
        </View>
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text size="sm">
            The service provider didn’t created the shipment yet!
          </Text>
        </View>
      )}
    </View>
  );
};
