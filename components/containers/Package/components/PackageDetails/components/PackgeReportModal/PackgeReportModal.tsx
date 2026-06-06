import { Button, Text, TextInput } from "@/components/ui";
import { CustomDropdown } from "@/components/ui/Dropdown";
import { useLocale } from "@/hooks";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { Modal, Platform, Pressable, ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { PackageReportModalProps } from "./props";
import { styles } from "./styles";

export const PackageReportModal = ({
  isReportModalOpen,
  onCloseReportModal,
  control,
  onSubmitReport,
}: PackageReportModalProps) => {
  const { t } = useLocale();

  return (
    <Modal
      visible={isReportModalOpen}
      transparent
      animationType="fade"
      onRequestClose={onCloseReportModal}
    >
      <View style={styles.backdrop}>
        <BlurView
          intensity={Platform.OS === "ios" ? 35 : 85}
          tint="dark"
          style={styles.blurContainer}
        />

        <TouchableWithoutFeedback onPress={onCloseReportModal}>
          <View style={styles.scrim} />
        </TouchableWithoutFeedback>

        <View style={styles.sheetWrapper} pointerEvents="box-none">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.reportModalContainer}>
              <View style={styles.headerRow}>
                <Pressable onPress={onCloseReportModal} hitSlop={12} style={styles.headerIconButton}>
                  <Ionicons name="arrow-back-outline" size={22} color="#111827" />
                </Pressable>

                <Text bold style={styles.headerTitle}>{t("reportAnIssue")}</Text>

                <Pressable onPress={onCloseReportModal} hitSlop={12} style={styles.headerIconButton}>
                  <Ionicons name="close" size={22} color="#111827" />
                </Pressable>
              </View>

              <View style={styles.divider} />

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContent}
              >
                <TextInput
                  name="trackingId"
                  inputMode="text"
                  control={control as any}
                  autoCorrect={false}
                  label={t("trackingId")}
                  placeholder="XXXXXXXXXXXXXXX"
                  editable={false}
                  style={styles.readOnlyInput}
                />

                <CustomDropdown
                  name="issueRelatedTo"
                  control={control as any}
                  label={t("issueRelatedTo")}
                  placeholder={t("selectIssueType")}
                  options={[
                    { label: t("driver"), value: "Driver" },
                    { label: t("courier"), value: "Courier" },
                    { label: t("package"), value: "Package" },
                  ]}
                  dropdownStyle={styles.dropdown}
                />

                <TextInput
                  name="reportDescription"
                  inputMode="text"
                  control={control as any}
                  label={t("issueDescription")}
                  placeholder={t("describeIssueClearly")}
                  multiline
                  numberOfLines={5}
                  style={styles.descriptionInput}
                />

                <Button
                  title={t("send")}
                  onPress={onSubmitReport}
                  variant="primary"
                  fullWidth
                  style={styles.sendButton}
                />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Modal>
  );
};
