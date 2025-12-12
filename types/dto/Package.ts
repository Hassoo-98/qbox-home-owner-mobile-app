import { PACKAGE_TYPE } from "@/constants";

export interface PackageAttribute {
  type: string;
  value: string;
}

export interface PaymentCharge {
  key: string;
  value: number;
}

export interface PaymentSummary {
  paymentMethod: string;
  charges: PaymentCharge[];
  currency: string;
}

export interface PackageBase {
  id: number;
  trackingId: string;
  type: PACKAGE_TYPE;
  courierName: string;
  lastUpdate: string; // ISO string
  qrCode: string;
  description: string;
  imageUrl: any; // require() returns any
  attributes: PackageAttribute[];
}

export interface IncomingPackage extends PackageBase {
  type: PACKAGE_TYPE.INCOMING;
}

export interface OutgoingPackage extends PackageBase {
  type: PACKAGE_TYPE.OUTGOING;
  status: "Send" | "Return";
  phoneNumber: string;
  email: string;
  recepientName: string;
  paymentSummary?: PaymentSummary; // Only required when "Send"
}

export interface DeliveredPackage extends PackageBase {
  type: PACKAGE_TYPE.DELIVERED;
}

export type PackageDetailsType =
  | IncomingPackage
  | OutgoingPackage
  | DeliveredPackage;
