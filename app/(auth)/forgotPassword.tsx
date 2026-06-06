import {
  Button,
  Form,
  FormLayout,
  PhoneNumberInput,
  SegmentedControl,
  Text,
  TextInput,
} from "@/components";
import { AUTH_PROVIDERS, Spacing } from "@/constants";
import { useLocale, useModal } from "@/hooks";
import {
  useSendOtpForResetPassword,
  useVerifyOtpForResetPassword,
} from "@/hooks/api/useAuthQueries";
import { ForgotPasswordFormValues } from "@/types";
import { ForgotPasswordFormResolver } from "@/utils";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";

export const ForgotPassword = () => {
  const { t } = useLocale();
  const [selectedAuthProvider, setSelectedAuthProvider] = useState<string>(
    AUTH_PROVIDERS.PHONE
  );

  const tempUidRef = useRef<string>("");
  const contactRef = useRef<string>("");

  const defaultFormValues = {
    email: "",
    phone: "",
  };

  const {
    control,
    formState: { isDirty },
    reset,
    handleSubmit,
    getValues,
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: defaultFormValues,
    resolver: ForgotPasswordFormResolver,
    mode: "onChange",
  });

  const isFormValid = isDirty;
  const { onTriggerModal } = useModal();
  const sendOtpMutation = useSendOtpForResetPassword();
  const verifyOtpMutation = useVerifyOtpForResetPassword();

  const handleVerifyOtp = (otp: string) => {
    const contact =
      selectedAuthProvider === "phone" ? getValues("phone") || "" : getValues("email") || "";
    const method = selectedAuthProvider === "phone" ? "phone" : "email";

    verifyOtpMutation.mutate(
      {
        otp,
        [method === "phone" ? "phone_number" : "email"]: contact,
      },
      {
        onSuccess: (response) => {
          const uid = response?.temp_uid || response?.data?.temp_uid || tempUidRef.current;
          router.push({
            pathname: "/resetPassword",
            params: {
              uid,
              contact,
              method,
            },
          });
        },
      }
    );
  };

  const handleSendOtp = (type: string, contact: string) => {
    const subtitle =
      type === "phone"
        ? `${t("enterSixDigitCodePhone")} ${contact}`
        : `${t("enterSixDigitCodeEmail")} ${contact}`;

    onTriggerModal({
      modalType: "otp",
      title: t("otpVerification"),
      subtitle,
      footerText: t("rememberPasswordBackTo"),
      footerAction: t("signIn"),
      isForgotPassowrd: true,
      secondaryButtonHandler: () => {
        router.dismissTo("/login");
      },
      primaryButtonHandler: (otpValue?: any) => handleVerifyOtp(otpValue as string),
    });
  };

  const onSubmit = (data: ForgotPasswordFormValues) => {
    const contact =
      selectedAuthProvider === "phone" ? data.phone || "" : data.email || "";
    const method = selectedAuthProvider === "phone" ? "phone" : "email";

    if (!contact) {
      Alert.alert(t("error"), t("emailOrPhoneRequired"));
      return;
    }

    contactRef.current = contact;

    const payload: any = {
      [method === "phone" ? "phone_number" : "email"]: contact,
      is_forget_otp: true,
      is_home_owner: true,
    };

    sendOtpMutation.mutate(payload, {
      onSuccess: (response) => {
        const uid = response?.temp_uid || response?.data?.temp_uid;
        if (uid) {
          tempUidRef.current = uid;
        }
        handleSendOtp(method, contact);
      },
    });
  };

  const handleAuthProviderChange = (option: string) => {
    setSelectedAuthProvider(option);
    reset(defaultFormValues);
  };

  return (
    <FormLayout
      title={t("forgotPasswordQuestion")}
      description={
        selectedAuthProvider === "phone"
          ? `${t("enterPhoneNumber")} ${t("otpVerification")}`
          : `${t("enterEmailAddress")} ${t("otpVerification")}`
      }
      headerContent={
        <SegmentedControl
          options={[
            { label: t("phoneNumber"), value: AUTH_PROVIDERS.PHONE },
            { label: t("emailAddress"), value: AUTH_PROVIDERS.EMAIL },
          ]}
          style={{ marginVertical: Spacing.md }}
          onChange={handleAuthProviderChange}
          value={selectedAuthProvider}
        />
      }
    >
      <Form>
        {selectedAuthProvider === "email" ? (
          <TextInput
            name="email"
            inputMode="email"
            control={control}
            label={t("emailAddress")}
            keyboardType="email-address"
            placeholder={t("enterEmailAddress")}
          />
        ) : (
          <PhoneNumberInput
            name="phone"
            control={control}
            label={t("phoneNumber")}
            placeholder="+966 XX XXX XXXX"
            defaultCode="PK"
          />
        )}

        <Button
          style={{ marginTop: Spacing.xl }}
          title={t("forgotPasswordQuestion")}
          disabled={!isFormValid}
          loading={sendOtpMutation.isPending}
          onPress={handleSubmit(onSubmit)}
        />

        <Text style={{ textAlign: "center", marginTop: Spacing.md }}>
          {t("rememberPasswordBackTo")}{" "}
          <Text
            variant="primary"
            style={{ fontWeight: "bold" }}
            onPress={() => router.dismissTo("/login")}
          >
            {t("signIn")}
          </Text>
        </Text>
      </Form>
    </FormLayout>
  );
};

export default ForgotPassword;
