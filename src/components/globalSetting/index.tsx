"use client";
import React, { useState } from "react";
import ProductMonitor from "@/components/globalSetting/ProductMonitor";
import AbstractReview from "@/components/globalSetting/AbstractReview";
import QC from "@/components/globalSetting/QC";
import PagePreference from "./PagePrefernce";

const GlobalSettingModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}) => {
  const [tabs, setTabs] = useState(1);

  const handleTab = (tabIndex: number) => {
    setTabs(tabIndex);
  };
  const [isPageSettingModalOpen, setIsPageSettingModalOpen] = useState(false);

  return isModalOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div
        className="relative z-50 transform bg-white rounded-lg shadow-lg modalWidth"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div>
          <div className="bg-white rounded-lg relative  ">
            <button
              className="  close-button"
              onClick={() =>{
 setIsModalOpen(false)
 setTimeout(() => {
        window.location.reload();
      }, 500);
}}
            >
              X
            </button>
            <h2 className="font-bold ml-12">Global Settings</h2>
            <ul className="flex flex-wrap cursor-pointer text-xs font-medium text-center border-b border-gray-200 ">
              <span
                className={`p-4 ${
                  tabs === 1
                    ? "bg-slate-200 text-violet"
                    : "bg-gray-100 text-gray-500"
                } rounded-t-md`}
                onClick={() => handleTab(1)}
              >
                Page Preference
              </span>
              <span
                className={`p-4 ${
                  tabs === 2
                    ? "bg-slate-200 text-violet"
                    : "bg-gray-100 text-gray-500"
                } rounded-t-md`}
                onClick={() => handleTab(2)}
              >
                Product Monitor
              </span>
              <span
                className={`p-4 ${
                  tabs === 3
                    ? "bg-slate-200 text-violet"
                    : "bg-gray-100 text-gray-500"
                } rounded-t-md`}
                onClick={() => handleTab(3)}
              >
                Abstract Review
              </span>
              <span
                className={`p-4 ${
                  tabs === 4
                    ? "bg-slate-200 text-violet"
                    : "bg-gray-100 text-gray-500"
                } rounded-t-md`}
                onClick={() => handleTab(4)}
              >
                QC Review
              </span>
            </ul>

            <div className="p-4">
              {tabs === 2 ? (
                <ProductMonitor />
              ) : tabs === 3 ? (
                <AbstractReview />
              ) : tabs === 4 ? (
                <QC />
              ) : tabs === 1 ? (
                <PagePreference
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default GlobalSettingModal;
