import { useCallback } from "react";
import { useSendOtp, useVerifyOtp } from "@/hooks/api/useAuthQueries";
import { SendOtpPayload, VerifyOtpPayload } from "@/services/api/types";

export type VerificationChannel = "email" | "phone_number";

export type VerificationOtpPayload =
  | { email: string; otp: string }
  | { phone_number: string; otp: string };

export const useVerification = () => {
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();

  const sendOtp = useCallback(
    async (payload: SendOtpPayload) => {
      return sendOtpMutation.mutateAsync({
        ...payload,
        is_home_owner: true,
        is_forget_otp: payload.is_forget_otp ?? false,
      });
    },
    [sendOtpMutation]
  );

  const verifyOtp = useCallback(
    async (payload: VerificationOtpPayload) => {
      const nextPayload: VerifyOtpPayload = {
        ...payload,
        is_home_owner: true,
        is_forget_otp: false,
        otp: payload.otp,
      };

      return verifyOtpMutation.mutateAsync(nextPayload);
    },
    [verifyOtpMutation]
  );

  return {
    sendOtp,
    verifyOtp,
    isSendingOtp: sendOtpMutation.isPending,
    isVerifyingOtp: verifyOtpMutation.isPending,
  };
};
