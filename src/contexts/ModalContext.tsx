import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

interface ModalProviderProps {
    children: ReactNode;
  }

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ModalContext.Provider value={{ modalVisible, setModalVisible }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
