interface AlertInterface {
  show: boolean;
  message: string;
  title: string;
  variant: "success" | "danger" | "warning" | "info";
  usingTimer: boolean;
  permanent: boolean;
  timer: number;

  onDismiss: () => void;
  setShow: (show: boolean) => void;
  setMessage: (message: string) => void;
  setTitle: (title: string) => void;
  setVariant: (variant: "success" | "danger" | "warning" | "info") => void;
  setUsingTimer: (usingTimer: boolean) => void;
  setPermanent: (permanent: boolean) => void;
  setTimer: (timer: number) => void;
}
