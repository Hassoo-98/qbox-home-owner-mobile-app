import { Control, UseFormGetValues } from "react-hook-form";

export interface QBoxLocationProps {
  control: Control<any, any, any>;
  qboxImage: string;
  pickImage: () => Promise<void>;
  getValues: UseFormGetValues<any>;
  handleCheckShortAddress: (short_address: string) => void;
  isShortAddressVerified: boolean;
  isShortAddressChecking: boolean;
}
