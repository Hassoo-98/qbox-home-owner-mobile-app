import { QR_VALIDITY_DURATION_TYPE } from "@/constants";
import { useOffers } from "@/hooks/api/useHomeQueries";
import { useCreateQRCode } from "@/hooks/api/useQRQueries";
import { QRGenerationFormValues } from "@/types";
import { QRGenerationFormResolver } from "@/utils/getValidationResolvers";
import { shareQrCardImage } from "@/utils/qrShareCard";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useHomeOwner } from "@/hooks/useHomeOwner";

const BACKEND_URL = "https://backend.qbox.sa";

const resolveBackendUrl = (path?: string | null) => {
    if (!path) {
        return "";
    }

    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    return `${BACKEND_URL}${path}`;
};

export const useHomeLogic = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isQrCodeGenerated, setIsQrCodeGenerated] = useState(false);
    const [qrCodeImage, setQrCodeImage] = useState("");
    const [qrCodeName, setQrCodeName] = useState("");

    const { data: offersData, isLoading: offersLoading, error: offersError } = useOffers();
    const { data: homeOwnerResponse, isLoading: homeOwnerLoading } = useHomeOwner();
    const homeOwner = homeOwnerResponse?.data;

    const createQRMutation = useCreateQRCode();
    const queryClient = useQueryClient();

    const defaultFormValues: QRGenerationFormValues = {
        qrName: "",
        maxUsers: "0",
        validityDuration: "",
        validityDurationType: QR_VALIDITY_DURATION_TYPE.MIN,
    };

    const { control, handleSubmit, reset } = useForm<QRGenerationFormValues>({
        defaultValues: defaultFormValues,
        resolver: QRGenerationFormResolver,
    });

    const handleGenerateQR = handleSubmit(
        async (data: QRGenerationFormValues) => {
            if (isQrCodeGenerated) {
                return;
            }

            setIsGenerating(true);

            try {
                const payload = {
                    qbox_id: homeOwner?.qboxes?.[0]?.qbox_id || "QB-10089912",
                    max_users: parseInt(data.maxUsers) || 1, // Default to 1 if parsing fails or is 0
                    duration_type: data.validityDurationType === QR_VALIDITY_DURATION_TYPE.DAY ? "days" :
                        data.validityDurationType === QR_VALIDITY_DURATION_TYPE.HOUR ? "hours" :
                            data.validityDurationType === QR_VALIDITY_DURATION_TYPE.MIN ? "minutes" : data.validityDurationType,
                    valid_duration: parseInt(data.validityDuration) || 1,
                    name: data.qrName || "qrcode",
                };

                const response = await createQRMutation.mutateAsync(payload);
                setQrCodeImage(resolveBackendUrl(response?.data?.qr_code_image));
                setQrCodeName(response?.data?.name || data.qrName || "qrcode");

                // Refresh home owner data to get the latest QR image
                queryClient.invalidateQueries({ queryKey: ['homeOwner'] });

                setIsGenerating(false);
                setShowSuccess(true);
                setIsQrCodeGenerated(true);

                setTimeout(() => {
                    setShowSuccess(false);
                }, 3000);
            } catch (error) {
                setIsGenerating(false);
                console.error("QR generation failed:", error);
            }
        }
    );

    const resetForm = () => {
        reset(defaultFormValues);
        setIsQrCodeGenerated(false);
        setQrCodeImage("");
        setQrCodeName("");
    };

    const handleShareQrCard = async () => {
      if (!qrCodeImage) {
        return;
      }

      try {
        await shareQrCardImage({
          qrImageUrl: qrCodeImage,
          ownerName: homeOwner?.full_name || "Home Owner",
          address: homeOwner?.address,
          boxId: homeOwner?.qboxes?.[0]?.qbox_id || "QBox",
        });
      } catch (error) {
        console.error("QR card sharing failed:", error);
      }
    };

    return {
        offersData,
        offersLoading,
        offersError,
        isGenerating,
        showSuccess,
        isQrCodeGenerated,
        qrCodeImage,
        qrCodeName,
        onShareQrCard: handleShareQrCard,
        control,
        handleGenerateQR,
        resetForm,
        setShowSuccess,
        homeOwner,
        homeOwnerLoading: homeOwnerLoading || offersLoading,
    };
};
