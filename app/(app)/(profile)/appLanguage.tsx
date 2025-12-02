import { SelectField } from "@/components";
import { useProfile } from "@/hooks/useProfile";
import { mvs } from "@/utils/metrices";
import { router } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";

export const AppLanguage = () => {
  const { setOnSave } = useProfile();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      language: "",
    },
  });
  const onSubmit = handleSubmit((data) => {
    console.log("this is language", JSON.stringify(data, null, 4));
    router.dismiss();
  });

  useEffect(() => {
    setOnSave(() => onSubmit);

    return () => setOnSave(null);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        padding: mvs(20),
      }}
    >
      <SelectField
        name="language"
        control={control}
        label="Language"
        placeholder="Select Language"
        options={[
          { label: "English", value: "en" },
          { label: "Urdu", value: "ur" },
          { label: "Arabic", value: "ar" },
        ]}
      />
    </ScrollView>
  );
};

export default AppLanguage;
