import { QRCode } from "@/types";

export interface QRCodeHistoryItemProps {
  item: QRCode;
  onShare?: (item: QRCode) => void;
  onMarkAsExpire?: (item: QRCode) => void;
}

export interface SwipeableRef {
  close: () => void;
  openLeft: () => void;
  openRight: () => void;
  reset: () => void;
}
