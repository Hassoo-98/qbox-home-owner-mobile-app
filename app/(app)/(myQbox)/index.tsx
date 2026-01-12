import {
  DatePickerModal,
  QBoxAlarmCard,
  StatusCardsGrid,
  VedioRecording,
} from "@/components";
import { useShare } from "@/hooks";
import { mvs } from "@/utils/metrices";
import { Feather } from "@expo/vector-icons";
import { useCalendarPermissions } from "expo-calendar";
import { useVideoPlayer } from "expo-video";
import { useState } from "react";
import { Platform, ScrollView } from "react-native";

export const MyQBox = () => {
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
  const [externalDate, setExternalDate] = useState(new Date());
  const [internalDate, setInternalDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeVideoType, setActiveVideoType] = useState<
    "external" | "internal" | null
  >(null);

  const externalPlayer = useVideoPlayer(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    (player) => {
      player.loop = false;
      player.muted = false;
    }
  );

  const internalPlayer = useVideoPlayer(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    (player) => {
      player.loop = false;
      player.muted = false;
    }
  );

  useCalendarPermissions();
  const { onShare } = useShare();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate && activeVideoType) {
      if (activeVideoType === "external") {
        setExternalDate(selectedDate);
      } else {
        setInternalDate(selectedDate);
      }
      console.log("Selected date:", selectedDate.toLocaleDateString());
    }
  };

  const openCalendar = (type: "external" | "internal") => {
    setActiveVideoType(type);
    setShowDatePicker(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleShare = () => {
    onShare("My QBox Status", "https://myqbox.com/status/123");
  };

  const currentDate =
    activeVideoType === "external" ? externalDate : internalDate;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ alignItems: "center", paddingBottom: mvs(20) }}
    >
      <QBoxAlarmCard
        isEnabled={isAlarmEnabled}
        onToggle={() => setIsAlarmEnabled(!isAlarmEnabled)}
      />

      <StatusCardsGrid />

      <VedioRecording
        player={externalPlayer}
        onShare={handleShare}
        onDownload={() => console.log("Download external")}
        autoPlay={true}
        header={{
          title: "External QBox View",
          subtitle: formatDate(externalDate),
          rightIcon: <Feather name="calendar" size={20} />,
          onRightIconPress: () => openCalendar("external"),
        }}
      />

      <VedioRecording
        player={internalPlayer}
        onShare={handleShare}
        onDownload={() => console.log("Download internal")}
        autoPlay={true}
        header={{
          title: "Internal QBox View",
          subtitle: formatDate(internalDate),
          rightIcon: <Feather name="calendar" size={20} />,
          onRightIconPress: () => openCalendar("internal"),
        }}
      />

      <DatePickerModal
        visible={showDatePicker}
        date={currentDate}
        onClose={() => setShowDatePicker(false)}
        onChange={handleDateChange}
      />
    </ScrollView>
  );
};

export default MyQBox;
