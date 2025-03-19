import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  CONSTANTS,
  STATUS,
  systemMessage,
} from "@/common/constants";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import EmailSenderComponent from "@/common/EmailSender";
import LoadingSpinner from "@/common/LoadingSpinner";
import CustomPagination from "@/common/Pagination/CustomPagination";
import { StatusChangeAsync } from "@/components/abstract-review/abstract-review.slice";
import Toast from "@/common/Toast";
import { IItem } from "../../advance.model";
import {
  AdvanceReviewDataState,
  AdvancedReviewCancelledDataAsync,
  AdvancedReviewCancelledTotalCountAsync,
} from "../../advance-review.slice";
import { SortOption } from "../../../../../utils/sortingUtils";
import { Utils } from "../../../../../utils/utils";

import * as XLSX from 'xlsx';

import {
  getHeaderColumnAsync,
  GetItemDownloadDataAsync,
  GetItemQcExportDataAsync,
  SentMonitorEmailAsync,
} from "@/components/drug-monitor/productMonitor.slice";
import ExportDropdown from "@/common/exportDropdowns/ExportDropdwon";
// @ts-ignore
import { exportToExcel } from "react-easy-export";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  getPageCountAsync,
  productMonitorState,
} from "@/components/drug-monitor/productMonitor.slice";
import productMonitor from "../../../../../pages/api/productMonitor";

interface Item {
  ID: string;
  "Monitor Name": string;
  Description: string;
  "Total Records": string;
  "Pending Case": number;
  "Due Date": string;
}

interface IProps {
  searchQuery: string;
  label: string;
}
const Cancelled: React.FC<IProps> = ({ label }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterData, setFilteredData] = useState<IItem[]>([]);
  const [monitorDropdownOpen, setMonitorDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [recordsDropdownOpen, setRecordsDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
 const [createdByDropdownOpen, setCreatedByDropdownOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pendingRecordsDropdownOpen, setPendingRecordsDropdownOpen] =
    useState(false);

  const [dateCreatedDropdownOpen, setdateCreatedDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const [fetchAdvanceReviewCancelledData, setFetchAdvanceReviewCancelledData] =
    useState<IItem[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
 const { GetPageCount } =useAppSelector(productMonitorState);
  const [perPage, setPerPage] = useState(GetPageCount);
const[defaultPage,setDefaultPage] = useState(GetPageCount);

  const { advanceReviewCancelledData, status, TotalCancelledCount } =
    useAppSelector(AdvanceReviewDataState);

  useEffect(() => {
const fetchData = async () => {
    if (defaultPage !== 0) {
    const fetchData = async () => {
      const payload = {
        pageNumber: 1,
        perPage: defaultPage,
      };
      dispatch(AdvancedReviewCancelledTotalCountAsync());
      dispatch(AdvancedReviewCancelledDataAsync(payload));
    };
    fetchData();
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
    const updateData = async () => {
      setIsLoading(true);
      if (status === STATUS.fulfilled) {
        setTotalRecords(TotalCancelledCount);
        setFetchAdvanceReviewCancelledData(advanceReviewCancelledData);
        setIsLoading(false);
      }
    };
    updateData();
  }, [status, advanceReviewCancelledData, TotalCancelledCount]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const payload = { pageNumber, perPage };
    dispatch(AdvancedReviewCancelledDataAsync(payload));
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
    const payload = { pageNumber: 1, perPage: newPerPage };
    dispatch(AdvancedReviewCancelledDataAsync(payload));
  };

  useEffect(() => {
    setIsLoading(true);
    if (fetchAdvanceReviewCancelledData?.length) {
      setIsLoading(false);
      setFilteredData(fetchAdvanceReviewCancelledData);
      setMessage("");
    } else {
      setIsLoading(false);
      setFilteredData([]);
      setMessage(systemMessage.not_found);
    }
  }, [fetchAdvanceReviewCancelledData]);

  const [openModals, setOpenModals] = useState(
    new Array(filterData.length).fill(false)
  );

  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);

  const monitorDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const recordsDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const dateCreatedDropdownRef = useRef<HTMLDivElement>(null);
 const createdByDropdownRef = useRef<HTMLDivElement>(null);

  const pendingCaseDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        monitorDropdownRef.current &&
        !monitorDropdownRef.current.contains(event.target as Node)
      ) {
        setMonitorDropdownOpen(false);
      }
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setDateDropdownOpen(false);
      }
if (
        createdByDropdownRef.current &&
        !createdByDropdownRef.current.contains(event.target as Node)
      ) {
        setCreatedByDropdownOpen(false);
      }
      if (
        recordsDropdownRef.current &&
        !recordsDropdownRef.current.contains(event.target as Node)
      ) {
        setRecordsDropdownOpen(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setStatusDropdownOpen(false);
      }
      if (
        dateCreatedDropdownRef.current &&
        !dateCreatedDropdownRef.current.contains(event.target as Node)
      ) {
        setdateCreatedDropdownOpen(false);
      }
      if (
        pendingCaseDropdownRef.current &&
        !pendingCaseDropdownRef.current.contains(event.target as Node)
      ) {
        setPendingRecordsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isModalOpen &&
        actionRef.current &&
        !actionRef.current.contains(event.target as Node)
      ) {
        const newOpenModals = [...openModals];
        newOpenModals[openModalIndex!] = false;
        setOpenModals(newOpenModals);
        setIsModalOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isModalOpen, openModals, openModalIndex]);

  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      if (!actionRef.current) return;
      if (!isModalOpen || actionRef.current.contains(event.target as Node))
        return;
      setIsModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, []);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof IItem;
    direction: "ascending" | "descending" | "";
  }>({
   key: "created_on",
    direction: "descending",
  });

  const sortedFilteredData = [...filterData].sort((a, b) => {
    let valueA: number | string = "";
    let valueB: number | string = "";

    if (typeof a[sortConfig.key] === "string") {
      valueA = a[sortConfig.key] as string;
    } else if (typeof a[sortConfig.key] === "number") {
      valueA = a[sortConfig.key] as number;
    }

    if (typeof b[sortConfig.key] === "string") {
      valueB = b[sortConfig.key] as string;
    } else if (typeof b[sortConfig.key] === "number") {
      valueB = b[sortConfig.key] as number;
    }

    if (sortConfig.direction === "ascending") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const handleMonitorNameSort = (
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.key === "name" && sortConfig.direction === direction) {
      return;
    }

    requestSort("name", direction);
    setMonitorDropdownOpen(false);
  };

  const handleDateSort = (direction: "ascending" | "descending" | "") => {
    if (sortConfig.key === "to_date" && sortConfig.direction === direction) {
      return;
    }

    requestSort("to_date", direction);
    setDateDropdownOpen(false);
  };

  const handleRecordsSort = (direction: "ascending" | "descending" | "") => {
    if (
      sortConfig.key === "total_records" &&
      sortConfig.direction === direction
    ) {
      return;
    }

    requestSort("total_records", direction);
    setRecordsDropdownOpen(false);
  };
  const handleDateCreatedSort = (
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.key === "created_on" && sortConfig.direction === direction) {
      return;
    }

    requestSort("created_on", direction);
    setdateCreatedDropdownOpen(false);
  };

  const handlePendingRecordsSort = (
    direction: "ascending" | "descending" | ""
  ) => {
    if (
      sortConfig.key === "pending_records" &&
      sortConfig.direction === direction
    ) {
      return;
    }

    requestSort("pending_records", direction);
    setPendingRecordsDropdownOpen(false);
  };
const handleCreatedBySort = (
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.key === "created_by" && sortConfig.direction === direction) {
      return;
    }

    requestSort("created_by", direction);
    setCreatedByDropdownOpen(false);
  }
  const requestSort = (
    key: keyof IItem,
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.direction == "") {
      direction = direction;
    }
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleRowClick = (item: IItem) => {
    setIsLoading(true);
    router.push(`${CONSTANTS.ROUTING_PATHS.advancedReview2}/${item.id}`);
  };

  const handleStatus = async (item: IItem, index: number, status: string) => {
    try {
      setIsLoading(true);
      const payload = { id: item.id, status: status };
      const response = await dispatch(StatusChangeAsync(payload));
      if (StatusChangeAsync.fulfilled.match(response)) {
        if (response.payload.status === 200) {
          setIsLoading(false);
          if (status === "Completed") {
            Toast(systemMessage.MarkCompleted, { type: "success" });
          } else if (status === "AI Review Completed") {
            Toast(systemMessage.MarkInProgress, { type: "success" });
          } else {
            Toast(systemMessage.MaskCancelled, { type: "success" });
          }
          const payload = {
            pageNumber: 1,
            perPage: perPage,
          };
          dispatch(AdvancedReviewCancelledDataAsync(payload));
          const newOpenModals = [...openModals];
          newOpenModals[index] = false;
          setOpenModals(newOpenModals);
          setIsModalOpen(false);
        } else {
          setIsLoading(false);
          Toast(systemMessage.ErrorInCompleted, { type: "error" });
        }
      }
    } catch (error: unknown) {
      setIsLoading(false);
    }
  };

  const handleEmailSend = async (tags: string[]) => {
    try {
      setIsLoading(true);
      const payload = {
        expert_review_type: "QC",
        page: currentPage,
        per_page: perPage,
        count: false,
        emails: tags,
        col: "status",
        value: "Cancelled",
      };
      const res = await dispatch(SentMonitorEmailAsync(payload));
      if (SentMonitorEmailAsync.fulfilled.match(res)) {
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

  const recordsDownload = async (id: string, status: string, name: string) => {
  try {
    setIsLoading(true);

    // Step 1: Fetch header names from the API related to `abstract_review`
    const resultAction = await dispatch(getHeaderColumnAsync());
    const headersResponse = unwrapResult(resultAction);

    if (!Array.isArray(headersResponse?.qc_review)) {
      setIsLoading(false);
      return;
    }

    // Headers from API response
    let csvHeaders = headersResponse.qc_review
      .filter((item: any) => item.is_active === true) // Filter active headers
      .map((item: any) => item.Value);

    // Table body keys from API response
    let csvtableBodyKeys = headersResponse.qc_review
      .filter((item: any) => item.is_active === true) // Filter active headers
      .map((item: any) => item.key);

    // Step 2: Add MANDATORY_HEADERS to the csvHeaders if they are not already present
    const MANDATORY_HEADERS = ["Article Id", "Title"];
    MANDATORY_HEADERS.forEach((mandatoryHeader) => {
      if (!csvHeaders.includes(mandatoryHeader)) {
        csvHeaders.unshift(mandatoryHeader); // Add to the beginning of headers array
        csvtableBodyKeys.unshift(mandatoryHeader); // Add keys to match headers
      }
    });

    // Step 3: Fetch the data to be downloaded from the second API (abstract review data)
    const response = await dispatch(GetItemQcExportDataAsync({ id }));

 if (GetItemQcExportDataAsync.fulfilled.match(response)){
      const data = response.payload;

      if (!data || data.length === 0) {
        setIsExportLoading(false);
        setIsLoading(false);
        return;
      }

      // Example: Create a mapping of headers to body keys manually, including mandatory fields
      const headerKeyMap: { [key: string]: string } = {
        "Title": "title",
        "Assignee": "assignee",
        "Review Type": "review_type",
        "Status": "status",
        "Expert Decision": "expert_decision",
        "Aggregate Reporting": "is_aggregate_reporting",
        "Safety Signal": "is_safety_signal",
        "Article of interest": "is_serious_event",
        "Categories": "categories",
        "Classifications": "classifications",
        "Comments": "comments",
        "Search Result Status": "search_result_status",
        "Monitor Status": "monitor_status",
        "Active": "is_active",
        "Country": "country",
        "Article Id": "article_id",
        "Ai decision": "ai_decision",
        "Reason": "reason",
        "Causality Decision": "causality_decision",
        "Causality Reason": "causality_reason",
        "Designated Medical Events": "designated_medical_events",
        "Created By": "created_by",
        "Date Created": "created_on",
        "Modified By": "modified_by",
        "Modified On": "modified_on",
        "Published On": "updated_on",
        "Pubmed Link": "pubmed_link",
        "Abstract Reviewed By": "abstract_reviewed_by",
        "Abstract Review Status": "abstract_review_status",
        "Abstract Review Decision": "abstract_review_decision",
        "Abstract Review Is_aggregate_reporting": "abstract_review_is_aggregate_reporting",
        "Abstract Review Is_safety_signal": "abstract_review_is_safety_signal",
        "Abstract Review Article of interest": "abstract_review_is_serious_event",
        "Abstract Review Categories": "abstract_review_categories",
        "Abstract Review Classifications": "abstract_review_classifications",
        "Abstract Review comments":"abstract_review_comments",
   "Affiliation":"affiliation",
"drug":"drug",
"Drug Of Choice":"drug_of_choice",
"adverse_reaction":"adverse_reaction"
      };
      const allArticleIdsAreNumeric = data.every((item: any) => /^\d+$/.test(item.article_id));


      const isPublishedOnSelected = csvHeaders.includes('Published On');
      
  const modifiedData = data.map((item: any) => {
        const { article_id, updated_on, drug_of_choice,...rest } = item;
        const formattedPublishedOn = isPublishedOnSelected && updated_on
          ? updated_on.split('T')[0] 
          : undefined; 
        return {
          ...rest,
          article_id: article_id, 
drug_of_choice: Array.isArray(drug_of_choice) ? drug_of_choice.join(", ") : drug_of_choice,

          ...(allArticleIdsAreNumeric ? { pubmed_link: `https://pubmed.ncbi.nlm.nih.gov/${article_id}` } : {}),
          ...(isPublishedOnSelected ? { updated_on: formattedPublishedOn } : {}),

        };
      });

if (allArticleIdsAreNumeric) {
        if (!csvHeaders.includes("Pubmed Link")) {
          csvHeaders.push("Pubmed Link");
          csvtableBodyKeys.push("Pubmed Link");
  headerKeyMap["Pubmed Link"] = "pubmed_link";
        }
      } else {
        // Remove "Pubmed Link" if any article_id contains non-numeric characters
        csvHeaders = csvHeaders.filter((header:any) => header !== "Pubmed Link");
        csvtableBodyKeys = csvtableBodyKeys.filter((key:any) => key !== "pubmed_link");
      }
      // Prepare data for export by mapping headers to table body keys
      const renderData = [
        csvHeaders, // Add headers as the first row
        ...modifiedData.map((item: any) =>
          csvtableBodyKeys.map((key: string) => item[headerKeyMap[key]] || "")
        ),
      ];
        const worksheet = XLSX.utils.aoa_to_sheet(renderData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      // Save the Excel file as .xlsx
      XLSX.writeFile(workbook, `${name}_QcReview_${Utils.getCurrentDateAndTime()}.xlsx`);

      setIsExportLoading(false);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      console.error(CONSTANTS.errorMessage.searchFailed, response.error);
    }
  } catch (error) {
    setIsLoading(false);
    console.error(CONSTANTS.errorMessage.unexpectedError, error);
  }
};


 

 

  const headers = [
   
    "Description",
    "Date Created",
    "Due Date",
    "Total Records",
    "Monitor Status",
    "Created By",
    "Pending Case",
  ];
  const tableBodyKeys = [
  
  
    "description",
    "created_on",
    "to_date",
    "total_records",
    "status",
    "created_by",
    "pending_records",
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  return (
    <React.Fragment>
      <div>
        <section className="mt-0 relative bg-white custom-box-shadow">
          <div className="flex justify-between">
            <div className="ml-2 mt-2 flex">
              <div>
                <input
                  type="text"
                  placeholder="Search by monitor name"
                  onChange={handleSearch}
                  className="w-[400px] h-[22px] text-14 rounded-md border-1 border-solid border-gray text-dimgray px-4 py-2"
                />
              </div>
              <div className="ml-[-30px] mt-3">
                <Image
                  src="/assets/icons/search-5-1.svg"
                  width={12}
                  height={12}
                  alt="search icon"
                  className=""
                />
              </div>
            </div>
            <div className="mr-4 cursor-pointer justify-end flex">
              <div className="mt-1 mr-32">
                <EmailSenderComponent
                  handleSend={(tags: string[]) => {
                    handleEmailSend(tags);
                  }}
                  customClasses="right-8"
                />
              </div>
              <div className="absolute">
                <ExportDropdown
 mandatoryHeaders = {["Id","Name"]}
   mandatoryBodyKeys = {["monitor_id","name"]}
                  tableBodyKeys={tableBodyKeys}
                  data={sortedFilteredData}
                  headers={headers}
                  fileNamePrefix="QC Cancelled List"
                  fileSavedName={`${
                    Utils.getUserData()?.user_name
                  }_QCCancelledList_${Utils.getCurrentDateAndTime()}`}
                  disable={false}
                  searchRow={undefined}
                  startRow={undefined}
                  endRow={undefined}
                />
                <>
                  <div className="absolute cursor-pointer top-0 ml-2">
                    <Image
                      src="/assets/icons/download-white.svg"
                      alt="download icon"
                      width={12}
                      height={12}
                      className={`left-0 ml-2 top-0 mt-2 `}
                    />
                  </div>
                </>
              </div>
              {isExportLoading && <LoadingSpinner text={"Downloading"} />}
            </div>
          </div>
          <div className="border-style mt-4"></div>
          <div className="overflow-x-autos">
            <table className="w-[100%] text-14 border border-collapse table-auto">
              <thead className="border-style text-sm ">
                <tr className="font-Archivo capitalize text-style text-sm bg-gray-50">
                  <th className="px-4 py-3 w-32 hover-text-style">ID</th>
                  <th className="px-2 py-3 w-64">
                    <div ref={monitorDropdownRef} className="relative">
                      <span
                        className="flex w-full ml-2 px-4 py-4 hover-text-style items-center  cursor-pointer"
                        onClick={() =>
                          setMonitorDropdownOpen(!monitorDropdownOpen)
                        }
                      >
                        Monitor Name{" "}
                        <Image
                          src="/assets/icons/sort.svg"
                          alt="sort"
                          width={12}
                          height={12}
                          className={`ml-3 ${
                            sortConfig.direction === "ascending"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </span>
                      {monitorDropdownOpen && (
                        <div className="absolute top-14 w-[190px] bg-white border rounded-lg shadow-lg">
                          <SortOption
                            label="Sort Ascending"
                            direction="ascending"
                            active={sortConfig.direction}
                            onClick={handleMonitorNameSort}
                            iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                          <SortOption
                            label="Sort Descending"
                            direction="descending"
                            active={sortConfig.direction}
                            onClick={handleMonitorNameSort}
                            iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="pl-3 w-20 hover-text-style items-center cursor-pointer">
                    Description
                  </th>
                  <th className="px-2 py-3 w-32 hover-text-style date-created-width">
                    <div ref={dateCreatedDropdownRef} className="relative">
                      <span
                        className="flex w-full -ml-2 px-4 py-4 hover-text-style items-center  cursor-pointer"
                        onClick={() =>
                          setdateCreatedDropdownOpen(!dateCreatedDropdownOpen)
                        }
                      >
                        {" "}
                        Date created
                        <Image
                          src="/assets/icons/sort.svg"
                          alt="sort"
                          width={12}
                          height={12}
                          className={`ml-3 ${
                            sortConfig.direction === "ascending"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </span>

                      {dateCreatedDropdownOpen && (
                        <div className="absolute top-14 w-[190px] bg-white border rounded-lg shadow-lg">
                          <SortOption
                            label="Sort Ascending"
                            direction="ascending"
                            active={sortConfig.direction}
                            onClick={handleDateCreatedSort}
                            iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                          <SortOption
                            label="Sort Descending"
                            direction="descending"
                            active={sortConfig.direction}
                            onClick={handleDateCreatedSort}
                            iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="px-2 w-32 py-3">
                    <div ref={dateDropdownRef} className="relative">
                      <span
                        className="flex w-full -ml-2 px-4 py-4 hover-text-style items-center  cursor-pointer"
                        onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                      >
                        Due Date{" "}
                        <Image
                          src="/assets/icons/sort.svg"
                          alt="sort"
                          width={12}
                          height={12}
                          className={`ml-3 ${
                            sortConfig.direction === "ascending"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </span>
                      {dateDropdownOpen && (
                        <div className="absolute text-left top-14 w-[200px] bg-white border rounded-lg shadow-lg">
                          <SortOption
                            label="Sort Ascending"
                            direction="ascending"
                            active={sortConfig.direction}
                            onClick={handleDateSort}
                            iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                          <SortOption
                            label="Sort Descending"
                            direction="descending"
                            active={sortConfig.direction}
                            onClick={handleDateSort}
                            iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="px-4 w-32 py-3 ml-8">
                    <div ref={recordsDropdownRef} className="relative">
                      <span
                        className="flex w-full -ml-4 px-4 py-4 hover-text-style items-center  cursor-pointer"
                        onClick={() =>
                          setRecordsDropdownOpen(!recordsDropdownOpen)
                        }
                      >
                        Total Records{" "}
                        <Image
                          src="/assets/icons/sort.svg"
                          alt="sort"
                          width={12}
                          height={12}
                          className={`ml-3 ${
                            sortConfig.direction === "ascending"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </span>
                      {recordsDropdownOpen && (
                        <div className="absolute top-14 text-left w-[190px] bg-white border rounded-lg shadow-lg">
                          <SortOption
                            label="Sort Ascending"
                            direction="ascending"
                            active={sortConfig.direction}
                            onClick={handleRecordsSort}
                            iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                          <SortOption
                            label="Sort Descending"
                            direction="descending"
                            active={sortConfig.direction}
                            onClick={handleRecordsSort}
                            iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="px-4 w-20 py-3 ml-8">
                    <div className="relative" ref={pendingCaseDropdownRef}>
                      <span
                        className="flex w-full -ml-4 px-4 py-4 hover-text-style items-center cursor-pointer"
                        onClick={() =>
                          setPendingRecordsDropdownOpen(
                            !pendingRecordsDropdownOpen
                          )
                        }
                      >
                        Pending Abstract Cases{" "}
                        <Image
                          src="/assets/icons/sort.svg"
                          alt="sort"
                          width={12}
                          height={12}
                          className={`ml-3 ${
                            sortConfig.direction === "ascending"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </span>
                      {pendingRecordsDropdownOpen && (
                        <div className="absolute text-left top-14 w-[200px] bg-white border rounded-lg shadow-lg">
                          <SortOption
                            label="Sort Ascending"
                            direction="ascending"
                            active={sortConfig.direction}
                            onClick={handlePendingRecordsSort}
                            iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                          <SortOption
                            label="Sort Descending"
                            direction="descending"
                            active={sortConfig.direction}
                            onClick={handlePendingRecordsSort}
                            iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                        </div>
                      )}
                    </div>
                  </th>
                 <th className="px-3 w-24 py-3 text-center hover-text-style">
                       <div ref={createdByDropdownRef} className="relative">
                      <span
                        className="flex w-full ml-2 px-2 py-4 hover-text-style items-center  cursor-pointer"
                        onClick={() =>
                          setCreatedByDropdownOpen(!createdByDropdownOpen)
                        }
                      >
                        Created By{" "}
                        <Image
                          src="/assets/icons/sort.svg"
                          alt="sort"
                          width={12}
                          height={12}
                          className={`ml-1 ${
                            sortConfig.direction === "ascending"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </span>
                      {createdByDropdownOpen&& (
                        <div className="absolute top-14 w-[190px] bg-white border rounded-lg shadow-lg">
                          <SortOption
                            label="Sort Ascending"
                            direction="ascending"
                            active={sortConfig.direction}
                            onClick={handleCreatedBySort}
                            iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                          <SortOption
                            label="Sort Descending"
                            direction="descending"
                            active={sortConfig.direction}
                            onClick={handleCreatedBySort}
                            iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="px-1 w-20 text-center hover-text-style">
                    Frequency
                  </th>
                  <th className="px-1 w-20 text-center hover-text-style">
                    Export
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedFilteredData &&
                  sortedFilteredData
                    ?.filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((item, index) => (
                      <tr
                        className="border-b cursor-pointer hover:bg-ghostwhite  text-sm table-row border-style"
                        key={index}
                      >
                        <td
                          className="px-4 text-left py-6"
                          onClick={() => handleRowClick(item)}
                        >
                          {item?.monitor_id}
                        </td>
                        <td
                          className={`px-8 text-left py-6 ${
                            searchQuery ? "font-bold" : ""
                          }`}
                          onClick={() => handleRowClick(item)}
                        >
                          {item?.name}
                        </td>
                        <td
                          className={`px-2 text-left py-6 w-full break-words text-lightslategray`}
                          onClick={() => handleRowClick(item)}
                        >
                          <div className="w-32">{item?.description}</div>
                        </td>
                        <td
                          className="px-4 text-center py-6 text-lightslategray date-width"
                          onClick={() => handleRowClick(item)}
                        >
                          {item?.created_on
                            ? item?.created_on.split("T")[0]
                            : "-"}
                        </td>
                        <td
                          className="px-4 text-center py-6 text-lightslategray"
                          onClick={() => handleRowClick(item)}
                        >
                          {item?.to_date}
                        </td>
                        <td
                          className="px-4 text-center py-6 text-lightslategray"
                          onClick={() => handleRowClick(item)}
                        >
                          {item?.total_records}
                        </td>
                        <td
                          className="px-2 text-center py-6 text-lightslategray"
                          onClick={() => handleRowClick(item)}
                        >
                          {item?.pending_records}
                        </td>
                        <td
                          className="px-4  py-6 text-lightslategray text-center"
                          onClick={() => handleRowClick(item)}
                        >
                          {item.created_by}
                        </td>
                        <td
                          className="px-4 text-center w-20 py-6 text-lightslategray"
                          onClick={() => handleRowClick(item)}
                        >
                          {item.frequency ?? "-"}
                        </td>
                        <td className="text-center">
                          <div
                            className="relative"
                            onClick={() => {
                              Utils.isPermissionGranted("export_files")
                              ? recordsDownload(item.id, item.status, item.name): undefined;
                            }}
                          >
                            {Utils.isPermissionGranted("export_files") ? (
                              <>
                                <Image
                                  src="/assets/icons/download-black.svg"
                                  alt="download icon"
                                  width={15}
                                  height={15}
                                  className={`left-0 top-0 mt-2 cursor-pointer`}
                                />
                              </>
                            ) : (
                              <>
                                <Image
                                  src="/assets/icons/download-disble.svg"
                                  alt="download icon"
                                  width={15}
                                  height={15}
                                  className={`left-0 top-0 mt-2 cursor-not-allowed`}
                                />
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                {message && (
                  <tr className="border-b cursor-pointer text-left text-sm border-style hover:bg-ghostwhite mb-2">
                    {" "}
                    <td
                      className="px-2 py-2 capitalize col-span-3 text-center"
                      colSpan={9}
                    >
                      {message}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        {isLoading && <LoadingSpinner />}
      </div>
      {fetchAdvanceReviewCancelledData?.length > 0 && (
        <CustomPagination
          currentPage={currentPage}
          perPage={perPage}
          totalRecords={Number(totalRecords)}
          handlePageChange={handlePageChange}
          handlePerPageChange={handlePerPageChange}
        />
      )}
     
    </React.Fragment>
  );
};

export default Cancelled;
