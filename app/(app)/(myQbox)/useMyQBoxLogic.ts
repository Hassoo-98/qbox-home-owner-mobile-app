import { useShare } from "@/hooks";
import { useCalendarPermissions } from "expo-calendar";
import { useVideoPlayer } from "expo-video";
import { useState } from "react";
import { Platform } from "react-native";

export const useMyQBoxLogic = () => {
    const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
    const [externalDate, setExternalDate] = useState(new Date());
    const [internalDate, setInternalDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [activeVideoType, setActiveVideoType] = useState<
        "external" | "internal" | null
    >(null);

    const { onShare } = useShare();
    useCalendarPermissions();

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

    const currentDate = activeVideoType === "external" ? externalDate : internalDate;

    return {
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
    };
};
