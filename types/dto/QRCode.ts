
export type QRCode = {
  id: string;
  name: string;
  status: string;
  validforUsers: number;
  expiresIn: string;
  created_at: string;
};

export type QRScan = {
  id: number;
  qrCodeId: number;
  qrCodeScanTime: string;
  qrCodeScanLocation: string;
  qrCodeScanUser: string;
  openedAt: string;
  closedAt: string;
  status: string;
  videoUrl: string;
};
