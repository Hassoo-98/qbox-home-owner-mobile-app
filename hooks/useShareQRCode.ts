import { useState } from "react";
import { Alert } from "react-native";

import {
  QRCodeShareError,
  shareQRCode as shareQRCodeFile,
} from "@/utils/shareQRCode";
import type { ShareQRCodeParams } from "@/utils/shareQRCode";

const resolveFriendlyMessage = (error: unknown) => {
  if (error instanceof QRCodeShareError) {
    switch (error.code) {
      case "network_failure":
        return "We couldn't download the QR code. Check your internet connection and try again.";
      case "http_error":
        return "The QR code image could not be loaded right now. Please try again later.";
      case "invalid_image_response":
        return "The server returned an invalid QR code image.";
      case "sharing_unavailable":
        return "Sharing is not available on this device.";
      case "sharing_failed":
        return "We couldn't open the share sheet. Please try again.";
      default:
        return "Unable to share the QR code. Please try again.";
    }
  }

  return "Unable to share the QR code. Please try again.";
};

export const useShareQRCode = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareQRCode = async (params: ShareQRCodeParams) => {
    setIsSharing(true);
    setError(null);

    try {
      return await shareQRCodeFile(params);
    } catch (error) {
      const message = resolveFriendlyMessage(error);
      setError(message);
      Alert.alert("Share QR Code", message);
      throw error;
    } finally {
      setIsSharing(false);
    }
  };

  const clearError = () => setError(null);

  return {
    shareQRCode,
    isSharing,
    error,
    clearError,
  };
};
