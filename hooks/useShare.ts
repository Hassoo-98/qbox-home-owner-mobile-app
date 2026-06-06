import { Alert, Share } from "react-native";

export const useShare = () => {
  const onShare = async (title: string, url: string) => {
    try {
      const result = await Share.share({
        title,
        url,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared via:", result.activityType);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const copyToClipboard = async (value: string, successMessage = "Copied to clipboard") => {
    try {
      await Share.share({
        title: successMessage,
        message: value,
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return { onShare, copyToClipboard };
};
