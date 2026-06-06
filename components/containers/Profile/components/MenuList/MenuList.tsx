import { useAuth } from "@/hooks";
import { router } from "expo-router";
import React from "react";
import { Linking } from "react-native";
import { MenuItem } from "../MenuItem";
import { MenuListProps } from "./props";

export const MenuList = ({ menuData, onItemPress }: MenuListProps) => {
  const { logout } = useAuth();

  const handleContactUs = async () => {
    const phoneNumber = "+1234567890"; // Replace with your WhatsApp number
    const message = "Hello, I need assistance with QBox app.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const handlePress = async (item: MenuListProps["menuData"][number]) => {
    if (onItemPress) {
      const handled = await onItemPress(item);
      if (handled) return;
    }

    if (item.id === 7) {
      await logout();
    } else if (item.id === 6) {
      await handleContactUs();
    } else if (item.path) {
      router.navigate(item.path);
    }
  };

  return (
    <>
      {menuData.map((item) => (
        <MenuItem
          key={item.id}
          title={item?.title}
          backgroundColor={item?.backgroundColor}
          path={item?.path}
          rightText={item?.rightText}
          isBadge={item?.isBadge}
          textColor={item?.textColor}
          icon={item?.icon}
          rightElement={item?.rightElement}
          onPress={async () => handlePress(item)}
        />
      ))}
    </>
  );
};
