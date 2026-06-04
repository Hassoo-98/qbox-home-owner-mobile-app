import { Control, UseFormSetValue } from "react-hook-form";
import { PaymentMethodItem } from "@/services/api/types";

export interface DeliveryInformationProps {
  control: Control<any, any, any>;
  setValue: UseFormSetValue<any>;
  paymentMethods: PaymentMethodItem[];
}
