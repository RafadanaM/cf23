export type ToastConfig = {
  title: string;
  description?: string;
  timeoutMs?: number;
};

export type ShownToast = ToastConfig & {
  id: string;
};
