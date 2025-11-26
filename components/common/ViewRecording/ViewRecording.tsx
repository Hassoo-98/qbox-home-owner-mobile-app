import { Button, Text } from "@/components";
import { Colors } from "@/constants";
import { mvs } from "@/utils/metrices";
import { Feather, Ionicons } from "@expo/vector-icons";
import { VideoPlayer, VideoView } from "expo-video";
import React, { ReactNode, useEffect } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const VIDEO_HEIGHT = (width - 100) * (9 / 16);

interface HeaderConfig {
  title: string;
  subtitle?: string;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
}

interface VedioRecordingProps {
  player: VideoPlayer;
  onShare?: () => void;
  onDownload?: () => void;
  autoPlay?: boolean;
  style?: object;
  header?: HeaderConfig;
  customHeader?: ReactNode;
}

export const VedioRecording = ({
  player,
  onShare,
  onDownload,
  autoPlay = true,
  style,
  header,
  customHeader,
}: VedioRecordingProps) => {
  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => player.play(), 200);
      return () => clearTimeout(timer);
    }
  }, [player, autoPlay]);

  const renderHeader = () => {
    if (customHeader) {
      return customHeader;
    }

    if (header) {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: mvs(8),
          }}
        >
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#000",
              }}
            >
              {header.title}
            </Text>
            {header.subtitle && (
              <Text size="sm" variant="primary">
                {header.subtitle}
              </Text>
            )}
          </View>
          {header.rightIcon && (
            <TouchableOpacity onPress={header.onRightIconPress}>
              {header.rightIcon}
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return null;
  };

  return (
    <View
      style={[
        {
          borderRadius: 16,
          width: "100%",
          padding: 20,
        },
        style,
      ]}
    >
      {renderHeader()}

      <View
        style={{
          borderWidth: 1,
          borderColor: Colors.border,
          alignItems: "center",
          borderRadius: mvs(10),
          paddingVertical: mvs(10),
          gap: mvs(10),
        }}
      >
        <VideoView
          player={player}
          style={styles.container}
          allowsFullscreen
          allowsPictureInPicture
        />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: VIDEO_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    width: "90%",
  },
});
