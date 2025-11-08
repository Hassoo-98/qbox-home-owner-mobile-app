import { Stepper, Text } from "@/components";
import { Spacing } from "@/constants";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthScreenLayoutProps } from "./props";

export const AuthScreenLayout = ({
  title,
  description,
  children,
  headerContent,
  currentStep,
  totalSteps,
  style,
  stepperStyle,
}: AuthScreenLayoutProps) => {
  return (
    <SafeAreaView
      edges={{ top: "off", bottom: "additive" }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{ paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl }}
          >
            {currentStep && totalSteps && (
              <Stepper
                totalSteps={totalSteps}
                currentStep={currentStep}
                height={6}
                style={stepperStyle ? stepperStyle : {}}
              />
            )}
            <Text size="xl" style={{ fontWeight: "bold" }}>
              {title}
            </Text>
            <Text size="md" variant="secondary">
              {description}
            </Text>
            {headerContent}
          </View>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreenLayout;
