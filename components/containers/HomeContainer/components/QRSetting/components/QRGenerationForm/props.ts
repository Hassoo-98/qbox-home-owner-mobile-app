import { QR_VALIDITY_DURATION_TYPE } from "@/constants";
import { QRGenerationFormValues } from "@/types";
import { Control } from "react-hook-form";

export interface QRGenerationFormProps {
  maxUsers: string;
  isGenerating: boolean;
  resetForm: () => void;
  onGenerateQR: () => void;
  validityDuration: string;
  isQrCodeGenerated: boolean;
  validityDurationType: QR_VALIDITY_DURATION_TYPE;
  control: Control<QRGenerationFormValues, any, QRGenerationFormValues>;
}
