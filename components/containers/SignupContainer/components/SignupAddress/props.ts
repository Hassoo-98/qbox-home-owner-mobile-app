import { Control } from "react-hook-form";

export interface SignupAddressProps {
  control: Control<any, any, any>;
  qboxImage: string;
  pickImage: () => Promise<void>;
}
