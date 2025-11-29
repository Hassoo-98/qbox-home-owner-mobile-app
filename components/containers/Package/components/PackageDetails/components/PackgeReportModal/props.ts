import { Control } from "react-hook-form";

export interface PackageReportModalProps {
  isReportModalOpen?: boolean;
  onCloseReportModal?: () => void;
  control: Control<any, any, any>;
  onSubmitReport: (e?: React.BaseSyntheticEvent) => Promise<void>;
}
