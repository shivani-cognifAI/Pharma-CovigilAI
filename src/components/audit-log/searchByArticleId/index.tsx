"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CONSTANTS } from "@/common/constants";
import Link from "next/link";
import Image from "next/image";
import {
  GetAuditLogItemAsync,
  GetAuditLogItemCountAsync,
  productMonitorState,
} from "@/components/drug-monitor/productMonitor.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import MonitorDetails from "@/common/modal/monitorDetails";
import { IDownload } from "@/components/drug-monitor/productMonitor.model";
import {  AuditLogState } from "../auditLogDetails/auditLog.slice";

function AuditLogArticleId(context: { params: any }) {
  const { GetPageCount } = useAppSelector(productMonitorState);
  const [perPage, setPerPage] = useState(GetPageCount);
  const [defaultPage, setDefaultPage] = useState(GetPageCount);
  const { monitor_id,MonitorStatus } = useAppSelector(AuditLogState);
const [selectedData, setSelectedData] = useState<IDownload[]>([]);;

  const { getData } = useAppSelector(productMonitorState);
  const dispatch = useAppDispatch();
  const { params } = context;
  const router = useRouter();


const article_id = params?.articleId;

useEffect(() => {
  const fetchData = async () => {
    if (defaultPage !== 0) {
      const countPayload = {
        id: monitor_id,
        status: MonitorStatus,
      };
      dispatch(GetAuditLogItemCountAsync(countPayload));

      const payload = {
        id: monitor_id,
        status: MonitorStatus,
        pageNumber: 1,
        perPage: perPage,
      };
      dispatch(GetAuditLogItemAsync(payload));
    }
  };

  fetchData();
}, [defaultPage, dispatch, monitor_id]);

// Filter `getData` based on `article_id`
useEffect(() => {
  if (getData?.length > 0 && article_id) {
    const filteredData = getData.filter((item) => item.article_id === article_id);
    setSelectedData(filteredData);
  }
}, [getData, article_id]);

  // Handle browser back button navigation
  useEffect(() => {
    const handleBackNavigation = () => {
      if (
        window.location.pathname.includes(CONSTANTS.ROUTING_PATHS.ListAuditLog)
      ) {
        router.replace(CONSTANTS.ROUTING_PATHS.ListAuditLog); // Redirect back to main list
      }
    };

    window.addEventListener("popstate", handleBackNavigation);
    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
    };
  }, []);

  return (
    <div className="">
      <div className="absolute top-[30px]  ">
        <div className="flex ml-2 text-14 items-center">
          <div className="mt-3" >
        {/* Back button manually navigating to ListAuditLog */}
             <Link
              href={CONSTANTS.ROUTING_PATHS.ListAuditLog}
              className="no-underline"
            >
              <div className="flex cursor-pointer">
                <Image
                  className="w-[20px]"
                  width={15}
                  height={15}
                  alt="Back"
                  src="/assets/icons/left-arrow.png"
                />
                <span className="text-14 text-black ml-2 capitalize no-underline">
                  Back
                </span>
              </div>
</Link>
          </div>
        </div>
      </div>

      <MonitorDetails
        MonitorName={selectedData?.[0]?.monitor_name}
        isOpen={true}
        selectedItems={selectedData?.[0]}
        onClose={() => {}}
      />
    </div>
  );
}

export default AuditLogArticleId;
