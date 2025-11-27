import { SelectField } from "@/components";
import { mvs } from "@/utils/metrices";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";

export const AppLanguage = () => {
  const { control } = useForm({
    defaultValues: {
      AppLanguage: "",
      oldAppLanguage: "",
      comfirmAppLanguage: "",
    },
  });

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
