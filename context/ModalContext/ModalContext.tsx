import { DriverOTPRequestModal, Modal, OTPModal } from "@/components";
import React, { useState } from "react";
import { ModalContextType, ModalProviderProps, ModalStateType } from "./props";
export const ModalContext = React.createContext<ModalContextType>({
  isOpen: false,
  onOpen: () => { },
  onClose: () => { },
  setLoading: () => { },
  onRequestOTP: () => { },
});

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setOpen] = React.useState<boolean>(false);

  const [isOTPRequested, setIsOTPRequested] = useState<boolean>(false);

  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [modal, setModal] = React.useState<ModalStateType>({
    title: "",
    subtitle: "",
    primaryButtonText: "Confirm",
    primaryButtonHandler: () => { },
    modalType: "default", // Add this to distinguish modal types
  });

  const handleOpen = (values: ModalStateType) => {
    setOpen(true);
    setModal({
      ...values,
      primaryButtonText: values.primaryButtonText || "Confirm",
      modalType: values.modalType || "default",
    });
  };

  const onRequestOTP = () => {
    setIsOTPRequested(true);
  };

  const handleClose = () => {
    setLoading(false);
    setOpen(false);
  };

  const handlePrimaryAction = async (data?: any) => {
    setLoading(true);
    try {
      const result = await Promise.resolve(modal.primaryButtonHandler(data));
      if (result !== false) {
        handleClose();
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
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
        onRequestOTP,
      }}
    >
      {children}
      {isOTPRequested ? (
        <DriverOTPRequestModal
          isOpen={isOTPRequested}
          onClose={() => {
            setIsOTPRequested(false);
          }}
        />
      ) : isOpen && modal.modalType === "otp" ? (
        <OTPModal
          isOpen={isOpen}
          onClose={handleClose}
          title={modal.title}
          subtitle={modal.subtitle}
          footerText={modal.footerText}
          footerAction={modal.footerAction}
          isForgotPassowrd={modal.isForgotPassowrd}
          onSubmit={(otp: string) => handlePrimaryAction(otp)}
          secondaryButtonHandler={handleSecondaryAction}
          primaryButtonText={modal.primaryButtonText}
          isLoading={isLoading}
        />
      ) : isOpen ? (
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
      ) : null}
    </ModalContext.Provider>
  );
};
