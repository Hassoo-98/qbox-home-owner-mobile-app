import { Href } from "expo-router";

export interface ProfileItem {
  id: number;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  path?: Href;
  rightText?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface SubscriptionHistoryItem {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  transactionId: string;
  paymentMethod: string;
  amount: string;
  currency: string;
}
