import { QR_VALIDITY_DURATION_TYPE } from "@/constants";

export type QRGenerationFormValues = {
  qrName?: string;
  maxUsers: string;
  validityDuration: string;
  validityDurationType: QR_VALIDITY_DURATION_TYPE;
};
