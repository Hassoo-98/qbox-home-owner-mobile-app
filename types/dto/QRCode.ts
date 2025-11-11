import { QR_VALIDITY_DURATION_TYPE } from "@/constants";

export type QRCode = {
  id: number;
  title: string;
  isActive: boolean;
  createdAt: string;
  validityDuration: number;
  validityDurationType: QR_VALIDITY_DURATION_TYPE;
  maxUsers: number;
};
