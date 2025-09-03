
import { useState } from "react";

export function useModal(initialState = {}) {
  const [modalState, setModalState] = useState(initialState);

  const openModal = (name, data = null) => {
    setModalState((prev) => ({ ...prev, [name]: true, currentData: data }));
  };

  const closeModal = (name) => {
    setModalState((prev) => ({ ...prev, [name]: false, currentData: null }));
  };

  return { modalState, openModal, closeModal };
}