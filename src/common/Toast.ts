import { toast, ToastOptions, ToastContent } from "react-toastify";

const Toast = (message: ToastContent, options: ToastOptions) => {
  toast(message, {
    position: "top-center",
    hideProgressBar: true,
    autoClose: 4000,
    ...options,
  });
};

export default Toast;
