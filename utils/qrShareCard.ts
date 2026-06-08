import * as FileSystem from "expo-file-system/legacy";
import { HomeOwner } from "@/services/api/types";
import { Platform, Share } from "react-native";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const XLINK_NAMESPACE = "http://www.w3.org/1999/xlink";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const resolveAddressLines = (address?: HomeOwner["address"]) => {
  if (!address) {
    return ["Address not available"];
  }

  return [
    address.short_address && `Short address: ${address.short_address}`,
    address.street && `Street: ${address.street}`,
    address.district && `District: ${address.district}`,
    address.city && `City: ${address.city}`,
    address.region && `Region: ${address.region}`,
    address.postal_code && `Postal code: ${address.postal_code}`,
    address.building_number && `Building number: ${address.building_number}`,
    address.additional_number && `Additional number: ${address.additional_number}`,
    address.latitude && `Latitude: ${address.latitude}`,
    address.longitude && `Longitude: ${address.longitude}`,
  ].filter((line): line is string => Boolean(line));
};

const resolveQrMimeType = (uri: string) => {
  const lowered = uri.toLowerCase();

  if (lowered.endsWith(".jpg") || lowered.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (lowered.endsWith(".webp")) {
    return "image/webp";
  }

  return "image/png";
};

const downloadImageAsBase64 = async (uri: string) => {
  const targetPath = `${FileSystem.cacheDirectory}qbox-qr-${Date.now()}.img`;
  const downloaded = await FileSystem.downloadAsync(uri, targetPath);
  return {
    base64: await FileSystem.readAsStringAsync(downloaded.uri, {
      encoding: FileSystem.EncodingType.Base64,
    }),
    mimeType: resolveQrMimeType(uri),
  };
};

const buildCardSvg = async ({
  qrImageUrl,
  ownerName,
  address,
  boxId,
}: {
  qrImageUrl: string;
  ownerName: string;
  address?: HomeOwner["address"];
  boxId?: string;
}) => {
  const { base64, mimeType } = await downloadImageAsBase64(qrImageUrl);
  const addressLines = resolveAddressLines(address);
  const qrLines = addressLines
    .map((line, index) => {
      const y = 540 + index * 54;
      return `<text x="110" y="${y}" fill="#1B1B1B" font-size="32" font-family="Arial, Helvetica, sans-serif">${escapeXml(line)}</text>`;
    })
    .join("");

  const ownerLine = escapeXml(ownerName || "Home Owner");
  const boxLine = escapeXml(boxId || "QBox");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="${SVG_NAMESPACE}" xmlns:xlink="${XLINK_NAMESPACE}" width="1080" height="1500" viewBox="0 0 1080 1500">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="20" flood-color="#000000" flood-opacity="0.12" />
    </filter>
  </defs>
  <rect width="1080" height="1500" fill="#F8F5F0" />
  <rect x="64" y="64" width="952" height="1372" rx="42" fill="#FFFFFF" filter="url(#shadow)" />
  <rect x="64" y="64" width="952" height="210" rx="42" fill="#0E2A47" />
  <text x="110" y="150" fill="#FFFFFF" font-size="34" font-family="Arial, Helvetica, sans-serif" letter-spacing="2">QBOX ACCESS QR CODE</text>
  <text x="110" y="205" fill="#FFFFFF" font-size="58" font-weight="700" font-family="Arial, Helvetica, sans-serif">${ownerLine}</text>
  <text x="110" y="282" fill="#0E2A47" font-size="32" font-weight="700" font-family="Arial, Helvetica, sans-serif">${boxLine}</text>
  <rect x="345" y="360" width="390" height="390" rx="34" fill="#FFFFFF" stroke="#D9D9D9" stroke-width="4" />
  <image x="375" y="390" width="330" height="330" preserveAspectRatio="xMidYMid meet" href="data:${mimeType};base64,${base64}" />
  <rect x="110" y="820" width="860" height="450" rx="34" fill="#F9FAFB" />
  <text x="150" y="890" fill="#0E2A47" font-size="34" font-weight="700" font-family="Arial, Helvetica, sans-serif">Address Details</text>
  ${qrLines}
  <text x="540" y="1360" text-anchor="middle" fill="#6B7280" font-size="28" font-family="Arial, Helvetica, sans-serif">Share this image with delivery partners or trusted contacts</text>
</svg>`;
};

export const shareQrCardImage = async ({
  qrImageUrl,
  ownerName,
  address,
  boxId,
}: {
  qrImageUrl: string;
  ownerName: string;
  address?: HomeOwner["address"];
  boxId?: string;
}) => {
  const svg = await buildCardSvg({
    qrImageUrl,
    ownerName,
    address,
    boxId,
  });

  const fileUri = `${FileSystem.cacheDirectory}qbox-share-${Date.now()}.svg`;
  await FileSystem.writeAsStringAsync(fileUri, svg, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const shareUri =
    Platform.OS === "android"
      ? await FileSystem.getContentUriAsync(fileUri)
      : fileUri;

  await Share.share({
    url: shareUri,
    message: `${ownerName || "Home Owner"} QBox access QR code`,
    title: "Share QR Code",
  });
};
