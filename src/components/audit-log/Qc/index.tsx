import React, { useEffect, useState } from "react";
// @ts-ignore
import { exportToExcel } from "react-easy-export";
import Image from "next/image";
import { IDownload } from "@/components/drug-monitor/productMonitor.model";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  AuditLogState,
  HistoryDataAsync,
} from "../auditLogDetails/auditLog.slice";
import LoadingSpinner from "@/common/LoadingSpinner";
import { STATUS } from "@/common/constants";
import { HistoryResult } from "../auditLogDetails/auditLog.model";
import { Utils } from "../../../../utils/utils";

interface IProps {
  selectedItems: IDownload;
  label: string;
  MonitorName: string;
onclose:any
}

const Qc: React.FC<IProps> = ({ selectedItems, label, MonitorName ,onclose}) => {
  const dispatch = useAppDispatch();
  const [historyData, setHistoryData] = useState<HistoryResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loading, HistoryData } = useAppSelector(AuditLogState);
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);

  const decodedMonitorName = decodeURIComponent(MonitorName);

  useEffect(() => {
    setIsLoading(true);
    const payload = {
      review_type: label,
      search_result_id: selectedItems?.search_result_id,
    };
    dispatch(HistoryDataAsync(payload));
    setIsLoading(false);
  }, [selectedItems]);

  useEffect(() => {
    setIsLoading(true);
    if (loading === STATUS.fulfilled) {
      setHistoryData(HistoryData);
      setIsLoading(false);
    }
    setIsLoading(false);
  }, [loading, HistoryData]);

  /**
   * Handles the download of a CSV file based on selected data and settings.
   */
  const handleDownload = () => {
    setIsExportLoading(true);

    const headers = [
      ["Monitor ID", selectedItems?.monitor_id || "-"],
      ["Monitor Name", decodedMonitorName || "-"],
      ["Article Id", selectedItems?.article_id || "-"],
      ["Article Title", selectedItems?.title || "-"],
      ["AI Decision", selectedItems?.ai_decision || "-"],
      ["Reason", selectedItems?.reason || "-"],
      // ["Confidence Score", selectedItems?.confidence_score || "-"],
      ["to decision", historyData[0]?.to_decision || "-"],
      ["Comments", selectedItems?.comments || "-"],
    ];

    const csvHeader = [
      "Date",
      "Updated By",
      "Expert review decision",
      "Comments",
      "Categories",
      "Classification",
    ];

    const csvContent = [
      historyData[1]?.created_on.split("T")[0] || "-",
      historyData[1]?.to_modified_by || "-",
      historyData[1]?.to_decision || "-",
      historyData[1]?.to_comments || "-",
      historyData[1]?.to_categories
        ? historyData[1].to_categories.join(", ")
        : "-",
      historyData[1]?.to_classifications
        ? historyData[1].to_classifications.join(", ")
        : "-",
    ];

    const renderData = [...headers, csvHeader, csvContent];

    exportToExcel(
      renderData,
      `Audit_${decodedMonitorName}_ArticleId_${
        selectedItems?.article_id
      }_QC_auditlog_${Utils.getCurrentDateAndTime()}.xls`
    );

    setIsExportLoading(false);
  };
const isFunctionEmpty = (fn:any) => {
  const fnBody = fn.toString().match(/{([\s\S]*)}/)?.[1]?.trim();
  return !fnBody; // Returns true if function body is empty, false otherwise
};
  return (
    <>
      <div className="container mb-12 mt-2">
                <div className={!isFunctionEmpty(onclose) ? "absolute right-14 top-3" : "absolute right-5 top-28"}>

          <button
            className={`${
              Utils.isPermissionGranted("export_files") ? "" : "disabled-select"
            } rounded-md bg-yellow text-white text-14 border ml-2 cursor-pointer border-gray text-sm font-medium font-archivo py-2 px-8`}
            onClick={handleDownload}
            disabled={!Utils.isPermissionGranted("export_files")}
          >
            Export
          </button>
          <div className={!isFunctionEmpty(onclose)?"absolute cursor-pointer top-0 ml-2":'absolute cursor-pointer top-0 ml-3'}>
            <Image
              src="/assets/icons/download-white.svg"
              alt="download icon"
              width={15}
              height={15}
              className={`left-0 ml-2 top-0 mt-2`}
            />
          </div>
        </div>
        {isExportLoading && <LoadingSpinner text={"Downloading"} />}
        <div className="flex flex-column text-14 w-12/12">
          <div className="border-right w-[550px]">
            <div className="flex flex-wrap m-2">
              <div className="m-2">
                <div className="text-dimgray m-1">Monitor ID</div>
                <div className="text-black m-1">
                  {selectedItems?.monitor_id || "-"}
                </div>
              </div>
              <div className="m-2">
                <div className="text-dimgray m-1">Monitor Name</div>
                <div className="text-black m-1">{decodedMonitorName}</div>
              </div>
            </div>
            <div className="flex flex-wrap m-2">
              <div className="m-2">
                <div className="text-dimgray m-1">Article Id</div>
                <div className="text-black m-1">
                  {selectedItems?.article_id || "-"}
                </div>
              </div>
              <div className="m-2">
                <div className="text-dimgray m-1">Article Title</div>
                <div className="text-black m-1">
                  {selectedItems?.title || "-"}
                </div>
              </div>
            </div>
            <div className="mt-8 ml-4">
              <div className="text-dimgray m-1">AI decision</div>
              <div className="text-black m-1">
                {selectedItems?.ai_decision || "-"}
              </div>
            </div>
            <div className="mt-8 ml-4">
              <div className="text-dimgray m-1">Reason</div>
              <div className="text-black m-1">
                {selectedItems?.reason || "-"}
              </div>
            </div>
            {/* <div className="mt-8 ml-4">
              <div className="text-dimgray m-1">Confidence Score</div>
              <div className="text-black m-1">
                {selectedItems.confidence_score || "-"}
              </div>
            </div> */}
            <div className="mt-8 ml-4">
              <div className="text-dimgray m-1">to decision</div>
              <div className="text-black m-1">
                {historyData[0]?.to_decision || "-"}
              </div>
            </div>
            <div className="mt-8 ml-4">
              <div className="text-dimgray m-1">Comments</div>
              <div className="text-black m-1">
                {selectedItems?.comments || "-"}
              </div>
            </div>
          </div>
          <div className="mt-4 ml-4">
            <div className="flex flex-wrap">
              <div className="m-2">
                <Image
                  src="/assets/icons/time-past.png"
                  width={15}
                  height={15}
                  alt="search icon"
                  className="ml-4"
                />
              </div>
              <div className="ml-2 mt-2 text-dimgray">History</div>
            </div>
            <div className="ml-6 mt-2 text-dimgray">Expert QC review</div>
            {HistoryData[1] && (
              <div className="overflow-y-auto max-h-96 w-80">
                <div className="border-style m-4">
                  <div className="text-dimgray m-2">
                    Date:{" "}
                    <span className="text-black">
                      {historyData[1]?.created_on.split("T")[0] || "-"}
                    </span>{" "}
                  </div>
                  <div className="text-dimgray m-2">
                    Updated By:{" "}
                    <span className="text-black">
                      {historyData[1]?.to_modified_by || "-"}
                    </span>
                  </div>
                  <div className="text-dimgray m-2">
                    Expert review decision :{" "}
                    <span className="text-black">
                      {historyData[1]?.to_decision || "-"}
                    </span>
                  </div>
                  <div className="text-dimgray m-2">
                    Comments :{" "}
                    <span className="text-black">
                      {historyData[1]?.to_comments || "-"}
                    </span>
                  </div>
                  <div className="text-dimgray m-2">
                    Categories :{" "}
                    <span className="text-black">
                      {historyData[1]?.to_categories
                        ? historyData[1].to_categories.join(", ")
                        : "-"}
                    </span>
                  </div>
                  <div className="m-2 text-dimgray">
                    Classification :{" "}
                    <span className="text-black">
                      {historyData[1]?.to_categories
                        ? historyData[1].to_classifications.join(", ")
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isLoading && <LoadingSpinner modelClass={"modelClass"} />}
    </>
  );
};

export default Qc;
