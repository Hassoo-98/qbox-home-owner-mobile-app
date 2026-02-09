import { Card, ItemInfo } from "@/components";
import { Colors, Spacing } from "@/constants";
import { BoxDetails, BoxStatus } from "./components";

export const BoxInfo = ({
  boxId,
  address,
  packageCount,
  status,
}: {
  boxId: string;
  address: string;
  packageCount: number;
  status: string;
}) => {
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
        description={boxId}
        style={{
          padding: 0,
        }}
        leftContent={<BoxDetails address={address} noOfPackages={packageCount} />}
        rightContent={<BoxStatus status={status} />}
      />
    </Card>
  );
};
