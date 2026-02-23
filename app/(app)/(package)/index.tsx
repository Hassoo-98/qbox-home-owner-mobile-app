import { Send } from "@/assets/icons";
import { EmptyState, PackageItemSkeleton, PackageList, PackageTypeModal, SegmentedControl } from "@/components";
import {
  Colors,
  PACKAGES_OPTIONS,
} from "@/constants";
import React from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { usePackageLogic } from "./usePackageLogic";

export const Package = () => {
  const {
    selectedPackageType,
    searchId,
    modalVisible,
    isLoading,
    filteredPackages,
    setSearchId,
    setModalVisible,
    handlePackageTypeChange,
    handleModalConfirm,
  } = usePackageLogic();

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

      {isLoading ? (
        <FlatList
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => <PackageItemSkeleton />}
          showsVerticalScrollIndicator={false}
        />
      ) : !filteredPackages || filteredPackages.length === 0 ? (
        <EmptyState
          title="No Shipments Found"
          description="Your shipments will appear here once they are processed."
          iconName="cube-outline"
        />
      ) : (
        <PackageList packages={filteredPackages} type={selectedPackageType} />
      )}

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

export default Package;
