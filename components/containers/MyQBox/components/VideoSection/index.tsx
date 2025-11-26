// components/VideoSection.tsx
import { VedioRecording } from "@/components";
import { Feather } from "@expo/vector-icons";

interface VideoSectionProps {
  type: "external" | "internal";
  player: any;
  date: Date;
  onShare: () => void;
  onCalendarPress: () => void;
  formatDate: (date: Date) => string;
}

export const VideoSection = ({
  type,
  player,
  date,
  onShare,
  onCalendarPress,
  formatDate,
}: VideoSectionProps) => {
  const title =
    type === "external" ? "External QBox View" : "Internal QBox View";

  return (
    <VedioRecording
      player={player}
      onShare={onShare}
      onDownload={() => console.log("Download")}
      autoPlay={true}
      header={{
        title,
        subtitle: formatDate(date),
        rightIcon: <Feather name="calendar" size={20} />,
        onRightIconPress: onCalendarPress,
      }}
    />
  );
};
