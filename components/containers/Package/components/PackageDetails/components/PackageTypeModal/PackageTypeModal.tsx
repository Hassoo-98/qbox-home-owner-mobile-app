import { ReturnPackageIcon, SendPackageIcon } from "@/assets/icons";
import { Button, Card, Text } from "@/components";
import { Colors } from "@/constants";
import { useLocale } from "@/hooks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { OptionCardProps, PackageTypeModalProps } from "./props";
import { styles } from "./style";

export const PackageTypeModal = ({
  visible,
  onClose,
  onConfirm,
}: PackageTypeModalProps) => {
  const { t } = useLocale();
  const [selectedType, setSelectedType] = useState<"send" | "return" | null>(
    null
  );

  const handleClose = () => {
    setSelectedType(null);
    onClose();
  };

  const handleConfirm = () => {
    if (selectedType) {
      onConfirm(selectedType);
      setSelectedType(null);
    }
  };

  const handlePackageTypeSelect = (type: "send" | "return") => {
    setSelectedType(type);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        <BlurView
          intensity={Platform.OS === "ios" ? 30 : 80}
          tint="light"
          style={styles.blurContainer}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} variant="default">
                {t("choosePackageType")}
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Description */}
            <Text variant="secondary" size="sm" style={styles.description}>
              {t("selectOneOfOptionsBelowToProceedFurther")}
            </Text>

            {/* Options */}
            <View style={styles.optionsContainer}>
              <OptionCard
                icon={
                  <SendPackageIcon
                    color={selectedType === "send" ? Colors.white : Colors.dark}
                  />
                }
                label={t("sendPackage")}
                isSelected={selectedType === "send"}
                onPress={() => handlePackageTypeSelect("send")}
              />

              <OptionCard
                icon={
                  <ReturnPackageIcon
                    color={
                      selectedType === "return" ? Colors.white : Colors.dark
                    }
                  />
                }
                label={t("returnPackage")}
                isSelected={selectedType === "return"}
                onPress={() => handlePackageTypeSelect("return")}
              />
            </View>

            {/* Confirm Button */}
            <Button
              title={t("confirm")}
              disabled={!selectedType}
              onPress={handleConfirm}
            />
          </Pressable>
        </BlurView>
      </Pressable>
    </Modal>
  );
};

const OptionCard = ({ icon, label, isSelected, onPress }: OptionCardProps) => {
  return (
    <Card
      style={[styles.optionCard, isSelected && styles.optionCardSelected]}
      onPress={onPress}
      variant="outlined"
    >
      <View style={styles.optionIconContainer}>{icon}</View>
      <Text
        size="sm"
        style={[
          styles.optionLabel,
          { color: isSelected ? Colors.white : Colors.dark },
        ]}
      >
        {label}
      </Text>
    </Card>
  );
};
