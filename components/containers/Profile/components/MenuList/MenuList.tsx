import { useAuth } from "@/hooks";
import React from "react";
import { Linking } from "react-native";
import { MenuItem } from "../MenuItem";
import { MenuListProps } from "./props";

export const MenuList = ({ menuData }: MenuListProps) => {
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

  const handlePress = async (title: string) => {
    if (title === "Logout") {
      await logout();
    } else if (title === "Contact Us") {
      await handleContactUs();
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
          textColor={item?.textColor}
          icon={item?.icon}
          onPress={async () => handlePress(item?.title)}
        />
      ))}
    </>
  );
};
