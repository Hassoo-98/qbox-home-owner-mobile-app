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

  const qrCodeDescription = `Valid for ${item?.validforUsers} user${item?.validforUsers > 1 ? "s" : ""
    }, expires in ${item?.expiresIn}`;

  return {
    swipeableRef,
    handleShare,
    handleMarkAsExpire,
    qrCodeDescription,
  };
};
