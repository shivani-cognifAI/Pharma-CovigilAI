"use client";
import Profile from "@/common/Profile";
import { authState } from "@/components/auth/auth.slice";
import { useAppSelector } from "@/redux/store";
import React, { ReactElement, useEffect, useState } from "react";
import HelpComponent from "@/common/helpButton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../sidebar";
import ResetPassword from "../reset-password";
import {
  CURRENT_VERSION,
  privacyPolicyURL,
  termsOfService,
} from "@/common/constants";
import GlobalSettingModal from "../globalSetting";
import Image from "next/image";
import MyComponent from "@/common/SessionTimer";

interface IProps {
  children: ReactElement;
}
const Layout: React.FC<IProps> = ({ children }) => {
  const [currPath, setCurrPath] = useState("/reset-password");
  const { isUserLoggedIn } = useAppSelector(authState);
  const [isPageSettingModalOpen, setIsPageSettingModalOpen] = useState(false);

  useEffect(() => {
    setCurrPath(window.location.pathname);
  }, [isUserLoggedIn]);

  
  // Handle the click to open the GlobalSettingModal
  const handlePageSettingIconClick = () => {
    setIsPageSettingModalOpen(true); // Open the modal
  };

  return (
    <div>
      <ToastContainer />
      {currPath === "/reset-password" ? (
        <ResetPassword />
      ) : (
        <>
          <div
            className={
              isUserLoggedIn ? "flex flex-row justify-start bg-gray-300" : ""
            }
          >
            {isUserLoggedIn && (
              <>
                <Sidebar />
              </>
            )}
            <div
              className={
                isUserLoggedIn
                  ? "bg-whitesmoke ml-2 justify-center w-[100%] break-words"
                  : ""
              }
            >
              <div className="flex flex-col">
                <div
                  className={`flex items-center justify-between ${
                    isUserLoggedIn ? "h-[90px]" : ""
                  }`}
                >
                  {isUserLoggedIn && (
                    <>
                      <div className="flex items-center justify-end ">
                        <div className="flex items-center space-x-4 ml-auto ">
                          <HelpComponent />

                          <button
                            onClick={handlePageSettingIconClick} // Open the modal on click
                            className=" bg-transparent absolute  right-[317px] top-9"
                          >
                            <Image
                              title="Global setting"
                              alt="page-setting-icon"
                              src="/assets/icons/pagepref.svg"
                              width={12}
                              height={12}
                              className="cursor-pointer px-2 py-2 rounded-full bg-gray"
                            />
                          </button>
                          <Profile />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <GlobalSettingModal
                  isModalOpen={isPageSettingModalOpen}
                  setIsModalOpen={setIsPageSettingModalOpen}
                />
                <div className={isUserLoggedIn ? "m-4" : ""}>{children}</div>
              </div>
              {isUserLoggedIn && (
                <>
 <MyComponent />
                  <div className="footer">
                    <div className="ml-5 text-14">{CURRENT_VERSION}</div>
                    <div>
                      <span className="mr-5 text-14">
                        <a href={privacyPolicyURL} target="_blank">
                          Privacy Policy{" "}
                        </a>
                        &nbsp; /
                      </span>
                      <span className="mr-5 text-14">
                        <a href={termsOfService} target="_blank">
                          Terms of Service
                        </a>
                        &nbsp; /
                      </span>
                      <span className="mr-5 text-14">
                        &copy; 2025 CoVigilAI
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Layout;
