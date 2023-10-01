import { create } from "zustand";

export const useAlertStore = create<AlertInterface>((set) => ({
  show: false,
  message: "",
  title: "",
  permanent: false,
  timer: 5,
  usingTimer: false,
  variant: "success",
  onDismiss: () => {
    set({ show: false, usingTimer: false, timer: 5 });
  },
  setShow: (show: boolean) => {
    set({ show });
  },
  setMessage: (message: string) => {
    set({ message });
  },
  setTitle: (title: string) => {
    set({ title });
  },
  setPermanent: (permanent: boolean) => {
    set({ permanent });
  },
  setTimer: (timer: number) => {
    set({ timer });
  },
  setUsingTimer: (usingTimer: boolean) => {
    set({ usingTimer });
  },
  setVariant: (variant: "success" | "danger" | "warning" | "info") => {
    set({ variant });
  },
}));

export const useWebsiteStore = create<WebsiteInterface>((set) => ({
  title: "",
  setWebsiteTitle: (title: string) => {
    set({ title });
  },

  image: "",
  setImage: (image: string) => {
    set({ image });
  },
}));
