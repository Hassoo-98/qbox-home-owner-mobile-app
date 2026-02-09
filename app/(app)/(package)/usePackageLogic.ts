import { PACKAGE_TYPE } from "@/constants";
import { usePackages } from "@/hooks/api/useShipmentQueries";
import { router } from "expo-router";
import { useState } from "react";

export const usePackageLogic = () => {
    const [selectedPackageType, setSelectedPackageType] = useState<string>(
        PACKAGE_TYPE.INCOMING
    );
    const [searchId, setSearchId] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const { data: packagesData, isLoading } = usePackages();

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

    const filteredPackages = (packagesData?.data?.items || []).filter(
        (item) =>
            item.package_status.toLowerCase() === selectedPackageType.toLowerCase() &&
            item.tracking_id.toLowerCase().includes(searchId.toLowerCase())
    );

    return {
        selectedPackageType,
        searchId,
        modalVisible,
        isLoading,
        filteredPackages,
        setSearchId,
        setModalVisible,
        handlePackageTypeChange,
        handleModalConfirm,
    };
};
