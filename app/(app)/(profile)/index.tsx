import { Text } from "@/components";
import {
  MenuList,
  ProfileCard,
  SubscriptionCard,
} from "@/components/containers/Profile";
import { MENU_ITEM } from "@/constants";
import { mvs } from "@/utils/metrices";
import React from "react";
import { ScrollView } from "react-native";

export const Profile = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        paddingHorizontal: mvs(20),
        marginBottom: mvs(50),
      }}
    >
      <ProfileCard
        name="Ibrahim Ali"
        email="ibrahim@gmail.com"
        phone="+966 54 678 6543"
      />

      <SubscriptionCard />

      <MenuList menuData={MENU_ITEM} />

      <Text variant="secondary" size="xs" style={{ marginVertical: mvs(10) }}>
        Developed and Maintained by REPLA Technologies PVT Ltd
      </Text>
    </ScrollView>
  );
};

export default Profile;
