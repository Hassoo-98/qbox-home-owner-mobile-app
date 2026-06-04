import { useShare } from "@/hooks";
import { useCalendarPermissions } from "expo-calendar";
import { useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useHomeOwner } from "@/hooks/useHomeOwner";
import { useQBoxStreams } from "@/hooks/useQBoxStreams";
import { useAuth } from "@/hooks/useAuth";
import {
    useControlDeviceAlarm,
    useDeviceStatusSocket,
} from "@/hooks/api/useQBoxQueries";

export const useMyQBoxLogic = () => {
    const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
    const [alarmStartedAt, setAlarmStartedAt] = useState<number | null>(null);
    const [alarmElapsedSeconds, setAlarmElapsedSeconds] = useState(0);
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
    const { data: streams } = useQBoxStreams(qboxId!);
    const statusSocket = useDeviceStatusSocket(qboxId || "");
    const controlAlarmMutation = useControlDeviceAlarm(qboxId || "");

    // Debugging logs
    useEffect(() => {
        if (qboxId) console.log("Current QBox ID:", qboxId);
        if (streams) console.log("Fetched Streams:", JSON.stringify(streams, null, 2));
    }, [qboxId, streams]);

    useEffect(() => {
        if (statusSocket.data?.alarm_active) {
            setIsAlarmEnabled(true);
            setAlarmStartedAt((current) => current ?? Date.now());
        } else if (statusSocket.data && statusSocket.data.alarm_active === false) {
            setIsAlarmEnabled(false);
            setAlarmStartedAt(null);
            setAlarmElapsedSeconds(0);
        }
    }, [statusSocket.data?.alarm_active]);

    useEffect(() => {
        if (!isAlarmEnabled || alarmStartedAt === null) {
            return;
        }

        const updateElapsed = () => {
            setAlarmElapsedSeconds(Math.floor((Date.now() - alarmStartedAt) / 1000));
        };

        updateElapsed();
        const intervalId = setInterval(updateElapsed, 1000);
        return () => clearInterval(intervalId);
    }, [isAlarmEnabled, alarmStartedAt]);

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

    const formatAlarmTimer = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return [hours, minutes, remainingSeconds]
            .map((part) => String(part).padStart(2, "0"))
            .join(":");
    };

    const handleAlarmToggle = async () => {
        if (!qboxId) {
            return;
        }

        try {
            const nextValue = !isAlarmEnabled;
            const action = nextValue ? "start" : "stop";

            await controlAlarmMutation.mutateAsync(action);
            setIsAlarmEnabled(nextValue);

            if (nextValue) {
                setAlarmStartedAt(Date.now());
                setAlarmElapsedSeconds(0);
            } else {
                setAlarmStartedAt(null);
                setAlarmElapsedSeconds(0);
            }
        } catch {
            // Mutation hook already shows the error toast.
        }
    };

    const currentDate = activeVideoType === "external" ? externalDate : internalDate;

    return {
        isAlarmEnabled,
        setIsAlarmEnabled,
        externalDate,
        internalDate,
        showDatePicker,
        setShowDatePicker,
        isAlarmLoading: controlAlarmMutation.isPending,
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
        handleAlarmToggle,
        isStatusSocketConnecting: statusSocket.isConnecting,
        alarmTimerText: isAlarmEnabled ? formatAlarmTimer(alarmElapsedSeconds) : "",
    };
};
