import {
  AppHeaderLeft,
  AppHeaderRight,
  AppHeaderTitle,
  HapticTab,
} from "@/components";
import { BOTTOM_TABS, Colors, NESTED_SCREEN_TITLES } from "@/constants";
import { useLocale } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { router, Tabs, usePathname } from "expo-router";

export const AppTabLayout = () => {
  const { t } = useLocale();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const handleQRPress = () => {
    router.navigate("/qrCodeHistory");
  };

  const handleNotificationPress = () => {
    // TODO: Implement notification navigation
  };

  const handleRefreshPress = async () => {
    if (!pathname.includes("/myQbox") && !pathname.includes("(myQbox)")) {
      return;
    }

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["homeOwner"] }),
      queryClient.invalidateQueries({ queryKey: ["qboxStreams"] }),
    ]);
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
        if (path.includes("/qrCodeHistory")) return t("qrCodeHistory");
        if (path.includes("/qrCodeDetails/")) return t("qrCodeDetails");
        if (path.includes("/basicInformation")) return t("basicInformation");
        if (path.includes("/telemetry")) return t("telemetry");
        return title;
      }
    }
    return null;
  };

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
              handleRefreshPress={handleRefreshPress}
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
              title:
                tab.id === 1
                  ? t("home")
                  : tab.id === 2
                    ? t("myQBoxLocation")
                    : tab.id === 3
                      ? t("package")
                      : t("profile"),
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
