"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  STATUS,
  SelectReporting,
  systemMessage,
} from "@/common/constants";
import EmailSenderComponent from "@/common/EmailSender";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { auditRepotdata } from "@/common/data";

import { Utils } from "../../../utils/utils";
import LoadingSpinner from "@/common/LoadingSpinner";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
 
  GetAllCountReportAsync,
  GetAllReportAsync,
  SendEmailAsync,
  addReportAsync,
  addReportArtcleIdAsync,
  getReportAsync,
  reportState,
} from "./report.slice";
import {
  IDashboardData,
  IGetReportAll,
  IGetReportSignedUrl,
  IReportResponse,
} from "./report.model";
import Toast from "@/common/Toast";
import e from "express";
import CustomPagination from "@/common/Pagination/CustomPagination";
// @ts-ignore
import { exportToExcel } from "react-easy-export";
import { SortOption } from "../../../utils/sortingUtils";
import {
  getPageCountAsync,
  productMonitorState,
} from "@/components/drug-monitor/productMonitor.slice";
import Dashboard from "@/common/Dasbord-report";
interface Option {
  readonly label: string;
  readonly value: string;
}
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

const Report = () => {
  const dispatch = useAppDispatch();
  const editRef = useRef<HTMLDivElement>(null);
  const {
    loading,
    status,
 
    Report,
    GetReport,
    GetAllReport,
    TotalReport,
  } = useAppSelector(reportState);
  const [isLoading, setIsLoading] = useState(false);
  const [allData, setAllData] = useState<Item[]>([]);
 
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);

  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [getReport, setGetReport] = useState<IReportResponse>();
  const [getReportUrl, setGetReportUrl] = useState<IGetReportSignedUrl>();

  const [selectedReportDate, setSelectedReportDate] = useState<{
    startReportDate: Date | string;
    endReportDate: Date | string;
  }>({
    startReportDate: format(
      new Date(new Date().setDate(new Date().getDate() - 30)),
      "yyyy-MM-dd"
    ),
    endReportDate: format(new Date(), "yyyy-MM-dd"),
  });


  const { startReportDate, endReportDate } = selectedReportDate;
  const [formValues, setFormValues] = useState({
    selectedTeam: "Team Jupiter",
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [timeModalOpen, setTimeModalOpen] = useState<ITime>({
    index: -1,
    isOpen: false,
  });
  const [startDateRange, setStartDateRange] = useState(new Date());
  const [endDateRange, setEndDateRange] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [articleId, setArticleId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
const { GetPageCount } =useAppSelector(productMonitorState);
  const [perPage, setPerPage] = useState(GetPageCount);
const[defaultPage,setDefaultPage] = useState(GetPageCount)
  const [reportData, setReportData] = useState<IGetReportAll[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [displayedCategory, setDisplayedCategory] = useState("");
  const [startDateDropdownOpen, setStartDateDropdownOpen] = useState(false);
  const [ createdDateDropdownOpen,  setCreatedDateDropdownOpen] = useState(false);

 
  const [endDateDropdownOpen, setEndDateDropdownOpen] = useState(false);
  const startDateDropdownRef = useRef<HTMLDivElement>(null);
  const endDateDropdownRef = useRef<HTMLDivElement>(null);
  const createdDateDropdownRef = useRef<HTMLDivElement>(null);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof IGetReportAll;
    direction: "ascending" | "descending" | "" | "";
  }>({
    key: "id",
    direction: "",
  });

  // const onChange = (dates: any) => {
  //   const [start, end] = dates;
  //   setStartDateRange(start);
  //   setEndDateRange(end);
  // };
 
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        startDateDropdownRef.current &&
        !startDateDropdownRef.current.contains(event.target as Node)
      ) {
        setStartDateDropdownOpen(false);
      }
      if (
        endDateDropdownRef.current &&
        !endDateDropdownRef.current.contains(event.target as Node)
      ) {
        setEndDateDropdownOpen(false);
      }  
 if (
        createdDateDropdownRef.current &&
        !createdDateDropdownRef.current.contains(event.target as Node)
      ) {
        setCreatedDateDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  const handleStartDateSort = (direction: "ascending" | "descending" | "") => {
    if (sortConfig.key === "from_date" && sortConfig.direction === direction) {
      return;
    }

    requestSort("from_date", direction);
    setStartDateDropdownOpen(false);
  };
  const handleEndDateSort = (direction: "ascending" | "descending" | "") => {
    if (sortConfig.key === "to_date" && sortConfig.direction === direction) {
      return;
    }

    requestSort("to_date", direction);
    setEndDateDropdownOpen(false);
  };
const handleCreatedDateSort = (direction: "ascending" | "descending" | "") => {
    if (sortConfig.key === "to_date" && sortConfig.direction === direction) {
      return;
    }

    requestSort("to_date", direction);
    setCreatedDateDropdownOpen(false);
  };
  const requestSort = (
    key: keyof IGetReportAll,
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.direction == "") {
      direction;
    }
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
 

 
useEffect(() => {
  const fetchData = async () => {
    if (defaultPage !== 0) {
    dispatch(GetAllCountReportAsync());
    const payload = {
      perPage: perPage,
      pageNumber: currentPage,
    };
    dispatch(GetAllReportAsync(payload));
   }
  };

  fetchData();
}, [defaultPage, dispatch]);

useEffect(() => {
  const fetchPageCount = async () => {
    const result = await dispatch(getPageCountAsync()); 
    const pageCount = result?.payload || 0; 

    if (pageCount !== 0) {
      setDefaultPage(pageCount); 
    setPerPage(pageCount)
    } else {
     
      console.error("Page count is 0, re-fetching...");
    }
  };

  fetchPageCount();
}, [dispatch]);



  useEffect(() => {
    setGetReport(undefined);
    setGetReportUrl(undefined);
  }, [loading]);

  useEffect(() => {
    if (status === STATUS.fulfilled) {
      setGetReport(Report);
      setGetReportUrl(GetReport);
      setReportData(GetAllReport);
    }
  }, [status, GetReport, Report, GetAllReport]);




  const resetFilters = () => {
    setSearchQuery("");
    setAllData(auditRepotdata);
    setSelectedTags([]);
    setGetReport(undefined);
    setGetReportUrl(undefined);
    setFormValues({
      selectedTeam: "Team Jupiter",
    });
    setSelectedCategory("");
  };
  const userIsMasterAdmin = true;

  /**
   * Handles exporting all data to Excel format.
   */
  const handleExportAllDataClick = () => {
    setIsExportLoading(true);

    if (!getReport || !getReport.data || [getReport.data].length === 0) {
      setIsExportLoading(false);
      return;
    }

    // Construct CSV data
    const csvHeaders: (keyof IReportResponse["data"])[] = [
      "report_id",
      "s3_identifier",
      "is_encrypted",
      "password",
      "created_on",
      "modified_on",
      "status",
      "user_name",
      "from_date",
      "to_date",
    ];

    const renderData = [
      csvHeaders,
      ...[getReport.data].map((item) => csvHeaders.map((key) => item[key])),
    ];

    exportToExcel(
      renderData,
      `exported_all_data_${Utils.getCurrentDateAndTime()}.xls`
    );

    setIsExportLoading(false);
  };

 

  const handleReportDateChange = async (
    date: string | null,
    dateType: string
  ) => {
    let newSelectedDate = { ...selectedReportDate };
    if (dateType === "startDate") {
      newSelectedDate.startReportDate = date
        ? typeof date === "string"
          ? date
          : new Date()
        : new Date();
    } else if (dateType === "endDate") {
      newSelectedDate.endReportDate = date
        ? typeof date === "string"
          ? date
          : new Date()
        : new Date();
    }
    setSelectedReportDate(newSelectedDate);
  };

  const handleSubmit = async () => {
    try {
      if (selectedCategory === "Article-Details") {
        const payload = {
          report_category: "Article-Tracking",
          article_id: articleId,
        };
        const response = await dispatch(addReportArtcleIdAsync(payload));
        if (addReportArtcleIdAsync.fulfilled.match(response)) {
          if (response.payload.status == 201) {
            Toast(systemMessage.AddReportSuccess, { type: "success" });
            await dispatch(getReportAsync(response?.payload?.data?.id));
            setIsLoading(false);
          }
          setIsLoading(false);
        } else {
          Toast(systemMessage.Something_Wrong, { type: "error" });
          setIsLoading(false);
        }

        return;
      }
      setDisplayedCategory(selectedCategory);
      setIsLoading(true);
      const payload = {
        report_category: selectedCategory,
        from_date: startReportDate,
        to_date: endReportDate,
      };

      const response = await dispatch(addReportAsync(payload));
      if (addReportAsync.fulfilled.match(response)) {
        if (response.payload.status == 201) {
          // Toast(systemMessage.AddReportSuccess, { type: "success" });
          await dispatch(getReportAsync(response?.payload?.data?.id));
          setIsLoading(false);
        }
        setIsLoading(false);
      } else {
        Toast(systemMessage.Something_Wrong, { type: "error" });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Handles the download of a file using an anchor element.
   * @param e The event object (e.g., click event).
   */
  const handleDownload = async (e: any) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const anchor = document.createElement("a");
      anchor.href = getReportUrl?.url as string;
      anchor.download = getReportUrl?.url as string;
      anchor.click();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const payload = { pageNumber, perPage };
    dispatch(GetAllReportAsync(payload));
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
    const payload = { pageNumber: 1, perPage: newPerPage };
    dispatch(GetAllReportAsync(payload));
  };

  const handleEmailSend = async (tags: string[]) => {
    try {
      setIsLoading(true);
      const payload = {
        report_category: selectedCategory,
        from_date: startReportDate,
        to_date: endReportDate,
        emails: tags,
      };
      const res = await dispatch(SendEmailAsync(payload));
      if (SendEmailAsync.fulfilled.match(res)) {
        setIsLoading(false);
        if (res.payload.status === 200) {
          Toast(systemMessage.SendMailSuccess, { type: "success" });
        } else {
          setIsLoading(false);
          Toast(systemMessage.Something_Wrong, { type: "error" });
        }
      } else {
        setIsLoading(false);
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
    } catch (error) {
      console.error("Error occurred during download:", error);
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedCategory(e.target.value);
  };

  const handleLinkDownload = async (e: any, url: string) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const anchor = document.createElement("a");
      anchor.href = url as string;
      anchor.download = url as string;
      anchor.click();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const sortedData =
    Array.isArray(reportData) &&
    [...reportData].sort((a, b) => {
      let valueA: number | string = "";
      let valueB: number | string = "";

      if (typeof a[sortConfig.key] === "string") {
        valueA = a[sortConfig.key] as string;
      } else if (typeof a[sortConfig.key] === "number") {
        valueA = a[sortConfig.key] as unknown as number;
      }

      if (typeof b[sortConfig.key] === "string") {
        valueB = b[sortConfig.key] as string;
      } else if (typeof b[sortConfig.key] === "number") {
        valueB = b[sortConfig.key] as unknown as number;
      }

      if (sortConfig.direction === "ascending") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  return (
    <React.Fragment>
      <h3 className="absolute top-3 ml-2">Reports</h3>

<Dashboard/>
<div className="main bg-white mt-4 w-[100%] custom-box-shadow">
        <div className="divide-y-2">
          <h3 className="ml-6 mt-5 pt-2">Report</h3>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
          <div className="flex">
            {/* <div className="ml-4 mt-4 p-2 relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-60 h-5 text-14 text-dimgray border border-gray rounded-md"
              />
              <div className="absolute top-5 left-60">
                <Image
                  src="/assets/icons/search-5-1.svg"
                  width={15}
                  height={15}
                  alt="search icon"
                />
              </div>
            </div> */}
            {/* {userIsMasterAdmin && (
              <div className="ml-6 mt-2">
                <select
                  className="block text-dimgray text-14 mt-[16px] border cursor-pointer w-[255px] px-4 py-[9px] pr-8 text-sm leading-tight bg-white border-gray rounded-md appearance-none focus:outline-none focus:border-blue-500"
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      selectedTeam: e.target.value,
                    })
                  }
                  value={formValues.selectedTeam}
                >
                  <option value={""}>Select Purpose</option>
                  {SelectPurpose.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )} */}
            <div className="flex absolute right-5 mt-3">
              <div className="mt-4 mr-2">
                <EmailSenderComponent
                  handleSend={(tags: string[]) => {
                    handleEmailSend(tags);
                  }}
                  customClasses="right-8"
                  disabled={!selectedCategory}
                />
              </div>
              <div className="m-2">
                <button
                  className="rounded-md border bg-silver cursor-pointer border-gray text-sm font-medium font-archivo px-8 py-3"
                  onClick={resetFilters}
                >
                  Reset Filter
                </button>
              </div>
              <div className="relative m-2">
                <button
                  className={`${
                     !getReport || !getReport.data || !Utils.isPermissionGranted("export_files") ? "disabled-select" : ""
                  } rounded-md border ml-2 cursor-pointer border-gray text-sm font-medium font-archivo px-8 py-3 bg-yellow text-white text-14`}
                  onClick={handleExportAllDataClick}
                  disabled={!getReport || !getReport.data || !Utils.isPermissionGranted("export_files")}
                >
                  Export
                </button>
                <>
                  <div className="absolute cursor-pointer top-1 ml-2">
                    <Image
                      src="/assets/icons/download-white.svg"
                      alt="download icon"
                      width={15}
                      height={15}
                      className={`left-0 ml-2 top-0 mt-2 `}
                    />
                  </div>
                </>
              </div>
              {isExportLoading && <LoadingSpinner text={"Downloading"} />}
            </div>
          </div>
          <div className="w-[19%] flex relative ml-6 mt-6">
            <div>
              <select
                className="block text-dimgray text-14 border cursor-pointer w-[400px] px-4 py-[9px] pr-8 text-sm leading-tight bg-white border-gray rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={handleCategoryChange}
                value={selectedCategory}
              >
                <option value="">Select report category</option>
                {SelectReporting.map((item, index) => (
                  <option
                    title={item.description}
                    key={index}
                    value={item.category}
                  >
                    {item.category}
                  </option>
                ))}
              </select>
            </div>
            {/* <div>
              <select
                className="block text-dimgray ml-3 text-14 border cursor-pointer w-[255px] px-4 py-[9px] pr-8 text-sm leading-tight bg-white border-gray rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) =>
                  setSelectedCategory({
                    selectedTeam: e.target.value,
                  })
                }
                value={selectedCategory.selectedTeam}
              >
                <option value="">Select sub category</option>
                {SelectSubReporting.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="flex ml-3 w-72">
              {selectedCategory === "Article-Details" ? (
                <>
                  <div className="ml-3">
                    <input
                      type="text"
                      placeholder="Article ID"
                      className="w-32 relative text-14 rounded-md border px-4 py-[6px]"
                      onChange={(e) => setArticleId(e.target.value)}
                      value={articleId}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex ml-3 w-80">
                    <DatePicker
                      selected={
                        typeof startReportDate === "string"
                          ? new Date(startReportDate)
                          : startReportDate
                      }
                      onChange={(date: Date | null) => {
                        if (date) {
                          const formattedDate = format(date, "yyyy-MM-dd");
                          handleReportDateChange(formattedDate, "startDate");
                        } else {
                          handleReportDateChange("", "startDate");
                        }
                      }}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Start Date"
                      className="w-32 relative text-14 rounded-md"
                      maxDate={new Date(endReportDate) || new Date()}
                      isClearable
                    />
                    <div className="ml-4">
                      <DatePicker
                        selected={
                          typeof endReportDate === "string"
                            ? new Date(endReportDate)
                            : endReportDate
                        }
                        onChange={(date: Date | null) => {
                          if (date) {
                            const formattedDate = format(date, "yyyy-MM-dd");
                            handleReportDateChange(formattedDate, "endDate");
                          } else {
                            handleReportDateChange("", "endDate");
                          }
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="End Date"
                        className="w-32 relative text-14 rounded-md"
                        minDate={new Date(startReportDate)}
                        maxDate={new Date()}
                        isClearable
                      />
                    </div>
                  </div>
                </>
              )}
              {/* <ExportOptions
                selectedOption={selectedExportOption}
                onChange={handleExportOptionChange}
              /> */}
              <div>
                <button
                  className={`button-style-export cursor-pointer ml-4 border-none px-8 py-3 text-white rounded-md
                  ${
                    !selectedCategory || !startReportDate || !endReportDate
                      ? "disabled-select"
                      : ""
                  }
                  `}
                  disabled={
                    !selectedCategory || !startReportDate || !endReportDate
                  }
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
        </div>
        <div>
          <div className="overflow-style">
            <table className="w-full  text-14 border border-collapse table-auto">
              <thead className="border-style text-center">
                <tr className="font-Archivo capitalize text-sm bg-gray-50">
                  {/* <th className="px-2 py-4 thead-style text-center">Purpose</th> */}
                  <th className="pl-6 px-2 py-6 w-60 thead-style text-center">
                    Report Category
                  </th>
                  <th className=" px-2 py-4 thead-style text-center">
                    Report id
                  </th>
                  <th className=" px-2 py-4 thead-style text-center">
                    User Name
                  </th>
                  <th className="px-2 py-4 thead-style text-center">Status</th>
                  {/* <th className="px-2 py-4 thead-style text-center">
                    Sub Category
                  </th> */}
 <th className="py-4 thead-style text-center">Date created</th>
                  <th className="py-4 thead-style text-center">
                    Start date
                  </th>

                  <th className="py-4 thead-style text-center">End date</th>
                  {/* <th className="px-2 py-4 thead-style text-center">
                    Report Type ( PDF / CSV)
                  </th> */}
                  <th className="text-center px-2 py-4 thead-style">Link</th>
                </tr>
              </thead>
              <tbody>
 {Object.keys(getReportUrl || getReport || {}).length ? (
  <tr
    className="border-b text-center text-sm border-style hover:bg-ghostwhite"
    key={1}
  >
    <td className="pl-4 px-3 py-6 text-center">
      {getReport?.data?.category || "-"}
    </td>
    <td className="px-2 py-6 text-center">
      {getReport?.data?.report_id}
    </td>
    <td className="px-2 py-6 text-center">
      {getReport?.data?.user_name}
    </td>
    <td className="px-2 py-6 text-center">
      {getReport?.data?.status}
    </td>
<td className="py-6 text-black text-center">
      {getReport?.data?.created_on?.split("T")[0]}
    </td>
    <td className="py-6 text-black text-center">
      {getReport?.data?.from_date?.split("T")[0]}
    </td>
    <td className="py-6 text-black text-center">
      {getReport?.data?.to_date?.split("T")[0]}
    </td>
    {getReport?.data?.status === "Completed" ? (
      <td
        className="px-1 py-6 text-black"
        onClick={(e) => handleDownload(e)}
      >
        <Image
          src="/assets/icons/download-black.svg"
          alt="download icon"
          width={15}
          height={15}
          title="Download"
          className="left-0 top-0 mt-2 cursor-pointer"
        />
      </td>
    ) : <td
  className={`px-1 py-6 text-black opacity-10 cursor-not-allowed`}

>
  <Image
    src="/assets/icons/download-black.svg"
    alt="download icon"
    width={15}
    height={15}
    title="Download"
    className="left-0 top-0 mt-2"
  />
</td>}
  </tr>
) : (
  <tr>
    <td colSpan={7} className="px-3 py-6 text-center">
      No record found
    </td>
  </tr>
)}

              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="main bg-white mt-4 w-[100%] custom-box-shadow">
        <div className="divide-y-2">
          <h3 className="ml-6 mt-5 pt-2">Report List</h3>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
        </div>
        <div>
          <div className="overflow-style">
            <table className="w-full  text-14 border border-collapse table-auto">
              <thead className="border-style text-center">
                <tr className="font-Archivo capitalize text-sm bg-gray-50">
                  <th className="pl-4 w-64 px-2 py-6 thead-style text-center">
                    Report Category
                  </th>
                  <th className=" px-2 py-4 thead-style text-center">
                    Report id
                  </th>
                  <th className=" px-2 py-4 thead-style text-center">
                    User Name
                  </th>
                  <th className="px-2 py-4 thead-style text-center">Status</th>
 <th className="py-3 text-center w-32 hover-text-style date-created-width">
                    <div ref={startDateDropdownRef} className="relative">
                      <span
                        className="flex w-full -ml-2 px-4 py-4 hover-text-style items-center  cursor-pointer"
                        onClick={() =>
                          setCreatedDateDropdownOpen(!createdDateDropdownOpen)
                        }
                      >
                        {" "}
                        Date created
                        <Image
                          src="/assets/icons/sort.svg"
                          alt="sort"
                          width={15}
                          height={15}
                          className={`ml-3 ${
                            sortConfig.direction === "ascending"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </span>

                      {createdDateDropdownOpen && (
                        <div className="absolute top-14 w-[190px] bg-white border rounded-lg shadow-lg">
                          <SortOption
                            label="Sort Ascending"
                            direction="ascending"
                            active={sortConfig.direction}
                            onClick={handleCreatedDateSort}
                            iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                          <SortOption
                            label="Sort Descending"
                            direction="descending"
                            active={sortConfig.direction}
                            onClick={handleCreatedDateSort}
                            iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="py-3 text-center w-32 hover-text-style date-created-width">
                    <div ref={startDateDropdownRef} className="relative">
                      <span
                        className="flex w-full -ml-2 px-4 py-4 hover-text-style items-center  cursor-pointer"
                        onClick={() =>
                          setStartDateDropdownOpen(!startDateDropdownOpen)
                        }
                      >
                        {" "}
                        Start Date
                        <Image
                          src="/assets/icons/sort.svg"
                          alt="sort"
                          width={15}
                          height={15}
                          className={`ml-3 ${
                            sortConfig.direction === "ascending"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </span>

                      {startDateDropdownOpen && (
                        <div className="absolute top-14 w-[190px] bg-white border rounded-lg shadow-lg">
                          <SortOption
                            label="Sort Ascending"
                            direction="ascending"
                            active={sortConfig.direction}
                            onClick={handleStartDateSort}
                            iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                          <SortOption
                            label="Sort Descending"
                            direction="descending"
                            active={sortConfig.direction}
                            onClick={handleStartDateSort}
                            iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="py-3 w-32 text-center hover-text-style date-created-width">
                    <div ref={endDateDropdownRef} className="relative">
                      <span
                        className="flex w-full -ml-2 px-4 py-4 hover-text-style items-center  cursor-pointer"
                        onClick={() =>
                          setEndDateDropdownOpen(!endDateDropdownOpen)
                        }
                      >
                        {" "}
                        End Date
                        <Image
                          src="/assets/icons/sort.svg"
                          alt="sort"
                          width={15}
                          height={15}
                          className={`ml-3 ${
                            sortConfig.direction === "ascending"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </span>

                      {endDateDropdownOpen && (
                        <div className="absolute top-14 w-[190px] bg-white border rounded-lg shadow-lg">
                          <SortOption
                            label="Sort Ascending"
                            direction="ascending"
                            active={sortConfig.direction}
                            onClick={handleEndDateSort}
                            iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                          <SortOption
                            label="Sort Descending"
                            direction="descending"
                            active={sortConfig.direction}
                            onClick={handleEndDateSort}
                            iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="text-center px-2 py-4 thead-style">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody className="text-14">
                {Array.isArray(sortedData) && sortedData.length !== 0 ? (
                  sortedData?.map((item, index) => (
                    <tr
                      className="border-b text-center text-sm border-style hover:bg-ghostwhite"
                      key={1}
                    >
                      <td className="text-center px-4 py-6">
                        {" "}
                        {item?.category || "-"}
                      </td>
                      <td className="text-center px-2 py-6">
                        {item?.report_id || "-"}
                      </td>
                      <td className="text-center px-2 py-6 text-lightslategray">
                        {item?.user_name || "-"}
                      </td>
                      <td className="text-center px-2 py-2 text-lightslategray date-width">
                        {item?.status || "-"}
                      </td>
 <td className="text-center px-2 py-6 text-lightslategray date-width">
                        {item?.created_on?.split("T")[0] || "-"}
                      </td>
                      <td className="text-center px-2 py-6 text-lightslategray date-width">
                        {item?.from_date?.split("T")[0] || "-"}
                      </td>
                      <td className="px-2 py-6 text-lightslategray text-center">
                        {item?.to_date?.split("T")[0] || "-"}
                      </td>
                      <td
                        className="px-1 py-6 text-black"
                        onClick={(e) => handleLinkDownload(e, item.url)}
                      >
                        <Image
                          src="/assets/icons/download-black.svg"
                          alt="download icon"
                          width={15}
                          height={15}
                          title="Download"
                          className="left-0 top-0 mt-2 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center">
                        No record found
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {reportData?.length > 0 && (
          <CustomPagination
            currentPage={currentPage}
            perPage={perPage}
            totalRecords={Number(totalRecords)}
            handlePageChange={handlePageChange}
            handlePerPageChange={handlePerPageChange}
          />
        )}
      </div>
      {isLoading && <LoadingSpinner />}
    </React.Fragment>
  );
};

export default Report;
