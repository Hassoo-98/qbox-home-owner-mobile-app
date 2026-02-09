import { QR_VALIDITY_DURATION_TYPE } from "@/constants";
import { useOffers } from "@/hooks/api/useHomeQueries";
import { useCreateQRCode } from "@/hooks/api/useQRQueries";
import { useShare } from "@/hooks/useShare";
import { QRGenerationFormValues } from "@/types";
import { QRGenerationFormResolver } from "@/utils/getValidationResolvers";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useHomeOwner } from "@/hooks/useHomeOwner";

export const useHomeLogic = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isQrCodeGenerated, setIsQrCodeGenerated] = useState(false);

    const { data: offersData, isLoading: offersLoading } = useOffers();
    const { data: homeOwnerResponse, isLoading: homeOwnerLoading } = useHomeOwner();
    const homeOwner = homeOwnerResponse?.data;

    const createQRMutation = useCreateQRCode();
    const queryClient = useQueryClient();
    const { onShare } = useShare();

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
                return onShare("QR Code generated", "https://myqbox.com/status/123");
            }

            setIsGenerating(true);

            try {
                const payload = {
                    qbox_id: homeOwner?.qboxes?.[0]?.qbox_id || "DEVICE123",
                    max_users: parseInt(data.maxUsers) || 0,
                    duration_type: data.validityDurationType === QR_VALIDITY_DURATION_TYPE.DAY ? "days" :
                        data.validityDurationType === QR_VALIDITY_DURATION_TYPE.HOUR ? "hours" :
                            data.validityDurationType === QR_VALIDITY_DURATION_TYPE.MIN ? "minutes" : data.validityDurationType,
                    valid_duration: parseInt(data.validityDuration) || 1,
                    name: data.qrName || "qrcode",
                };

                await createQRMutation.mutateAsync(payload);

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
    };

    return {
        offersData,
        offersLoading,
        isGenerating,
        showSuccess,
        isQrCodeGenerated,
        control,
        handleGenerateQR,
        resetForm,
        setShowSuccess,
        homeOwner,
        homeOwnerLoading,
    };
};
