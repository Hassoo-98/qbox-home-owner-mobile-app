import { Button, Text } from "@/components";
import { Colors } from "@/constants";
import { mvs } from "@/utils/metrices";
import { Feather, Ionicons } from "@expo/vector-icons";
import { VideoPlayer, VideoView } from "expo-video";
import React, { ReactNode, useEffect } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");
const VIDEO_WIDTH = width - 80;
const VIDEO_HEIGHT = VIDEO_WIDTH * (9 / 16);

interface HeaderConfig {
  title: string;
  subtitle?: string;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
}

interface VideoRecordingProps {
  player?: VideoPlayer;
  sourceUri?: string;
  headers?: Record<string, string>;
  onShare?: () => void;
  onDownload?: () => void;
  autoPlay?: boolean;
  style?: object;
  header?: HeaderConfig;
  customHeader?: ReactNode;
}

export const VideoRecording = ({
  player,
  sourceUri,
  headers,
  onShare,
  onDownload,
  autoPlay = true,
  style,
  header,
  customHeader,
}: VideoRecordingProps) => {
  useEffect(() => {
    if (autoPlay && player) {
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
          paddingHorizontal: 20,
          paddingVertical: 10,
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
        {sourceUri ? (
          <WebView
            source={{ uri: sourceUri, headers }}
            style={[styles.container, { backgroundColor: 'black' }]}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scrollEnabled={false}
            scalesPageToFit={true}
            useWideViewPort={true}
            loadWithOverviewMode={true}
            userAgent="Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36"
            startInLoadingState={true}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn(
                'WebView received error status code: ',
                nativeEvent.statusCode
              );
            }}
            injectedJavaScript={`
              (function() {
                const style = document.createElement('style');
                style.innerHTML = \`
                  * { margin: 0 !important; padding: 0 !important; overflow: hidden !important; }
                  video { 
                    width: 100vw !important; 
                    height: 100vh !important; 
                    object-fit: contain !important; 
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                  } 
                  body, html { 
                    background: black !important; 
                    width: 100% !important;
                    height: 100% !important;
                  }
                \`;
                document.head.appendChild(style);
                
                // Auto-play attempt
                setTimeout(() => {
                  const videos = document.getElementsByTagName('video');
                  for (let v of videos) {
                    v.muted = true;
                    v.play().catch(e => console.log("Auto-play blocked", e));
                  }
                }, 1000);
              })();
              true;
            `}
          />
        ) : player ? (
          <VideoView
            player={player}
            style={styles.container}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls={true}
            surfaceType="textureView"
          />
        ) : (
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text>No stream available</Text>
          </View>
        )}
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
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    position: "relative",
    alignSelf: "center",
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    width: "90%",
  },
});
