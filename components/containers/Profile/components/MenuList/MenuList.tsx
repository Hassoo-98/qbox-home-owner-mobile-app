import { useAuth } from "@/hooks";
import React from "react";
import { MenuItem } from "../MenuItem";
import { MenuListProps } from "./props";

export const MenuList = ({ menuData }: MenuListProps) => {
  const { logout } = useAuth();

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
          onPress={async () => item?.title === "Logout" && (await logout())}
        />
      ))}
    </>
  );
};
