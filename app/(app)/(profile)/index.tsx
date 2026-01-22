import { MenuList, ProfileCard, SubscriptionCard, Text } from "@/components";
import { MENU_ITEM } from "@/constants";
import { useUserProfile } from "@/hooks/api/useAuthQueries";
import { mvs } from "@/utils/metrices";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

export const Profile = () => {
  const { data: profile, isLoading, error } = useUserProfile();


  console.log("profile", JSON.stringify(profile, null, 2));

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        alignItems: "center",
        paddingHorizontal: mvs(20),
        paddingBottom: mvs(30),
      }}
    >
      <ProfileCard
        name={profile?.full_name}
        email={profile?.email}
        phone={profile?.phone}
        imageUri={profile?.avatar}
      />

      <SubscriptionCard />

      <MenuList menuData={MENU_ITEM} />

      <Text variant="secondary" size="xs" style={{ marginVertical: mvs(20) }}>
        Developed and Maintained by REPLA Technologies PVT Ltd
      </Text>
    </ScrollView>
  );
};

export default Profile;
