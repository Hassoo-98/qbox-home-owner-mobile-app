import { ItemInfo, Text } from "@/components";
import { Colors, Spacing } from "@/constants";
import { useLocale } from "@/hooks";
import { Image } from "expo-image";
import { mvs } from "@/utils/metrices";
import { format } from "date-fns";
import React from "react";
import { View } from "react-native";
import { QRCodeDetailsHeaderProps } from "./props";

const BACKEND_URL = "https://backend.qbox.sa";

const resolveBackendUrl = (path?: string | null) => {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${BACKEND_URL}${path}`;
};

export const QRCodeDetailsHeader = ({
  qrCodeData,
  qrCodeDescription,
}: QRCodeDetailsHeaderProps) => {
  const { t } = useLocale();

  return (
    <>
      <ItemInfo
        title={t("qrCodeValidity")}
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
              justifyContent: "center",
            }}
          >
            {qrCodeData?.qr_code_image ? (
              <Image
                source={{ uri: resolveBackendUrl(qrCodeData.qr_code_image) }}
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 8,
                  backgroundColor: Colors.white,
                }}
                contentFit="contain"
              />
            ) : (
              <View
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 8,
                  backgroundColor: Colors.border,
                }}
              />
            )}
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
              {t("leftUsers")}: {" " + qrCodeData?.usersLeft}
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
          {t("scanHistory")}
        </Text>
      </View>
    </>
  );
};

export default QRCodeDetailsHeader;
