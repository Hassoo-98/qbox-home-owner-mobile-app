
export interface SignupFooterProps {
    currentStep: number,
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
    isFormValid: boolean,
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>,
    phoneNumber: string,
    handleSendOtp: (contact: string, onSuccess?: () => void) => void,
    handleVerifyOtp: (contact: string, otp: string, onSuccess: () => void) => void
}