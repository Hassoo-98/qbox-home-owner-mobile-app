import { Button } from "@/components/ui";
import { Image } from "expo-image";
import React from "react";
import {
  Pressable,
  Modal as RNModal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ModalProps } from "./props";

export const Modal = ({
  icon,
  title,
  isOpen,
  onClose,
  subtitle,
  isLoading,
  primaryButtonText = "Confirm",
  primaryButtonHandler,
  secondaryButtonText,
  secondaryButtonHandler,
}: ModalProps) => {
  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === "string") {
      return (
        <View style={styles.iconContainer}>
          <Image
            source={{ uri: icon }}
            style={styles.iconImage}
            contentFit="contain"
          />
        </View>
      );
    }

    return <View style={styles.iconContainer}>{icon}</View>;
  };

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          {renderIcon()}

          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>

          <View style={styles.actions}>
            <Button
              variant="primary"
              loading={isLoading}
              title={primaryButtonText}
              onPress={primaryButtonHandler}
            />

            {secondaryButtonText && secondaryButtonHandler && (
              <Button
                variant="outline"
                loading={isLoading}
                title={secondaryButtonText}
                onPress={secondaryButtonHandler}
              />
            )}
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    padding: 32,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconImage: {
    width: 64,
    height: 64,
  },
  content: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#1a1a1a",
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
    color: "#6B6B6B",
    lineHeight: 22,
  },
  actions: {
    gap: 12,
  },
});

export default Modal;
