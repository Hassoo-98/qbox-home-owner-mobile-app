import { ModalContext } from "@/context";
import { useContext } from "react";

export const useModal = () => {
  const {
    onOpen: onTriggerModal,
    onClose: onCloseModal,
    onRequestOTP,
  } = useContext(ModalContext);

  return {
    onCloseModal,
    onRequestOTP,
    onTriggerModal,
  };
};
