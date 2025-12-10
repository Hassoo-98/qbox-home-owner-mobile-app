import { MenuList, ProfileCard, SubscriptionCard, Text } from "@/components";
import { MENU_ITEM } from "@/constants";
import { mvs } from "@/utils/metrices";
import React from "react";
import { ScrollView } from "react-native";

export const Profile = () => {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        alignItems: "center",
        paddingHorizontal: mvs(20),
        paddingBottom: mvs(30), // use padding instead of margin for contentContainer
      }}
    >
      <ProfileCard
        name="Ibrahim Ali"
        email="ibrahim@gmail.com"
        phone="+966 54 678 6543"
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
