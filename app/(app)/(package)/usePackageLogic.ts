import { PACKAGE_TYPE } from "@/constants";
import { useDeliveredPackages, useIncomingPackages, useOutgoingPackages } from "@/hooks/api/useShipmentQueries";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { useMemo, useState } from "react";

export const usePackageLogic = () => {
    const { user } = useAuth();
    const [selectedPackageType, setSelectedPackageType] = useState<string>(
        PACKAGE_TYPE.INCOMING
    );
    const [searchId, setSearchId] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const incomingQuery = useIncomingPackages();
    const outgoingQuery = useOutgoingPackages();
    const deliveredQuery = useDeliveredPackages();


    const activeQuery = useMemo(() => {
        switch (selectedPackageType.toLowerCase()) {
            case PACKAGE_TYPE.INCOMING.toLowerCase():
                return incomingQuery;
            case PACKAGE_TYPE.OUTGOING.toLowerCase():
                return outgoingQuery;
            case PACKAGE_TYPE.DELIVERED.toLowerCase():
                return deliveredQuery;
            default:
                return incomingQuery;
        }
    }, [selectedPackageType, incomingQuery, outgoingQuery, deliveredQuery]);

    const handlePackageTypeChange = (option: string) => {
        setSelectedPackageType(option);
    };

    const handleModalConfirm = (type: "send" | "return") => {
        if (type === "send") {
            router.navigate("/sendPackage");
        } else {
            router.navigate("/returnPackage");
        }
        setModalVisible(false);
    };

    const filteredPackages = useMemo(() => {
        const packets = activeQuery.data?.data.items || [];
        if (!searchId) return packets;
        return packets.filter(item =>
            (item.trackingId || item.tracking_id || "").toLowerCase().includes(searchId.toLowerCase())
        );
    }, [activeQuery.data, searchId]);

    return {
        userId: user?.id,
        selectedPackageType,
        searchId,
        modalVisible,
        isLoading: !user?.id || activeQuery.isLoading,
        filteredPackages,
        setSearchId,
        setModalVisible,
        handlePackageTypeChange,
        handleModalConfirm,
    };
};
