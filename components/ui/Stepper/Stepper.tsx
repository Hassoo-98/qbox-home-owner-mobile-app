import { Colors } from "@/constants";
import { View } from "react-native";
import { StepperProps } from "./props";
import { styles } from "./styles";

export const Stepper = ({
  totalSteps,
  currentStep,
  activeColor = Colors.primary,
  inactiveColor = Colors.inActive,
  height = 4,
  spacing = 8,
  style,
}: StepperProps) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.step,
            {
              height,
              backgroundColor:
                index < currentStep ? activeColor : inactiveColor,
              marginRight: index < totalSteps - 1 ? spacing : 0,
            },
          ]}
        />
      ))}
    </View>
  );
};

export default Stepper;
