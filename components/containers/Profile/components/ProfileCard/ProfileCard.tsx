import { Text } from "@/components/ui";
import { mvs } from "@/utils/metrices";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ProfileCardProps } from "./props";

export const ProfileCard: React.FC<ProfileCardProps> = ({
  imageUri,
  name = "Unknown",
  email = "Unknown",
  phone = "Unknown",
}) => {
  const getInitial = () => {
    if (!name) return "";

    const parts = name.trim().split(" ").filter(Boolean);
    return parts.map((p) => p.charAt(0).toUpperCase()).join("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>

        <Text size="xl" style={styles.initialsText} variant="primary">
          {getInitial()}
        </Text>
      </View>
      <Text size="lg" style={{ fontWeight: "600" }}>
        {name}
      </Text>
      <Text>{email}</Text>
      <Text size="sm" variant="secondary">
        {phone}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8EDEF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  initialsText: {
    fontWeight: "bold",
    fontSize: mvs(28),
  },
});
