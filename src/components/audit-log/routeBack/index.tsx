import React, { useEffect, useState } from "react";
// @ts-ignore
import { exportToExcel } from "react-easy-export";
import Image from "next/image";
import { IDownload } from "@/components/drug-monitor/productMonitor.model";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  AuditLogState,
  HistoryDataAsync,
  RouteBackDataAsync,
} from "../auditLogDetails/auditLog.slice";
import LoadingSpinner from "@/common/LoadingSpinner";
import { STATUS } from "@/common/constants";
import {
  HistoryResult,
  RouteBackResult,
} from "../auditLogDetails/auditLog.model";
import { Utils } from "../../../../utils/utils";

interface IProps {
  selectedItems: IDownload;
  label: string;
  MonitorName: string;
onclose:any
}

const RouteBack: React.FC<IProps> = ({ selectedItems, label, MonitorName ,onclose}) => {
  const dispatch = useAppDispatch();
  const [historyData, setHistoryData] = useState<HistoryResult[]>([]);
  const [routeBackData, setRouteBackData] = useState<RouteBackResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loading, HistoryData, RouteBackData } = useAppSelector(AuditLogState);
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);

  const decodedMonitorName = decodeURIComponent(MonitorName);

  useEffect(() => {
    setIsLoading(true);
    const payload = {
      search_result_id: selectedItems.search_result_id,
    };

    dispatch(RouteBackDataAsync(payload));
    setIsLoading(false);
  }, [selectedItems]);

  useEffect(() => {
    setIsLoading(true);
    if (loading === STATUS.fulfilled) {
      setHistoryData(HistoryData);
      setRouteBackData(RouteBackData);
      setIsLoading(false);
    }
    setIsLoading(false);
  }, [loading, HistoryData, RouteBackData]);

  /**
   * Handles the download of a CSV file based on selected data and settings.
   */

  const handleDownload = () => {
    setIsExportLoading(true);

    // Prepare the data for export
    const data = [
      ["Monitor ID", selectedItems?.monitor_id || "-"],
      ["Monitor Name", decodedMonitorName || "-"],
      ["Article Id", selectedItems?.article_id || "-"],
      ["Article Title", selectedItems?.title || "-"],
      ["AI Decision", selectedItems.ai_decision || "-"],
      ["Reason", selectedItems.reason || "-"],
      // ["Confidence Score", selectedItems.confidence_score || "-"],
      ["to decision", historyData[0]?.to_decision || "-"],
      ["Comments", selectedItems.comments || "-"],
    ];

    const csvHeader = ["Date", "Updated By", "Remarks"];

    const csvContent = routeBackData.map((item) => [
      item.created_on ? item.created_on.split("T")[0] : "-",
      item.created_by || "-",
      item.comments || "-",
    ]);

    const renderData = [...data, csvHeader, ...csvContent];

    exportToExcel(
      renderData,
      `Audit_${decodedMonitorName}_ArticleId_${
        selectedItems?.article_id
      }_RouteBack_auditlog_${Utils.getCurrentDateAndTime()}.xls`
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
        <div className={!isFunctionEmpty(onclose) ?" absolute right-14 top-3":"absolute right-5 top-28" }>
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
                  {selectedItems.monitor_id || "-"}
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
                  {selectedItems.article_id || "-"}
                </div>
              </div>
              <div className="m-2">
                <div className="text-dimgray m-1">Article Title</div>
                <div className="text-black m-1">
                  {selectedItems.title || "-"}
                </div>
              </div>
            </div>
            <div className="mt-8 ml-4">
              <div className="text-dimgray m-1">AI decision</div>
              <div className="text-black m-1">
                {selectedItems.ai_decision || "-"}
              </div>
            </div>
            <div className="mt-8 ml-4">
              <div className="text-dimgray m-1">Reason</div>
              <div className="text-black m-1">
                {selectedItems.reason || "-"}
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
                {selectedItems.comments || "-"}
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
            <div className="ml-6 mt-2 text-dimgray">Route Back</div>

            <div className="overflow-y-auto max-h-96 w-80">
              {RouteBackData && RouteBackData.length > 0 ? (
                RouteBackData.map((item) => (
                  <div key={item.id} className="border-style m-4">
                    <div className="text-dimgray m-2">
                      Date:{" "}
                      <span className="text-black">
                        {item.created_on?.split("T")[0] || "-"}
                      </span>
                    </div>
                    <div className="text-dimgray m-2">
                      Previous Decision:{" "}
                      <span className="text-black">
                        {item?.previous_decision || "-"}
                      </span>
                    </div>

                    <div className="text-dimgray m-2">
                      Updated By:{" "}
                      <span className="text-black">
                        {item.created_by || "-"}
                      </span>
                    </div>
                    <div className="text-dimgray m-2">
                      Remarks:{" "}
                      <span className="text-black">{item.comments || "-"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="m-4 text-dimgray">No data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isLoading && <LoadingSpinner modelClass={"modelClass"} />}
    </>
  );
};

export default RouteBack;
