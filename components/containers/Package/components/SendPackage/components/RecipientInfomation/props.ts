import { SendPackageFormValues } from "@/types";
import { Control } from "react-hook-form";

export interface RecipientInformationProps {
  control: Control<SendPackageFormValues, any, SendPackageFormValues>;
  onVerifyQBox: () => void;
  isVerifyingQBox?: boolean;
  isQBoxVerified?: boolean;
}
