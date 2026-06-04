import { RadioButton, Text, TextInput } from "@/components";
import { PaymentMethodItem } from "@/services/api/types";
import { Colors } from "@/constants";
import { mvs } from "@/utils/metrices";
import React, { useEffect, useMemo, useState } from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import { View } from "react-native";

interface PaymentSectionProps {
  control: Control<any>;
  setValue?: UseFormSetValue<any>;
  paymentMethods?: PaymentMethodItem[];
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  control,
  setValue,
  paymentMethods = [],
}) => {
  const [method, setMethod] = useState<"card" | "stc">("card");

  const activeMethods = useMemo(
    () => paymentMethods.filter((paymentMethod) => paymentMethod.is_active),
    [paymentMethods]
  );

  const cardMethod = activeMethods.find((paymentMethod) =>
    /card/i.test(paymentMethod.name)
  );
  const stcMethod = activeMethods.find((paymentMethod) =>
    /stc/i.test(paymentMethod.name)
  );

  useEffect(() => {
    if (cardMethod) {
      setMethod("card");
      setValue?.("paymentMethodId", cardMethod.id, {
        shouldDirty: false,
        shouldValidate: true,
      });
      setValue?.("paymentMethod", cardMethod.name, {
        shouldDirty: false,
        shouldValidate: true,
      });
      return;
    }

    if (stcMethod) {
      setMethod("stc");
      setValue?.("paymentMethodId", stcMethod.id, {
        shouldDirty: false,
        shouldValidate: true,
      });
      setValue?.("paymentMethod", stcMethod.name, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [cardMethod, setValue, stcMethod]);

  return (
    <View
      style={{
        paddingHorizontal: 8,
        borderTopColor: Colors.border,
        borderTopWidth: 2,
        marginTop: 16,
        paddingTop: mvs(10),
      }}
    >
      <Text bold>Payment summary</Text>

      {stcMethod && (
        <RadioButton
          title={stcMethod.name}
          subtitle={stcMethod.description}
          selected={method === "stc"}
          onPress={() => {
            setMethod("stc");
            setValue?.("paymentMethodId", stcMethod.id);
            setValue?.("paymentMethod", stcMethod.name);
          }}
        />
      )}

      {cardMethod && (
        <RadioButton
          title={cardMethod.name}
          subtitle={cardMethod.description}
          selected={method === "card"}
          onPress={() => {
            setMethod("card");
            setValue?.("paymentMethodId", cardMethod.id);
            setValue?.("paymentMethod", cardMethod.name);
          }}
        />
      )}

      {method === "card" && cardMethod && (
        <View
          style={{
            padding: mvs(20),
            backgroundColor: Colors.gray,
            borderRadius: mvs(10),
            marginTop: 16,
          }}
        >
          <TextInput
            name="cardHolderName"
            inputMode="text"
            control={control}
            autoCorrect={false}
            label="Card Holder Name"
            placeholder="Write card holder name"
          />

          <TextInput
            name="cardNumber"
            inputMode="numeric"
            control={control}
            autoCorrect={false}
            label="Card Number"
            placeholder="XXXX XXXX XXXX XXXX"
            maxLength={19}
          />

          <View style={{ flexDirection: "row", gap: 10 }}>
          <TextInput
            name="expiry"
            inputMode="numeric"
            control={control}
            label="Expiry"
            placeholder="MM/YY"
            width="48%"
            maxLength={5}
          />

            <TextInput
              name="cvv"
              inputMode="numeric"
              control={control}
              label="CVV"
              placeholder="XXX"
              width="48%"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>
      )}
    </View>
  );
};
