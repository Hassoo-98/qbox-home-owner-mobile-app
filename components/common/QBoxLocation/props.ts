import { Control } from "react-hook-form";

export interface QBoxLocationProps {
  control: Control<any, any, any>;
  qboxImage: string;
  pickImage: () => Promise<void>;
}
