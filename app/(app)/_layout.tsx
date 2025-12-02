import {
  AppHeaderLeft,
  AppHeaderRight,
  AppHeaderTitle,
  HapticTab,
} from "@/components";
import { BOTTOM_TABS, Colors, NESTED_SCREEN_TITLES } from "@/constants";
import { router, Tabs, usePathname } from "expo-router";

export const AppTabLayout = () => {
  const pathname = usePathname();

  console.log("pathname", pathname);

  const handleQRPress = () => {
    router.navigate("/qrCodeHistory");
    console.log("QR pressed");
  };

  const handleNotificationPress = () => {
    console.log("Notification pressed");
  };

  // Check if current pathname is a nested screen
  const isNestedScreen = Object.keys(NESTED_SCREEN_TITLES).some((path) =>
    pathname.includes(path)
  );

  const shouldShowTabBar = ["/", "/myQbox", "/profile", "/package"].includes(
    pathname
  );

  // Get dynamic title for nested screens
  const getScreenTitle = () => {
    for (const [path, title] of Object.entries(NESTED_SCREEN_TITLES)) {
      if (pathname.includes(path)) {
        return title;
      }
    }
    return null;
  };

  const isHomeScreen = pathname === "/";

  console.log("is home screen: ", isHomeScreen);

  return (
    <Tabs
      screenOptions={({ route: { name: routeName } }) => ({
        headerShown: shouldShowTabBar,
        headerShadowVisible: false,
        headerTitleAlign: "left",
        headerStyle: {
          backgroundColor: Colors.gray,
        },
        headerTitle({ children }) {
          const title = getScreenTitle() || children;
          return <AppHeaderTitle title={title} />;
        },
        headerLeft: () => <AppHeaderLeft canGoBack={isNestedScreen} />,
        headerRight: () => {
          return (
            <AppHeaderRight
              activeTab={routeName}
              handleQRPress={handleQRPress}
              handleNotificationPress={handleNotificationPress}
            />
          );
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.secondary,
        tabBarButton: HapticTab,
        tabBarStyle: shouldShowTabBar
          ? {
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
            }
          : {
              display: "none",
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
              ...(tab?.isBottomTab
                ? {
                    tabBarIcon: ({ focused }) => {
                      const { Icon, IconOutline } = tab;
                      return focused ? (
                        <Icon width={24} height={24} />
                      ) : (
                        <IconOutline width={24} height={24} />
                      );
                    },
                  }
                : {
                    href: null,
                  }),
            }}
          />
        ))}
    </Tabs>
  );
};

export default AppTabLayout;
