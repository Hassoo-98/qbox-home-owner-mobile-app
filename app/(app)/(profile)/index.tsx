import { MenuList, ProfileCard, ProfileSkeleton, SubscriptionCard, Text } from "@/components";
import { MENU_ITEM } from "@/constants";
import React from "react";
import { ScrollView, View } from "react-native";
import { styles } from "./styles";
import { useProfileLogic } from "./useProfileLogic";

export const Profile = () => {
  const { profile, isLoading } = useProfileLogic();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ProfileSkeleton />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <ProfileCard
        name={profile?.full_name}
        email={profile?.email}
        phone={profile?.phone}
      />

      <SubscriptionCard />

      <MenuList menuData={MENU_ITEM} />

      <Text variant="secondary" size="xs" style={styles.maintenanceText}>
        Developed and Maintained by REPLA Technologies PVT Ltd
      </Text>
    </ScrollView>
  );
};

export default Profile;
