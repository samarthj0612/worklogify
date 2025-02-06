import React, { ReactNode } from "react";
import { Modal, StyleSheet, View } from "react-native";

interface CustomModalProps {
  children: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

const CustomModal = ({
  children,
  isOpen = false,
  onClose = () => {},
}: CustomModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>{children}</View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
});
