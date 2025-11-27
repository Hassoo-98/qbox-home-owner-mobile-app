import { ModalContext } from "@/context";
import { useContext } from "react";

export const useModal = () => {
  const { onOpen: onTriggerModal, onClose: onCloseModal } =
    useContext(ModalContext);

  return {
    onCloseModal,
    onTriggerModal,
  };
};
