
export interface SignupFooterProps {
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    validateStep: (step: number) => Promise<boolean>;
    onSubmit: () => void;
    contactInfo: string;
    handleSendOtp: (contact: string, onSuccess?: () => void) => void;
    handleVerifyOtp: (contact: string, otp: string, onSuccess: () => void) => void;
    isQBoxVerified: boolean;
}