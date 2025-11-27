import { Modal } from "@/components";
import React from "react";
import { ModalContextType, ModalProviderProps, ModalStateType } from "./props";

export const ModalContext = React.createContext<ModalContextType>({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
  setLoading: () => {},
});

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [modal, setModal] = React.useState<ModalStateType>({
    title: "",
    subtitle: "",
    primaryButtonText: "Confirm",
    primaryButtonHandler: () => {},
  });

  const handleOpen = (values: ModalStateType) => {
    setOpen(true);
    setModal({
      ...values,
      primaryButtonText: values.primaryButtonText || "Confirm",
    });
  };

  const handleClose = () => {
    setLoading(false);
    setOpen(false);
  };

  const handlePrimaryAction = () => {
    setLoading(true);
    modal.primaryButtonHandler();
  };

  const handleSecondaryAction = () => {
    if (modal.secondaryButtonHandler) {
      setLoading(true);
      modal.secondaryButtonHandler();
    }
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        setLoading,
        onOpen: handleOpen,
        onClose: handleClose,
      }}
    >
      {children}
      {isOpen && (
        <Modal
          isOpen={isOpen}
          icon={modal.icon}
          title={modal.title}
          subtitle={modal.subtitle}
          isLoading={isLoading}
          onClose={handleClose}
          primaryButtonText={modal.primaryButtonText}
          primaryButtonHandler={handlePrimaryAction}
          secondaryButtonText={modal.secondaryButtonText}
          secondaryButtonHandler={handleSecondaryAction}
        />
      )}
    </ModalContext.Provider>
  );
};
