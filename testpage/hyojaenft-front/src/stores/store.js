import { create } from "zustand";

export const useAddressStore = create((set) => ({
  address: "",
  setAddress: (text) => set({ address: text }),
  removeAllBears: () => set({ bears: 0 }),
}));
