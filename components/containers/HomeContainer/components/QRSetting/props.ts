import { QRGenerationFormValues } from "@/types";
import { Control } from "react-hook-form";

export interface QRSettingProps {
  isGenerating: boolean;
  isSharing: boolean;
  isQrCodeGenerated: boolean;
  onGenerateQR: () => void;
  resetForm: () => void;
  control: Control<QRGenerationFormValues, any, QRGenerationFormValues>;
  boxId: string;
  address: string;
  image: string;
  qrCodeImage: string;
  qrCodeName: string;
  onShareQrCard: () => void;
}
