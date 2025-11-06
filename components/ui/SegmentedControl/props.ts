export interface SegmentOption {
  label: string;
  value: string;
}

export interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  style?: any;
}
