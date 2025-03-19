import React, { useState } from "react";
import Image from "next/image";
import { IDownload } from "@/components/drug-monitor/productMonitor.model";
import Abstract from "@/components/audit-log/Abstract";
import Qc from "@/components/audit-log/Qc";
import E2BXML from "@/components/audit-log/E2BXML";
import E3BXML from "@/components/audit-log/E3BXML";
import RouteBack from "@/components/audit-log/routeBack";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: IDownload;
  MonitorName: string;
}

const MonitorDetails: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedItems,
  MonitorName,
}) => {
  const [tabs, setTabs] = useState(1);
  const handleTab = (tabIndex: React.SetStateAction<number>) => {
    setTabs(tabIndex);
  };
  const isFunctionEmpty = (fn: any) => {
    const fnBody = fn
      .toString()
      .match(/{([\s\S]*)}/)?.[1]
      ?.trim();
    return !fnBody; // Returns true if function body is empty, false otherwise
  };
  return (
    <div
      className={
        !isFunctionEmpty(onClose) ? "monitor-style text-14 p-2 " : "w-full"
      }
    >
      <div className="bg-white w-full text-14 rounded-[15px] ">
        <ul
          className={
            "flex flex-wrap justify-between bg-tabColor mt-0  cursor-pointer text-sm font-medium text-center border-b border-gray-200 mb-0"
          }
        >
          <div>
            <span
              className={`inline-block text-14 p-4 -ml-[40px] ${
                tabs === 1 ? "bg-violet" : "bg-tabColor"
              } ${
                tabs === 1 ? "text-white" : "text-buttonGray"
              } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
              onClick={() => handleTab(1)}
            >
              {" "}
              Abstract
            </span>

            <span
              className={`inline-block text-14 p-4 text-tabText  ${
                tabs === 2 ? "bg-violet" : "bg-tabColor"
              } ${
                tabs === 2 ? "text-white" : "text-buttonGray"
              } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
              onClick={() => handleTab(2)}
            >
              {" "}
              QC
            </span>
            <span
              className={`inline-block text-14 p-4 text-tabText  ${
                tabs === 5 ? "bg-violet" : "bg-tabColor"
              } ${
                tabs === 5 ? "text-white" : "text-buttonGray"
              } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
              onClick={() => handleTab(5)}
            >
              {" "}
              Route Back
            </span>
            <span
              className={`inline-block text-14 p-4 text-tabText  ${
                tabs === 3 ? "bg-violet" : "bg-tabColor"
              } ${
                tabs === 3 ? "text-white" : "text-buttonGray"
              } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
              onClick={() => handleTab(3)}
            >
              {" "}
              E2BR2
            </span>
            <span
              className={`inline-block text-14 p-4 text-tabText  ${
                tabs === 4 ? "bg-violet" : "bg-tabColor"
              } ${
                tabs === 4 ? "text-white" : "text-buttonGray"
              } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
              onClick={() => handleTab(4)}
            >
              {" "}
              E2BR3
            </span>
          </div>
          <div className="flex gap-2 float-right">
            <button
              className="font-Archivo cursor-pointer text-14 text-silver bg-transparent rounded-sm"
              onClick={onClose}
            >
              <Image
                src="/assets/icons/Vector.svg"
                width={12}
                height={12}
                alt="search icon"
                className="mr-2"
              />
            </button>
          </div>
        </ul>

        {tabs === 1 ? (
          <Abstract
            selectedItems={selectedItems}
            label={"Abstract"}
            MonitorName={MonitorName}
            onclose={onClose}
          />
        ) : tabs === 5 ? (
          <RouteBack
            selectedItems={selectedItems}
            label={"Route back"}
            MonitorName={MonitorName}
            onclose={onClose}
          />
        ) : tabs === 2 ? (
          <Qc
            selectedItems={selectedItems}
            label={"QC"}
            MonitorName={MonitorName}
            onclose={onClose}
          />
        ) : tabs === 3 ? (
          <E2BXML
            selectedItems={selectedItems}
            label={"E2b XML"}
            MonitorName={MonitorName}
            onclose={onClose}
          />
        ) : (
          <E3BXML
            selectedItems={selectedItems}
            label={"E3b XML"}
            MonitorName={MonitorName}
            onclose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default MonitorDetails;
