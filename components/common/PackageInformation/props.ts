import { Control } from "react-hook-form";

export interface PackageInformationProps {
  control: Control<any, any, any>;
  packageImage: string;
  pickImage: () => Promise<void>;
}
