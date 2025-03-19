"use client";
import React, { useState } from "react";
import Classification from "./classification";
import Category from "./category";
import E2BR2Component from "./E2BR2R2Component";
import E2BR3Component from "./E2BR2R3Component";
import DrugOfChoice from "./DrugOfChoiceComponent";
import Deduplicates from "./Deduplicates";

const staticContent = [
  { id: 1, name: "Email Notification" },
  { id: 2, name: "Reminder Notification" },
];

const SystemSettings = () => {
  const [tabs, setTabs] = useState(1);

  const handleTab = (tabIndex: React.SetStateAction<number>) => {
    setTabs(tabIndex);
  };

  return (
    <React.Fragment>
      <h3 className="absolute top-3 ml-2">System Management</h3>
      <div className="bg-white rounded-[15px]">
        <ul className="flex flex-wrap bg-tabColor cursor-pointer text-sm font-medium text-center  border-b border-gray-200 mb-0">
          <span
            className={`inline-block text-14 p-4 -ml-[40px] text-tabText ${
              tabs === 1 ? "bg-white" : "bg-tabColor"
            } ${
              tabs === 1 ? "text-violet" : "text-buttonGray"
            } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
            onClick={() => handleTab(1)}
          >
            {" "}
            Category
          </span>
          <span
            className={`inline-block text-14 p-4 text-tabText ${
              tabs === 2 ? "bg-white" : "bg-tabColor"
            } ${
              tabs === 2 ? "text-violet" : "text-buttonGray"
            } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
            onClick={() => handleTab(2)}
          >
            {" "}
            Classification
          </span>
          <span
            className={`inline-block text-14 p-4 text-tabText  ${
              tabs === 3 ? "bg-white" : "bg-tabColor"
            } ${
              tabs === 3 ? "text-violet" : "text-buttonGray"
            } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
            onClick={() => handleTab(3)}
          >
            {" "}
            Product
          </span>
<span
            className={`inline-block text-14 p-4 text-tabText  ${
              tabs === 4 ? "bg-white" : "bg-tabColor"
            } ${
              tabs === 4 ? "text-violet" : "text-buttonGray"
            } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
            onClick={() => handleTab(4)}
          >
            {" "}
            Deduplication
          </span>
          <span
            className={`inline-block text-14 p-4 text-tabText  ${
              tabs === 5 ? "bg-white" : "bg-tabColor"
            } ${
              tabs === 5 ? "text-violet" : "text-buttonGray"
            } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
            onClick={() => handleTab(5)}
          >
            {" "}
            E2BR2
          </span>
          <span
            className={`inline-block text-14 p-4 text-tabText  ${
              tabs === 6 ? "bg-white" : "bg-tabColor"
            } ${
              tabs === 6 ? "text-violet" : "text-buttonGray"
            } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
            onClick={() => handleTab(6)}
          >
            {" "}
            E2BR3
          </span>

          {/* <span
            className={`inline-block text-14 p-4 text-tabText  ${
              tabs === 4 ? "bg-white" : "bg-tabColor"
            } ${
              tabs === 4 ? "text-violet" : "text-buttonGray"
            } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
            onClick={() => handleTab(4)}
          >
            {" "}
            Email & Notifications
          </span> */}
        </ul>
        {tabs === 1 ? (
          <Category />
        ) : tabs === 2 ? (
          <Classification />
        ) : tabs === 3 ? (
          <DrugOfChoice />
        ) : tabs === 4 ? (
          <Deduplicates/>
        ) : tabs === 5 ? (
          <E2BR2Component />
        ) : tabs === 6 ? (
          <E2BR3Component />
        ) : (
          ""
        )}
      </div>
    </React.Fragment>
  );
};

export default SystemSettings;
