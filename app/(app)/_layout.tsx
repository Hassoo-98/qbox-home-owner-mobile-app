import { AppHeaderRight, AppHeaderTitle, HapticTab } from "@/components";
import { BOTTOM_TABS, Colors } from "@/constants";
import { Tabs } from "expo-router";

export const AppTabLayout = () => {
  const handleQRPress = () => {
    console.log("QR pressed");
  };

  const handleNotificationPress = () => {
    console.log("Notification pressed");
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        headerShadowVisible: false,
        headerTitleAlign: "left",
        headerStyle: {
          backgroundColor: Colors.gray,
        },
        headerTitle({ children }) {
          return <AppHeaderTitle title={children} />;
        },
        headerRight: () => (
          <AppHeaderRight
            activeTab={route.name}
            handleQRPress={handleQRPress}
            handleNotificationPress={handleNotificationPress}
          />
        ),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.secondary,
        tabBarButton: HapticTab,
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: Colors.background || "#ffffff",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          ...(process.env.EXPO_OS === "ios" && {
            height: 60,
            paddingBottom: 8,
          }),
        },
      })}
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
