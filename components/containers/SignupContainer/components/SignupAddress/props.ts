import { SignUpFormValues } from "@/types";
import { Control } from "react-hook-form";

export interface SignupAddressProps {
    control: Control<SignUpFormValues, any, SignUpFormValues>
    qboxImage: string
    pickImage: () => Promise<void>
}