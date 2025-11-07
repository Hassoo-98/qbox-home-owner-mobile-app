import { HapticTab } from "@/components";
import { BOTTOM_TABS, Colors } from "@/constants";
import { Tabs } from "expo-router";

export const AppTabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.secondary,
        tabBarButton: HapticTab,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      {BOTTOM_TABS &&
        BOTTOM_TABS?.length > 0 &&
        BOTTOM_TABS?.map((tab) => (
          <Tabs.Screen
            key={tab.id}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ focused }) => {
                const { Icon, IconOutline } = tab;
                return focused ? (
                  <Icon width={24} height={24} />
                ) : (
                  <IconOutline width={24} height={24} />
                );
              },
            }}
          />
        ))}
    </Tabs>
  );
};

export default AppTabLayout;
