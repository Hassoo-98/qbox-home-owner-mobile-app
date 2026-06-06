import { CustomDropdown } from "@/components/ui/Dropdown";
import { useLocale, useProfile } from "@/hooks";
import { mvs } from "@/utils/metrices";
import { router } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";

export const AppLanguage = () => {
  const { setOnSave } = useProfile();
  const { locale, setLocale, t } = useLocale();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      language: locale,
    },
  });

  useEffect(() => {
    reset({ language: locale });
  }, [locale, reset]);

  const onSubmit = handleSubmit(async (data) => {
    await setLocale(data.language === "ar" ? "ar" : "en");
    router.dismiss();
  });

  useEffect(() => {
    setOnSave(() => onSubmit);

    return () => setOnSave(null);
  }, [onSubmit, setOnSave]);

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        padding: mvs(20),
      }}
    >
      <CustomDropdown
        name="language"
        control={control}
        label={t("language")}
        placeholder={t("selectLanguage")}
        options={[
          { label: t("english"), value: "en" },
          { label: t("arabic"), value: "ar" },
        ]}
        containerStyle={{ width: "100%" }}
      />
    </ScrollView>
  );
};

export default AppLanguage;
