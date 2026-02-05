import { QR_VALIDITY_DURATION_TYPE } from "@/constants";
import { useOffers } from "@/hooks/api/useHomeQueries";
import { useGenerateQR } from "@/hooks/api/useQRQueries";
import { useShare } from "@/hooks/useShare";
import { QRGenerationFormValues } from "@/types";
import { QRGenerationFormResolver } from "@/utils/getValidationResolvers";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const useHomeLogic = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isQrCodeGenerated, setIsQrCodeGenerated] = useState(false);

    const { data: offersData, isLoading: offersLoading } = useOffers();
    const generateQRMutation = useGenerateQR();
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
                await generateQRMutation.mutateAsync({
                    user_id: "current_user_id", // This should come from auth context
                    locker_id: "L-101", // This should be selected or default
                    guest_name: data.qrName || "Guest",
                    valid_hours: parseInt(data.validityDuration || "1") || 1,
                });

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
    };
};
