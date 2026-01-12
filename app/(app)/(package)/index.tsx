import { Send } from "@/assets/icons";
import { PackageList, PackageTypeModal, SegmentedControl } from "@/components";
import {
  BorderRadius,
  Colors,
  PACKAGE_TYPE,
  PACKAGES,
  PACKAGES_OPTIONS,
  Spacing,
} from "@/constants";
import { mvs } from "@/utils/metrices";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export const Package = () => {
  const [selectedPackageType, setSelectedPackageType] = useState<string>(
    PACKAGE_TYPE.INCOMING
  );
  const [searchId, setSearchId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handlePackageTypeChange = (option: string) => {
    setSelectedPackageType(option);
  };

  const handleModalConfirm = (type: "send" | "return") => {
    if (type === "send") {
      router.navigate("/sendPackage");
    } else {
      router.navigate("/returnPackage");
    }
    setModalVisible(false);
  };

  const filteredPackages = PACKAGES.filter(
    (item) =>
      item.type === selectedPackageType &&
      item.trackingId.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <SegmentedControl
        options={PACKAGES_OPTIONS}
        style={styles.segmentedControl}
        onChange={handlePackageTypeChange}
        value={selectedPackageType}
      />

      <TextInput
        style={styles.searchInput}
        placeholderTextColor={Colors.secondaryText}
        value={searchId}
        onChangeText={setSearchId}
        placeholder="Search by tracking ID"
      />

      <PackageList packages={filteredPackages} />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Send />
      </TouchableOpacity>

      <PackageTypeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleModalConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: mvs(20),
  },
  segmentedControl: {
    marginVertical: Spacing.md,
    width: "100%",
  },
  searchInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: mvs(8),
    height: mvs(40),
    padding: mvs(10),
    backgroundColor: Colors.background,
    marginBottom: mvs(Spacing.md),
  },
  fab: {
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
  },
});

export default Package;
