import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { SessionStorage } from "../../utils/Sessionstorage";
import { CONSTANTS, systemMessage } from "./constants";
import Modal from "./modal/model";
import { LogOutAsync, setSessionModal } from "@/components/auth/auth.slice";
import { LocalStorage } from "../../utils/localstorage";
import { useRouter } from "next/navigation";
import Toast from "./Toast";

const MyComponent: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const showModal = useAppSelector((state: any) => state.auth.showSessionModal);

  const inactivityTime = 20 * 60 * 1000; // 20 minutes
  const logoutTime = 60; // 1 minute in seconds
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  const [countdown, setCountdown] = useState<number>(logoutTime); // Countdown state
  const countdownTimer = useRef<NodeJS.Timeout | null>(null); // Countdown timer ref

  // Function to reset inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      dispatch(setSessionModal(true)); // Show modal after 20 minutes
    }, inactivityTime);
  };

  // Axios setup and interceptor
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CURRENT_APP_BASE_URL 
  });

  useEffect(() => {
    // Add Axios interceptor to reset timer before every API call
    api.interceptors.request.use(
      (config) => {
        resetInactivityTimer(); // Reset timer before sending a request
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Initial user activity tracking
    ["click", "mousemove", "keydown", "scroll"].forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      ["click", "mousemove", "keydown", "scroll"].forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, []);

  useEffect(() => {
    if (showModal) {
      setCountdown(logoutTime); // Reset countdown when modal is displayed

      // Start countdown timer
      countdownTimer.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleLogout(); // Auto-logout when countdown reaches zero
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownTimer.current) clearInterval(countdownTimer.current); // Clear countdown timer
    }

    return () => {
      if (countdownTimer.current) clearInterval(countdownTimer.current); // Cleanup on unmount
    };
  }, [showModal]);

  const handleContinue = () => {
    dispatch(setSessionModal(false));
    resetInactivityTimer(); // Reset inactivity timer after user clicks continue
  };

  const handleLogout = async () => {
    dispatch(setSessionModal(false));
    if (countdownTimer.current) clearInterval(countdownTimer.current); // Stop countdown

    const res = await dispatch(LogOutAsync());
    if (LogOutAsync.fulfilled.match(res)) {
      Toast(systemMessage["LogOut Success"], { type: "success" });
      router.push("/");
      LocalStorage.clearLocalStorage();
    }
  };

  return (
    <div>
      {showModal && (
        <Modal
          childElement={
            <div className="sessionTransfer-modal p-4">
              <div className="text-14 text-black">Session Timeout Warning</div>
              <div className="border-bottom mt-3"></div>
              <div className="text-14 text-black mt-4">
                {CONSTANTS.session_timeout_message1}
              </div>
              <div className="text-14 text-black mt-1">
                {CONSTANTS.session_timeout_message2}
              </div>
              <div className="text-14 text-black mt-4">
                Auto-logout in <strong>{countdown}</strong> seconds.
              </div>
              <div className="flex mt-4 float-right mb-2">
                <button
                  className="px-4 py-2 border-none bg-violet text-white rounded-md cursor-pointer"
                  onClick={handleContinue}
                >
                  Continue
                </button>
                <button
                  className="px-4 py-2 ml-2 border-none bg-violet text-white rounded-md cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          }
          isOpen={true}
        />
      )}
    </div>
  );
};

export default MyComponent;
