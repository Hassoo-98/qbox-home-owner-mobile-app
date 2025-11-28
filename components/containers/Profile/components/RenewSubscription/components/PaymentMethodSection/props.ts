export interface PaymentMethodSectionProps {
  method: "card" | "stc";
  onMethodChange: (method: "card" | "stc") => void;
}
