import { useShare } from "@/hooks";
import { useCalendarPermissions } from "expo-calendar";
import { useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useHomeOwner } from "@/hooks/useHomeOwner";
import { useQBoxStreams } from "@/hooks/useQBoxStreams";
import { useAuth } from "@/hooks/useAuth";

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

    const { userToken } = useAuth();
    const { data: homeOwnerResponse } = useHomeOwner();
    const qboxId = homeOwnerResponse?.data?.qboxes?.[0]?.qbox_id;
    const { data: streams, isLoading: isStreamsLoading } = useQBoxStreams(qboxId!);

    // Debugging logs
    useEffect(() => {
        if (qboxId) console.log("Current QBox ID:", qboxId);
        if (streams) console.log("Fetched Streams:", JSON.stringify(streams, null, 2));
    }, [qboxId, streams]);

    // External QBox Video Player
    const externalPlayer = useVideoPlayer(streams?.streams?.external || null, (player) => {
        player.loop = false;
        player.muted = false;
        player.play();
    });

    // Internal QBox Video Player
    const internalPlayer = useVideoPlayer(streams?.streams?.internal || null, (player) => {
        player.loop = false;
        player.muted = false;
        player.play();
    });

    // Explicitly handle source updates and play
    useEffect(() => {
        if (streams?.streams?.external) {
            console.log("External stream available:", streams.streams.external);
        }
    }, [streams?.streams?.external]);

    useEffect(() => {
        if (streams?.streams?.internal) {
            console.log("Internal stream available:", streams.streams.internal);
        }
    }, [streams?.streams?.internal]);

    const externalSource = streams?.streams?.external;
    const internalSource = streams?.streams?.internal;
    const headers = userToken ? { Authorization: `Bearer ${userToken}` } : undefined;

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
        externalSource,
        internalSource,
        headers,
        currentDate,
        handleDateChange,
        openCalendar,
        formatDate,
        handleShare,
    };
};
