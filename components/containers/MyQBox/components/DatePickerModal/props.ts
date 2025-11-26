export interface DatePickerModalProps {
    visible: boolean;
    date: Date;
    onClose: () => void;
    onChange: (event: any, selectedDate?: Date) => void;
  }