import { Stepper, Text } from "@/components";
import { Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormLayoutProps } from "./props";

export const FormLayout = ({
  title,
  description,
  children,
  headerContent,
  currentStep,
  totalSteps,
  style,
  stepperStyle,
  footer,
}: FormLayoutProps) => {
  return (
    <SafeAreaView
      edges={{ top: "off", bottom: "additive" }}
      style={{ flex: 1 }}
    >
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          {/* Scrollable Content */}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: mvs(130) }}
          >
            <View
              style={{
                paddingHorizontal: Spacing.xl,
                paddingTop: Spacing.xl,
              }}
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
            {/* Fixed Footer */}
            {footer && (
              <View
                style={{
                  paddingHorizontal: Spacing.xl,
                  backgroundColor: "white",
                }}
              >
                {footer}
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FormLayout;
