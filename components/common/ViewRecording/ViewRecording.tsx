// components/VedioRecording.tsx
import { Button } from "@/components";
import { Colors } from "@/constants";
import { Feather, Ionicons } from "@expo/vector-icons";
import { VideoPlayer, VideoView } from "expo-video";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");
const VIDEO_HEIGHT = (width - 40) * (9 / 16); // 16:9

interface VedioRecordingProps {
  player: VideoPlayer;
  onShare?: () => void;
  onDownload?: () => void;
  autoPlay?: boolean;
  style?: object;
}

export const VedioRecording = ({
  player,
  onShare,
  onDownload,
  autoPlay = true,
  style,
}: VedioRecordingProps) => {
  // Auto-play when component mounts or player changes
  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => player.play(), 200);
      return () => clearTimeout(timer);
    }
  }, [player, autoPlay]);

  return (
    <View style={[styles.container, style]}>
      {/* Video */}
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        allowsFullscreen
        allowsPictureInPicture
      />

      {/* Share & Download Buttons at Bottom */}
      <View style={styles.bottomActions}>
        <Button
          style={{
            width: "48%",
            borderColor: Colors.inActive,
            backgroundColor: "transparent",
          }}
          onPress={onShare}
          title="Share"
          icon={<Ionicons name="share-social-outline" size={20} />}
          variant="default"
          size="sm"
        />
        <Button
          style={{
            width: "48%",
            borderColor: Colors.inActive,
            backgroundColor: "transparent",
          }}
          onPress={onDownload}
          title="Download"
          icon={<Feather name="download" size={20} />}
          variant="default"
          size="sm"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: VIDEO_HEIGHT,
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "transparent",
    borderColor: "#444",
  },
});
