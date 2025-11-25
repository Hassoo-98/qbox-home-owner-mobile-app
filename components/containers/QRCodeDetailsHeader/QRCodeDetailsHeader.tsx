import { DummyQRCodeIcon } from "@/assets/icons";
import { ItemInfo, Text } from "@/components";
import { Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { format } from "date-fns";
import React from "react";
import { View } from "react-native";
import { QRCodeDetailsHeaderProps } from "./props";

export const QRCodeDetailsHeader = ({
  qrCodeData,
  qrCodeDescription,
}: QRCodeDetailsHeaderProps) => {
  return (
    <>
      <ItemInfo
        title="QR Code Validity"
        description={qrCodeDescription}
        style={{
          padding: 0,
        }}
        descriptionProps={{
          size: "md",
        }}
        rightContent={
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <DummyQRCodeIcon height={80} width={80} />
          </View>
        }
        leftContent={
          <View>
            <Text
              size="sm"
              style={{
                marginBottom: Spacing.sm,
              }}
            >
              {format(qrCodeData?.createdAt, "Pp")}
            </Text>
            <Text
              size="sm"
              style={{
                marginBottom: Spacing.sm,
              }}
            >
              Left users: {" " + qrCodeData?.usersLeft}
            </Text>
          </View>
        }
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: Spacing.sm,
          marginBottom: mvs(Spacing.md),
        }}
      >
        <Text size="lg" style={{ fontWeight: "bold" }}>
          QR History
        </Text>
      </View>
    </>
  );
};

export default QRCodeDetailsHeader;
