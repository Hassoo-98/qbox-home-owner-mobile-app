import { PackageItemIcon } from "@/assets/icons";
import { Card, Chip, SegmentedControl, Text } from "@/components";
import {
  BorderRadius,
  Colors,
  PACKAGE_TYPE,
  PACKAGES,
  PACKAGES_OPTIONS,
  Spacing,
} from "@/constants";
import { mvs } from "@/utils/metrices";
import { format } from "date-fns";
import { useState } from "react";
import { FlatList, TextInput, View } from "react-native";

export const Package = () => {
  const [selectedPackageType, setSelectedPackageType] = useState<string>(
    PACKAGE_TYPE.INCOMING
  );
  const [searchId, setSearchId] = useState("");

  const handleAuthProviderChange = (option: string) => {
    setSelectedPackageType(option);
  };

  // Filter by type
  const filteredByType = PACKAGES.filter(
    (item) => item.type === selectedPackageType
  );

  // Filter by search
  const finalPackages = filteredByType.filter((item) =>
    item.trackingId.toLowerCase().includes(searchId.toLowerCase())
  );

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
            onPress={() => {}}
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
    </View>
  );
};

export default Package;
