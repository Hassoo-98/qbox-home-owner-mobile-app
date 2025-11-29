import { Button, SelectField, Text, TextInput } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { Modal, Platform, TouchableWithoutFeedback, View } from "react-native";
import { PackageReportModalProps } from "./props";
import { styles } from "./styles";

export const PackageReportModal = ({
  isReportModalOpen,
  onCloseReportModal,
  control,
  onSubmitReport,
}: PackageReportModalProps) => {
  return (
    <Modal
      visible={isReportModalOpen}
      transparent
      animationType="fade"
      onRequestClose={onCloseReportModal}
    >
      <TouchableWithoutFeedback onPress={onCloseReportModal}>
        <BlurView
          intensity={Platform.OS === "ios" ? 30 : 80}
          tint="dark"
          style={styles.blurContainer}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.reportModalContainer}>
              {/* HEADER */}
              <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                  <Ionicons name="arrow-back-outline" size={20} />
                  <Text>Report an issue</Text>
                </View>

                <TouchableWithoutFeedback onPress={onCloseReportModal}>
                  <Ionicons name="close" size={20} />
                </TouchableWithoutFeedback>
              </View>

              {/* FORM FIELDS */}
              <TextInput
                name="trackingId"
                inputMode="numeric"
                control={control}
                autoCorrect={false}
                label="Tracking ID"
                placeholder="XXXXXXXXXXXXXXX"
              />

              <SelectField
                name="reportType"
                control={control}
                label="Issue related to"
                placeholder="Select issue type"
                options={[
                  { label: "Driver", value: "driver" },
                  { label: "Sender", value: "Sender" },
                  { label: "Other", value: "other" },
                ]}
              />

              <TextInput
                name="reportDescription"
                inputMode="text"
                control={control}
                label="Issue Description"
                placeholder="Write issue description"
                multiline
                numberOfLines={4}
              />

              <Button title="Send" onPress={onSubmitReport} />
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
