import React from "react";
import { MenuItem } from "../MenuItem";
import { Props } from "./props";

export const MenuList: React.FC<Props> = ({ menuData }) => {
  return (
    <>
      {menuData.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </>
  );
};
