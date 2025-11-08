import { Button, Card, ItemInfo, Text, TextInput } from "@/components";
import { Colors, QR_VALIDITY, Spacing } from "@/constants";
import { useForm } from "react-hook-form";
import { View } from "react-native";

export const QRSetting = () => {
  const { control } = useForm({
    defaultValues: {
      name: "",
      maxUsers: 0,
      validityTime: 0,
      validityUnit: QR_VALIDITY.MIN,
    },
  });

  return (
    <Card
      backgroundColor={Colors.darkGray}
      variant="filled"
      borderRadius={Spacing.sm + 4}
      style={{
        marginTop: Spacing.md,
        padding: 0,
        width: "100%",
      }}
    >
      <ItemInfo
        title="Box ID"
        description="AB5432"
        style={{
          padding: 0,
        }}
        leftContent={
          <View>
            <Text
              size="md"
              style={{
                marginBottom: Spacing.sm,
              }}
            >
              {"National Address"}
            </Text>
          </View>
        }
        rightContent={
          <View>
            <Text>Right Content</Text>
          </View>
        }
      />
      <Card
        backgroundColor={Colors.white}
        variant="filled"
        borderRadius={Spacing.sm + 4}
      >
        <Text>QR Setting</Text>
        {/* <Form> */}
        <TextInput
          control={control}
          name="name"
          placeholder="Enter QR name"
          label="QR Name (Optional)"
          required={true}
        />
        <Button variant="primary" title="Save" />
        {/* </Form> */}
      </Card>
    </Card>
  );
};
