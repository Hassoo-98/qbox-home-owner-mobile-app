import { ItemInfo } from "@/components/common";
import { Text } from "@/components/ui";
import { Colors, PACKAGE_TYPE } from "@/constants";
import { useLocale } from "@/hooks";
import { format } from "date-fns";
import { Image } from "expo-image";
import { View } from "react-native";
import { styles } from "./style";

export const PackageDetailsHeader = ({ packageData }: any) => {
  const { t } = useLocale();
  if (packageData.type === PACKAGE_TYPE.OUTGOING) {
    return <OutgoingPackageDetailsHeader data={packageData} />;
  }
  return (
    <ItemInfo
      title={packageData.courierName || t("courierName")}
      description={packageData.type === PACKAGE_TYPE.DELIVERED ? null : packageData.sender_name || t("senderName")}
      titleProps={{
        size: "md",
        style: { fontWeight: "bold", color: Colors.dark },
      }}
      descriptionProps={{ size: "sm", style: { fontWeight: "medium" } }}
      rightContent={
        <Image source={packageData.imageUrl} style={styles.packageImage} />
      }
      leftContent={
        <View>
          <Text size="sm">{`${t("lastUpdate")}: ${format(packageData.lastUpdate, "Pp")}`}</Text>
        </View>
      }
    />
  );
};

const OutgoingPackageDetailsHeader = ({ data }: any) => {
  const { t } = useLocale();

  return (
    <ItemInfo
      title={data.courierName || data.service_provider?.name || t("serviceProvider")}
      description={data.receiverName || data.receiver_home_owner?.home_owner_name || data.receiver_home_owner?.name || t("receiverName")}
      descriptionProps={{
        size: "sm",
      }}
      leftContent={
        <View>
          <Text size="sm">
            {t("emailAddress")}: {data.receiver_home_owner?.home_owner_email || data.receiverEmail || data.email || "N/A"}
          </Text>
          <Text size="sm">
            {t("phoneNumber")}: {data.receiver_home_owner?.home_owner_phone || data.receiverPhoneNumber || data.phoneNumber || "N/A"}
          </Text>
          <View style={{ marginTop: 2 }}>
            <Text size="sm">
              {`${t("lastUpdate")}: ${format(data.lastUpdate, "Pp")}`}
            </Text>
          </View>
        </View>
      }
      rightContent={<Image source={data.imageUrl} style={styles.packageImage} />}
    />
  );
};
