import { Control } from "react-hook-form";

export interface PackageReportFormValues {
  trackingId: string;
  issueRelatedTo: string;
  reportDescription: string;
}

export interface PackageReportModalProps {
  isReportModalOpen?: boolean;
  onCloseReportModal?: () => void;
  control: Control<PackageReportFormValues, any, PackageReportFormValues>;
  onSubmitReport: (e?: React.BaseSyntheticEvent) => Promise<void>;
}
