export interface OfferClaimedModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotionCode: string;
  discount: string;
  serviceProvider: string;
  expiryDate: string;
}
