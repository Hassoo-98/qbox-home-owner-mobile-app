import {
  DatePickerModal,
  QBoxAlarmCard,
  StatusCardsGrid,
  VideoRecording,
} from "@/components";
import { useHomeOwner } from "@/hooks/useHomeOwner";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView } from "react-native";
import { styles } from "./styles";
import { useMyQBoxLogic } from "./useMyQBoxLogic";

export const MyQBox = () => {
  const {
    isAlarmEnabled,
    isAlarmLoading,
    alarmTimerText,
    handleAlarmToggle,
    externalDate,
    internalDate,
    showDatePicker,
    setShowDatePicker,
    externalPlayer,
    internalPlayer,
    externalSource,
    internalSource,
    headers,
    currentDate,
    handleDateChange,
    openCalendar,
    formatDate,
    handleShare,
  } = useMyQBoxLogic();

  const { data: homeOwnerResponse } = useHomeOwner();


  const qboxesDetails = homeOwnerResponse?.data?.qboxes;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <QBoxAlarmCard
        isEnabled={isAlarmEnabled}
        onToggle={handleAlarmToggle}
        timerText={alarmTimerText}
        isLoading={isAlarmLoading}
      />

      {/* QBox Status Grid */}
      <StatusCardsGrid qboxesDetails={qboxesDetails} />

      {/* External QBox View */}
      <VideoRecording
        sourceUri={externalSource}
        headers={headers}
        player={externalPlayer}
        onShare={handleShare}
        onDownload={() => { }}
        autoPlay={true}
        header={{
          title: "External QBox View",
          subtitle: formatDate(externalDate),
          rightIcon: <Feather name="calendar" size={20} />,
          onRightIconPress: () => openCalendar("external"),
        }}
      />


      {/* Internal QBox View */}

      <VideoRecording
        sourceUri={internalSource}
        headers={headers}
        player={internalPlayer}
        onShare={handleShare}
        onDownload={() => { }}
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
