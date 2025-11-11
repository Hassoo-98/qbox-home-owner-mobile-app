import { QR_VALIDITY_DURATION_TYPE } from "@/constants";
import { useRef } from "react";
import { QRCodeHistoryItemProps, SwipeableRef } from "../props";

export const useData = ({
  item,
  onShare,
  onMarkAsExpire,
}: QRCodeHistoryItemProps) => {
  const swipeableRef = useRef<SwipeableRef>(null);

  const handleShare = () => {
    console.log("Share QR Code:", item.id);
    onShare?.(item);
    swipeableRef.current?.close();
  };

  const handleMarkAsExpire = () => {
    console.log("Mark as expire:", item.id);
    onMarkAsExpire?.(item);
    swipeableRef.current?.close();
  };

  const qrCodeDescription = `Valid for ${item?.maxUsers} user${
    item?.maxUsers > 1 ? "s" : ""
  }, expires in ${item?.validityDuration} ${
    item?.validityDurationType === QR_VALIDITY_DURATION_TYPE.MIN
      ? "minute"
      : item?.validityDurationType === QR_VALIDITY_DURATION_TYPE.HOUR
      ? "hour"
      : "day"
  }${item?.validityDuration > 1 ? "s" : ""}`;

  return {
    swipeableRef,
    handleShare,
    handleMarkAsExpire,
    qrCodeDescription,
  };
};
