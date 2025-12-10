import {
  PackageItemIcon,
  ReturnPackageIcon,
  Send,
  SendPackageIcon,
} from "@/assets/icons";
import { Button, Card, Chip, SegmentedControl, Text } from "@/components";
import {
  BorderRadius,
  Colors,
  PACKAGE_TYPE,
  PACKAGES,
  PACKAGES_OPTIONS,
  Spacing,
} from "@/constants";
import { mvs } from "@/utils/metrices";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const Package = () => {
  const [selectedPackageType, setSelectedPackageType] = useState<string>(
    PACKAGE_TYPE.INCOMING
  );
  const [searchId, setSearchId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<"send" | "return" | null>(
    null
  );

  const handleAuthProviderChange = (option: string) => {
    setSelectedPackageType(option);
  };

  const handlePackageTypeSelect = (type: "send" | "return") => {
    setSelectedType(type);
  };

  const handleConfirm = () => {
    if (selectedType) {
      console.log("Selected package type:", selectedType);
      // Add your logic here (e.g., navigate to next screen, create package, etc.)
      if (selectedType === "send") {
        router.navigate("/sendPackage");
      } else {
        router.navigate("/returnPackage");
      }

      setModalVisible(false);
      setSelectedType(null);
    }
  };

  // Filter by type
  const filteredByType = PACKAGES.filter(
    (item) => item.type === selectedPackageType
  );

  // Filter by search
  const finalPackages = filteredByType.filter((item) =>
    item.trackingId.toLowerCase().includes(searchId.toLowerCase())
  );

  const handleCardPress = (id: number) => {
    router.navigate(`/packageDetails/${id}`);
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: mvs(20) }}>
      <SegmentedControl
        options={PACKAGES_OPTIONS}
        style={{ marginVertical: Spacing.md, width: "100%" }}
        onChange={handleAuthProviderChange}
        value={selectedPackageType}
      />

      {/* Search Box */}
      <TextInput
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor: Colors.border,
          borderRadius: mvs(8),
          height: mvs(40),
          padding: mvs(10),
          backgroundColor: Colors.background,
          marginBottom: mvs(Spacing.md),
        }}
        placeholderTextColor={Colors.secondaryText}
        value={searchId}
        onChangeText={setSearchId}
        placeholder="Search by tracking ID"
      />

      {/* Packages List */}
      <FlatList
        data={finalPackages}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card
            variant="filled"
            style={{ marginBottom: mvs(Spacing.sm), width: "100%" }}
            onPress={() => {
              handleCardPress(item?.id);
            }}
          >
            <View style={{ flexDirection: "row", gap: mvs(12) }}>
              {/* Icon */}
              <View
                style={{
                  width: mvs(40),
                  height: mvs(40),
                  borderRadius: BorderRadius.full,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Colors.primary,
                }}
              >
                <PackageItemIcon />
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                {/* Title + City/Status */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>{item.title}</Text>

                  {/* Chip based on type */}
                  {item.type === PACKAGE_TYPE.INCOMING && item.city && (
                    <Chip label={item.city} size="medium" />
                  )}

                  {item.type === PACKAGE_TYPE.OUTGOING && item.status && (
                    <Chip
                      label={item.status}
                      size="medium"
                      variant={
                        item.status === "Send"
                          ? "warning"
                          : item.status === "Return"
                          ? "info"
                          : "default"
                      }
                    />
                  )}
                </View>

                {/* Subtitle */}
                <Text size="sm">{item.Subtitle}</Text>

                {/* Tracking ID */}
                <Text
                  variant="secondary"
                  size="sm"
                  style={{ marginTop: mvs(Spacing.sm) }}
                >
                  {item.trackingId}
                </Text>

                {/* Created Date */}
                <Text variant="secondary" size="sm">
                  {format(new Date(item.createdAt), "Pp")}
                </Text>
              </View>
            </View>
          </Card>
        )}
      />

      {/* Floating Action Button */}
      {selectedPackageType === PACKAGE_TYPE.OUTGOING && (
        <TouchableOpacity
          style={{
            width: mvs(50),
            height: mvs(50),
            borderRadius: BorderRadius.full,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.primary,
            position: "absolute",
            right: mvs(20),
            bottom: mvs(50),
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Send />
        </TouchableOpacity>
      )}

      {/* Package Type Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => {
            setModalVisible(false);
            setSelectedType(null);
          }}
        >
          <BlurView
            intensity={Platform.OS === "ios" ? 30 : 80}
            tint="light"
            style={styles.blurContainer}
          >
            <Pressable
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={{ fontWeight: "700" }} variant="default">
                  Choose Package Type
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setSelectedType(null);
                  }}
                  style={styles.closeButton}
                >
                  <Ionicons name="close-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <Text
                variant="secondary"
                size="sm"
                style={{ marginBottom: mvs(24) }}
              >
                Select one of the options below to proceed further.
              </Text>

              <View style={styles.optionsContainer}>
                <Card
                  style={[
                    styles.optionCard,
                    selectedType === "send" && styles.optionCardSelected,
                  ]}
                  onPress={() => handlePackageTypeSelect("send")}
                  variant="outlined"
                >
                  <View style={{ alignSelf: "center" }}>
                    <SendPackageIcon
                      color={
                        selectedType === "send" ? Colors.white : Colors.dark
                      }
                    />
                  </View>
                  <Text
                    style={{
                      fontWeight: "500",
                      textAlign: "center",
                      color:
                        selectedType === "send" ? Colors.white : Colors.dark,
                    }}
                  >
                    Send Package
                  </Text>
                </Card>

                <Card
                  style={[
                    styles.optionCard,
                    selectedType === "return" && styles.optionCardSelected,
                  ]}
                  onPress={() => handlePackageTypeSelect("return")}
                  variant="outlined"
                >
                  <View style={{ alignSelf: "center" }}>
                    <ReturnPackageIcon
                      color={
                        selectedType === "return" ? Colors.white : Colors.dark
                      }
                    />
                  </View>
                  <Text
                    style={{
                      fontWeight: "500",
                      textAlign: "center",
                      color:
                        selectedType === "return" ? Colors.white : Colors.dark,
                    }}
                  >
                    Return Package
                  </Text>
                </Card>
              </View>

              <Button
                title="Confirm"
                disabled={!selectedType}
                onPress={handleConfirm}
              />
            </Pressable>
          </BlurView>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  blurContainer: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: mvs(16),
    padding: mvs(20),
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: mvs(8),
  },
  closeButton: {
    padding: mvs(4),
  },
  closeButtonText: {
    fontSize: 20,
    color: Colors.secondaryText,
  },
  optionsContainer: {
    flexDirection: "row",
    gap: mvs(16),
    marginBottom: mvs(24),
  },
  optionCard: {},
  optionCardSelected: {
    backgroundColor: Colors.primary,
  },
  iconContainer: {
    width: mvs(48),
    height: mvs(48),
    borderRadius: mvs(24),
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: mvs(12),
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: mvs(8),
    paddingVertical: mvs(14),
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
});

export default Package;
