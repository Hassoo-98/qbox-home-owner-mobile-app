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
    setIsAlarmEnabled,
    externalDate,
    internalDate,
    showDatePicker,
    setShowDatePicker,
    externalPlayer,
    internalPlayer,
    currentDate,
    handleDateChange,
    openCalendar,
    formatDate,
    handleShare,
  } = useMyQBoxLogic();

  const { data: homeOwnerResponse, isLoading, error } = useHomeOwner();


  const qboxesDetails = homeOwnerResponse?.data?.qboxes;
  console.log("homeOwnerResponse", JSON.stringify(qboxesDetails, null, 4));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <QBoxAlarmCard
        isEnabled={isAlarmEnabled}
        onToggle={() => setIsAlarmEnabled(!isAlarmEnabled)}
      />

      {/* QBox Status Grid */}
      <StatusCardsGrid qboxesDetails={qboxesDetails} />

      {/* External QBox View */}
      <VideoRecording
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
