export interface ReturnPackageFooterProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isFormValid: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}
