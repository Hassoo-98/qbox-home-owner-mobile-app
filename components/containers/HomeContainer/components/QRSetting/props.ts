import { QRGenerationFormValues } from "@/types";
import { Control } from "react-hook-form";

export interface QRSettingProps {
  isGenerating: boolean;
  isQrCodeGenerated: boolean;
  onGenerateQR: () => void;
  resetForm: () => void;
  control: Control<QRGenerationFormValues, any, QRGenerationFormValues>;
}
