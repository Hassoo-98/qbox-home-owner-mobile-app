// Type for each menu item
export interface MenuItemType {
    id: number;
    icon: React.ComponentType<{ size?: number; color?: string }>;
    title: string;
    path?: string;
    rightText?: string;
    backgroundColor?: string;
    textColor?: string;
  }
  
  export interface Props {
    item: MenuItemType;
  }
  