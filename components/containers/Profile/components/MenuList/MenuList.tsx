import React from "react";
import { MenuItem } from "../MenuItem";
import { MenuListProps } from "./props";

export const MenuList = ({ menuData }: MenuListProps) => {
  return (
    <>
      {menuData.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </>
  );
};
