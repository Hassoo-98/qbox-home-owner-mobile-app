import { ItemInfo } from "@/components/common";
import { Text } from "@/components/ui";
import { Colors, PACKAGE_TYPE } from "@/constants";
import { format } from "date-fns";
import { Image } from "expo-image";
import { View } from "react-native";
import { styles } from "./style";

export const PackageDetailsHeader = ({ packageData }: any) => {
  if (packageData.type === PACKAGE_TYPE.OUTGOING) {
    return <OutgoingPackageDetailsHeader data={packageData} />;
  }
  return (
    <ItemInfo
      title={packageData.courierName}
      description={`Last update: ${format(packageData.lastUpdate, "Pp")}`}
      titleProps={{
        size: "lg",
        style: { fontWeight: "bold", color: Colors.dark },
      }}
      descriptionProps={{ size: "sm", style: { fontWeight: "medium" } }}
      rightContent={
        <Image source={packageData.imageUrl} style={styles.packageImage} />
      }
    />
  );
};

const OutgoingPackageDetailsHeader = ({ data }: any) => (
  <ItemInfo
    title="QBox ID"
    description={data.recepientName}
    descriptionProps={{ size: "sm" }}
    leftContent={
      <View>
        <Text size="sm">{`${data.phoneNumber} . ${data.email}`}</Text>
        <Text size="sm">{`Last update: ${format(data.lastUpdate, "Pp")}`}</Text>
      </View>
    }
    rightContent={<Image source={data.imageUrl} style={styles.packageImage} />}
  />
);
