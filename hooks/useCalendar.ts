import * as Calendar from "expo-calendar";
import { useEffect } from "react";

export const useCalendarPermissions = () => {
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        console.log("Calendar permission not granted");
      }
    })();
  }, []);
};