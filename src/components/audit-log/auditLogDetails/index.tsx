"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "@/common/modal/model";
import MonitorDetails from "@/common/modal/monitorDetails";
import "react-datepicker/dist/react-datepicker.css";
import LoadingSpinner from "@/common/LoadingSpinner";
import Link from "next/link";
import { CONSTANTS, STATUS } from "@/common/constants";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  GetAuditLogItemAsync,
  GetAuditLogItemCountAsync,
  getPageCountAsync,
  productMonitorState,
} from "../../drug-monitor/productMonitor.slice";
import { IDownload } from "../../drug-monitor/productMonitor.model";
import CustomPagination from "@/common/Pagination/CustomPagination";

export interface Item {
  "Monitor ID": string;
  "Monitor name": string;
  "Article id": number;
  "Article title": string;
  "From decision": string;
  "To decision": string;
  Comments: string;
  history: {
    Date: string;
    "Updated by": string;
    "From Decision": string;
    "To Decision": string;
  }[];
}
interface ITime {
  index: number;
  isOpen: boolean;
}

const AuditLog = (context: { params: any }) => {
const [allData, setAllData] = useState<IDownload[]>([]);
  const [selectedItems, setSelectedItems] = useState<IDownload | undefined>();
  const [timeModalOpen, setTimeModalOpen] = useState<ITime>({
    index: -1,
    isOpen: false,
  });
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { params } = context;
  const monitor_id = params?.monitor_id as string;
  const MonitorStatus = params?.status as string;
  const MonitorName = params?.monitor_name as string;
  const { getData, status, TotalAuditLog } =
    useAppSelector(productMonitorState);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { GetPageCount } = useAppSelector(productMonitorState);
  const [perPage, setPerPage] = useState(GetPageCount);
  const [defaultPage, setDefaultPage] = useState(GetPageCount);

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
  useEffect(() => {
    const fetchPageCount = async () => {
      const result = await dispatch(getPageCountAsync());
      const pageCount = result?.payload || 0;

      if (pageCount !== 0) {
        setDefaultPage(pageCount);
        setPerPage(pageCount);
      } else {
        console.error("Page count is 0, re-fetching...");
      }
    };

    fetchPageCount();
  }, [dispatch]);

  useEffect(() => {
    const updateData = async () => {
      setIsLoading(true);
      if (status === STATUS.fulfilled) {
        setAllData(getData);
        setTotalRecords(TotalAuditLog);
        setIsLoading(false);
      }
    };
    updateData();
  }, [getData, status, TotalAuditLog]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = async (pageNumber: number) => {
    setIsLoading(true);
    setCurrentPage(pageNumber);
    const payload = {
      pageNumber,
      perPage,
      id: monitor_id,
      status: MonitorStatus,
    };
    await dispatch(GetAuditLogItemAsync(payload));
    setIsLoading(false);
  };

  const handlePerPageChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIsLoading(true);
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
    const payload = {
      pageNumber: 1,
      perPage: newPerPage,
      id: monitor_id,
      status: MonitorStatus,
    };
    await dispatch(GetAuditLogItemAsync(payload));
    setIsLoading(false);
  };

  const filteredData = allData.filter((item) =>
    item?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <React.Fragment>
      <div className="absolute top-[30px]">
        <div className="flex ml-2 text-14 items-center">
          <div className="mt-3">
            <Link
              href={CONSTANTS.ROUTING_PATHS.ListAuditLog}
              className="no-underline	"
            >
              <div className="flex">
                <div>
                  <Image
                    className="w-[20px]"
                    width={15}
                    height={15}
                    alt=""
                    src="/assets/icons/left-arrow.png"
                  />
                </div>
                <div className="text-14 text-black ml-2 capitalize">
                  <span className="no-underline">Back</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="mt-2 ml-4 w-[50%]">
            <input
              type="text"
              placeholder="Search article title"
              className="w-[100%] text-black border-none text-14 search px-4 py-2"
              onChange={handleSearchInputChange}
            />
            <Image
              className="absolute cursor-pointer right-[12px] top-[20px] w-4 h-4 overflow-hidden"
              alt=""
              width={22}
              height={22}
              src="/assets/icons/search-5-1.svg"
            />
          </div>
        </div>
      </div>
      <div className="main bg-white mt-0 w-[100%] custom-box-shadow">
        <div className="divide-y-2">
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
        </div>
        <div>
          <div className="overflow-x-autos">
            <table className="w-full text-14 border border-collapse table-auto">
              <thead className="border-style text-center">
                <tr className="font-Archivo capitalize text-sm bg-gray-50">
                  <th className="px-4 py-4 thead-style text-center">
                    Article id
                  </th>
                  <th className="px-2 py-4 thead-style text-left">
                    Article title
                  </th>
                  <th className="px-4 py-4 thead-style text-center">History</th>
                </tr>
              </thead>
              {filteredData.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center">
                      No records found
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      className="border-b cursor-pointer text-center text-sm border-style hover:bg-ghostwhite"
                      key={index}
                      onClick={() => {
                        setSelectedItems(item);
                        setTimeModalOpen((prev) => ({
                          ...prev,
                          index,
                          isOpen: true,
                        }));
                      }}
                    >
                      <td className="px-3 text-center py-6">
                        {item.article_id || "-"}
                      </td>
                      <td className="px-3 py-6 text-black text-left">
                        {item.title || "-"}
                      </td>
                      <td className="px-2 py-6 text-black text-center ">
                        <div className="flex justify-center">
                          <button className="bg-transparent cursor-pointer  w-fit m-auto">
                            <Image
                              src="/assets/icons/time-past.png"
                              width={15}
                              height={15}
                              alt="search icon"
                              className=""
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
        {isLoading && <LoadingSpinner />}
        {filteredData.length > 0 && (
          <CustomPagination
            currentPage={currentPage}
            perPage={perPage}
            totalRecords={Number(totalRecords)}
            handlePageChange={handlePageChange}
            handlePerPageChange={handlePerPageChange}
          />
        )}
        <Modal
          isOpen={timeModalOpen.isOpen}
          childElement={
            <MonitorDetails
              MonitorName={MonitorName}
              isOpen={timeModalOpen.isOpen}
              selectedItems={selectedItems!}
              onClose={() => setTimeModalOpen({ index: -1, isOpen: false })}
            />
          }
        />
      </div>
    </React.Fragment>
  );
};

export default AuditLog;
