import { RecordingIcon } from "@/assets/icons";
import { Button, Card, Chip, Text, VedioRecording } from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants";
import { mvs } from "@/utils/metrices";
import { format } from "date-fns";
import { useVideoPlayer } from "expo-video";
import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { QRScanHistoryItemProps } from "./props";

export const QRScanHistoryItem = ({ item }: QRScanHistoryItemProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const videoSource = item.videoUrl;

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.muted = false;
  });

  const handleShare = () => {
    console.log("Share recording");
  };

  const handleDownload = () => {
    console.log("Download recording");
  };

  const handleCloseModal = () => {
    if (player) {
      player.pause();
    }
    setModalVisible(false);
  };

  return (
    <>
      <Card
        variant="filled"
        showSideBorder
        sideBorderColor={
          item.status === "success" ? Colors.success : Colors.danger
        }
        style={{ marginBottom: mvs(Spacing.md) }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            ...(item?.status === "success" && {
              borderBottomWidth: 1,
              borderColor: Colors.border2,
              paddingBottom: mvs(Spacing.sm),
            }),
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            {item?.qrCodeScanUser || "Unknown "}
          </Text>
          <Chip
            variant={item.status === "success" ? "success" : "error"}
            label={item.status === "success" ? "Success" : "Failed"}
            size="small"
          />
        </View>

        {item?.status === "success" && (
          <>
            <View style={{ paddingVertical: mvs(Spacing.sm) }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text size="md" variant="secondary">
                  Locker Opened
                </Text>
                <Text size="md" variant="secondary">
                  {format(item?.openedAt, "Pp")}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text size="md" variant="secondary">
                  Locker Closed
                </Text>
                <Text size="md" variant="secondary">
                  {format(item?.closedAt, "Pp")}
                </Text>
              </View>
            </View>

            {/* View Recording Button */}
            <Button
              title="View Recording"
              textStyle={{ color: Colors.primary }}
              icon={<RecordingIcon width={24} height={24} />}
              style={{
                backgroundColor: Colors.darkGray,
                marginTop: mvs(Spacing.xs),
              }}
              onPress={() => setModalVisible(true)}
            />
          </>
        )}
      </Card>

      {/* Video Recording Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <VedioRecording
              player={player}
              onShare={() => console.log("Share")}
              onDownload={() => console.log("Download")}
              autoPlay={true}
              header={{
                title: `${item?.qrCodeScanUser || "Recording"} - ${format(
                  item?.openedAt,
                  "PP"
                )}`,
                rightIcon: <Text style={styles.closeIcon}>✕</Text>,
                onRightIconPress: handleCloseModal,
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 500,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: mvs(8),
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    marginRight: 10,
  },
  closeIcon: {
    fontSize: 24,
    color: "#666",
    fontWeight: "300",
  },
  videoContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: Colors.border,
    borderRadius: mvs(10),
  },
  video: {
    alignSelf: "center",
    width: "100%",
    height: "100%",
    borderRadius: mvs(BorderRadius.sm),
  },
  videoControls: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
  },
  controlButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  playPauseButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  controlIcon: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  controlLabel: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    marginTop: -4,
  },
  playPauseIcon: {
    color: "#fff",
    fontSize: 24,
  },
  videoInfoBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    gap: 8,
  },
  videoLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  timeContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  currentTime: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  duration: {
    color: "#fff",
    fontSize: 13,
    marginLeft: "auto",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: mvs(10),
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 6,
  },
  buttonDivider: {
    width: 1,
    backgroundColor: "#e5e5e5",
  },
  actionIcon: {
    fontSize: 18,
    color: "#555",
  },
  actionText: {
    fontSize: 15,
    color: "#555",
    fontWeight: "500",
  },
});

export default QRScanHistoryItem;
