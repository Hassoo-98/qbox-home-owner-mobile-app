import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as SecureStore from "expo-secure-store";

const BACKEND_URL = "https://backend.qbox.sa";
const DEFAULT_TOKEN_KEY = "token";

export type ShareQRCodeParams = {
  qrCodeId: string;
  token?: string;
  dialogTitle?: string;
};

export type ShareQRCodeResult = {
  fileUri: string;
  mimeType: string;
};

export type QRCodeShareErrorCode =
  | "network_failure"
  | "http_error"
  | "invalid_image_response"
  | "sharing_unavailable"
  | "sharing_failed";

export class QRCodeShareError extends Error {
  code: QRCodeShareErrorCode;
  cause?: unknown;

  constructor(code: QRCodeShareErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = "QRCodeShareError";
    this.code = code;
    this.cause = cause;
  }
}

const resolveSharedImageUrl = (qrCodeId: string) =>
  `${BACKEND_URL}/qbox/qr-codes/${qrCodeId}/shared-image/`;

const resolveHeaders = async (token?: string) => {
  const resolvedToken = token ?? (await SecureStore.getItemAsync(DEFAULT_TOKEN_KEY));

  return {
    Accept: "image/*",
    ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
  };
};

const normalizeContentType = (contentType?: string | null) =>
  (contentType || "").split(";")[0].trim().toLowerCase();

const isPng = (bytes: Uint8Array) =>
  bytes.length >= 8 &&
  bytes[0] === 0x89 &&
  bytes[1] === 0x50 &&
  bytes[2] === 0x4e &&
  bytes[3] === 0x47 &&
  bytes[4] === 0x0d &&
  bytes[5] === 0x0a &&
  bytes[6] === 0x1a &&
  bytes[7] === 0x0a;

const isJpeg = (bytes: Uint8Array) =>
  bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

const isWebp = (bytes: Uint8Array) =>
  bytes.length >= 12 &&
  bytes[0] === 0x52 &&
  bytes[1] === 0x49 &&
  bytes[2] === 0x46 &&
  bytes[3] === 0x46 &&
  bytes[8] === 0x57 &&
  bytes[9] === 0x45 &&
  bytes[10] === 0x42 &&
  bytes[11] === 0x50;

const resolveImageMetadata = (contentType: string | null, bytes: Uint8Array) => {
  const normalizedContentType = normalizeContentType(contentType);

  if (isPng(bytes)) {
    return { extension: "png", mimeType: "image/png" };
  }

  if (isJpeg(bytes)) {
    return { extension: "jpg", mimeType: "image/jpeg" };
  }

  if (isWebp(bytes)) {
    return { extension: "webp", mimeType: "image/webp" };
  }

  if (
    normalizedContentType.includes("png") ||
    normalizedContentType.includes("jpeg") ||
    normalizedContentType.includes("jpg") ||
    normalizedContentType.includes("webp")
  ) {
    throw new QRCodeShareError(
      "invalid_image_response",
      "The server returned image headers, but the body was not a valid image."
    );
  }

  if (normalizedContentType.startsWith("image/")) {
    const subtype = normalizedContentType.split("/")[1] || "png";
    return {
      extension: subtype.replace("+xml", ""),
      mimeType: normalizedContentType,
    };
  }

  throw new QRCodeShareError(
    "invalid_image_response",
    "The server did not return a supported image for the QR code."
  );
};

const downloadSharedQrImage = async ({
  qrCodeId,
  token,
}: {
  qrCodeId: string;
  token?: string;
}): Promise<ShareQRCodeResult> => {
  const headers = await resolveHeaders(token);

  let response: Response;

  try {
    response = await fetch(resolveSharedImageUrl(qrCodeId), {
      method: "GET",
      headers,
    });
  } catch (error) {
    throw new QRCodeShareError(
      "network_failure",
      "We couldn't reach the QR code image service. Please check your connection and try again.",
      error
    );
  }

  if (!response.ok) {
    throw new QRCodeShareError(
      "http_error",
      `The QR code image request failed with status ${response.status}.`,
      response
    );
  }

  const contentType = response.headers.get("content-type");
  const bytes = new Uint8Array(await response.arrayBuffer());
  const { extension, mimeType } = resolveImageMetadata(contentType, bytes);

  const safeQrCodeId = qrCodeId.replace(/[^a-zA-Z0-9-_]/g, "_");
  const fileName = `qbox-shared-qr-${safeQrCodeId}-${Date.now()}.${extension}`;
  const targetFile = new FileSystem.File(FileSystem.Paths.cache, fileName);

  targetFile.write(bytes);

  return {
    fileUri: targetFile.uri,
    mimeType,
  };
};

const shareWithNativeSheet = async ({
  fileUri,
  mimeType,
  dialogTitle,
}: {
  fileUri: string;
  mimeType: string;
  dialogTitle: string;
}) => {
  const isAvailable = await Sharing.isAvailableAsync();

  if (!isAvailable) {
    throw new QRCodeShareError(
      "sharing_unavailable",
      "Sharing is not available on this device."
    );
  }

  try {
    await Sharing.shareAsync(fileUri, {
      mimeType,
      dialogTitle,
    });
  } catch (error) {
    throw new QRCodeShareError(
      "sharing_failed",
      "The native share sheet could not be opened.",
      error
    );
  }
};

export const shareQRCode = async ({
  qrCodeId,
  token,
  dialogTitle = "Share QR Code",
}: ShareQRCodeParams): Promise<ShareQRCodeResult> => {
  const downloaded = await downloadSharedQrImage({
    qrCodeId,
    token,
  });

  await shareWithNativeSheet({
    fileUri: downloaded.fileUri,
    mimeType: downloaded.mimeType,
    dialogTitle,
  });

  return downloaded;
};
