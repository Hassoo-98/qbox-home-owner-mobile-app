import { ProfileItem } from "@/types";

 export interface MenuListProps {
    menuData: ProfileItem[];
    onItemPress?: (item: ProfileItem) => boolean | Promise<boolean>;
  }
  
