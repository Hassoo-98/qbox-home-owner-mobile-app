export interface RenewSubscriptionFormData {
  name: string;
  phone: string;
  price: string;
  startDate: string;
  endDate: string;
  paymentMethod: "card" | "stc";
  cardHolderName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}
