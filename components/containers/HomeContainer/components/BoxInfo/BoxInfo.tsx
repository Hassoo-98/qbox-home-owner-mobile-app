import { Card, ItemInfo } from "@/components";
import { Colors, Spacing } from "@/constants";
import { BoxDetails, BoxStatus } from "./components";

export const BoxInfo = () => {
  return (
    <Card
      backgroundColor={Colors.darkGray}
      variant="filled"
      borderRadius={Spacing.sm + 4}
      style={{
        width: "100%",
      }}
    >
      <ItemInfo
        title="Box ID"
        description="AB5432"
        style={{
          padding: 0,
        }}
        leftContent={<BoxDetails address="National Address" noOfPackages={1} />}
        rightContent={<BoxStatus status="Online" />}
      />
    </Card>
  );
};
