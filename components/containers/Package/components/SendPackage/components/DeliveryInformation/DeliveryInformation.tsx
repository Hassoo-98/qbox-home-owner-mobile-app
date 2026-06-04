import { PaymentSection } from "@/components/common";
import { CustomDropdown } from "@/components/ui/Dropdown";
import { useServiceProviderLookup } from "@/hooks/api/useShipmentQueries";
import React, { useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { View } from "react-native";
import { PackageOrderPaymentSummary } from "../PackageOrderPaymentSummary";
import { DeliveryInformationProps } from "./props";

export const DeliveryInformation = ({
  control,
  setValue,
  paymentMethods,
}: DeliveryInformationProps) => {
  const { data, isLoading } = useServiceProviderLookup();
  const shippingCompany = useWatch({ control, name: "shippingCompany" });

  const paymentSummary = useMemo(
    () => ({
      paymentMethod: "Credit Card",
      charges: [
        {
          key: "Base delivery fee (First 5 Kg's)",
          value: 5,
        },
        {
          key: "Additional per Kg",
          value: 10,
        },
        {
          key: "Tax Fuel",
          value: 5,
        },
      ],
      currency: "SAR",
    }),
    []
  );

  const shippingCompanyOptions = useMemo(
    () =>
      data?.items?.map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? [],
    [data?.items]
  );

  useEffect(() => {
    const selectedProvider = data?.items?.find(
      (item) => item.id === shippingCompany
    );

    if (!selectedProvider) {
      setValue("serviceProviderId", "", {
        shouldDirty: false,
        shouldValidate: true,
      });
      setValue("shippingCompanyName", "", {
        shouldDirty: false,
        shouldValidate: true,
      });
      return;
    }

    setValue("serviceProviderId", selectedProvider.id, {
      shouldDirty: false,
      shouldValidate: true,
    });
    setValue("shippingCompanyName", selectedProvider.name, {
      shouldDirty: false,
      shouldValidate: true,
    });
  }, [data?.items, setValue, shippingCompany]);

  useEffect(() => {
    const total = paymentSummary.charges.reduce(
      (sum, item) => sum + item.value,
      0
    );
    setValue("charges", total);
  }, [paymentSummary.charges, setValue]);

  return (
    <View>
      <CustomDropdown
        name="shippingCompany"
        control={control}
        label="Shipping Company"
        placeholder={
          isLoading ? "Loading shipping companies..." : "Choose shipping company"
        }
        options={shippingCompanyOptions}
        search
        disabled={isLoading || !shippingCompanyOptions.length}
      />

      <View>
        <PackageOrderPaymentSummary paymentSummary={paymentSummary} />
        <PaymentSection
          control={control}
          setValue={setValue}
          paymentMethods={paymentMethods}
        />
      </View>
    </View>
  );
};
